import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Initialize Supabase client for server operations
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') || '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
);

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-65f9e3ac/health", (c) => {
  return c.json({ status: "ok" });
});

// Authentication endpoints
app.post("/make-server-65f9e3ac/auth/signup", async (c) => {
  try {
    const { email, password, role, metadata, adminKey } = await c.req.json();
    
    // Validate admin key for admin signup
    if (role === 'admin') {
      const validAdminKey = Deno.env.get('ADMIN_ACCESS_KEY') || 'admin123';
      if (adminKey !== validAdminKey) {
        return c.json({ error: 'Invalid admin access key' }, 401);
      }
    }
    
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { 
        ...metadata, 
        role,
        createdAt: new Date().toISOString()
      },
      email_confirm: true // Auto-confirm since no email server configured
    });
    
    if (error) {
      console.log('Signup error:', error);
      return c.json({ error: error.message }, 400);
    }
    
    // Store user data in KV store for easy access
    await kv.set(`user_${data.user.id}`, {
      id: data.user.id,
      email: data.user.email,
      role,
      metadata,
      createdAt: new Date().toISOString()
    });
    
    // Store by role for user management
    const existingUsers = await kv.get(`users_by_role_${role}`) || [];
    existingUsers.push({
      id: data.user.id,
      email: data.user.email,
      name: metadata.name,
      role,
      createdAt: new Date().toISOString()
    });
    await kv.set(`users_by_role_${role}`, existingUsers);
    
    return c.json({
      id: data.user.id,
      email: data.user.email,
      name: metadata.name,
      role,
      metadata
    });
  } catch (error) {
    console.log('Signup error:', error);
    return c.json({ error: 'Failed to create user account' }, 500);
  }
});

app.post("/make-server-65f9e3ac/auth/signin", async (c) => {
  try {
    const { email, password, role } = await c.req.json();
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      console.log('Signin error:', error);
      return c.json({ error: error.message }, 400);
    }
    
    const userMetadata = data.user.user_metadata;
    if (userMetadata.role !== role) {
      return c.json({ error: 'Invalid role for this account' }, 403);
    }
    
    // Log the login
    const loginLog = {
      userId: data.user.id,
      email: data.user.email,
      role,
      timestamp: new Date().toISOString(),
      ip: c.req.header('CF-Connecting-IP') || 'unknown',
      userAgent: c.req.header('User-Agent') || 'unknown',
      action: 'login'
    };
    
    const existingLogs = await kv.get(`login_logs_${data.user.id}`) || [];
    existingLogs.unshift(loginLog);
    // Keep only last 50 logs
    if (existingLogs.length > 50) existingLogs.length = 50;
    await kv.set(`login_logs_${data.user.id}`, existingLogs);
    
    return c.json({
      id: data.user.id,
      email: data.user.email,
      name: userMetadata.name,
      role: userMetadata.role,
      metadata: userMetadata,
      accessToken: data.session.access_token
    });
  } catch (error) {
    console.log('Signin error:', error);
    return c.json({ error: 'Failed to sign in' }, 500);
  }
});

// Get users by role (for admin)
app.get("/make-server-65f9e3ac/auth/users/:role", async (c) => {
  try {
    const role = c.req.param("role");
    const users = await kv.get(`users_by_role_${role}`) || [];
    return c.json(users);
  } catch (error) {
    console.log('Error fetching users:', error);
    return c.json({ error: 'Failed to fetch users' }, 500);
  }
});

// Get login logs for a user
app.get("/make-server-65f9e3ac/auth/logs/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const logs = await kv.get(`login_logs_${userId}`) || [];
    return c.json(logs);
  } catch (error) {
    console.log('Error fetching logs:', error);
    return c.json({ error: 'Failed to fetch logs' }, 500);
  }
});

