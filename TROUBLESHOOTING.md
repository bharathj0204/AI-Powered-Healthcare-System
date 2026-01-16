# Troubleshooting Guide: "Failed to fetch" Errors

## Problem: Cannot sign up or sign in - "Failed to fetch" error

This error typically occurs when Supabase authentication is not properly configured. Here's how to fix it:

### Solution Steps

#### 1. **Enable Email Authentication in Supabase**

1. Go to your Supabase project dashboard: https://supabase.com/dashboard/project/mbmvphjqfvzzxtgwyiaj
2. Navigate to **Authentication** → **Providers**
3. Make sure **Email** provider is **enabled**
4. Configure the email settings:
   - **Enable email confirmations** (optional, but recommended for production)
   - **Secure email change** should be enabled

#### 2. **Configure Email Templates (Important!)**

1. In your Supabase dashboard, go to **Authentication** → **Email Templates**
2. Make sure these templates are configured:
   - **Confirm signup**
   - **Magic Link**
   - **Change Email Address**
   - **Reset Password**

#### 3. **Check Site URL and Redirect URLs**

1. Go to **Authentication** → **URL Configuration**
2. Set **Site URL** to your application URL (e.g., `http://localhost:5173` for development)
3. Add **Redirect URLs**:
   - `http://localhost:5173/**` (for local development)
   - Your production URL when deploying

#### 4. **Verify API Keys**

1. Go to **Settings** → **API**
2. Confirm that:
   - **Project URL** matches: `https://mbmvphjqfvzzxtgwyiaj.supabase.co`
   - **anon public** key is correctly copied to `/utils/supabase/info.tsx`

#### 5. **Disable Email Confirmation for Testing (Optional)**

If you want to test without email confirmation:

1. Go to **Authentication** → **Providers** → **Email**
2. **Disable "Confirm email"** option
3. This allows users to sign up and immediately sign in without email verification

#### 6. **Check Network and CORS**

- Make sure you have internet connection
- Check browser console for detailed error messages
- Clear browser cache and cookies
- Try in incognito/private mode

### Quick Test

After configuring Supabase, try signing up with a test account:

1. Click "Sign Up" tab
2. Fill in:
   - Name: Test User
   - Email: test@example.com
   - Password: TestPassword123!
3. Click "Create Account"

### Common Error Messages

#### "Unable to connect to authentication service"
- Check internet connection
- Verify Supabase project is not paused
- Check Supabase status page: https://status.supabase.com/

#### "Email rate limit exceeded"
- Wait 5-10 minutes before trying again
- This is a Supabase rate limit protection

#### "User already registered"
- The email is already in use
- Try signing in instead
- Or use a different email

#### "Please verify your email address"
- Check your email inbox for confirmation link
- Check spam folder
- Resend confirmation email from Supabase dashboard

### Still Having Issues?

1. **Check Supabase logs**:
   - Go to your Supabase dashboard
   - Navigate to **Logs** → **Auth Logs**
   - Look for error messages

2. **Browser Console**:
   - Open browser developer tools (F12)
   - Check Console tab for detailed errors
   - Look for network errors in Network tab

3. **Test Supabase directly**:
   ```javascript
   // Open browser console and run:
   const { data, error } = await supabase.auth.signUp({
     email: 'test@example.com',
     password: 'TestPassword123!'
   })
   console.log({ data, error })
   ```

### Database Tables (Optional)

The authentication logging features require database tables. If you want to enable authentication history tracking:

1. See `/supabase-setup.md` for SQL setup scripts
2. Run the SQL scripts in Supabase SQL Editor
3. This enables:
   - Authentication event logging
   - User profile management
   - Activity history

**Note**: Authentication will work WITHOUT these tables - they're only needed for advanced features like login history and admin dashboard analytics.

### Production Checklist

Before deploying to production:

- [ ] Email provider configured (SendGrid, AWS SES, etc.)
- [ ] Email confirmation enabled
- [ ] Site URL set to production domain
- [ ] Redirect URLs include production domain
- [ ] Rate limiting configured appropriately
- [ ] Email templates customized with your branding
- [ ] Test complete signup/signin flow
- [ ] Password reset flow tested
- [ ] Database tables created (if using logging features)

### Contact Support

If you've followed all steps and still experiencing issues:

1. Check Supabase Discord: https://discord.supabase.com
2. Supabase Documentation: https://supabase.com/docs/guides/auth
3. File a support ticket with Supabase team

---

**Last Updated**: November 2025
**Supabase Project**: mbmvphjqfvzzxtgwyiaj
