# Supabase Database Setup Guide

This guide will help you set up the required database tables for the authentication logging system.

## Required Tables

### 1. auth_logs Table

This table stores all login, registration, and logout events.

```sql
-- Create auth_logs table
CREATE TABLE auth_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action VARCHAR(50) NOT NULL, -- 'login', 'register', 'logout', 'password_reset', 'history_cleared'
  ip_address VARCHAR(100),
  user_agent TEXT,
  success BOOLEAN DEFAULT true,
  error_message TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_auth_logs_user_id ON auth_logs(user_id);
CREATE INDEX idx_auth_logs_action ON auth_logs(action);
CREATE INDEX idx_auth_logs_created_at ON auth_logs(created_at DESC);

-- Enable Row Level Security
ALTER TABLE auth_logs ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view their own logs
CREATE POLICY "Users can view their own logs"
  ON auth_logs
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create policy for admins to view all logs
CREATE POLICY "Admins can view all logs"
  ON auth_logs
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Allow authenticated users to insert their own logs
CREATE POLICY "Users can insert their own logs"
  ON auth_logs
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

### 2. user_profiles Table

This table stores extended user profile information.

```sql
-- Create user_profiles table
CREATE TABLE user_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL, -- 'patient', 'doctor', 'admin'
  phone VARCHAR(50),
  address TEXT,
  specialization VARCHAR(255), -- For doctors
  license_number VARCHAR(100), -- For doctors
  emergency_contact VARCHAR(50), -- For patients
  blood_group VARCHAR(10), -- For patients
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_user_profiles_email ON user_profiles(email);
CREATE INDEX idx_user_profiles_role ON user_profiles(role);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view their own profile
CREATE POLICY "Users can view their own profile"
  ON user_profiles
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create policy for users to update their own profile
CREATE POLICY "Users can update their own profile"
  ON user_profiles
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Create policy for admins to view all profiles
CREATE POLICY "Admins can view all profiles"
  ON user_profiles
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Allow authenticated users to insert their own profile
CREATE POLICY "Users can insert their own profile"
  ON user_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

### 3. Updated Timestamp Function

```sql
-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for user_profiles table
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

## Setup Instructions

1. **Connect to your Supabase project**:
   - Go to your Supabase project dashboard
   - Navigate to the SQL Editor

2. **Run the SQL commands**:
   - Copy and paste the SQL commands above in order
   - Run each section separately to ensure there are no errors

3. **Verify the setup**:
   - Go to the Table Editor in Supabase
   - Verify that both `auth_logs` and `user_profiles` tables exist
   - Check that indexes and policies are created

4. **Test the functionality**:
   - Register a new user through the application
   - Check that a record is created in `user_profiles`
   - Check that a registration log is created in `auth_logs`
   - Try logging in and verify a login log is created

## Clear History Feature

The "Clear All History" button in the User Management section will:
- Delete all records from the `auth_logs` table
- Keep user accounts and profiles intact
- Add a special log entry indicating when history was cleared
- All new login/registration activity will be tracked from that point forward

## Notes

- All authentication events are automatically logged
- IP addresses are fetched when available
- Failed login attempts are also logged
- Admin users have full access to all logs
- Regular users can only see their own logs
- The system is GDPR compliant as users can request deletion of their data
