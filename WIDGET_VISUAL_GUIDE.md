# Usage Widget - Visual Guide

## Widget States

### 1. Normal State (Expanded)

```
┌──────────────────────────────────────┐
│ ⋮⋮⋮                          ▼    ✕  │ ← Drag Handle & Controls
├──────────────────────────────────────┤
│ [PREMIUM]              Upgrade →     │ ← Header
├──────────────────────────────────────┤
│                                      │
│  📸 Photos               ∞          │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━        │ ← Metrics
│  Unlimited                           │
│                                      │
│  🎞️ GIFs                 ∞          │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━        │
│  Unlimited                           │
│                                      │
└──────────────────────────────────────┘
     Width: 320px
     Height: ~280px
```

### 2. Minimized State

```
┌──────────────────────────────────────┐
│ ⋮⋮⋮                          ▲    ✕  │ ← Drag Handle & Controls
├──────────────────────────────────────┤
│ [PREMIUM]              Upgrade →     │ ← Header Only
└──────────────────────────────────────┘
     Width: 320px
     Height: ~60px
```

### 3. Closed State (Widget Hidden)

```
                        Screen
┌──────────────────────────────────────┐
│                                      │
│                                      │
│                                      │
│                         (content)    │
│                                      │
│                                      │
│                              ┌────┐  │
│                              │ 📊 │  │ ← Restore Button
│                              └────┘  │
└──────────────────────────────────────┘
     Floating button: 56x56px
     Position: bottom-right (24px from edges)
```

## Control Buttons

### Drag Handle (Top Bar)

```
┌──────────────────────────────────────┐
│ ⋮⋮⋮                          ▼    ✕  │
└──────────────────────────────────────┘
  ↑                             ↑    ↑
  │                             │    │
  Drag Indicator          Minimize Close
  (3 dots)                Button  Button

  Click & drag here to move widget
```

### Minimize Button

```
Normal:  ▼  (down arrow)
Action:  Collapses content, shows only header

Minimized: ▲  (up arrow)
Action:    Expands to show full content
```

### Close Button

```
Symbol:  ✕  (X)
Action:  Hides widget completely
Result:  Restore button (📊) appears
```

### Restore Button

```
Symbol:  📊  (chart emoji)
Action:  Shows widget at last position
Result:  Widget reappears, restore button hides
```

## Drag Interaction

### Step 1: Hover

```
┌──────────────────────────────────────┐
│ ⋮⋮⋮                          ▼    ✕  │ ← Cursor: grab
├──────────────────────────────────────┤
  Background: rgba(255,255,255,0.08)
```

### Step 2: Click & Hold

```
┌──────────────────────────────────────┐
│ ⋮⋮⋮                          ▼    ✕  │ ← Cursor: grabbing
├──────────────────────────────────────┤
  Shadow: Enhanced (0 20px 60px)
  Border: Brighter
```

### Step 3: Drag

```
    User's Mouse
         ↓
    ┌────────────────┐
    │ Widget follows │
    │ mouse position │
    └────────────────┘
         ↑
    Constrained to viewport
```

### Step 4: Release

```
┌──────────────────────────────────────┐
│ Widget stays at new position         │
│ Position saved to localStorage       │
└──────────────────────────────────────┘
```

## Hover States

### Normal Buttons

```
Default:
┌────┐
│ ▼  │  Background: rgba(255,255,255,0.1)
└────┘  Color: rgba(255,255,255,0.7)

Hover:
┌────┐
│ ▼  │  Background: rgba(255,255,255,0.2)
└────┘  Color: white
        Transform: scale(1.1)
```

### Close Button Special Hover

```
Default:
┌────┐
│ ✕  │  Background: rgba(255,255,255,0.1)
└────┘  Color: rgba(255,255,255,0.7)

Hover:
┌────┐
│ ✕  │  Background: rgba(255,107,107,0.2)
└────┘  Color: #ff6b6b (red)
        Transform: scale(1.1)
```

### Upgrade Link

```
Default:
Upgrade →  Color: #667eea

Hover:
Upgrade →  Background: rgba(102,126,234,0.1)
          Color: #8b9cf7
```

## Progress Bar States

### Good (0-74% used)

```
┌──────────────────────────────────────┐
│ ████████████░░░░░░░░░░░░░░░░░░░░░░░░ │
└──────────────────────────────────────┘
  Color: Green (#10b981)
```

### Warning (75-89% used)

```
┌──────────────────────────────────────┐
│ ████████████████████████████░░░░░░░░ │
└──────────────────────────────────────┘
  Color: Orange (#f59e0b)
```

### Critical (90-100% used)

```
┌──────────────────────────────────────┐
│ █████████████████████████████████░░░ │
└──────────────────────────────────────┘
  Color: Red (#ef4444)
  Effect: Pulsing glow
```

## Animation Sequences

### Widget Appearing

```
Frame 1:  opacity: 0
          transform: translateY(0)

Frame 2:  opacity: 0.5
          transform: translateY(0)

Frame 3:  opacity: 1
          transform: translateY(0)

Duration: 0.3s
```