// Authentication endpoints
app.post("/make-server-65f9e3ac/auth/signup", async (c) => {
  try {
    const userData = await c.req.json();
    const { email, password, role, ...profileData } = userData;

    // Create user with Supabase auth
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: {
        role,
        ...profileData
      },
      // Automatically confirm the user's email since an email server hasn't been configured
      email_confirm: true
    });

    if (error) {
      console.log(`User creation error for ${role}:`, error);
      return c.json({ error: error.message }, 400);
    }

    // Store additional profile data in our KV store
    await kv.set(`user_profile_${data.user.id}`, {
      id: data.user.id,
      email,
      role,
      ...profileData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    // Store user in role-specific collections for easier querying
    const existingUsers = await kv.get(`users_${role}`) || [];
    await kv.set(`users_${role}`, [...existingUsers, {
      id: data.user.id,
      email,
      name: profileData.name,
      createdAt: new Date().toISOString()
    }]);

    // Log user registration for monitoring
    await kv.set(`user_login_log_${data.user.id}`, [{
      action: 'registered',
      timestamp: new Date().toISOString(),
      userAgent: c.req.header('User-Agent') || 'Unknown',
      ip: c.req.header('X-Forwarded-For') || 'Unknown'
    }]);

    return c.json({ 
      success: true, 
      message: `${role} account created successfully`,
      userId: data.user.id 
    });
  } catch (error) {
    console.log('Signup error:', error);
    return c.json({ error: 'Failed to create account' }, 500);
  }
});

// User login tracking
app.post("/make-server-65f9e3ac/auth/login-track", async (c) => {
  try {
    const { userId, email, role } = await c.req.json();
    
    // Get existing login logs
    const existingLogs = await kv.get(`user_login_log_${userId}`) || [];
    
    // Add new login entry
    const loginEntry = {
      action: 'login',
      timestamp: new Date().toISOString(),
      userAgent: c.req.header('User-Agent') || 'Unknown',
      ip: c.req.header('X-Forwarded-For') || 'Unknown'
    };
    
    await kv.set(`user_login_log_${userId}`, [...existingLogs, loginEntry]);
    
    // Update last login in user profile
    const profile = await kv.get(`user_profile_${userId}`);
    if (profile) {
      await kv.set(`user_profile_${userId}`, {
        ...profile,
        lastLogin: new Date().toISOString()
      });
    }
    
    return c.json({ success: true });
  } catch (error) {
    console.log('Login tracking error:', error);
    return c.json({ error: 'Failed to track login' }, 500);
  }
});

// Get user profile
app.get("/make-server-65f9e3ac/auth/profile/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const profile = await kv.get(`user_profile_${userId}`);
    
    if (!profile) {
      return c.json({ error: "User profile not found" }, 404);
    }
    
    return c.json(profile);
  } catch (error) {
    console.log('Profile fetch error:', error);
    return c.json({ error: 'Failed to fetch profile' }, 500);
  }
});

// Get users by role (for admin)
app.get("/make-server-65f9e3ac/auth/users/:role", async (c) => {
  try {
    const role = c.req.param("role");
    const users = await kv.get(`users_${role}`) || [];
    return c.json(users);
  } catch (error) {
    console.log('Users fetch error:', error);
    return c.json({ error: 'Failed to fetch users' }, 500);
  }
});

// Get login logs for monitoring
app.get("/make-server-65f9e3ac/auth/logs/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const logs = await kv.get(`user_login_log_${userId}`) || [];
    return c.json(logs);
  } catch (error) {
    console.log('Login logs fetch error:', error);
    return c.json({ error: 'Failed to fetch login logs' }, 500);
  }
});

// Patient monitoring endpoints
app.get("/make-server-65f9e3ac/patients/:id/vitals", async (c) => {
  try {
    const patientId = c.req.param("id");
    const vitals = await kv.get(`patient_vitals_${patientId}`);
    
    if (!vitals) {
      return c.json({ error: "Patient vitals not found" }, 404);
    }
    
    return c.json(vitals);
  } catch (error) {
    console.log("Error fetching patient vitals:", error);
    return c.json({ error: "Failed to fetch patient vitals" }, 500);
  }
});

