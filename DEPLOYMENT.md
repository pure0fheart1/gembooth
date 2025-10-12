# GemBooth Deployment Guide

## Web App Deployment

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel
   ```

3. **Configure Environment Variables in Vercel Dashboard:**
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `GEMINI_API_KEY`

4. **Production URL:**
   - Custom domain: Add in Vercel settings
   - Free domain: `gembooth.vercel.app`

### Option 2: Netlify

1. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Build and Deploy:**
   ```bash
   npm run build
   netlify deploy --prod --dir=dist
   ```

3. **Set Environment Variables:**
   ```bash
   netlify env:set VITE_SUPABASE_URL "your_url"
   netlify env:set VITE_SUPABASE_ANON_KEY "your_key"
   ```

### Option 3: Custom Server (VPS/AWS/GCP)

1. **Build the app:**
   ```bash
   npm run build
   ```

2. **Serve with Nginx:**
   ```nginx
   server {
       listen 80;
       server_name gembooth.com;
       root /var/www/gembooth/dist;
       
       location / {
           try_files $uri $uri/ /index.html;
       }
   }
   ```

3. **SSL with Let's Encrypt:**
   ```bash
   certbot --nginx -d gembooth.com
   ```

## Supabase Edge Functions Deployment

### Deploy All Functions
```bash
supabase functions deploy
```

### Deploy Specific Function
```bash
supabase functions deploy process-image
supabase functions deploy create-gif
```

### Set Secrets
```bash
supabase secrets set GEMINI_API_KEY=your_key
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_key
```

### View Logs
```bash
supabase functions logs process-image --tail
```

## Android App Deployment

### Generate Signed APK

1. **Create keystore:**
   ```bash
   keytool -genkey -v -keystore gembooth.keystore -alias gembooth -keyalg RSA -keysize 2048 -validity 10000
   ```

2. **Configure signing in android/app/build.gradle:**
   ```gradle
   android {
       signingConfigs {
           release {
               storeFile file('gembooth.keystore')
               storePassword 'your_password'
               keyAlias 'gembooth'
               keyPassword 'your_password'
           }
       }
       
       buildTypes {
           release {
               signingConfig signingConfigs.release
               minifyEnabled true
               proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
           }
       }
   }
   ```

3. **Build release APK:**
   ```bash
   cd android
   ./gradlew assembleRelease
   ```

4. **APK location:**
   ```
   android/app/build/outputs/apk/release/app-release.apk
   ```

### Google Play Store

1. **Create Play Console Account** ($25 one-time fee)

2. **Create App:**
   - App name: GemBooth
   - Default language
   - App category: Photography

3. **Upload Assets:**
   - Icon (512x512)
   - Feature graphic (1024x500)
   - Screenshots (min 2)
   - Privacy policy URL

4. **Upload APK/AAB:**
   ```bash
   cd android
   ./gradlew bundleRelease
   ```
   Upload: `android/app/build/outputs/bundle/release/app-release.aab`

5. **Complete Content Rating Questionnaire**

6. **Set Pricing (Free/Paid)**

7. **Submit for Review**

## CI/CD Setup

### GitHub Actions (Web App)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
        env:
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

### GitHub Actions (Android App)

Create `.github/workflows/android.yml`:

```yaml
name: Android CI

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup JDK
        uses: actions/setup-java@v3
        with:
          distribution: 'temurin'
          java-version: '11'
      
      - name: Build APK
        run: |
          cd android
          chmod +x gradlew
          ./gradlew assembleRelease
      
      - name: Upload APK
        uses: actions/upload-artifact@v3
        with:
          name: app-release
          path: android/app/build/outputs/apk/release/app-release.apk
```

## Monitoring & Analytics

### Supabase Dashboard
- Monitor database usage
- View Edge Function logs
- Check storage usage
- Track authentication events

### Error Tracking (Optional)
```bash
npm install @sentry/react @sentry/vite-plugin
```

### Analytics (Optional)
```bash
npm install @vercel/analytics
```

## Post-Deployment Checklist

- [ ] Web app accessible at custom domain
- [ ] HTTPS enabled
- [ ] Environment variables set correctly
- [ ] Supabase migrations applied
- [ ] Edge Functions deployed and working
- [ ] Storage buckets configured
- [ ] RLS policies active
- [ ] Email authentication working
- [ ] Android app signed and uploaded
- [ ] Analytics tracking setup
- [ ] Error monitoring active
- [ ] Backup strategy in place
- [ ] Documentation updated

## Rollback Strategy

### Web App
```bash
vercel rollback
```

### Edge Functions
```bash
supabase functions deploy <function-name> --version <previous-version>
```

### Database
```bash
supabase db reset
```

## Cost Optimization

### Free Tier Limits
- **Supabase:** 500MB database, 1GB storage, 2GB bandwidth
- **Vercel:** 100GB bandwidth, unlimited deployments
- **Gemini API:** Pay per use (~$0.002 per image)

### Monitoring Costs
- Set up billing alerts in Supabase
- Monitor API usage in Google Cloud Console
- Track Edge Function invocations

### Scaling Considerations
- Enable CDN caching
- Implement rate limiting
- Use image optimization
- Consider upgrading to Supabase Pro for production
