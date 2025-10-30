# Batch Upload - System Architecture

## Component Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         App.jsx (Main)                          │
│                                                                 │
│  ┌──────────────┐                              ┌──────────────┐│
│  │  Batch Upload │  showBatchUpload state     │  Main Photo  ││
│  │    Button     │◄────────────────────────────│   Gallery    ││
│  └──────┬───────┘                              └──────────────┘│
│         │                                                       │
│         │ onClick                                               │
│         ▼                                                       │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │           BatchUpload.jsx Component                      │  │
│  │  ┌─────────────────────────────────────────────────┐   │  │
│  │  │  File Selection                                  │   │  │
│  │  │  - Multiple file input                           │   │  │
│  │  │  - Preview thumbnails                            │   │  │
│  │  │  - Remove individual files                       │   │  │
│  │  └─────────────────────────────────────────────────┘   │  │
│  │  ┌─────────────────────────────────────────────────┐   │  │
│  │  │  Mode Selection                                  │   │  │
│  │  │  - Grid of 12 mode buttons                      │   │  │
│  │  │  - Visual emoji indicators                       │   │  │
│  │  │  - Active state highlighting                     │   │  │
│  │  └─────────────────────────────────────────────────┘   │  │
│  │  ┌─────────────────────────────────────────────────┐   │  │
│  │  │  Processing                                      │   │  │
│  │  │  - Progress bar (0-100%)                         │   │  │
│  │  │  - Current file indicator                        │   │  │
│  │  │  - Animated spinner                              │   │  │
│  │  └─────────────────────────────────────────────────┘   │  │
│  │  ┌─────────────────────────────────────────────────┐   │  │
│  │  │  Results                                         │   │  │
│  │  │  - Success/failure summary                       │   │  │
│  │  │  - Error details list                            │   │  │
│  │  │  - Download ZIP button                           │   │  │
│  │  └─────────────────────────────────────────────────┘   │  │
│  └─────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow Architecture

```
┌────────────────────────────────────────────────────────────────────┐
│                        User Interactions                           │
└────────────┬───────────────────────────────────────────────────────┘
             │
             ▼
┌────────────────────────────────────────────────────────────────────┐
│                      BatchUpload Component                         │
│                                                                    │
│  [File Selection] → [Mode Selection] → [Process Button]           │
└────────────┬───────────────────────────────────────────────────────┘
             │
             │ processBatch(files, mode)
             ▼
┌────────────────────────────────────────────────────────────────────┐
│                   actions-supabase.js                              │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │ 1. Validate User                                             │ │
│  │    - getCurrentUser()                                        │ │
│  │    - Check authentication                                    │ │
│  └──────────────────────────────────────────────────────────────┘ │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │ 2. Check Subscription Tier                                   │ │
│  │    - getUserSubscription(userId)                             │ │
│  │    - Verify Pro/Premium                                      │ │
│  └──────────────────────────────────────────────────────────────┘ │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │ 3. Validate Files                                            │ │
│  │    - Check types (JPEG/PNG)                                  │ │
│  │    - Check sizes (<10MB)                                     │ │
│  │    - Check count (≤10)                                       │ │
│  └──────────────────────────────────────────────────────────────┘ │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │ 4. Check Usage Quota                                         │ │
│  │    - checkUsageLimit(userId, 'photo')                        │ │
│  │    - Verify remaining quota                                  │ │
│  └──────────────────────────────────────────────────────────────┘ │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │ 5. Process Loop (for each file)                              │ │
│  │    ┌────────────────────────────────────────────────────┐   │ │
│  │    │ a. Convert to base64                               │   │ │
│  │    └────────────────────────────────────────────────────┘   │ │
│  │    ┌────────────────────────────────────────────────────┐   │ │
│  │    │ b. Check quota (again)                             │   │ │
│  │    └────────────────────────────────────────────────────┘   │ │
│  │    ┌────────────────────────────────────────────────────┐   │ │
│  │    │ c. Call Edge Function                              │   │ │
│  │    │    - Send base64 image                             │   │ │
│  │    │    - Send mode/prompt                              │   │ │
│  │    └────────────────────────────────────────────────────┘   │ │
│  │    ┌────────────────────────────────────────────────────┐   │ │
│  │    │ d. Store result                                    │   │ │
│  │    │    - imageData.inputs[id]                          │   │ │
│  │    │    - imageData.outputs[id]                         │   │ │
│  │    └────────────────────────────────────────────────────┘   │ │
│  │    ┌────────────────────────────────────────────────────┐   │ │
│  │    │ e. Update Zustand store                            │   │ │
│  │    │    - Add to photos array                           │   │ │
│  │    │    - Update progress state                         │   │ │
│  │    └────────────────────────────────────────────────────┘   │ │
│  │    ┌────────────────────────────────────────────────────┐   │ │
│  │    │ f. Increment usage                                 │   │ │
│  │    │    - incrementUsage(userId, 'photo')               │   │ │
│  │    └────────────────────────────────────────────────────┘   │ │
│  └──────────────────────────────────────────────────────────────┘ │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │ 6. Return Results                                            │ │
│  │    - Array of {success, id, fileName, error}                 │ │
│  └──────────────────────────────────────────────────────────────┘ │
└────────────┬───────────────────────────────────────────────────────┘
             │
             │ results array
             ▼
┌────────────────────────────────────────────────────────────────────┐
│                      BatchUpload Component                         │
│                                                                    │
│  [Display Results] → [Download ZIP] or [Upload Another]           │
└────────────────────────────────────────────────────────────────────┘
```

