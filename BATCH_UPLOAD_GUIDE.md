# Batch Upload Feature Guide

## Overview

The Batch Upload feature allows Pro and Premium subscribers to upload and process multiple photos simultaneously, significantly improving workflow efficiency for users who need to transform many images at once.

## Key Features

### 1. Multi-File Selection
- Upload up to 10 images at once
- Drag-and-drop support (via standard file input)
- Preview all selected images before processing
- Remove individual images from the batch

### 2. Mode Selection
- Apply the same AI transformation to all images
- Choose from 12 predefined modes (Renaissance, Cartoon, Statue, etc.)
- Visual mode selector with emoji icons

### 3. Real-Time Progress Tracking
- Visual progress bar showing completion percentage
- Current file counter (e.g., "Processing image 3 of 10")
- Individual file status tracking
- Estimated time remaining

### 4. Error Handling
- Individual file failures don't stop the entire batch
- Detailed error messages for failed images
- Success/failure summary at completion
- Usage limit warnings with graceful degradation

### 5. Bulk Download
- Download all processed images as a ZIP file
- Automatic file naming (original_name_processed.jpg)
- Uses JSZip library loaded from CDN
- Preserves original file extensions

### 6. Subscription Tier Enforcement
- Feature locked for Free tier users
- Pro/Premium tier verification before processing
- Usage quota checking before and during batch processing
- Clear upgrade prompts for free users

## User Flow

### Step 1: Open Batch Upload Modal
1. User clicks "Batch Upload" button in the results area (bottom panel)
2. Modal opens with instructions and feature badge

### Step 2: Select Images
1. Click "Select Images" button
2. Choose up to 10 JPEG/PNG images from device
3. Preview thumbnails appear in a grid
4. Option to remove individual images

### Step 3: Choose Effect
1. Select transformation mode from visual grid
2. Active mode is highlighted with blue border
3. All images will be processed with the same effect

### Step 4: Process Batch
1. Click "Process All" button
2. Progress view shows:
   - Rotating spinner icon
   - Progress bar (0-100%)
   - Current file counter
   - Processing status message

### Step 5: Review Results
1. Results summary shows successful/failed counts
2. Failed images listed with error messages
3. Options available:
   - Download all as ZIP
   - Upload another batch
   - Close modal

### Step 6: Access Processed Images
- All successful images appear in the main photo gallery
- Images can be viewed, deleted, or used in GIFs
- Images persist in Supabase Storage

## Technical Implementation

### File Structure
```
src/
├── components/
│   └── BatchUpload.jsx          # Main batch upload UI component
├── lib/
│   ├── actions-supabase.js      # processBatch() function
│   └── store.js                 # batchUploadProgress state
index.css                         # Batch upload styles
```

### Key Functions

#### `processBatch(files, mode)`
Located in `src/lib/actions-supabase.js`

**Parameters:**
- `files` (Array): FileList converted to array
- `mode` (string): Mode key (e.g., 'renaissance', 'cartoon')

**Returns:**
- Array of result objects with `{success, id, fileName, error}`

**Process:**
1. Verify user authentication
2. Check subscription tier (Pro/Premium required)
3. Validate files (type, size, count)
4. Check usage quota
5. Process each file sequentially
6. Update progress state after each file
7. Return results array

**Error Handling:**
- Invalid file types → Alert and return null
- Oversized files (>10MB) → Alert and return null
- Usage limit reached → Alert and partial results
- Individual file failures → Continue processing others

### State Management

**Zustand Store** (`src/lib/store.js`):
```javascript
batchUploadProgress: null  // {total, completed, current}
```

**States:**
- `null` - Not processing
- `{total: 10, completed: 0, current: null}` - Starting
- `{total: 10, completed: 5, current: 6}` - In progress
- `null` - Complete (state cleared)

### Subscription Tier Checks

**Tier Access:**
- **Free**: No access - shows upgrade prompt
- **Pro**: Full access (limits apply per tier)
- **Premium**: Full access (higher limits)

**Quota Enforcement:**
- Check before batch starts
- Check before each individual file
- Graceful stop if limit reached mid-batch
- Clear error messages about remaining quota

### File Validation

**Supported Types:**
- JPEG (`image/jpeg`, `image/jpg`)
- PNG (`image/png`)

**File Size Limit:** 10MB per file

**Batch Size Limit:** 10 files maximum

### ZIP Download Implementation

Uses JSZip library loaded dynamically from CDN:
```javascript
const JSZip = (await import('https://cdn.jsdelivr.net/npm/jszip@3.10.1/+esm')).default
```

**Process:**
1. Create new JSZip instance
2. Iterate through successful results
3. Convert base64 images to blobs
4. Add to ZIP with modified filename
5. Generate ZIP blob
6. Trigger browser download

## Testing Guide

### Test Case 1: Free Tier User
**Expected:** Upgrade prompt when clicking "Batch Upload"

1. Log in with Free tier account
2. Click "Batch Upload" button
3. **Verify:** Alert appears saying feature is Pro/Premium only
4. **Verify:** Modal does not open

### Test Case 2: Pro/Premium User - Successful Batch
**Expected:** All images process successfully

1. Log in with Pro/Premium account
2. Click "Batch Upload"
3. Select 5 valid JPEG images
4. Choose "Renaissance" mode
5. Click "Process All"
6. **Verify:** Progress bar updates smoothly
7. **Verify:** All 5 images appear in gallery
8. **Verify:** Results summary shows "5 successful, 0 failed"

### Test Case 3: Invalid File Types
**Expected:** Alert about invalid files

