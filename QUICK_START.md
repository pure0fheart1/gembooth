# ⚡ GemBooth Quick Start Guide

## 🎯 Get Running in 15 Minutes

### Step 1: Supabase Setup (5 min)
```bash
# 1. Go to supabase.com and create account
# 2. Create new project called "gembooth"
# 3. Copy these from Settings > API:
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGc...
```

### Step 2: Run Migrations (2 min)
```bash
npm install -g supabase
supabase login
supabase link --project-ref YOUR_PROJECT_REF
supabase db push
```

### Step 3: Deploy Functions (3 min)
```bash
cd gembooth
supabase functions deploy process-image
supabase functions deploy create-gif
supabase secrets set GEMINI_API_KEY=your_gemini_key
```

### Step 4: Web App Setup (3 min)
```bash
npm install
cp .env.example .env.local

# Edit .env.local with your keys:
GEMINI_API_KEY=xxx
VITE_SUPABASE_URL=xxx
VITE_SUPABASE_ANON_KEY=xxx

npm run dev
```

### Step 5: Test! (2 min)
1. Open http://localhost:5173
2. Click "Sign Up"
3. Create account
4. Start the webcam
5. Take a photo
6. Watch the AI magic! ✨

---

## 📋 Essential Commands

### Development
```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Supabase
```bash
supabase db push              # Run migrations
supabase functions deploy     # Deploy all functions
supabase functions logs NAME  # View function logs
supabase db reset             # Reset database
```

### Deployment
```bash
vercel                        # Deploy to Vercel
vercel --prod                 # Deploy to production
```

---

## 🔑 Where to Get API Keys

### Gemini API Key
1. Go to https://ai.google.dev
2. Click "Get API Key"
3. Create new key
4. Copy and save

### Supabase Keys
1. Go to your Supabase project
2. Settings > API
3. Copy "Project URL" and "anon/public" key

---

## 📁 Project Structure

```
gembooth/
├── 📄 Documentation
│   ├── README_UPDATED.md          # Main README
│   ├── SUPABASE_SETUP.md          # Backend setup
│   ├── ANDROID_SETUP.md           # Mobile guide
│   ├── DEPLOYMENT.md              # Deploy guide
│   ├── PROJECT_SUMMARY.md         # Overview
│   └── IMPLEMENTATION_CHECKLIST.md # Progress tracker
│
├── 🗄️ Backend (Supabase)
│   └── supabase/
│       ├── migrations/            # Database schema
│       └── functions/             # Edge Functions
│
├── 🌐 Frontend (React)
│   └── src/
│       ├── components/            # UI components
│       │   ├── App.jsx           # Main app
│       │   └── Auth/             # Auth UI
│       └── lib/
│           ├── supabase/         # Backend client
│           ├── actions.js        # Business logic
│           └── store.js          # State management
│
└── ⚙️ Config
    ├── .env.local                # Your secrets (create this!)
    ├── .env.example              # Template
    ├── package.json              # Dependencies
    └── vite.config.ts            # Build config
```

---

## 🐛 Troubleshooting

### "Missing environment variables"
→ Create `.env.local` from `.env.example`
→ Restart dev server

### "Edge Function error"
→ Check GEMINI_API_KEY is set: `supabase secrets list`
→ View logs: `supabase functions logs process-image`

### "Auth not working"
→ Enable email auth in Supabase dashboard
→ Check email confirmation settings

### "Storage upload fails"
→ Verify RLS policies: check Supabase > Storage > Policies
→ Ensure user is logged in

---

## 🎯 Next Steps

### For Web App
- [ ] Read [README_UPDATED.md](README_UPDATED.md)
- [ ] Complete [IMPLEMENTATION_CHECKLIST.md](IMPLEMENTATION_CHECKLIST.md)
- [ ] Build Gallery page
- [ ] Deploy to Vercel

### For Android App
- [ ] Read [ANDROID_SETUP.md](ANDROID_SETUP.md)
- [ ] Choose React Native or Kotlin
- [ ] Follow mobile setup guide

### For Production
- [ ] Read [DEPLOYMENT.md](DEPLOYMENT.md)
- [ ] Set up monitoring
- [ ] Configure custom domain
- [ ] Launch! 🚀

---

## 📞 Get Help

- 📖 Read the docs in this folder
- 🐛 GitHub Issues
- 💬 Supabase Discord
- 📧 support@gembooth.com

---

<div align="center">

**Ready to build? Let's go! 🚀**

⭐ Star the project if you find it useful!

</div>
