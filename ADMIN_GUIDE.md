# Administrator Guide - Login & Registration History Management

## Overview

The authentication system has been enhanced with comprehensive logging and history management capabilities. All login, registration, and logout events are now tracked in the database with timestamps, IP addresses, and user details.

## Key Features

### 1. Automatic Event Logging

All authentication events are automatically logged:
- **User Registration** - Tracks when new users create accounts
- **Login Attempts** - Records both successful and failed login attempts
- **Logout Events** - Logs when users sign out
- **Role Verification** - Logs when users try to access wrong portals
- **History Cleared** - Records when an admin clears the history

### 2. Comprehensive User Management

Navigate to **User Management** (Admin only) to:
- View all registered users by role (Patients, Doctors, Admins)
- See user registration dates and details
- Track user activity through login logs
- Delete user accounts when necessary
- Monitor system health and statistics

### 3. Activity Log Viewing

For each user, you can:
1. Click "View Logs" next to any user
2. See their complete login/logout history
3. View timestamps and IP addresses
4. Check success/failure status of login attempts
5. Review metadata associated with each event

### 4. Clear All History

**Important**: This is a destructive action!

The "Clear All History" button allows you to:
- Remove all historical login and registration logs
- Start fresh tracking from the current moment
- Keep all user accounts intact
- Maintain user profiles and data

**How to use:**
1. Navigate to User Management section
2. Click the red "Clear All History" button in the top right
3. Read the warning carefully
4. Confirm the action
5. All historical logs will be deleted
6. A marker entry will be created noting when history was cleared
7. New activity will be tracked from this point forward

## Database Structure

### auth_logs Table
Stores all authentication events with:
- User ID (linked to the user account)
- Action type (login, register, logout, etc.)
- IP address
- User agent (browser information)
- Success status
- Error messages (if failed)
- Timestamp
- Additional metadata

### user_profiles Table
Stores extended user information:
- User ID
- Name and email
- Role (patient, doctor, admin)
- Role-specific fields (license number, blood group, etc.)
- Contact information
- Creation and update timestamps

## Security & Privacy

### Role-Based Access
- **Patients**: Can only view their own logs
- **Doctors**: Can only view their own logs
- **Admins**: Can view all logs and manage users

### Data Protection
- All tables use Row Level Security (RLS)
- Users cannot access other users' data
- Only admins can clear history
- All actions are logged for audit purposes

### GDPR Compliance
- Users can request account deletion
- All associated logs are deleted when user is deleted
- Clear audit trail of all actions
- Data retention policies can be implemented

## Common Tasks

### View Recent Registrations
1. Go to User Management
2. Click "Overview" tab
3. See the 5 most recent registrations across all roles

### Check User Activity
1. Go to User Management
2. Navigate to the specific role tab (Patients, Doctors, or Admins)
3. Find the user in the list
4. Click "View Logs"
5. Review their activity in the Activity Logs tab

### Delete a User
1. Go to User Management
2. Find the user in their role tab
3. Click the red trash icon
4. Confirm deletion
5. User account, profile, and all logs will be deleted

### Reset Authentication History
1. Click "Clear All History" button
2. Confirm the action in the dialog
3. Wait for confirmation toast
4. History is now cleared
5. New logins/registrations will be tracked fresh

## Monitoring & Analytics

### User Statistics
The dashboard shows:
- Total number of patients
- Total number of doctors
- Total number of admins
- Recent registration activity
- System health metrics

### Activity Patterns
Monitor:
- Login frequency
- Failed login attempts (potential security issues)
- Registration trends
- User activity patterns

## Troubleshooting

### No logs showing for a user
- User may have no recent activity
- History might have been cleared
- Check the "created_at" date on log entries

### Cannot clear history
- Ensure you're logged in as an admin
- Check Supabase connection
- Verify RLS policies are correct

### Users not appearing in User Management
- Refresh the page
- Check Supabase connection
- Verify users have the correct role in their metadata

## Best Practices

1. **Regular Monitoring**: Check activity logs weekly for suspicious activity
2. **History Management**: Only clear history when necessary (e.g., testing, compliance)
3. **User Verification**: Always verify user identity before making changes
4. **Backup Before Clear**: Consider exporting logs before clearing history
5. **Document Actions**: Keep notes on why history was cleared

## Technical Notes

### Timestamp Format
All timestamps are stored in UTC and displayed in local time

### IP Address Limitation
IP addresses may show as "unknown" due to browser privacy settings

### Log Retention
Logs are kept indefinitely unless manually cleared

### Performance
The system is optimized with indexes on:
- User ID
- Action type
- Created date

## Need Help?

If you encounter issues:
1. Check the browser console for errors
2. Verify Supabase connection in the settings
3. Ensure database tables are properly set up (see `/supabase-setup.md`)
4. Contact technical support if issues persist

---

**Last Updated**: November 16, 2024
**Version**: 2.0
