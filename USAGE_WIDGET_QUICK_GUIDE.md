# Usage Widget - Quick User Guide

## What is the Usage Widget?

A floating widget that displays your current subscription tier and usage stats for photos and GIFs. It can be moved, minimized, or closed based on your preference.

## How to Use

### Moving the Widget
1. **Hover** over the top bar (you'll see three dots)
2. **Click and hold** on the top bar
3. **Drag** to any position on the screen
4. **Release** to drop it in place
5. Position is automatically saved for next time!

### Minimizing the Widget
1. Click the **▼ button** in the top-right corner
2. Widget shrinks to show only the header (saves space)
3. Click **▲ button** to expand it again
4. Minimized state is remembered across sessions

### Closing the Widget
1. Click the **✕ button** in the top-right corner
2. Widget disappears completely
3. A floating **📊 button** appears in the bottom-right corner
4. Click the 📊 button anytime to restore the widget

### Understanding the Stats

**Tier Badge** (top-left)
- Shows your current plan: FREE, PRO, or PREMIUM
- Click "Upgrade" to see pricing options

**Photos Counter** 📸
- Shows remaining photos for the month
- Green = plenty left
- Orange = getting low (75%+ used)
- Red = almost out (90%+ used)
- ∞ = unlimited (Pro/Premium)

**GIFs Counter** 🎞️
- Shows remaining GIFs for the month
- Same color coding as photos
- ∞ = unlimited (Premium)

## Visual States

### Normal
- Black background with frosted glass effect
- Subtle white border
- Smooth shadow

### Dragging
- Cursor changes to grabbing hand
- Enhanced shadow for depth
- Brighter border

### Minimized
- Shows only header and tier badge
- Takes up minimal space
- Content slides up smoothly

### Closed
- Widget hidden completely
- Purple restore button in bottom-right
- Click to bring back widget

## Keyboard & Accessibility

- **Tab**: Navigate to minimize/close buttons
- **Enter/Space**: Activate buttons
- **Screen Reader**: All buttons have labels
- **Reduced Motion**: Animations disabled if preferred
- **High Contrast**: Enhanced borders and colors

## Tips & Tricks

### Best Positions
- **Top-Left**: Out of the way, easy to check
- **Top-Right**: Near navigation menu
- **Bottom-Left**: Near other widgets
- **Bottom-Right**: Quick access, away from content

### Workflow Suggestions
1. **Default**: Keep it visible in a corner
2. **Working**: Minimize to save screen space
3. **Presentation**: Close it completely
4. **Quick Check**: Click restore, check stats, close again

### Mobile Usage
- Widget automatically adjusts size for smaller screens
- Touch targets are larger for easy tapping
- Drag with finger works smoothly
- Restore button scaled appropriately

## Troubleshooting

### Widget Not Appearing?
- Look for the 📊 button in bottom-right corner
- Click it to restore the widget
- Refresh the page if needed

### Widget Stuck Off-Screen?
Open browser console (F12) and run:
```javascript
localStorage.removeItem('usageCounter-position')
window.location.reload()
```

### State Not Saving?
- Check that cookies/localStorage is enabled
- Try incognito/private mode to test
- Clear browser cache and try again

### Can't Drag Widget?
- Make sure you're clicking the top bar (with three dots)
- Try refreshing the page
- Check that JavaScript is enabled

## Features at a Glance

| Feature | How to Use | Benefit |
|---------|------------|---------|
| **Drag** | Click & drag top bar | Position anywhere you want |
| **Minimize** | Click ▼ button | Save screen space |
| **Close** | Click ✕ button | Remove from view completely |
| **Restore** | Click 📊 button | Bring back when needed |
| **Upgrade** | Click "Upgrade" link | See pricing options |

## Design Philosophy

The widget is designed to be:
- **Unobtrusive**: Stays out of your way
- **Accessible**: Works with keyboard, screen readers, touch
- **Flexible**: Position it where it works for you
- **Persistent**: Remembers your preferences
- **Smooth**: Polished animations and transitions
- **Responsive**: Adapts to any screen size

## What's Next?

Future potential features (not yet implemented):
- Snap to screen edges
- Resize by dragging corner
- Keyboard shortcuts to move
- Multiple themes/colors
- Auto-hide on scroll

## Feedback

Enjoying the widget? Have suggestions? Let us know!
