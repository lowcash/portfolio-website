# Achievement Popup – Fixes & Implementation Plan

## 🔴 Issues to Fix

### 1. Achievement Popup Not Displaying
- **Root Cause**: `showAchievement` state initializes from persisted achievements in localStorage, but the popup is only shown when `unlockAchievement()` callback is triggered during gameplay
- **Scenario**: Dev console Easter egg triggers achievement (devTool manual unlock), but popup doesn't render because component doesn't re-render achievement trigger
- **Fix Needed**: 
  - [ ] Ensure `unlockAchievement` callback properly triggers state update for `showAchievement`
  - [ ] Add debug logging to confirm callback is firing
  - [ ] Verify achievement unlock event flow works end-to-end

### 2. Achievement Popup Positioning (Wrong Location)
- **Current**: `bottom-0` (overlaps scroll-to-top button area)
- **Desired**: "Nad side dots nav" = should be at `top: 50%` (vertically centered), right-aligned like nav dots
- **Issue**: When tried `top: 50%, transform: translateY(-50%)`, popup disappeared (likely z-index or container sizing issue)
- **Fix Needed**:
  - [ ] Test positioning with explicit z-index stacking (z-[55] currently set)
  - [ ] Verify parent container `inset-x-0` doesn't conflict with `top: 50%`
  - [ ] Add debugging (border/background) to see container bounds
  - [ ] Ensure `maxWidth: 72rem` container still works at 50% height

### 3. Animation: Popup Appearance (Missing Smooth Entry)
- **Current**: `slideInRight 0.5s ease-out forwards` animation is defined but might not be visible
- **Issue**: Animation might start outside viewport or be cut off by container overflow
- **Fix Needed**:
  - [ ] Verify CSS `@keyframes slideInRight` is loaded correctly
  - [ ] Check if animation triggers properly in React render
  - [ ] Test animation in browser DevTools (timeline)
  - [ ] Consider starting animation from `translateX(400px)` instead of `100px` for visibility

### 4. Animation: Popup Disappearance (Too Instant)
- **Current**: `setTimeout(() => setShowAchievement(null), 4000)` → state set to null immediately, no exit animation
- **Issue**: Popup vanishes instantly instead of fading/sliding out smoothly
- **Fix Needed**:
  - [ ] Add exit animation state: `isHiding` boolean separate from `showAchievement`
  - [ ] Trigger CSS animation on exit (e.g., `slideOutRight 0.5s ease-in forwards`)
  - [ ] Only set `showAchievement` to null AFTER animation completes (5 seconds total: 0.5s in + 4s display + 0.5s out)
  - [ ] Use `onAnimationEnd` callback to know when exit animation is done

---

## ✅ Implementation Steps

### Step 1: Fix Achievement Unlock Callback Flow
**File**: `src/components/ui/easter-eggs.tsx`
- Verify `unlockAchievement` is properly called from all achievement trigger handlers
- Add `console.log` at start of `unlockAchievement` callback to confirm it fires
- Check React DevTools to see if `showAchievement` state updates
- **Output**: Achievement popup should render when unlocking

### Step 2: Implement Entry/Exit Animation States
**File**: `src/components/ui/easter-eggs.tsx`
- Add new state: `const [isHidingAchievement, setIsHidingAchievement] = useState(false)`
- When showing: `setShowAchievement(ach)` + `setIsHidingAchievement(false)` 
- After 4 seconds: `setIsHidingAchievement(true)` (triggers exit animation)
- After 0.5s more: `setShowAchievement(null)` (unmounts component)
- Use conditional CSS class: `className={isHidingAchievement ? 'animate-slideOutRight' : 'animate-slideInRight'}`

### Step 3: Fix Achievement Popup Positioning
**File**: `src/components/ui/easter-eggs.tsx`
- Change from `bottom-0` to `top-[50%]` with `transform: translateY(-50%)`
- Keep container `inset-x-0` + `z-[55]`
- Test in viewport (should appear centered vertically, right side of screen)
- Debug: Add `border: 2px solid red` temporarily to see container bounds
- **Expected**: Popup appears at middle height, aligned with nav dots vertically

### Step 4: Verify Achievement-Unlocked Flow End-to-End
**Steps**:
1. Reset achievements: dev console → "RESET ACHIEVEMENTS" button
2. Scroll to 50% of page (perfectly-balanced achievement)
3. Popup should appear at 50% height, right-aligned
4. Popup should stay for 4 seconds
5. Popup should fade out smoothly over 0.5s
6. After 4.5s total, popup should unmount

### Step 5: Add Unit Tests (Optional)
- Test achievement unlock triggers `showAchievement` state update
- Test animation states (entering vs exiting)
- Test positioning (verify z-index doesn't conflict with other elements)

---

## 🎨 CSS Animations to Update

### Current (in easter-eggs.tsx component):
```typescript
const animationStyles = `
  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(100px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
`
```

### New (add slideOutRight):
```typescript
const animationStyles = `
  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(400px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  @keyframes slideOutRight {
    from {
      opacity: 1;
      transform: translateX(0);
    }
    to {
      opacity: 0;
      transform: translateX(400px);
    }
  }
`
```

---

## 📊 Verification Checklist

- [ ] Achievement unlocks when scrolling to 50%
- [ ] Popup appears with smooth slide-in animation (0.5s)
- [ ] Popup stays visible for 4 seconds
- [ ] Popup exits with smooth slide-out animation (0.5s)
- [ ] Popup is positioned at `top: 50%`, right-aligned (above/at nav dots level)
- [ ] No z-index conflicts with nav dots or other UI elements
- [ ] No console errors
- [ ] Works on mobile (responsive)
- [ ] Works on desktop (1280x800)
- [ ] E2E tests still pass (26/26)

---

## 📦 Related Files
- `src/components/ui/easter-eggs.tsx` – Main component
- `src/components/ui/floating-rail.tsx` – Reference for positioning pattern (max-width: 72rem, right-aligned)
- `src/components/shared/AnimatedBackground.tsx` – z-index context
- `src/index.css` – Global animations (could add slideOutRight here instead of inline)

---

## 🚀 Priority
**HIGH** – Animations are user-facing, positioning affects UX, and bug prevents feature from working properly.

---

**Created**: 28 Mar 2026  
**Status**: Planning → Implementation Ready
