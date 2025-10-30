# Favorite Modes Feature Guide

## Overview

The Favorite Modes feature allows users to mark their preferred AI transformation modes as favorites for quick access. Favorited modes appear first in the mode selector with special visual indicators.

## Features Implemented

### 1. User Interface
- **Star Icon Button**: Each mode has a star icon that can be clicked to favorite/unfavorite
- **Favorites Section**: A "⭐ Favorites" label appears when user has favorites
- **Visual Indicators**: Favorited modes have:
  - Golden star icon (filled for favorites, outline for non-favorites)
  - Subtle golden border
  - Enhanced brightness/visibility
  - Positioned first in the mode list

### 2. Data Persistence
- **Supabase Integration**: Favorites saved to `profiles.favorite_modes` column (JSONB array)
- **localStorage Fallback**: Non-authenticated users can still use favorites (stored locally)
- **Auto-sync**: Favorites sync between Supabase and localStorage for offline access

### 3. State Management
- **Zustand Store**: `favoriteModes` array added to global state
- **Actions**: `loadFavoriteModes()` and `toggleFavorite(modeKey)` in actions-supabase.js
- **Real-time Updates**: UI updates immediately when favorites change

## Files Modified

### Core Application Files
1. **src/lib/store.js**
   - Added `favoriteModes: []` to initial state

2. **src/lib/favoriteModes.js** (New File)
   - `loadFavorites()` - Load from Supabase or localStorage
   - `toggleFavorite(modeKey)` - Add/remove favorite
   - `saveFavoritesToSupabase(favorites)` - Save to database
   - `saveFavoritesToStorage(favorites)` - Save to localStorage

3. **src/lib/actions-supabase.js**
   - Added `loadFavoriteModes()` action
   - Added `toggleFavorite(modeKey)` action
   - Integrated with favoriteModes.js helpers

4. **src/components/App.jsx**
   - Added `useEffect` to load favorites on mount
   - Added `handleToggleFavorite()` handler
   - Added `isFavorite()` checker
   - Added `organizedModes()` to sort favorites first
   - Updated mode selector UI with favorite buttons
   - Added "Favorites" label section

5. **index.css**
   - Added `.modeSelector .favoriteBtn` styles
   - Added `.modeSelector li.isFavorite` styles
   - Added `.modeSelector li.favoritesLabel` styles
   - Added hover/active animations for star buttons

### Database Migration
6. **supabase/migrations/20250117000000_add_favorite_modes.sql**
   - Added `favorite_modes JSONB DEFAULT '[]'::jsonb` column to profiles table

## Database Schema

```sql
ALTER TABLE public.profiles
ADD COLUMN favorite_modes JSONB DEFAULT '[]'::jsonb;
```

The `favorite_modes` column stores an array of mode keys (e.g., `["renaissance", "cartoon", "anime"]`)

## How It Works

### User Flow
1. User opens the app and webcam starts
2. Favorites are loaded from Supabase (if authenticated) or localStorage
3. Mode selector shows all modes with star buttons
4. Clicking a star:
   - Toggles favorite status
   - Updates Zustand store
   - Saves to Supabase (if authenticated)
   - Saves to localStorage (as backup)
   - UI updates immediately
5. Favorited modes automatically move to front of list
6. "⭐ Favorites" label appears if user has any favorites

### Technical Flow
```
User clicks star → toggleFavorite(modeKey)
  ↓
Check if mode is already favorited
  ↓
Add or remove from favorites array
  ↓
Save to localStorage (immediate)
  ↓
Save to Supabase (async)
  ↓
Update Zustand store
  ↓
UI re-renders with new favorite status
```

## Deployment Instructions

### 1. Apply Database Migration

**Option A: Using Supabase CLI**
```bash
# Push migration to Supabase
supabase db push
```

**Option B: Using SQL Editor (Supabase Dashboard)**
1. Go to Supabase Dashboard → SQL Editor
2. Run this SQL:
```sql
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS favorite_modes JSONB DEFAULT '[]'::jsonb;

COMMENT ON COLUMN public.profiles.favorite_modes IS 'Array of mode keys that user has marked as favorites';
```

### 2. Deploy Frontend Changes

**Vercel Deployment**
```bash
# Build and test locally first
npm run build
npm run preview

# Deploy to Vercel
vercel --prod
```

**Or push to Git**
```bash
git add .
git commit -m "Add favorite modes feature"
git push origin master
```

Vercel will automatically deploy if connected to your repo.

### 3. Verify Deployment

1. **Test Database Column**
   - Go to Supabase Dashboard → Table Editor → profiles
   - Verify `favorite_modes` column exists

