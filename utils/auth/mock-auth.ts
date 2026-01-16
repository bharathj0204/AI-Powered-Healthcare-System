/**
 * Mock Authentication System for Development
 * Used when Supabase is not configured or unavailable
 */

interface MockUser {
  id: string;
  email: string;
  name: string;
  role: 'patient' | 'doctor' | 'admin';
  user_metadata?: any;
}

const MOCK_USERS_KEY = 'mock_auth_users';
const MOCK_SESSION_KEY = 'mock_auth_session';

// Default demo accounts
const DEFAULT_DEMO_ACCOUNTS: MockUser[] = [
  {
    id: 'demo_patient_001',
    email: 'patient@demo.com',
    name: 'Rajesh Kumar Sharma',
    role: 'patient',
    user_metadata: {
      name: 'Rajesh Kumar Sharma',
      role: 'patient',
      phone: '+91 98765 43210',
      address: 'B-123, Lajpat Nagar, New Delhi 110024, Delhi, India',
      emergencyContact: '+91 98765 43211',
      bloodGroup: 'B+',
      age: 45,
      gender: 'Male',
      city: 'New Delhi',
      state: 'Delhi',
      condition: 'Type 2 Diabetes',
      lastVisit: '2024-01-15',
      nextAppointment: '2024-02-10'
    }
  },
  {
    id: 'demo_doctor_001',
    email: 'doctor@demo.com',
    name: 'Dr. Demo Sharma',
    role: 'doctor',
    user_metadata: {
      name: 'Dr. Demo Sharma',
      role: 'doctor',
      licenseNumber: 'MCI-12345',
      specialization: 'General Medicine',
      hospital: 'GoHealth Medical Center',
      experience: '10 years',
      qualification: 'MBBS, MD'
    }
  },
  {
    id: 'demo_admin_001',
    email: 'admin@demo.com',
    name: 'Admin Demo',
    role: 'admin',
    user_metadata: {
      name: 'Admin Demo',
      role: 'admin',
      department: 'System Administration',
      employeeId: 'ADMIN-001'
    }
  }
];

// Initialize demo accounts if they don't exist
function initializeDemoAccounts() {
  const users = getMockUsers();
  
  // Check if demo accounts already exist
  const hasPatientDemo = users.some(u => u.email === 'patient@demo.com');
  const hasDoctorDemo = users.some(u => u.email === 'doctor@demo.com');
  const hasAdminDemo = users.some(u => u.email === 'admin@demo.com');
  
  // Add missing demo accounts
  let updated = false;
  if (!hasPatientDemo) {
    users.push(DEFAULT_DEMO_ACCOUNTS[0]);
    updated = true;
  }
  if (!hasDoctorDemo) {
    users.push(DEFAULT_DEMO_ACCOUNTS[1]);
    updated = true;
  }
  if (!hasAdminDemo) {
    users.push(DEFAULT_DEMO_ACCOUNTS[2]);
    updated = true;
  }
  
  if (updated) {
    saveMockUsers(users);
    console.log('✅ Demo accounts initialized');
  }
}

// Get all mock users from localStorage
function getMockUsers(): MockUser[] {
  const users = localStorage.getItem(MOCK_USERS_KEY);
  return users ? JSON.parse(users) : [];
}

// Save mock users to localStorage
function saveMockUsers(users: MockUser[]) {
  localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
}

// Get current session
export function getMockSession(): MockUser | null {
  const session = localStorage.getItem(MOCK_SESSION_KEY);
  return session ? JSON.parse(session) : null;
}

// Set current session
function setMockSession(user: MockUser | null) {
  if (user) {
    localStorage.setItem(MOCK_SESSION_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(MOCK_SESSION_KEY);
  }
}

// Mock sign up
export async function mockSignUp(email: string, password: string, metadata: any) {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const users = getMockUsers();
  
  // Check if user already exists
  if (users.find(u => u.email === email)) {
    throw new Error('An account with this email already exists. Please sign in instead.');
  }

  // Create new user
  const newUser: MockUser = {
    id: `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    email,
    name: metadata.name || email.split('@')[0],
    role: metadata.role || 'patient',
    user_metadata: metadata
  };

  // Save user
  users.push(newUser);
  saveMockUsers(users);

  return {
    user: newUser,
    session: null // Mock doesn't auto-login
  };
}

// Mock sign in
export async function mockSignIn(email: string, password: string) {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const users = getMockUsers();
  const user = users.find(u => u.email === email);

  if (!user) {
    throw new Error('Invalid email or password. Please try again.');
  }

  // Set session
  setMockSession(user);

  return {
    user,
    session: { user, access_token: 'mock_token' }
  };
}

// Mock sign out
export async function mockSignOut() {
  setMockSession(null);
}

// Check if mock mode should be used
export function shouldUseMockAuth(): boolean {
  // Check if explicitly enabled
  const mockEnabled = localStorage.getItem('use_mock_auth');
  return mockEnabled === 'true';
}

// Enable mock auth mode
export function enableMockAuth() {
  localStorage.setItem('use_mock_auth', 'true');
  console.log('🔧 Mock authentication enabled - Using local storage for testing');
}

// Disable mock auth mode
export function disableMockAuth() {
  localStorage.removeItem('use_mock_auth');
  console.log('✅ Mock authentication disabled - Using Supabase');
}

// Initialize demo accounts on load
initializeDemoAccounts();