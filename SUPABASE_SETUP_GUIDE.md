# Supabase Environment Setup Guide

This guide will walk you through setting up Supabase for your EarnParkPro application.

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in to your account
3. Click "New Project"
4. Fill in the project details:
   - Project Name: `earnparkpro` (or your preferred name)
   - Database Password: Choose a strong password (save this securely!)
   - Region: Select the region closest to your users
5. Click "Create New Project"
6. Wait for the project to be provisioned (usually takes 1-2 minutes)

## Step 2: Get Your Supabase Credentials

1. Once your project is ready, go to **Settings** → **API**
2. You'll find two important values:
   - **Project URL**: This is your `VITE_SUPABASE_URL`
   - **anon public key**: This is your `VITE_SUPABASE_ANON_KEY`

## Step 3: Configure Environment Variables

1. In your project root, you already have a `.env` file
2. Open the `.env` file and update it with your credentials:

```bash
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**Important:** Replace the values with your actual credentials from Step 2

## Step 4: Configure Email Authentication

By default, Supabase requires email confirmation. To enable seamless authentication:

### Option A: Enable Email Confirmation (Recommended for Production)

1. Go to **Authentication** → **Providers** → **Email**
2. Enable "Confirm email"
3. Configure your SMTP settings (or use Supabase's built-in email service)

### Option B: Disable Email Confirmation (For Testing Only)

1. Go to **Authentication** → **Providers** → **Email**
2. **Disable** "Confirm email"
3. Users will be able to sign in immediately after registration

**Note:** For production, you should always enable email confirmation for security.

## Step 5: Set Up Email Templates

1. Go to **Authentication** → **Email Templates**
2. Customize the email templates:
   - **Confirm signup**: Sent when users register
   - **Magic Link**: For passwordless login
   - **Change Email Address**: When users update their email
   - **Reset Password**: For password recovery

## Step 6: Configure Authentication Settings

1. Go to **Authentication** → **URL Configuration**
2. Add your site URL:
   - **Site URL**: `https://your-domain.com` (or `http://localhost:5173` for development)
   - **Redirect URLs**: Add `https://your-domain.com/*` to allow redirects

## Step 7: Database Migrations

The required database tables have already been created through migrations:
- `user_dashboard_data` - User portfolio and dashboard information
- `withdrawal_requests` - Withdrawal request tracking

These migrations are located in the `supabase/migrations/` folder and have been applied automatically.

## Step 8: Verify Your Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Try to sign up with a test account
3. Check the Supabase Dashboard → **Authentication** → **Users** to see if the user was created

## Step 9: Test Email Verification Flow

1. Sign up with a valid email address
2. Check your email inbox for the confirmation email
3. Click the confirmation link
4. You should be redirected to the dashboard

## Troubleshooting

### Issue: "Invalid API key" error
- **Solution**: Double-check that you copied the correct `anon` key from Supabase, not the service role key

### Issue: Email confirmation not working
- **Solution**: Check your email spam folder, or disable email confirmation temporarily for testing

### Issue: Users can't access dashboard after signup
- **Solution**: Make sure email confirmation is properly configured or disabled for testing

### Issue: "Failed to fetch" errors
- **Solution**:
  - Verify your `.env` file has the correct Supabase URL
  - Check that your Supabase project is running (not paused)
  - Restart your development server after changing `.env`

## Security Best Practices

1. **Never commit your `.env` file** - It's already in `.gitignore`
2. **Use different projects** for development and production
3. **Enable Row Level Security (RLS)** on all tables (already done)
4. **Regularly rotate your service role key** if you use it
5. **Monitor authentication logs** in the Supabase dashboard

## Production Deployment

When deploying to production:

1. Set environment variables in your hosting platform (e.g., Netlify):
   - Go to **Site settings** → **Environment variables**
   - Add `VITE_SUPABASE_URL`
   - Add `VITE_SUPABASE_ANON_KEY`

2. Update your Supabase project:
   - Add your production URL to **Authentication** → **URL Configuration**
   - Configure proper email templates
   - Enable email confirmation

3. Test thoroughly before going live

## Getting Help

- Supabase Documentation: [https://supabase.com/docs](https://supabase.com/docs)
- Supabase Discord: [https://discord.supabase.com](https://discord.supabase.com)
- GitHub Issues: [https://github.com/supabase/supabase/issues](https://github.com/supabase/supabase/issues)

## Next Steps

After setting up Supabase:

1. Customize email templates with your branding
2. Set up proper SMTP for production emails
3. Configure Row Level Security policies if you make schema changes
4. Monitor user signups in the Supabase dashboard
5. Set up database backups