app.post("/make-server-65f9e3ac/patients/:id/vitals", async (c) => {
  try {
    const patientId = c.req.param("id");
    const vitalsData = await c.req.json();
    
    // Store the vital signs with timestamp
    const vitals = {
      ...vitalsData,
      timestamp: new Date().toISOString(),
      patientId
    };
    
    await kv.set(`patient_vitals_${patientId}`, vitals);
    
    // Check for critical values and create alerts
    const alerts = [];
    if (vitals.heartRate < 50 || vitals.heartRate > 120) {
      alerts.push({
        type: 'critical',
        message: `Heart rate ${vitals.heartRate} bpm is outside normal range`,
        timestamp: new Date().toISOString()
      });
    }
    
    if (vitals.oxygenSaturation < 95) {
      alerts.push({
        type: 'critical',
        message: `Oxygen saturation ${vitals.oxygenSaturation}% is critically low`,
        timestamp: new Date().toISOString()
      });
    }
    
    if (vitals.temperature > 100.4 || vitals.temperature < 96) {
      alerts.push({
        type: 'warning',
        message: `Temperature ${vitals.temperature}°F is abnormal`,
        timestamp: new Date().toISOString()
      });
    }
    
    // Store alerts if any
    if (alerts.length > 0) {
      await kv.set(`patient_alerts_${patientId}`, alerts);
      
      // Notify family members (in real implementation, this would send SMS/emails)
      const familyContacts = await kv.get(`patient_contacts_${patientId}`);
      if (familyContacts) {
        console.log(`Alerts generated for patient ${patientId}, notifying family:`, alerts);
      }
    }
    
    return c.json({ success: true, vitals, alerts });
  } catch (error) {
    console.log("Error storing patient vitals:", error);
    return c.json({ error: "Failed to store patient vitals" }, 500);
  }
});

app.get("/make-server-65f9e3ac/patients/:id/alerts", async (c) => {
  try {
    const patientId = c.req.param("id");
    const alerts = await kv.get(`patient_alerts_${patientId}`) || [];
    return c.json(alerts);
  } catch (error) {
    console.log("Error fetching patient alerts:", error);
    return c.json({ error: "Failed to fetch patient alerts" }, 500);
  }
});

// Family dashboard endpoints
app.get("/make-server-65f9e3ac/family/:patientId/dashboard", async (c) => {
  try {
    const patientId = c.req.param("patientId");
    
    // Get patient basic info
    const patientInfo = await kv.get(`patient_info_${patientId}`);
    const vitals = await kv.get(`patient_vitals_${patientId}`);
    const alerts = await kv.get(`patient_alerts_${patientId}`) || [];
    
    const dashboard = {
      patient: patientInfo,
      currentVitals: vitals,
      activeAlerts: alerts.filter((alert: any) => {
        const alertTime = new Date(alert.timestamp);
        const now = new Date();
        const hoursDiff = (now.getTime() - alertTime.getTime()) / (1000 * 60 * 60);
        return hoursDiff < 24; // Show alerts from last 24 hours
      }),
      lastUpdate: vitals?.timestamp || null
    };
    
    return c.json(dashboard);
  } catch (error) {
    console.log("Error fetching family dashboard:", error);
    return c.json({ error: "Failed to fetch family dashboard" }, 500);
  }
});

