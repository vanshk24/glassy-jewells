# Announcement Bar Behavior Feature

## Overview

Enhanced the CMS-Lite announcement bar system with behavior options, giving brands control over how their announcement displays while keeping the interface simple and safe.

---

## Database Updates

### New Column: `announcement_behavior`
- **Type**: `text`
- **Default**: `'static'`
- **Allowed Values**: `'static'`, `'scroll'`, `'hover'`
- **Constraint**: CHECK constraint ensures only valid values

---

## Behavior Options

### 1. **Static** (Default)
- Announcement text displays normally
- No animation or movement
- Classic, clean presentation
- Best for: Short messages, important notices

### 2. **Scroll**
- Text continuously scrolls from right to left
- Creates a marquee/ticker effect
- Infinite loop animation
- Subtle, luxury-friendly speed (20s per cycle)
- Best for: Longer announcements, promotional messages

### 3. **Hover** (Pause on Hover)
- Same scrolling animation as "Scroll"
- Pauses when user hovers over announcement
- Resumes scrolling when hover ends
- Best for: Messages users need time to read

---

## Admin Interface

### Settings Page (`/admin/settings`)

**New Field Added:**
```
Announcement Behavior (Dropdown)
├── Static (Default)
├── Scrolling Text
└── Pause on Hover
```

**Location**: Announcement Bar card, below the announcement text field

**Field Hints**:
- "Leave empty to hide the announcement bar" (for text field)
- "Choose how the announcement appears" (for behavior dropdown)

---

## Frontend Implementation

### Header Component Updates

**Props Added:**
- `announcementBehavior?: AnnouncementBehavior`

**Behavior Logic:**
- If `announcement_text` is empty → bar hidden (regardless of behavior)
- If text exists → behavior style applied based on setting

**CSS Classes:**
- `.announcement` - Base styles
- `.announcement.scroll` - Scrolling animation applied
- `.announcement.hover` - Scrolling with pause-on-hover

**Animation Details:**
- **Duration**: 20 seconds per cycle
- **Timing**: Linear easing (smooth, consistent speed)
- **Effect**: Text duplicated for seamless loop
- **Performance**: Hardware-accelerated transform

---

## Pages Updated

All public pages now pass `announcementBehavior` to Header:

✅ Home (`/`)  
✅ Shop (`/shop`)  
✅ Product Detail (`/product/:id`)  
✅ Cart (`/cart`)  
✅ Checkout (`/checkout`)  
✅ Search (`/search`)  
✅ Wishlist (`/wishlist`)  
✅ Order Confirmation (`/order-confirmation/:orderId`)

---

## Key Features

### ✅ Simplicity
- Only 3 clear behavior options
- No speed, color, or layout controls
- Prevents over-customization

### ✅ Accessibility
- Scrolling animations respect reduced motion preferences
- Text remains readable at all times
- Pause-on-hover improves usability

### ✅ Luxury-Friendly Design
- Subtle, elegant animations
- Consistent with high-end aesthetic
- No aggressive or distracting effects

### ✅ Performance
- CSS-only animations (no JavaScript)
- GPU-accelerated transforms
- Minimal impact on page load

---

## Usage Examples

### Static Announcement
```
Text: "Free Shipping on Orders Over $50"
Behavior: Static
→ Simple, clean display
```

### Scrolling Announcement
```
Text: "New Collection Launching Soon • Sign Up for Early Access • Limited Time Offer"
Behavior: Scrolling Text
→ Continuous scroll for longer content
```

### Hover-Pausable Announcement
```
Text: "Flash Sale: 30% Off Selected Items Until Midnight"
Behavior: Pause on Hover
→ Scrolls but allows users to read when needed
```

---

## Technical Details

### Animation Implementation

```css
@keyframes scroll-announcement {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

.announcement.scroll .announcementContent {
  animation: scroll-announcement 20s linear infinite;
}

.announcement.hover:hover .announcementContent {
  animation-play-state: paused;
}
```

### Seamless Loop Technique
- Text content duplicated in DOM
- Animation moves both copies together
- When first copy exits, second copy fills gap
- Creates infinite seamless scroll

---

## Migration Applied

```sql
ALTER TABLE site_settings 
ADD COLUMN IF NOT EXISTS announcement_behavior text 
DEFAULT 'static' 
CHECK (announcement_behavior IN ('static', 'scroll', 'hover'));

UPDATE site_settings 
SET announcement_behavior = 'static' 
WHERE announcement_behavior IS NULL;
```

---

## Files Modified

### Database & Types
- `app/types/site-settings.ts` - Added `AnnouncementBehavior` type

### Services (Already Supports New Field)
- `app/services/site-settings.service.ts` - No changes needed

### Admin
- `app/routes/admin.settings.tsx` - Added behavior dropdown
- `app/routes/admin.settings.module.css` - Added field hint styles

### Components
- `app/components/header.tsx` - Added behavior logic
- `app/components/header.module.css` - Added scroll/hover animations

### Routes (All Updated to Pass Behavior)
- `app/routes/home.tsx`
- `app/routes/shop.tsx`
- `app/routes/product.$id.tsx`
- `app/routes/cart.tsx`
- `app/routes/checkout.tsx`
- `app/routes/search.tsx`
- `app/routes/wishlist.tsx`
- `app/routes/order-confirmation.$orderId.tsx`

---

## Quality Assurance

✅ **Type Checking**: Passed  
✅ **Build Validation**: Successful  
✅ **Database Migration**: Applied  
✅ **Default Values**: Set to 'static'  
✅ **Backward Compatibility**: Maintained  

---

## Next Steps (Optional Future Enhancements)

While keeping CMS-Lite focused, these could be considered later:
- Announcement bar color override (brand accent by default)
- Show/hide announcement on specific pages
- Schedule announcement display (start/end dates)

**Note**: Current implementation intentionally avoids these to maintain simplicity.

---

## Summary

The announcement behavior feature adds meaningful control for brands without compromising the CMS-Lite philosophy. It remains simple, safe, and focused on brand content rather than complex customization.

Brands can now:
1. Display static messages (classic approach)
2. Create scrolling tickers (for longer content)
3. Add user-friendly pause-on-hover (best of both worlds)

All while maintaining the luxury aesthetic and professional appearance of the platform.
