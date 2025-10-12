<div align="center">
<img width="1200" height="475" alt="GemBooth" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />

# 📸 GemBooth

**AI-Powered Photo Booth with Cloud Sync**

Transform your photos with AI effects using Google Gemini • Web & Android • Powered by Supabase

[Live Demo](https://gembooth.vercel.app) • [Documentation](#documentation) • [Android App](#android-app)

</div>

---

## ✨ Features

### Core Features
- 🎨 **AI Image Effects** - Transform photos with Gemini-powered effects
- 📱 **Cross-Platform** - Web app + Android app (coming soon)
- 🔐 **User Authentication** - Secure login with Supabase Auth
- ☁️ **Cloud Storage** - All photos synced to Supabase
- 🎬 **GIF Creator** - Combine photos into animated GIFs
- 📊 **Usage Dashboard** - Track your creations
- 🌙 **Custom Modes** - Create your own AI prompts

### Tech Stack
- **Frontend:** React + Vite
- **Backend:** Supabase (PostgreSQL + Storage + Edge Functions)
- **AI:** Google Gemini 2.5 Flash
- **State:** Zustand
- **Auth:** Supabase Auth
- **Deployment:** Vercel (Web) + Google Play (Android)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Supabase account (free tier works!)
- Google Gemini API key

### 1. Clone & Install
```bash
git clone https://github.com/yourusername/gembooth.git
cd gembooth
npm install
```

### 2. Set Up Supabase
Follow the detailed guide: [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)

Quick version:
```bash
# Create Supabase project at supabase.com
# Run migrations
supabase db push

# Deploy Edge Functions
supabase functions deploy process-image
supabase functions deploy create-gif

# Set secrets
supabase secrets set GEMINI_API_KEY=your_key
```

### 3. Configure Environment
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
GEMINI_API_KEY=your_gemini_api_key
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### 4. Run Development Server
```bash
npm run dev
```

Visit `http://localhost:5173` 🎉

---

## 📖 Documentation

### Setup Guides
- [Supabase Setup](./SUPABASE_SETUP.md) - Complete backend setup
- [Android Development](./ANDROID_SETUP.md) - Build the mobile app
- [Deployment Guide](./DEPLOYMENT.md) - Deploy to production

### Architecture
```
gembooth/
├── src/
│   ├── components/
│   │   ├── App.jsx              # Main app component
│   │   └── Auth/                # Authentication UI
│   │       ├── AuthContext.jsx
│   │       ├── LoginForm.jsx
│   │       └── SignupForm.jsx
│   ├── lib/
│   │   ├── actions.js           # Business logic
│   │   ├── llm.js               # Gemini integration (legacy)
│   │   ├── store.js             # Zustand state
│   │   ├── modes.js             # Effect modes
│   │   └── supabase/            # Supabase integration
│   │       ├── client.js
│   │       └── auth.js
│   └── index.tsx
├── supabase/
│   ├── migrations/              # Database schema
│   │   ├── 20250106000000_initial_schema.sql
│   │   ├── 20250106000001_rls_policies.sql
│   │   └── 20250106000002_storage_setup.sql
│   └── functions/               # Edge Functions
│       ├── process-image/
│       └── create-gif/
└── index.html
```

### Database Schema
```sql
-- Users (extended from auth.users)
profiles: id, username, avatar_url, bio

-- Photos
photos: id, user_id, input_url, output_url, mode, prompt

-- GIFs
gifs: id, user_id, gif_url, photo_ids[]

-- Favorites
favorites: id, user_id, photo_id, gif_id

-- Usage Stats
usage_stats: id, user_id, action_type, mode
```

---

## 🔒 Security

- ✅ Row Level Security (RLS) on all tables
- ✅ Storage policies for user isolation
- ✅ Edge Functions for API key protection
- ✅ Email verification required
- ✅ Secure session management

---

## 🎯 Roadmap

### Phase 1: Backend ✅
- [x] Supabase setup
- [x] Database schema
- [x] RLS policies
- [x] Edge Functions
- [x] Storage configuration

### Phase 2: Web App 🚧
- [x] Authentication UI
- [x] Supabase integration
- [ ] Gallery page
- [ ] User dashboard
- [ ] Settings page

### Phase 3: Android App 📱
- [ ] React Native setup
- [ ] Camera integration
- [ ] Supabase sync
- [ ] Offline mode
- [ ] Google Play release

### Phase 4: Features 🎨
- [ ] Social sharing
- [ ] Public gallery
- [ ] Premium modes
- [ ] Batch processing
- [ ] Video support

---

## 📱 Android App

The Android version is in development! Choose your approach:

### Option 1: React Native (Recommended)
- 70% code reuse from web
- Faster development
- Single codebase

### Option 2: Native Kotlin
- Best performance
- Full Android ecosystem
- Smaller app size

See [ANDROID_SETUP.md](./ANDROID_SETUP.md) for details.

---

## 💰 Cost Breakdown

### Free Tier (Perfect for Development)
- **Supabase Free:** 500MB DB, 1GB storage
- **Vercel Free:** 100GB bandwidth
- **Gemini API:** ~$0.002 per image

### Production (Estimated)
- **Supabase Pro:** $25/mo (100K users)
- **Vercel Pro:** $20/mo
- **Gemini API:** Usage-based (~$20-50/mo for 10K images)

**Total: ~$65-95/mo** for 100K users

---

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📄 License

MIT License - see [LICENSE](./LICENSE)

---

## 🙏 Acknowledgments

- [Google Gemini](https://ai.google.dev/) - AI image generation
- [Supabase](https://supabase.com) - Backend infrastructure
- [Vercel](https://vercel.com) - Web hosting
- Original GemBooth by AI Studio

---

## 📞 Support

- 📧 Email: support@gembooth.com
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/gembooth/issues)
- 💬 Discord: [Join our community](https://discord.gg/gembooth)

---

<div align="center">
Made with ❤️ by the GemBooth Team

⭐ Star us on GitHub if you find this useful!
</div>
