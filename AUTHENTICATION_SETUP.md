# Authentication Setup - Important Information

## Current Authentication Status

### ⚠️ YOU CANNOT CREATE ACCOUNTS YET

**Why?** The application uses **Supabase Authentication** (`@supabase/supabase-js`), but Supabase has not been configured yet.

### What's Being Used

- **Authentication Service**: Supabase Auth (NOT a demo/local system)
- **Required Configuration**: Environment variables for Supabase connection
- **Current State**: Authentication will show error messages until Supabase is set up

### What You Need to Do

Follow these steps to enable authentication:

1. **Create a Supabase Account**
   - Go to [https://supabase.com](https://supabase.com)
   - Sign up for a free account

2. **Create a New Project**
   - Click "New Project"
   - Choose a name (e.g., "earnparkpro")
   - Set a strong database password
   - Select your region

3. **Get Your API Keys**
   - Go to Settings → API
   - Copy your **Project URL**
   - Copy your **anon public** key

4. **Configure Environment Variables**
   - Open your `.env` file
   - Add these values:
     ```bash
     VITE_SUPABASE_URL=https://your-project.supabase.co
     VITE_SUPABASE_ANON_KEY=your-anon-key-here
     ```

5. **Configure Email Settings**
   - In Supabase Dashboard: Authentication → Providers → Email
   - Either:
     - **Disable "Confirm email"** (for testing only)
     - **Enable "Confirm email"** and configure SMTP (for production)

6. **Restart Your Dev Server**
   ```bash
   npm run dev
   ```

7. **Test Authentication**
   - Try signing up with a test email
   - Check if user appears in Supabase Dashboard → Authentication → Users

## Detailed Setup Guide

For complete step-by-step instructions, see `SUPABASE_SETUP_GUIDE.md` in the project root.

## What Happens After Setup

Once Supabase is configured:

✅ Users can sign up with email/password
✅ Email verification is sent (if enabled)
✅ Users can log in after email confirmation
✅ Dashboard access is restricted to authenticated users
✅ All user data is stored in Supabase

## Database Tables

The following tables are already created in Supabase:

- `user_dashboard_data` - User portfolio information
- `withdrawal_requests` - Withdrawal tracking

These were created via migrations and are ready to use once Supabase is configured.

## Security Features

✅ Row Level Security (RLS) enabled on all tables
✅ Users can only access their own data
✅ Secure authentication with JWT tokens
✅ Email verification (when enabled)
✅ Password hashing handled by Supabase

## Need Help?

- See `SUPABASE_SETUP_GUIDE.md` for detailed instructions
- Supabase Docs: [https://supabase.com/docs](https://supabase.com/docs)
- If you encounter issues, check the troubleshooting section in the setup guide