## State Management Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    Zustand Store (store.js)                     │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  batchUploadProgress: null | {total, completed, current}│   │
│  │                                                           │   │
│  │  States:                                                  │   │
│  │  • null        = Not processing                          │   │
│  │  • {0, 0, null} = Starting                               │   │
│  │  • {10, 5, 6}   = Processing (50% complete)              │   │
│  │  • null        = Completed (cleared)                     │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  photos: [...]                                           │   │
│  │                                                           │   │
│  │  Updated with each processed image:                      │   │
│  │  • {id, mode, isBusy: true}  = Processing                │   │
│  │  • {id, mode, isBusy: false} = Complete                  │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
            ▲                                    │
            │                                    │
            │ setState                           │ useStore.use.X()
            │                                    │
┌───────────┴────────────────────────────────────▼───────────────┐
│                    React Components                            │
│                                                                │
│  BatchUpload.jsx           App.jsx                            │
│  • Reads progress          • Reads photos                     │
│  • Displays UI             • Displays gallery                 │
│                                                                │
│  processBatch()                                                │
│  • Sets progress           • Adds photos                      │
│  • Clears on complete      • Updates status                   │
└────────────────────────────────────────────────────────────────┘
```

## Storage Architecture

```
┌────────────────────────────────────────────────────────────────┐
│                     Supabase Storage                           │
│                                                                │
│  Bucket: user-photos                                           │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ {userId}/                                                 │ │
│  │   ├── {photoId1}-input.jpg    ← Original image           │ │
│  │   ├── {photoId1}-output.jpg   ← Processed image          │ │
│  │   ├── {photoId2}-input.jpg                               │ │
│  │   ├── {photoId2}-output.jpg                              │ │
│  │   └── ...                                                 │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  Bucket: user-gifs                                             │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ {userId}/                                                 │ │
│  │   ├── {gifId1}.gif                                        │ │
│  │   └── {gifId2}.gif                                        │ │
│  └──────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────┐
│                    Supabase Database                           │
│                                                                │
│  Table: photos                                                 │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ id | user_id | input_url | output_url | mode | created   │ │
│  ├────┼─────────┼───────────┼────────────┼──────┼──────────┤ │
│  │ uuid│ user1   │ https://..│ https://.. │ rena.│ 2025-... │ │
│  │ ...│ ...     │ ...       │ ...        │ ...  │ ...      │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  Table: usage_limits                                           │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ user_id | photos_used | photos_limit | period_start     │ │
│  ├─────────┼─────────────┼──────────────┼─────────────────┤ │
│  │ user1   │ 15          │ 100          │ 2025-01-01      │ │
│  │ ...     │ ...         │ ...          │ ...             │ │
│  └──────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────┘
```

## API Integration Flow

```
┌────────────────────────────────────────────────────────────────┐
│                     Client (React App)                         │
└────────────┬───────────────────────────────────────────────────┘
             │
             │ supabase.functions.invoke('process-image', {...})
             ▼