// Healthcare chatbot endpoints
app.post("/make-server-65f9e3ac/chatbot/ask", async (c) => {
  try {
    const { question, patientContext } = await c.req.json();
    
    // Store conversation for tracking
    const conversationId = `chat_${Date.now()}`;
    await kv.set(`conversation_${conversationId}`, {
      question,
      patientContext,
      timestamp: new Date().toISOString()
    });
    
    // Simple keyword-based responses (in real implementation, would use AI service)
    let response = "I understand you're asking about a health concern. While I can provide general health information, I recommend consulting with a healthcare professional for personalized medical advice.";
    let confidence = 60;
    
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes('emergency') || lowerQuestion.includes('urgent')) {
      response = "If this is a medical emergency, please call 911 immediately or go to the nearest emergency room. For urgent but non-emergency situations, contact your healthcare provider's after-hours line.";
      confidence = 95;
    } else if (lowerQuestion.includes('headache')) {
      response = "Headaches can have various causes. For mild headaches, try resting in a quiet room, staying hydrated, and using over-the-counter pain relievers as directed. If headaches are severe, frequent, or accompanied by other symptoms, please consult a healthcare provider.";
      confidence = 85;
    } else if (lowerQuestion.includes('fever')) {
      response = "Fever is often a sign of infection. Stay hydrated, rest, and monitor your temperature. Seek medical attention if fever exceeds 103°F (39.4°C), persists more than 3 days, or is accompanied by severe symptoms.";
      confidence = 90;
    }
    
    // Store response
    await kv.set(`response_${conversationId}`, {
      response,
      confidence,
      timestamp: new Date().toISOString()
    });
    
    return c.json({
      response,
      confidence,
      conversationId
    });
  } catch (error) {
    console.log("Error processing chatbot question:", error);
    return c.json({ error: "Failed to process question" }, 500);
  }
});

// Medical records endpoints
app.get("/make-server-65f9e3ac/patients/:id/records", async (c) => {
  try {
    const patientId = c.req.param("id");
    const records = await kv.get(`patient_records_${patientId}`) || [];
    return c.json(records);
  } catch (error) {
    console.log("Error fetching patient records:", error);
    return c.json({ error: "Failed to fetch patient records" }, 500);
  }
});

app.post("/make-server-65f9e3ac/patients/:id/records", async (c) => {
  try {
    const patientId = c.req.param("id");
    const recordData = await c.req.json();
    
    const newRecord = {
      id: `record_${Date.now()}`,
      patientId,
      ...recordData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const existingRecords = await kv.get(`patient_records_${patientId}`) || [];
    const updatedRecords = [...existingRecords, newRecord];
    
    await kv.set(`patient_records_${patientId}`, updatedRecords);
    
    return c.json({ success: true, record: newRecord });
  } catch (error) {
    console.log("Error creating patient record:", error);
    return c.json({ error: "Failed to create patient record" }, 500);
  }
});

// Initialize sample data
app.post("/make-server-65f9e3ac/init-sample-data", async (c) => {
  try {
    // Initialize sample patient data
    const samplePatients = [
      {
        id: '1',
        name: 'John Smith',
        age: 45,
        room: 'ICU-101',
        condition: 'Post-operative monitoring',
        emergencyContacts: [
          { name: 'Mary Smith', relationship: 'Spouse', phone: '+1-555-0123', notificationEnabled: true }
        ]
      },
      {
        id: '2',
        name: 'Sarah Johnson',
        age: 32,
        room: 'Room-205',
        condition: 'Diabetes management',
        emergencyContacts: [
          { name: 'Mike Johnson', relationship: 'Husband', phone: '+1-555-0125', notificationEnabled: true }
        ]
      }
    ];

    for (const patient of samplePatients) {
      await kv.set(`patient_info_${patient.id}`, patient);
      await kv.set(`patient_contacts_${patient.id}`, patient.emergencyContacts);
      
      // Initialize sample vitals
      await kv.set(`patient_vitals_${patient.id}`, {
        heartRate: 75 + Math.random() * 10,
        bloodPressure: { systolic: 120 + Math.random() * 20, diastolic: 80 + Math.random() * 10 },
        temperature: 98.6 + (Math.random() - 0.5) * 2,
        oxygenSaturation: 95 + Math.random() * 5,
        respiratoryRate: 16 + Math.random() * 4,
        timestamp: new Date().toISOString()
      });
    }
    
    return c.json({ success: true, message: "Sample data initialized" });
  } catch (error) {
    console.log("Error initializing sample data:", error);
    return c.json({ error: "Failed to initialize sample data" }, 500);
  }
});

Deno.serve(app.fetch);