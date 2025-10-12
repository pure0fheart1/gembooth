# GemBooth Supabase Setup Guide

## Prerequisites
- Node.js installed
- Supabase account (free tier is fine)
- Gemini API key

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in project details:
   - Name: `gembooth`
   - Database Password: (choose a strong password)
   - Region: (closest to your users)
4. Wait for project to be created (~2 minutes)

## Step 2: Run Database Migrations

1. Install Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. Login to Supabase:
   ```bash
   supabase login
   ```

3. Link your project:
   ```bash
   supabase link --project-ref YOUR_PROJECT_REF
   ```
   
   Find your project ref in: Project Settings → General → Reference ID

4. Run migrations:
   ```bash
   supabase db push
   ```

## Step 3: Set Up Storage Buckets

The storage buckets are created via migration, but you can also create them manually:

1. Go to Storage in Supabase Dashboard
2. Create two buckets:
   - `user-photos` (Private, 10MB limit)
   - `user-gifs` (Private, 50MB limit)

## Step 4: Deploy Edge Functions

1. Navigate to supabase/functions directory
2. Deploy process-image function:
   ```bash
   supabase functions deploy process-image
   ```

3. Deploy create-gif function:
   ```bash
   supabase functions deploy create-gif
   ```

4. Set environment secrets:
   ```bash
   supabase secrets set GEMINI_API_KEY=your_gemini_api_key
   ```

## Step 5: Configure Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in your credentials:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your_anon_key_here
   ```

   Find these in Supabase Dashboard:
   - Project Settings → API → Project URL
   - Project Settings → API → Project API keys → anon/public

## Step 6: Enable Authentication

1. Go to Authentication → Providers in Supabase Dashboard
2. Enable Email provider
3. Configure email templates (optional):
   - Confirm signup
   - Reset password
   - Magic link

## Step 7: Test the Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run development server:
   ```bash
   npm run dev
   ```

3. Test authentication:
   - Sign up with a test email
   - Check confirmation email
   - Log in
   - Take a photo and test AI processing

## Troubleshooting

### "Missing Supabase environment variables"
- Ensure `.env.local` exists
- Verify variable names start with `VITE_`
- Restart dev server after changing .env

### Edge Function errors
- Check function logs: `supabase functions logs process-image`
- Verify GEMINI_API_KEY is set
- Ensure Supabase service role key has correct permissions

### Storage upload fails
- Check RLS policies are applied
- Verify bucket exists and is private
- Check file size limits

## Security Checklist

- [ ] Enable RLS on all tables
- [ ] Set up proper storage policies
- [ ] Never expose service role key in frontend
- [ ] Use Edge Functions for sensitive operations
- [ ] Enable email verification
- [ ] Set up rate limiting (Supabase Pro)
