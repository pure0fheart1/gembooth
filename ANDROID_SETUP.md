# GemBooth Android App Development Guide

## Architecture Decision: React Native vs Native Android

### Option 1: React Native (Recommended for faster development)
**Pros:**
- Code reuse from web app (~60-70%)
- Faster development
- Single codebase for iOS later
- Familiar React patterns

**Cons:**
- Slightly larger app size
- Some native features need bridging

### Option 2: Kotlin/Jetpack Compose (Best performance)
**Pros:**
- Better performance
- Full Android ecosystem access
- Smaller app size

**Cons:**
- Separate codebase
- Longer development time

## React Native Setup (Recommended)

### Prerequisites
- Node.js 18+
- Android Studio
- JDK 11+
- React Native CLI

### Step 1: Initialize Project

```bash
npx react-native init GemBoothMobile --template react-native-template-typescript
cd GemBoothMobile
```

### Step 2: Install Dependencies

```bash
npm install @supabase/supabase-js
npm install @react-native-camera-roll/camera-roll
npm install react-native-vision-camera
npm install @react-native-async-storage/async-storage
npm install @react-navigation/native
npm install @react-navigation/stack
npm install react-native-fast-image
```

### Step 3: Configure Android Permissions

Add to `android/app/src/main/AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.INTERNET" />
```

### Step 4: Project Structure

```
GemBoothMobile/
├── android/              # Android native code
├── src/
│   ├── components/
│   │   ├── Camera.tsx
│   │   ├── PhotoPreview.tsx
│   │   └── ModeSelector.tsx
│   ├── screens/
│   │   ├── AuthScreen.tsx
│   │   ├── CameraScreen.tsx
│   │   ├── GalleryScreen.tsx
│   │   └── ProfileScreen.tsx
│   ├── services/
│   │   ├── supabase.ts
│   │   ├── camera.ts
│   │   └── storage.ts
│   ├── navigation/
│   │   └── AppNavigator.tsx
│   └── utils/
│       └── imageProcessing.ts
├── App.tsx
└── package.json
```

### Step 5: Implement Core Features

#### 5.1 Supabase Client (src/services/supabase.ts)
```typescript
import { createClient } from '@supabase/supabase-js'
import AsyncStorage from '@react-native-async-storage/async-storage'

const supabaseUrl = 'YOUR_SUPABASE_URL'
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})
```

#### 5.2 Camera Service (src/services/camera.ts)
```typescript
import { Camera } from 'react-native-vision-camera'

export const cameraService = {
  async requestPermissions() {
    const cameraPermission = await Camera.requestCameraPermission()
    return cameraPermission === 'granted'
  },

  async takePhoto(camera: Camera) {
    const photo = await camera.takePhoto({
      qualityPrioritization: 'balanced',
      flash: 'off',
    })
    return photo
  }
}
```

#### 5.3 Image Processing (via Edge Function)
```typescript
export const processImage = async (imageUri: string, mode: string) => {
  const { data: { session } } = await supabase.auth.getSession()
  
  const response = await fetch(
    'YOUR_SUPABASE_URL/functions/v1/process-image',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session?.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputImage: imageUri,
        mode,
        userId: session?.user.id
      })
    }
  )
  
  return await response.json()
}
```

### Step 6: Build and Run

```bash
# Run Metro bundler
npm start

# Run on Android emulator/device
npm run android
```

## Native Kotlin Alternative

### Step 1: Create Android Project

```bash
# Using Android Studio
File → New → New Project → Empty Activity
Name: GemBooth
Package: com.gembooth.app
Language: Kotlin
```

### Step 2: Add Dependencies (build.gradle)

```gradle
dependencies {
    implementation 'io.github.jan-tennert.supabase:postgrest-kt:2.0.0'
    implementation 'io.github.jan-tennert.supabase:storage-kt:2.0.0'
    implementation 'io.github.jan-tennert.supabase:gotrue-kt:2.0.0'
    
    implementation 'androidx.camera:camera-camera2:1.3.0'
    implementation 'androidx.camera:camera-lifecycle:1.3.0'
    implementation 'androidx.camera:camera-view:1.3.0'
    
    implementation 'com.squareup.retrofit2:retrofit:2.9.0'
    implementation 'com.squareup.okhttp3:okhttp:4.12.0'
}
```

### Step 3: Core Features

#### Supabase Client (SupabaseClient.kt)
```kotlin
object SupabaseClient {
    val client = createSupabaseClient(
        supabaseUrl = "YOUR_SUPABASE_URL",
        supabaseKey = "YOUR_SUPABASE_ANON_KEY"
    ) {
        install(Auth)
        install(Storage)
        install(Postgrest)
    }
}
```

## Testing Checklist

- [ ] Camera permissions work
- [ ] Photo capture works
- [ ] Image upload to Supabase
- [ ] Edge Function processes images
- [ ] Gallery loads user photos
- [ ] Authentication flow works
- [ ] Offline mode with queue
- [ ] GIF creation works

## Deployment

### Google Play Store
1. Generate signed APK
2. Create Play Console account
3. Fill in app details
4. Upload APK
5. Submit for review

### Internal Testing
1. Use Google Play Internal Testing
2. Add test users
3. Share testing link
