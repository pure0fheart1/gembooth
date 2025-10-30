# Usage Widget - Quick Reference Card

## 🎯 At a Glance

| Action | How To | Visual Cue |
|--------|--------|------------|
| **Move** | Click & drag top bar | Three dots (⋮⋮⋮) + grab cursor |
| **Minimize** | Click ▼ button | Content slides up |
| **Expand** | Click ▲ button | Content slides down |
| **Close** | Click ✕ button | Widget disappears |
| **Restore** | Click 📊 button | Widget reappears |

## 🎨 Visual Elements

```
┌──────────────────────────┐
│ ⋮⋮⋮             ▼    ✕  │  Drag Handle + Controls
├──────────────────────────┤
│ [TIER]      Upgrade →    │  Header
├──────────────────────────┤
│ 📸 Photos          ∞    │
│ ━━━━━━━━━━━━━━          │  Metrics
│ 🎞️ GIFs           ∞    │
│ ━━━━━━━━━━━━━━          │
└──────────────────────────┘
```

## 🔢 Numbers to Know

| Element | Desktop | Mobile |
|---------|---------|--------|
| Widget Width | 320px | 280px |
| Expanded Height | ~280px | ~280px |
| Minimized Height | ~60px | ~60px |
| Restore Button | 56x56px | 48x48px |
| Control Buttons | 24x24px | 32x32px |

## 🎨 Color Codes

```css
/* Backgrounds */
Widget:      rgba(0, 0, 0, 0.95)
Drag Handle: rgba(255, 255, 255, 0.05)
Metrics:     rgba(255, 255, 255, 0.03)

/* Brand Colors */
Purple:      #667eea → #764ba2  (gradient)
Green:       #10b981  (good status)
Orange:      #f59e0b  (warning status)
Red:         #ef4444  (critical status)

/* Borders */
Normal:      rgba(255, 255, 255, 0.15)
Hover:       rgba(255, 255, 255, 0.2)
Dragging:    rgba(255, 255, 255, 0.3)
```

## ⚡ Quick Actions

### For End Users

```
Want more space?          → Click ▼ (minimize)
Need it back?            → Click ▲ (expand)
Don't need it now?       → Click ✕ (close)
Want to see it again?    → Click 📊 (restore)
Better position?         → Drag from top bar
Check pricing?           → Click "Upgrade"
```

### For Developers

```
Import component:    import UsageCounter, { UsageCounterToggle } from './UsageCounter'
Add to layout:       <UsageCounter /> + <UsageCounterToggle />
Main styles:         UsageCounter.css
State storage:       localStorage (3 keys)
Z-index:             9999 (widget), 9998 (restore)
```

## 🔧 localStorage Keys

```javascript
// Widget position
'usageCounter-position'  // {"x": 20, "y": 100}

// Minimize state
'usageCounter-minimized' // "true" | "false"

// Visibility state
'usageCounter-visible'   // "true" | "false"
```

## 🐛 Quick Fixes

### Widget stuck off-screen?

```javascript
// Run in browser console
localStorage.removeItem('usageCounter-position')
location.reload()
```

### State not saving?

```javascript
// Check if localStorage is working
localStorage.setItem('test', 'value')
localStorage.getItem('test') // Should return 'value'
```

### Widget not appearing?

```javascript
// Check visibility state
localStorage.getItem('usageCounter-visible')
// Should be null or "true"

// Force visible
localStorage.setItem('usageCounter-visible', 'true')
location.reload()
```

## 📱 Browser Support

| Feature | Support |
|---------|---------|
| Chrome/Edge | ✅ Full |
| Firefox | ✅ Full |
| Safari | ✅ Full |
| Mobile Safari | ✅ Full |
| Chrome Mobile | ✅ Full |

**Required APIs:**
- ✅ `position: fixed`
- ✅ `backdrop-filter`
- ✅ `localStorage`
- ✅ Mouse/Touch events
- ✅ CSS transitions

## 🎯 User Experience Goals

| Goal | Implementation |
|------|----------------|
| **Flexible** | Drag to any position |
| **Space-saving** | Minimize when not needed |
| **Non-intrusive** | Close completely |
| **Recoverable** | Easy restore button |
| **Persistent** | Remembers preferences |
| **Smooth** | Polished animations |
| **Accessible** | Screen readers, keyboard |
| **Responsive** | Works on all devices |