2. **Test Functionality**
   - Sign in to the app
   - Click star icons on different modes
   - Refresh page - favorites should persist
   - Check "⭐ Favorites" label appears
   - Verify favorited modes appear first

3. **Test Edge Cases**
   - Non-authenticated users (should use localStorage)
   - Multiple browser tabs (should sync)
   - Mobile devices (star buttons visible)

## Edge Cases Handled

### 1. User Not Logged In
- Favorites saved to localStorage only
- Works fully offline
- If user signs in later, localStorage favorites are preserved

### 2. Database Connection Issues
- Falls back to localStorage gracefully
- No errors shown to user
- Continues to work offline

### 3. Empty Favorites
- "Favorites" label hidden when no favorites
- Mode list shows in default order
- Star buttons still visible and functional

### 4. Page Refresh
- Favorites loaded on mount via `useEffect`
- State restored from Supabase or localStorage
- No data loss

### 5. Multiple Tabs
- Each tab independently loads favorites
- Changes in one tab don't auto-sync to other tabs
- Next page load will show latest favorites from database

## Customization Options

### Change Star Icons
Edit `src/components/App.jsx` line 230:
```jsx
<span className="icon">{isFavorite(key) ? 'star' : 'star_border'}</span>
```

Options: `star`, `favorite`, `bookmark`, `heart`, etc.

### Change Star Color
Edit `index.css` line 245:
```css
.modeSelector .favoriteBtn .icon {
  color: #ffd700; /* Gold color */
}
```

### Change Favorites Label
Edit `src/components/App.jsx` line 209:
```jsx
<span className="labelText">⭐ Favorites</span>
```

### Disable localStorage Fallback
Edit `src/lib/favoriteModes.js` line 81-92 to only use Supabase:
```javascript
export async function loadFavorites() {
  const supabaseFavorites = await getFavoritesFromSupabase()
  if (supabaseFavorites !== null) {
    return supabaseFavorites
  }
  return [] // Don't fall back to localStorage
}
```

## Troubleshooting

### Favorites Not Persisting
1. Check Supabase connection in browser console
2. Verify `profiles` table has `favorite_modes` column
3. Check RLS policies allow users to update their own profiles
4. Verify localStorage is enabled in browser

### Star Buttons Not Visible
1. Clear browser cache
2. Check CSS loaded correctly (inspect element)
3. Verify Material Symbols font loaded
4. Try on mobile - buttons always visible on mobile

### Favorites Not Loading on Refresh
1. Check browser console for errors
2. Verify `loadFavoriteModes()` called in useEffect
3. Check Supabase auth session is valid
4. Verify `favoriteModes` in Zustand store

### Database Migration Failed
1. Check if column already exists
2. Verify Supabase CLI connected to correct project
3. Use SQL Editor as fallback
4. Check migration file syntax

## Performance Considerations

- **Minimal Database Calls**: Favorites loaded once on mount, not on every toggle
- **Optimistic UI**: UI updates immediately before database save
- **localStorage Caching**: Reduces database reads
- **No Extra Renders**: Uses `useCallback` to prevent unnecessary re-renders

## Security

- **RLS Policies**: Users can only read/update their own favorites
- **Input Validation**: Mode keys validated against available modes
- **SQL Injection**: Using parameterized queries via Supabase client
- **XSS Prevention**: No user input rendered directly in UI

## Future Enhancements

Potential improvements for future versions:

1. **Reorder Favorites**: Drag and drop to change favorite order
2. **Favorite Limits**: Restrict to max 5-10 favorites
3. **Favorite Categories**: Group favorites by style (realistic, artistic, fun)
4. **Share Favorites**: Export/import favorite lists
5. **Sync Across Devices**: Real-time sync when user opens multiple tabs
6. **Analytics**: Track most-favorited modes
7. **Recommendations**: Suggest modes based on favorites
8. **Keyboard Shortcuts**: Quick-select favorites with numbers (1-9)

## Testing Checklist

- [ ] Database migration applied successfully
- [ ] Favorites persist after page refresh
- [ ] Star icons toggle correctly
- [ ] Favorites appear first in mode list
- [ ] "Favorites" label shows/hides correctly
- [ ] Works for authenticated users
- [ ] Works for non-authenticated users (localStorage)
- [ ] Mobile UI displays correctly
- [ ] No console errors
- [ ] Build succeeds (`npm run build`)
- [ ] Vercel deployment successful

## Support

For issues or questions:
1. Check browser console for errors
2. Verify Supabase Dashboard shows migration applied
3. Test in incognito mode to rule out browser cache issues
4. Check network tab for failed API calls

## License

Apache-2.0
