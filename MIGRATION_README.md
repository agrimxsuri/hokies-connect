# Hokies Connect - Supabase Migration Guide

This guide will help you migrate the Hokies Connect application from localStorage to Supabase with authentication and Row-Level Security.

## Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier available)
- Git (for version control)

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/sign in
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - Name: `hokies-connect`
   - Database Password: (generate a strong password)
   - Region: Choose closest to your users
5. Click "Create new project"
6. Wait for the project to be ready (2-3 minutes)

## Step 2: Get Supabase Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (e.g., `https://xyz.supabase.co`)
   - **anon public** key (starts with `eyJ...`)
   - **service_role** key (starts with `eyJ...`)

## Step 3: Configure Environment Variables

1. Copy `env.template` to `.env.local`:
   ```bash
   cp env.template .env.local
   ```

2. Edit `.env.local` and replace the placeholder values:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   VITE_SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
   VITE_STORAGE_BUCKET=avatars
   ```

## Step 4: Set Up Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy the contents of `supabase-schema.sql`
3. Paste it into the SQL editor
4. Click **Run** to execute the schema
5. Verify the tables were created in **Table Editor**

## Step 5: Configure Storage

1. In your Supabase dashboard, go to **Storage**
2. Verify the `avatars` bucket was created
3. If not, create it manually:
   - Click "New bucket"
   - Name: `avatars`
   - Public: Yes

## Step 6: Install Dependencies

```bash
npm install @supabase/supabase-js
```

## Step 7: Test the Migration

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open the application in your browser
3. Try signing up with a new account
4. Create a profile and verify data is saved
5. Test the migration utility in Settings

## Step 8: Migrate Existing Data

1. Sign in to the application
2. Go to **Settings** (accessible from any protected page)
3. Click **"Import My Local Data"**
4. Verify the migration completed successfully
5. Check that your profile data appears correctly

## Verification Checklist

- [ ] New users can sign up and create profiles
- [ ] Existing users can migrate their localStorage data
- [ ] Students can only access student routes
- [ ] Alumni can only access alumni routes
- [ ] Call requests work between students and alumni
- [ ] Profile pictures upload to Supabase Storage
- [ ] Data persists across browser sessions
- [ ] Row-Level Security prevents cross-user data access

## Troubleshooting

### Common Issues

1. **"Missing Supabase environment variables"**
   - Check that `.env.local` exists and has correct values
   - Restart the development server

2. **"User not authenticated" errors**
   - Clear browser localStorage and try again
   - Check that RLS policies are correctly applied

3. **Profile pictures not uploading**
   - Verify the `avatars` storage bucket exists
   - Check storage policies in Supabase dashboard

4. **Migration fails**
   - Check browser console for specific error messages
   - Ensure user is signed in before attempting migration

### Database Issues

1. **Tables not created**
   - Re-run the SQL schema in Supabase SQL Editor
   - Check for syntax errors in the SQL

2. **RLS policies not working**
   - Verify policies are enabled in Supabase dashboard
   - Test with different user accounts

### Performance Issues

1. **Slow queries**
   - Check that indexes were created properly
   - Monitor query performance in Supabase dashboard

## Security Notes

- Never commit `.env.local` to version control
- The `service_role` key has admin privileges - keep it secure
- RLS policies ensure users can only access their own data
- All API calls are authenticated through Supabase Auth

## Next Steps

After successful migration:

1. **Backup your data** regularly using Supabase dashboard
2. **Monitor usage** in Supabase dashboard
3. **Set up email templates** for auth flows in Supabase
4. **Configure custom domains** if needed
5. **Set up monitoring and alerts** for production use

## Support

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord Community](https://discord.supabase.com)
- [React + Supabase Guide](https://supabase.com/docs/guides/getting-started/quickstarts/reactjs)

## File Changes Summary

### New Files Created:
- `src/lib/supabase.ts` - Supabase client configuration
- `src/lib/database.types.ts` - TypeScript types for database
- `src/lib/auth.ts` - Authentication utilities
- `src/lib/storage.ts` - File upload utilities
- `src/lib/api/studentAPI.ts` - Student profile API
- `src/lib/api/alumniAPI.ts` - Alumni profile API
- `src/lib/api/requestAPI.ts` - Call requests API
- `src/lib/migration.ts` - Data migration utility
- `src/components/RouteGuard.tsx` - Route protection
- `src/pages/SignIn.tsx` - Sign in page
- `src/pages/SignUp.tsx` - Sign up page
- `src/pages/Settings.tsx` - Settings/migration page
- `supabase-schema.sql` - Database schema
- `env.template` - Environment variables template

### Modified Files:
- `src/App.tsx` - Added auth routes and route guards
- `src/pages/UserTypeSelection.tsx` - Redirects to sign up
- `src/pages/SignUp.tsx` - Uses role from navigation state

### Dependencies Added:
- `@supabase/supabase-js` - Supabase JavaScript client

The migration preserves all existing UI/UX while adding secure backend persistence and authentication.
