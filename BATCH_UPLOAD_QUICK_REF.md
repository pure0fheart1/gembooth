# Batch Upload - Quick Reference

## Quick Start

### Opening Batch Upload
```jsx
// In App.jsx
const [showBatchUpload, setShowBatchUpload] = useState(false)

<button onClick={() => setShowBatchUpload(true)}>
  Batch Upload
</button>

{showBatchUpload && (
  <BatchUpload onClose={() => setShowBatchUpload(false)} />
)}
```

### Processing Files
```javascript
import { processBatch } from '../lib/actions-supabase'

const handleUpload = async () => {
  const results = await processBatch(filesArray, 'renaissance')
  if (results) {
    console.log('Batch complete:', results)
  }
}
```

## Key Constraints

| Constraint | Value | Enforced Where |
|------------|-------|----------------|
| Max files per batch | 10 | `BatchUpload.jsx:12` |
| Max file size | 10MB | `actions-supabase.js:356` |
| Allowed types | JPEG, PNG | `actions-supabase.js:348` |
| Subscription tier | Pro/Premium | `actions-supabase.js:336` |
| Processing mode | Sequential | `actions-supabase.js:360` |

## File Locations

```
src/
├── components/
│   └── BatchUpload.jsx          # UI component (309 lines)
├── lib/
│   ├── actions-supabase.js      # processBatch() (lines 327-470)
│   └── store.js                 # State (line 21)
└── index.css                     # Styles (lines 2225-2707)
```

## State Flow

```
User clicks "Batch Upload"
  → showBatchUpload = true
    → BatchUpload component renders
      → User selects files
        → Previews generated
          → User selects mode
            → User clicks "Process All"
              → processBatch() called
                → batchUploadProgress updated
                  → Processing begins
                    → Progress bar updates
                      → Results returned
                        → Summary shown
                          → User downloads ZIP or closes
                            → showBatchUpload = false
```

## Error Handling Matrix

| Error Type | Alert Message | Return Value | Modal Behavior |
|------------|---------------|--------------|----------------|
| Free tier user | "Batch upload is a Pro/Premium feature..." | `null` | Stays open |
| No files | "Please select at least one image..." | `null` | Stays open |
| Invalid types | "Invalid file types detected..." | `null` | Stays open |
| Oversized files | "Some files are too large..." | `null` | Stays open |
| Quota exceeded | "You have reached your monthly limit..." | `null` | Stays open |
| Mid-batch quota | "Usage limit reached. Successfully processed X..." | Partial results | Shows results |
| Individual failure | (No alert) | Results with errors | Shows results |

## CSS Class Reference

### Main Classes
- `.batchUploadModal` - Full-screen overlay
- `.batchUpload` - Main modal container
- `.batchUpload__header` - Top bar with title/close
- `.batchUpload__content` - Scrollable content area
- `.batchUpload__progress` - Progress view
- `.batchUpload__results` - Results summary view

### Interactive Elements
- `.batchUpload__selectBtn` - File selection button
- `.batchUpload__modeBtn` - Mode selector buttons
- `.batchUpload__uploadBtn` - Process batch button
- `.batchUpload__zipBtn` - Download ZIP button
- `.batchUpload__removeBtn` - Remove file from preview

## Common Patterns

### Checking Batch Progress
```javascript
const batchProgress = useStore.use.batchUploadProgress()

if (batchProgress) {
  console.log(`${batchProgress.completed}/${batchProgress.total}`)
}
```

### Accessing Results
```javascript
// In BatchUpload component
const [batchResults, setBatchResults] = useState(null)

const handleUpload = async () => {
  const results = await processBatch(selectedFiles, selectedMode)
  if (results) {
    setBatchResults(results)
    // Results structure:
    // [
    //   {success: true, id: 'uuid', fileName: 'photo1.jpg'},
    //   {success: false, fileName: 'photo2.jpg', error: 'API error'}
    // ]
  }
}
```

### ZIP Download
```javascript
// Dynamically import JSZip
const JSZip = (await import('https://cdn.jsdelivr.net/npm/jszip@3.10.1/+esm')).default

const zip = new JSZip()
// Add files...
const blob = await zip.generateAsync({type: 'blob'})
// Trigger download...
```

## Testing Checklist

- [ ] Free tier shows upgrade prompt
- [ ] Pro/Premium tier can access feature
- [ ] File type validation works
- [ ] File size validation works
- [ ] Max 10 files enforced
- [ ] Progress bar updates correctly
- [ ] Individual failures don't stop batch
- [ ] Usage limit checks work
- [ ] ZIP download works
- [ ] Processed images appear in gallery
- [ ] Mobile responsive
- [ ] Modal closes properly

## Debugging Tips

### Check Subscription Tier
```javascript
import { getUserSubscription } from '../lib/stripe/subscriptionService'

const subscription = await getUserSubscription(userId)
console.log('Tier:', subscription?.tier?.id)
```

### Monitor Progress
```javascript
// Add to processBatch function
console.log('Progress:', {
  total: files.length,
  completed: i + 1,
  current: i + 1,
  file: file.name
})
```

### Inspect Results
```javascript
console.table(results.map(r => ({
  File: r.fileName,
  Status: r.success ? '✅' : '❌',
  Error: r.error || '-'
})))
```

### Check Edge Function Logs
```bash
supabase functions logs process-image --tail
```

## Performance Tips

1. **Sequential Processing**: Intentional to avoid API rate limits
2. **Memory**: Base64 stored in memory, consider clearing old data
3. **Storage**: Each image counts toward Supabase storage quota
4. **API Calls**: One Gemini API call per image
5. **ZIP Size**: Large batches = large ZIP = longer generation time

## Quick Fixes

### "Batch upload button not showing"
- Check `!isDemo` condition in App.jsx
- Verify user is authenticated
- Check CSS for `.batchUploadBtn`

### "Progress stuck"
- Check browser console for errors
- Verify Edge Function is deployed
- Check Supabase secrets are set
- Look for network request failures

### "Images not in gallery"
- Verify `imageData.outputs[id]` populated
- Check Zustand store `photos` array
- Ensure `batchUploadProgress` cleared to null

### "ZIP download fails"
- Check browser console for JSZip errors
- Verify `imageData.outputs` has base64 data
- Ensure browser allows downloads
- Try smaller batch size

## Related Functions

```javascript
// Core actions
snapPhoto(base64)           // Single photo upload
deletePhoto(id)             // Delete photo
makeGif()                   // Create GIF from photos
processBatch(files, mode)   // Batch upload ← NEW

// Subscription checks
getUserSubscription(userId)
checkUsageLimit(userId, type)
incrementUsage(userId, type)
```

## Environment Variables

None required specifically for batch upload. Uses existing:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `GEMINI_API_KEY` (Edge Function secret)

## Browser Compatibility

- **Chrome/Edge**: ✅ Full support
- **Firefox**: ✅ Full support
- **Safari**: ✅ Full support
- **Mobile Chrome**: ✅ Full support
- **Mobile Safari**: ✅ Full support

**Requirements:**
- File input with `multiple` attribute
- ES6 async/await
- Dynamic imports (for JSZip)
- FormData/FileReader APIs

---

**Version:** 1.0.0
**Status:** Production Ready
**Last Updated:** January 2025