┌────────────────────────────────────────────────────────────────┐
│              Supabase Edge Function                            │
│              process-image/index.ts                            │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ 1. Receive Request                                       │ │
│  │    - inputImage (base64)                                 │ │
│  │    - mode                                                │ │
│  │    - prompt                                              │ │
│  │    - userId                                              │ │
│  └──────────────────────────────────────────────────────────┘ │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ 2. Call Gemini API                                       │ │
│  │    - Send image + prompt                                 │ │
│  │    - Receive transformed image                           │ │
│  └──────────────────────────────────────────────────────────┘ │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ 3. Upload to Storage                                     │ │
│  │    - Input image → user-photos bucket                    │ │
│  │    - Output image → user-photos bucket                   │ │
│  └──────────────────────────────────────────────────────────┘ │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ 4. Save to Database                                      │ │
│  │    - Insert into photos table                            │ │
│  │    - Return photo record                                 │ │
│  └──────────────────────────────────────────────────────────┘ │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ 5. Return Response                                       │ │
│  │    - outputImage (base64)                                │ │
│  │    - photoId                                             │ │
│  └──────────────────────────────────────────────────────────┘ │
└────────────┬───────────────────────────────────────────────────┘
             │
             │ {data: {outputImage, photoId}, error}
             ▼
┌────────────────────────────────────────────────────────────────┐
│                     Client (React App)                         │
│                                                                │
│  • Store output in imageData.outputs[id]                      │
│  • Update photos array in Zustand                             │
│  • Increment usage counter                                    │
└────────────────────────────────────────────────────────────────┘
```

## Error Handling Architecture

```
┌────────────────────────────────────────────────────────────────┐
│                    Error Handling Layers                       │
│                                                                │
│  Layer 1: Client-Side Validation (BatchUpload.jsx)            │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ • File count (max 10)                                    │ │
│  │ • Empty selection                                        │ │
│  │ Result: Alert → Stay on screen                          │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  Layer 2: Pre-Processing Validation (actions-supabase.js)     │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ • Subscription tier check                                │ │
│  │ • File type validation                                   │ │
│  │ • File size validation                                   │ │
│  │ • Initial quota check                                    │ │
│  │ Result: Alert → Return null → No processing             │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  Layer 3: Per-Image Validation (actions-supabase.js)          │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ • Quota check before each image                          │ │
│  │ Result: Alert → Break loop → Partial results            │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  Layer 4: API/Network Errors (try/catch)                      │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ • Edge Function errors                                   │ │
│  │ • Network failures                                       │ │
│  │ • Gemini API errors                                      │ │
│  │ Result: Catch → Add to results with error → Continue    │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  Layer 5: Results Display (BatchUpload.jsx)                   │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ • Show success count                                     │ │
│  │ • Show failure count                                     │ │
│  │ • List errors with file names                            │ │
│  │ Result: User informed → Can retry failed files          │ │
│  └──────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────┘
```

## Subscription Tier Integration

```
┌────────────────────────────────────────────────────────────────┐
│                   Subscription System                          │
│                                                                │
│  Free Tier                                                     │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ • Batch Upload: ❌ Not Available                         │ │
│  │ • Shows: Upgrade prompt                                  │ │
│  │ • Photos: 10/month                                       │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  Pro Tier ($9.99/month)                                        │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ • Batch Upload: ✅ Available                             │ │
│  │ • Photos: 100/month                                      │ │
│  │ • GIFs: 20/month                                         │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  Premium Tier ($19.99/month)                                   │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ • Batch Upload: ✅ Available                             │ │
│  │ • Photos: 500/month                                      │ │
│  │ • GIFs: 100/month                                        │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  Checking Process:                                             │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ 1. getUserSubscription(userId)                           │ │
│  │ 2. Extract tier.id ('free', 'pro', 'premium')            │ │
│  │ 3. If 'free' → Show alert, return null                   │ │
│  │ 4. If 'pro' or 'premium' → Continue                      │ │
│  └──────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────┘
```

## Memory Architecture

```
┌────────────────────────────────────────────────────────────────┐
│                      Browser Memory                            │
│                                                                │
│  imageData Object (lib/imageData.js)                          │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ inputs: {                                                 │ │
│  │   'uuid-1': 'data:image/jpeg;base64,...',  ← 500KB-2MB   │ │
│  │   'uuid-2': 'data:image/jpeg;base64,...',                │ │
│  │   ...                                                     │ │
│  │ }                                                         │ │
│  │                                                           │ │
│  │ outputs: {                                                │ │
│  │   'uuid-1': 'data:image/jpeg;base64,...',  ← 500KB-2MB   │ │
│  │   'uuid-2': 'data:image/jpeg;base64,...',                │ │
│  │   ...                                                     │ │
│  │ }                                                         │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  Batch of 10 images:                                           │
│  • Input images: ~10MB - 20MB                                 │
│  • Output images: ~10MB - 20MB                                │
│  • Total: ~20MB - 40MB in RAM                                 │
│                                                                │
│  Cleared when:                                                 │
│  • User deletes photo (deletePhoto action)                    │
│  • Page refresh (not persisted)                               │
│  • Browser tab closed                                         │
│                                                                │
│  Future: Consider IndexedDB for persistence                    │
└────────────────────────────────────────────────────────────────┘
```

## ZIP Generation Flow

```
┌────────────────────────────────────────────────────────────────┐
│                 ZIP Download Process                           │
│                                                                │
│  1. User clicks "Download All as ZIP"                          │
│     ▼                                                          │
│  2. Dynamic import JSZip from CDN                              │
│     const JSZip = await import('https://cdn.../jszip...')     │
│     ▼                                                          │
│  3. Create ZIP instance                                        │
│     const zip = new JSZip()                                    │
│     ▼                                                          │
│  4. Filter successful results                                  │
│     const successful = results.filter(r => r.success)         │
│     ▼                                                          │
│  5. For each successful result:                                │
│     ┌────────────────────────────────────────────────────┐   │
│     │ a. Get output image from imageData                 │   │
│     │    const img = imageData.outputs[result.id]        │   │
│     ├────────────────────────────────────────────────────┤   │
│     │ b. Convert base64 to blob                          │   │
│     │    const blob = await fetch(dataUrl).then(r=>blob) │   │
│     ├────────────────────────────────────────────────────┤   │
│     │ c. Generate filename                               │   │
│     │    const name = original_processed.jpg             │   │
│     ├────────────────────────────────────────────────────┤   │
│     │ d. Add to ZIP                                      │   │
│     │    zip.file(name, blob)                            │   │
│     └────────────────────────────────────────────────────┘   │
│     ▼                                                          │
│  6. Generate ZIP blob                                          │
│     const blob = await zip.generateAsync({type: 'blob'})      │
│     ▼                                                          │
│  7. Create download link                                       │
│     const url = URL.createObjectURL(blob)                     │
│     ▼                                                          │
│  8. Trigger download                                           │
│     const a = document.createElement('a')                      │
│     a.href = url                                               │
│     a.download = 'gembooth_batch_[timestamp].zip'             │
│     a.click()                                                  │
│     ▼                                                          │
│  9. Cleanup                                                    │
│     URL.revokeObjectURL(url)                                   │
└────────────────────────────────────────────────────────────────┘
```

---

**Document Version:** 1.0
**Last Updated:** January 17, 2025
**Status:** Production Architecture