### Minimize Animation

```
Collapse:
  Content slides up
  Height reduces
  Duration: 0.3s

Expand:
  Content slides down
  Height increases
  Duration: 0.3s
```

### Restore Button Appearing

```
Frame 1:  opacity: 0
          transform: translateY(20px) scale(0.9)

Frame 2:  opacity: 0.5
          transform: translateY(10px) scale(0.95)

Frame 3:  opacity: 1
          transform: translateY(0) scale(1)

Duration: 0.4s
```

## Responsive Layouts

### Desktop (> 768px)

```
┌────────────────────────────────────────────┐
│                                            │
│  ┌────────────────┐                       │
│  │ Usage Widget   │                       │
│  │ 320px width    │                       │
│  └────────────────┘                       │
│                                            │
│        (main content area)                │
│                                            │
│                           ┌────┐          │
│                           │ 📊 │ 56x56   │
│                           └────┘          │
└────────────────────────────────────────────┘
```

### Mobile (< 768px)

```
┌──────────────────────────────┐
│                              │
│ ┌──────────────┐            │
│ │ Usage Widget │            │
│ │ 280px width  │            │
│ └──────────────┘            │
│                              │
│   (main content)            │
│                              │
│                  ┌────┐     │
│                  │ 📊 │ 48x │
│                  └────┘     │
└──────────────────────────────┘
```

## Color Reference

### Backgrounds

```
Widget:     rgba(0, 0, 0, 0.95)     ■ Almost black
Drag Handle: rgba(255,255,255,0.05) □ Subtle white
Metric Box:  rgba(255,255,255,0.03) □ Very subtle
```

### Borders

```
Main:   rgba(255,255,255,0.15) ─── Normal
Hover:  rgba(255,255,255,0.2)  ─── Brighter
Drag:   rgba(255,255,255,0.3)  ─── Brightest
```

### Gradients

```
Badge:         #667eea → #764ba2  Purple gradient
Restore:       #667eea → #764ba2  Purple gradient
Progress Good: #10b981 → #059669  Green gradient
Progress Warn: #f59e0b → #d97706  Orange gradient
Progress Crit: #ef4444 → #dc2626  Red gradient
```

## Interaction Flow Diagram

```
┌─────────────┐
│ Page Loads  │
└──────┬──────┘
       │
       ↓
┌─────────────────────┐
│ Widget Appears      │
│ at saved position   │
└──────┬──────────────┘
       │
       ↓
┌─────────────────────┐
│ User can:           │
│ • Drag to move      │─────→ Position saved
│ • Minimize          │─────→ State saved
│ • Close             │─────→ Visibility saved
└──────┬──────────────┘
       │
       ↓ (if closed)
┌─────────────────────┐
│ Restore Button      │
│ appears             │
└──────┬──────────────┘
       │
       ↓ (click restore)
┌─────────────────────┐
│ Widget reappears    │
│ at last position    │
└─────────────────────┘
```

## Z-Index Stack

```
Layer 9999:  Usage Widget (floating)
Layer 9998:  Restore Button
Layer 1000:  Navigation Bar
Layer 100:   Modals/Overlays
Layer 1:     Page Content
Layer 0:     Background
```

## Position Constraints

```
Screen Bounds:
┌────────────────────────────────────┐
│ 0,0                                │ Top-left corner (min)
│                                    │
│     Widget can be anywhere         │
│     within this area               │
│                                    │
│                                    │
│           (viewport width - 320),  │
│           (viewport height - 280)  │ Bottom-right corner (max)
└────────────────────────────────────┘

Widget automatically stays within bounds
No part of widget can go off-screen
```

## Touch Targets (Mobile)

```
Minimum Touch Target: 44x44px (iOS HIG)

Our Implementation:
┌──────┐
│  ▼   │  32x32px (larger than 24x24 desktop)
└──────┘  Still within safe area

Drag Handle:
┌────────────────┐
│    12px        │  Increased padding
└────────────────┘  Easier to grab
```

## Accessibility Features

### Screen Reader Announcements

```
Minimize Button:
- aria-label: "Minimize widget"
- title: "Minimize"

Expand Button:
- aria-label: "Expand widget"
- title: "Expand"

Close Button:
- aria-label: "Close widget"
- title: "Close"

Restore Button:
- aria-label: "Show usage widget"
- title: "Show usage widget"
```

### Focus Indicators

```
Default:
┌────┐
│ ▼  │  No outline
└────┘

Focused (Tab):
┌────┐
│ ▼  │  Outline: 2px solid #667eea
└────┘  Offset: 2px
```

## Summary

The widget provides a complete, polished experience with:

✓ **Clear visual states** - Normal, minimized, closed
✓ **Intuitive controls** - Drag, minimize, close, restore
✓ **Smooth animations** - All state changes animated
✓ **Responsive design** - Adapts to screen size
✓ **Accessible** - Screen readers, keyboard, reduced motion
✓ **Professional polish** - Matching design system

All interactions feel smooth and natural, with proper visual feedback at every step.
