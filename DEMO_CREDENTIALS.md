# Demo Login Credentials

This document contains the default demo account credentials for testing the GoHealth AI Healthcare System.

## 🔐 Demo Accounts

### Patient Portal
- **Email:** `patient@demo.com`
- **Password:** `demo123`
- **Role:** Patient
- **Patient Name:** Rajesh Kumar Sharma
- **Features:** Full patient dashboard access, appointments, health records, AI chatbot

### Doctor Portal
- **Email:** `doctor@demo.com`
- **Password:** `demo123`
- **Role:** Doctor
- **Doctor Name:** Dr. Demo Sharma
- **Features:** Patient management, appointments, prescriptions, medical records

### Admin Portal
- **Email:** `admin@demo.com`
- **Password:** `demo123`
- **Role:** Administrator
- **Features:** System administration, user management, analytics, billing overview

### 👨‍👩‍👧‍👦 Family Portal (NEW!)
Access patient health dashboards using family access codes:

- **Access Code:** `FAMILY-DEMO-1234`
  - **Patient:** Demo Patient (Rajesh Kumar Sharma)
  - **Features:** View-only access to health records, appointments, and vitals

- **Access Code:** `FAMILY-TEST-5678`
  - **Patient:** Rajesh Kumar Sharma
  - **Features:** View-only access to patient dashboard

- **Access Code:** `FAMILY-ABCD-9999`
  - **Patient:** Priyanka Singh
  - **Features:** View-only access to patient dashboard

**How to use Family Portal:**
1. Go to Patient Portal login
2. Click on "Family Portal" tab
3. Enter one of the access codes above
4. Access patient's health dashboard with view-only permissions

## 🎯 How to Use

### Automatic Demo Mode
The application automatically switches to **Demo Mode** when Supabase is not configured:

1. Visit any login portal (Patient, Doctor, or Admin)
2. If Demo Mode is active, you'll see a colored banner:
   - 🟠 **Orange** banner for Patient Portal
   - 🟢 **Green** banner for Doctor Portal
   - 🟣 **Purple** banner for Admin Portal
3. The banner displays the demo credentials for that portal
4. Enter the credentials and sign in

### Manual Demo Mode Activation
If Supabase is configured but you want to use Demo Mode:

1. Go to Patient Portal
2. Look for the "Enable Demo Mode" button (appears if Supabase connection fails)
3. Click to activate Demo Mode
4. All authentication will use local storage

## 📝 Features in Demo Mode

### ✅ Available Features
- User authentication (login/register)
- Session management
- Role-based access control
- Full dashboard access for all user types
- All UI interactions
- Local data persistence (via localStorage)

### ⚠️ Limitations
- Data is stored locally (not synced to cloud)
- No real backend API calls
- Data is reset when browser storage is cleared
- No multi-device sync
- No password recovery

## 🔧 Technical Details

### Data Storage
- **User Accounts:** Stored in `localStorage` under key `mock_auth_users`
- **Active Session:** Stored in `localStorage` under key `mock_auth_session`
- **Demo Mode Flag:** Stored in `localStorage` under key `use_mock_auth`

### Demo Account Details

#### Patient Account (`patient@demo.com`)
```json
{
  "id": "demo_patient_001",
  "email": "patient@demo.com",
  "name": "Rajesh Kumar Sharma",
  "role": "patient",
  "metadata": {
    "phone": "+91 98765 43210",
    "address": "B-123, Lajpat Nagar, New Delhi 110024, Delhi, India",
    "emergencyContact": "+91 98765 43211",
    "bloodGroup": "B+",
    "age": 45,
    "gender": "Male",
    "city": "New Delhi",
    "state": "Delhi",
    "condition": "Type 2 Diabetes"
  }
}
```

#### Doctor Account (`doctor@demo.com`)
```json
{
  "id": "demo_doctor_001",
  "email": "doctor@demo.com",
  "name": "Dr. Demo Sharma",
  "role": "doctor",
  "metadata": {
    "licenseNumber": "MCI-12345",
    "specialization": "General Medicine",
    "hospital": "GoHealth Medical Center",
    "experience": "10 years",
    "qualification": "MBBS, MD"
  }
}
```

#### Admin Account (`admin@demo.com`)
```json
{
  "id": "demo_admin_001",
  "email": "admin@demo.com",
  "name": "Admin Demo",
  "role": "admin",
  "metadata": {
    "department": "System Administration",
    "employeeId": "ADMIN-001"
  }
}
```

## 🛡️ Security Notes

### For Development/Demo Use Only
- These credentials are for **demonstration purposes only**
- Never use these credentials in production
- All passwords are stored in plain text in localStorage (acceptable for demo)
- No encryption or hashing in Demo Mode

### Production Deployment
When deploying to production:
1. Configure Supabase properly (see `TROUBLESHOOTING.md`)
2. Demo Mode will be disabled automatically
3. All authentication will use Supabase Auth
4. Passwords will be securely hashed
5. Data will be stored in secure PostgreSQL database

## 🔄 Resetting Demo Mode

To reset all demo data:
1. Open browser DevTools (F12)
2. Go to Console tab
3. Run: `localStorage.clear()`
4. Refresh the page
5. Demo accounts will be re-initialized automatically

## 📚 Additional Resources

- **Main Documentation:** See `README.md`
- **Troubleshooting Guide:** See `TROUBLESHOOTING.md`
- **Supabase Setup:** Contact system administrator

## ⚡ Quick Start

```bash
# 1. Clone and install
npm install

# 2. Start the application
npm run dev

# 3. Visit http://localhost:5173

# 4. Choose a portal and login with demo credentials
# Patient: patient@demo.com / demo123
# Doctor: doctor@demo.com / demo123
# Admin: admin@demo.com / demo123
```

---

**Last Updated:** November 18, 2025  
**Version:** 1.0.0  
**System:** GoHealth AI Healthcare Management
