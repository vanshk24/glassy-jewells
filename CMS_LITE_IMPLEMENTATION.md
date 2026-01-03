# CMS-Lite Brand Settings Implementation

## Overview

A simple content management system for controlling brand identity and site-wide content without complex page builders or layout controls.

## Database Schema

### Table: `site_settings`

Single-row table enforced by `CHECK (id = 1)` constraint.

**Fields:**
- `id` - INTEGER PRIMARY KEY (always 1)
- `brand_name` - TEXT NOT NULL
- `logo_url` - TEXT (nullable)
- `hero_banner_url` - TEXT (nullable)
- `hero_heading` - TEXT (nullable)
- `hero_subheading` - TEXT (nullable)
- `announcement_text` - TEXT (nullable)
- `contact_email` - TEXT (nullable)
- `contact_phone` - TEXT (nullable)
- `social_links` - JSONB (facebook, instagram, twitter, linkedin, youtube)
- `created_at` - TIMESTAMPTZ
- `updated_at` - TIMESTAMPTZ

**RLS Policies:**
- Public read access (anonymous users can view settings)
- All operations allowed (auth handled at application layer)

**Default Values:**
```json
{
  "brand_name": "ShopHub",
  "hero_heading": "Discover Amazing Products",
  "hero_subheading": "Quality items at unbeatable prices",
  "announcement_text": "🎉 Free shipping on orders over $50!",
  "contact_email": "contact@shophub.com",
  "social_links": {
    "facebook": "",
    "instagram": "",
    "twitter": ""
  }
}
```

## Admin Interface

### Route: `/admin/settings`

**Access Control:** Super Admin only (`requireSuperAdmin`)

**Features:**
- Form-based editing of all brand settings
- Real-time image preview for logo and hero banner
- URL validation for images and social links
- Success/error messaging
- Organized by sections:
  - Brand Identity (name, logo)
  - Hero Section (banner, heading, subheading)
  - Announcement Bar (promotional text)
  - Contact Information (email, phone)
  - Social Media Links (5 platforms)

**Navigation:**
- Accessible from Admin Dashboard via "Site Settings" button
- Only visible to super_admin role

## Frontend Integration

### Components Updated

**Header Component** (`app/components/header.tsx`)
- Props: `brandName`, `logoUrl`, `announcementText`
- Displays brand logo or text name
- Shows dismissible announcement bar at top
- Falls back to default "vansh" if no settings

**Footer Component** (`app/components/footer.tsx`)
- Props: `brandName`, `contactEmail`, `contactPhone`, `socialLinks`
- Displays contact information
- Shows active social media icons
- Dynamic copyright with brand name and current year

### Pages Using Site Settings

All public pages fetch settings via loader and pass to Header/Footer:

1. **Home** (`/`)
   - Hero section uses `hero_banner_url`, `hero_heading`, `hero_subheading`
   - Header and Footer receive brand settings

2. **Shop** (`/shop`)
   - Header and Footer receive brand settings

3. **Product Details** (`/product/:id`)
   - Header and Footer receive brand settings
   - Works even when product not found

4. **Other pages** (cart, checkout, wishlist, search)
   - Can be extended similarly if needed

## Service Layer

**File:** `app/services/site-settings.service.ts`

**Functions:**
- `getSiteSettings()` - Fetches settings (returns null on error)
- `updateSiteSettings(updates)` - Updates settings (super admin only)

**Error Handling:**
- Graceful fallbacks for missing data
- Null checks prevent crashes
- Console logging for debugging

## Type Definitions

**File:** `app/types/site-settings.ts`

**Interfaces:**
- `SiteSettings` - Full database record shape
- `UpdateSiteSettingsInput` - Partial updates with null support

## Design Features

### Styling
- Card-based layout for settings sections
- Image previews for logo and banner
- Consistent spacing and typography
- Success/error message banners
- Responsive form fields

### UX Features
- Announcement bar is dismissible (client-side state)
- Logo automatically resizes (max 40px height)
- Social icons only show if URL provided
- Email/phone as clickable links
- Image fallbacks for broken URLs

## Limitations (By Design)

**Not Included:**
- Page builder or WYSIWYG editor
- Layout customization
- Typography controls
- Color scheme management
- Navigation menu editing
- Multi-language support
- Version history
- Draft/publish workflow

**Scope:** Brand content only (identity, messaging, contact info)

## Security

- Super admin access required for editing
- Public read-only access for frontend
- URL validation on form inputs
- JSONB for structured social links
- Server-side permission checks

## Future Enhancements (Optional)

If needed later:
- Image upload (current: URL-based)
- Rich text editor for descriptions
- SEO metadata fields
- Multiple announcement bars
- Scheduled announcements
- Settings preview before save

## Migration

**File:** `app/supabase/schema.sql` (already applied)

Migration name: `create_site_settings_table`

To verify:
```sql
SELECT * FROM site_settings WHERE id = 1;
```

## Usage Example

**Admin:**
1. Log in as super admin
2. Navigate to Admin Dashboard
3. Click "Site Settings"
4. Edit fields as needed
5. Click "Save Changes"

**Frontend:**
- Changes reflect immediately on all pages
- No cache clearing needed
- Loaders fetch fresh data on each navigation

## Testing Checklist

- ✅ Database table created with single-row constraint
- ✅ Default settings populated
- ✅ Admin settings page accessible to super admin only
- ✅ Form saves and updates correctly
- ✅ Image previews work
- ✅ Header shows brand name/logo
- ✅ Header shows announcement bar
- ✅ Footer shows contact info
- ✅ Footer shows social links
- ✅ Hero section uses custom text/image
- ✅ Fallbacks work when settings are null
- ✅ Type checking passes
- ✅ Build successful

## Files Created/Modified

**Created:**
- `app/types/site-settings.ts`
- `app/services/site-settings.service.ts`
- `app/routes/admin.settings.tsx`
- `app/routes/admin.settings.module.css`
- `CMS_LITE_IMPLEMENTATION.md`

**Modified:**
- `app/routes/admin.tsx` (added Settings button)
- `app/routes/home.tsx` (loader, hero section, header/footer props)
- `app/routes/shop.tsx` (loader, header/footer props)
- `app/routes/product.$id.tsx` (loader, header/footer props)
- `app/components/header.tsx` (brand name, logo, announcement bar)
- `app/components/header.module.css` (announcement styles, logo image)
- `app/components/footer.tsx` (contact, social links)
- `app/routes.ts` (added settings route)
- `app/supabase/schema.sql` (migration applied)

**Status:** ✅ Implementation complete and verified
