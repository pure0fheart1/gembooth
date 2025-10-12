# 🚀 Next Steps - GemBooth Deployment

## ✅ Completed
- [x] Database tables created in Supabase
- [x] Storage buckets configured (via migration)
- [x] Environment variables set in `.env.local`

## 📋 What You Need to Do Now

### Step 1: Verify Storage Buckets
1. Go to https://supabase.com/dashboard
2. Select your `gembooth` project
3. Navigate to **Storage** in the left sidebar
4. Verify these buckets exist:
   - ✓ `user-photos` (10MB limit, private)
   - ✓ `user-gifs` (50MB limit, private)

If they don't exist, run this SQL in the SQL Editor:
```sql
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('user-photos', 'user-photos', false, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('user-gifs', 'user-gifs', false, 52428800, ARRAY['image/gif']);
```

### Step 2: Deploy Edge Functions

**Option A: Using the automated script (Recommended)**

Windows (Command Prompt):
```cmd
deploy-functions.bat
```

Linux/Mac/Git Bash:
```bash
bash deploy-functions.sh
```

**Option B: Manual deployment**

1. Login to Supabase:
   ```bash
   npx supabase@latest login
   ```

2. Get your project reference ID:
   - Go to: https://supabase.com/dashboard/project/_/settings/general
   - Copy the "Reference ID"

3. Link your project:
   ```bash
   npx supabase@latest link --project-ref YOUR_PROJECT_REF
   ```

4. Deploy functions:
   ```bash
   npx supabase@latest functions deploy process-image
   npx supabase@latest functions deploy create-gif
   ```

5. Set Gemini API key (from your .env.local file):
   ```bash
   npx supabase@latest secrets set GEMINI_API_KEY=AIzaSyDPQtBK3oPEb4z5JMfunP2FQpVMONrvris
   ```

### Step 3: Test Edge Functions

1. Go to Supabase Dashboard → **Functions**
2. Click on `process-image`
3. Click **Invoke** button
4. Test with this payload:
   ```json
   {
     "inputImage": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
     "mode": "enhance",
     "userId": "test-user-id"
   }
   ```

5. Check the **Logs** tab for any errors

### Step 4: Enable Email Authentication

1. Go to **Authentication** → **Providers**
2. Enable **Email** provider
3. Configure email templates (optional)
4. Save changes

### Step 5: Test the Web App

1. Start the dev server (if not already running):
   ```bash
   npm run dev
   ```

2. Open http://localhost:5173 in your browser

3. Test the flow:
   - Sign up with a test email
   - Check your email for verification
   - Log in to the app
   - Try capturing/uploading a photo
   - Test AI processing modes

### Step 6: Deploy to Vercel (Production)

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

3. Set environment variables in Vercel dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_GEMINI_API_KEY`

4. Test production site

## 🔍 Troubleshooting

### Edge Functions fail to deploy
- Make sure you're logged in: `npx supabase@latest login`
- Verify project is linked: `npx supabase@latest projects list`
- Check function logs in dashboard

### Storage upload fails
- Verify buckets exist in Storage dashboard
- Check bucket policies (should be created by migration)
- Ensure user is authenticated

### Authentication not working
- Enable Email provider in Auth settings
- Check email configuration in Supabase
- Verify `.env.local` has correct Supabase URL and keys

## 📞 Need Help?

- 📖 Check: `SUPABASE_SETUP.md`
- 📖 Full checklist: `IMPLEMENTATION_CHECKLIST.md`
- 🔗 Supabase Docs: https://supabase.com/docs
- 💬 Supabase Discord: https://discord.supabase.com

---

**Your Supabase Project:**
- URL: https://cahdabrkluflhlwexqsc.supabase.co
- Dashboard: https://supabase.com/dashboard/project/cahdabrkluflhlwexqsc

**Quick Commands:**
```bash
# Deploy all functions
npx supabase@latest functions deploy

# View function logs
npx supabase@latest functions logs process-image

# Run migrations
npx supabase@latest db push

# Start dev server
npm run dev
```
