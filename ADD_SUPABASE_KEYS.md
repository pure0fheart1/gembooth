# 🔑 Add Supabase Keys to Vercel

## ✅ Already Added
- ✅ GEMINI_API_KEY (all environments)

## ⚠️ Still Needed
You need to add your Supabase keys. Run these commands:

### Step 1: Add VITE_SUPABASE_URL

```bash
cd C:/Users/jamie/Desktop/gembooth

# Production
echo "YOUR_SUPABASE_URL" | vercel env add VITE_SUPABASE_URL production

# Preview
echo "YOUR_SUPABASE_URL" | vercel env add VITE_SUPABASE_URL preview

# Development  
echo "YOUR_SUPABASE_URL" | vercel env add VITE_SUPABASE_URL development
```

**Replace `YOUR_SUPABASE_URL` with your actual Supabase URL**
Example: `https://xxxxx.supabase.co`

### Step 2: Add VITE_SUPABASE_ANON_KEY

```bash
cd C:/Users/jamie/Desktop/gembooth

# Production
echo "YOUR_SUPABASE_ANON_KEY" | vercel env add VITE_SUPABASE_ANON_KEY production

# Preview
echo "YOUR_SUPABASE_ANON_KEY" | vercel env add VITE_SUPABASE_ANON_KEY preview

# Development
echo "YOUR_SUPABASE_ANON_KEY" | vercel env add VITE_SUPABASE_ANON_KEY development
```

**Replace `YOUR_SUPABASE_ANON_KEY` with your actual anon key**

---

## 🔍 Where to Find Supabase Keys

1. Go to https://supabase.com/dashboard
2. Select your GemBooth project
3. Click **Settings** → **API**
4. Copy these values:
   - **Project URL** → Use for VITE_SUPABASE_URL
   - **anon/public key** → Use for VITE_SUPABASE_ANON_KEY

---

## 🚀 After Adding Keys

### Redeploy to Production
```bash
cd C:/Users/jamie/Desktop/gembooth
vercel --prod
```

This will trigger a new deployment with the environment variables.

---

## ✅ Verify Environment Variables

Check all env vars are set:
```bash
vercel env ls
```

You should see:
- GEMINI_API_KEY (Production, Preview, Development) ✅
- VITE_SUPABASE_URL (Production, Preview, Development)
- VITE_SUPABASE_ANON_KEY (Production, Preview, Development)

---

## 🎯 Quick Alternative: Use Vercel Dashboard

If you prefer a GUI:

1. Go to https://vercel.com/jamie-lees-projects-f8b674ea/gembooth/settings/environment-variables
2. Click "Add New"
3. Add each variable:
   - Key: `VITE_SUPABASE_URL`
   - Value: Your Supabase URL
   - Environments: Check all three ✓
4. Repeat for `VITE_SUPABASE_ANON_KEY`
5. Redeploy from Deployments tab

---

## 📝 Current Status

### Environment Variables Status
- [x] GEMINI_API_KEY - **ADDED** ✅
- [ ] VITE_SUPABASE_URL - **PENDING** ⏳
- [ ] VITE_SUPABASE_ANON_KEY - **PENDING** ⏳

### Deployment Status
- [x] Initial deployment successful
- [x] Project linked to Vercel
- [ ] Environment variables complete
- [ ] Production redeploy needed

---

## 🆘 Don't Have Supabase Set Up Yet?

Follow the setup guide:
```bash
# Read the guide
cat SUPABASE_SETUP.md

# Or follow quick start
cat QUICK_START.md
```

---

<div align="center">

**Current Deployment:** https://gembooth-jisim1d7t-jamie-lees-projects-f8b674ea.vercel.app

Once you add Supabase keys and redeploy, your app will be fully functional! 🚀

</div>