1. Open batch upload modal
2. Select mix of JPG and PDF files
3. **Verify:** Alert lists invalid files by name
4. **Verify:** Modal remains open but doesn't process

### Test Case 4: Oversized Files
**Expected:** Alert about file size limits

1. Open batch upload modal
2. Select images >10MB
3. **Verify:** Alert lists oversized files
4. **Verify:** Processing doesn't start

### Test Case 5: Usage Limit Reached
**Expected:** Graceful handling when quota exhausted

1. Use account with 2 photos remaining in quota
2. Attempt to upload 5 images
3. **Verify:** First 2 images process
4. **Verify:** Alert explains limit reached
5. **Verify:** Results show 2 successful, 3 failed

### Test Case 6: Individual File Failures
**Expected:** Other files continue processing

1. Upload batch with 1 corrupted image
2. **Verify:** Processing continues for other files
3. **Verify:** Results show specific error for failed file
4. **Verify:** Other files appear in gallery

### Test Case 7: ZIP Download
**Expected:** ZIP contains all processed images

1. Complete successful batch of 5 images
2. Click "Download All as ZIP"
3. **Verify:** Browser downloads ZIP file
4. **Verify:** ZIP contains 5 images
5. **Verify:** Filenames formatted as "original_processed.jpg"

### Test Case 8: Upload Another Batch
**Expected:** Modal resets for new batch

1. Complete a batch upload
2. Click "Upload Another Batch"
3. **Verify:** File selection cleared
4. **Verify:** Mode selection reset to default
5. **Verify:** Ready to select new files

### Test Case 9: Close and Reopen
**Expected:** Gallery updated, state cleared

1. Complete batch upload
2. Click "Close"
3. **Verify:** Modal closes
4. **Verify:** Processed images visible in gallery
5. Reopen modal
6. **Verify:** Fresh state, no previous files

### Test Case 10: Mobile Responsiveness
**Expected:** Works on mobile devices

1. Open on mobile browser (or resize to <768px)
2. **Verify:** Modal is scrollable
3. **Verify:** Mode grid adapts to smaller screen
4. **Verify:** Preview grid shows fewer columns
5. **Verify:** All buttons remain accessible

## Performance Considerations

### Sequential Processing
Images are processed **one at a time** to:
- Avoid overwhelming the Gemini API
- Prevent browser memory issues
- Allow for usage limit checks between files
- Provide accurate progress updates

### Memory Management
- Base64 images stored in `imageData` object
- Cleared when photos are deleted
- Consider IndexedDB for persistence in future

### API Rate Limits
- Gemini API has rate limits
- Sequential processing helps stay within limits
- Consider adding delay between requests if needed

### Storage Quotas
- Each image counted against user's storage quota
- Supabase Storage has tier-based limits
- Usage tracking via `usage_limits` table

## Future Enhancements

### Potential Improvements
1. **Parallel Processing**: Process 2-3 images simultaneously
2. **Custom Prompts**: Allow different prompt per image
3. **Batch Progress Persistence**: Resume interrupted batches
4. **Email Notification**: Alert when large batch completes
5. **Scheduled Processing**: Queue batches for later
6. **Batch History**: View past batch uploads
7. **Advanced Filters**: Pre-process images (resize, crop)
8. **Mode Templates**: Save favorite mode combinations
9. **CSV Import**: Batch upload with metadata
10. **API Webhook**: Trigger batch from external source

### Code Improvements
1. Add TypeScript types for better type safety
2. Implement retry logic for failed API calls
3. Add unit tests for `processBatch` function
4. Optimize ZIP generation for large batches
5. Add batch upload analytics tracking

## Troubleshooting

### Issue: "Batch upload is a Pro/Premium feature"
**Solution:** Upgrade to Pro or Premium tier

### Issue: "Invalid file types detected"
**Solution:** Ensure all files are JPEG or PNG format

### Issue: "Some files are too large"
**Solution:** Compress images to under 10MB each

### Issue: Progress stuck at certain percentage
**Check:**
- Browser console for errors
- Network tab for failed requests
- Supabase Edge Function logs

### Issue: ZIP download not working
**Check:**
- Browser allows pop-ups/downloads
- Sufficient browser storage available
- Check browser console for JSZip errors

### Issue: Images not appearing in gallery
**Check:**
- `batchUploadProgress` state cleared to null
- Zustand store `photos` array updated
- `imageData.outputs` contains base64 data

## API Reference

### Component Props

**BatchUpload**
```jsx
<BatchUpload
  onClose={() => void}  // Callback when modal closes
/>
```

### Store Selectors

```javascript
const batchProgress = useStore.use.batchUploadProgress()
// Returns: null | {total: number, completed: number, current: number}
```

### Action Functions

```javascript
import { processBatch } from '../lib/actions-supabase'

const results = await processBatch(filesArray, 'renaissance')
// Returns: null | Array<{success: boolean, id: string, fileName: string, error?: string}>
```

## Security Considerations

1. **File Type Validation**: Only allow image types
2. **File Size Limits**: Prevent storage abuse
3. **Tier Verification**: Server-side checks required
4. **Usage Quotas**: Enforced before each upload
5. **User Authentication**: Required for all operations
6. **RLS Policies**: Ensure users only access own data

## Support

For issues or questions about batch upload:
1. Check browser console for errors
2. Review Supabase Edge Function logs
3. Verify subscription tier is Pro/Premium
4. Check usage quota hasn't been exceeded
5. Ensure images meet size/type requirements

---

**Last Updated:** January 2025
**Feature Status:** ✅ Production Ready
**Subscription Required:** Pro or Premium