## 🔄 State Transitions

```
Normal ←→ Minimized  (▼/▲ button)
  │
  ↓ (✕ button)
Hidden
  ↑ (📊 button)
Normal (restored at last position)
```

## 📐 Position Constraints

```
Min X: 0
Max X: viewport width - 320px
Min Y: 0
Max Y: viewport height - (widget height)
```

Widget automatically stays within these bounds while dragging.

## ⌨️ Keyboard Navigation

```
Tab       → Focus next control
Shift+Tab → Focus previous control
Enter     → Activate focused button
Space     → Activate focused button
Escape    → (potential future: close widget)
```

## 🎨 CSS Classes

```css
/* Main container */
.usageCounterFloating
.usageCounterFloating.minimized
.usageCounterFloating.dragging

/* Components */
.usageCounterDragHandle
.dragIndicator
.usageCounterControls
.controlButton
.controlButton.minimize
.controlButton.close

/* Content */
.usageCounterHeader
.usageTierBadge
.upgradeLink
.usageMetrics
.usageMetric
.usageMetricValue
.usageProgressBar
.usageProgressFill

/* Restore button */
.usageCounterRestoreButton
```

## 🚀 Performance Tips

- **Dragging**: Hardware accelerated with `will-change`
- **Animations**: 60fps smooth with CSS transitions
- **Events**: Listeners added only when needed
- **Storage**: Updates debounced automatically
- **Rendering**: Conditional based on visibility

## ✨ Feature Checklist

- [x] Draggable anywhere on screen
- [x] Stays within viewport bounds
- [x] Minimize/expand with smooth animation
- [x] Close completely
- [x] Restore with floating button
- [x] Position persists across sessions
- [x] State persists across sessions
- [x] Frosted glass aesthetic
- [x] Hover effects on all controls
- [x] Smooth transitions
- [x] Responsive design
- [x] Touch-optimized
- [x] Screen reader support
- [x] Keyboard navigation
- [x] Reduced motion support
- [x] High contrast support

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `USAGE_WIDGET_ENHANCEMENT.md` | Technical details |
| `USAGE_WIDGET_QUICK_GUIDE.md` | User guide |
| `WIDGET_VISUAL_GUIDE.md` | Visual reference |
| `WIDGET_QUICK_REFERENCE.md` | This file |
| `IMPLEMENTATION_SUMMARY.md` | Changes made |

## 🎓 Learning Resources

### React Patterns Used
- Custom hooks (useEffect, useState, useRef)
- Conditional rendering
- Event handlers
- LocalStorage integration
- Component composition

### CSS Techniques Used
- Fixed positioning
- Backdrop filter (frosted glass)
- CSS transitions
- CSS animations
- Media queries
- Flexbox layout
- Box shadows
- Responsive design

### Accessibility Features
- ARIA labels
- Semantic HTML
- Focus management
- Reduced motion support
- High contrast support
- Touch target sizing

## 💡 Pro Tips

1. **Position Strategy**: Try bottom-left or top-right for best workflow
2. **Minimize Habit**: Keep minimized during focused work
3. **Close When Needed**: Close during presentations or screenshots
4. **Quick Check**: Restore → check stats → close (quick workflow)
5. **Mobile Usage**: Best position is top corners on small screens

## 📊 Usage Patterns

### Recommended Workflows

**Active Monitoring:**
```
Widget → Expanded → Visible corner
Check regularly throughout session
```

**Focused Work:**
```
Widget → Minimized → Out of way
Expand only when checking limits
```

**Presentation Mode:**
```
Widget → Closed → 📊 available
Restore after presentation
```

**Mobile Usage:**
```
Widget → Minimized by default
Expand only when needed
Position in top corners
```

## 🎯 Success Metrics

The widget is successful if:
- ✅ Users can easily reposition it
- ✅ Minimize saves screen space
- ✅ Close removes it completely
- ✅ Restore is intuitive
- ✅ Position is remembered
- ✅ Interactions feel smooth
- ✅ Works on all devices
- ✅ Accessible to everyone

---

**Status:** ✅ All features implemented and working

**Version:** 1.0.0

**Last Updated:** 2025-10-30
