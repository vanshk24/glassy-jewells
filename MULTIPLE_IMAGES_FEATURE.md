# Multiple Images Support

This document explains the enhanced multiple image support feature for products.

## Overview

Products now support multiple images instead of a single image. This allows you to showcase products from different angles and provide customers with a better view of the product.

## Database Schema

The `products` table already had support for multiple images with the `images` column defined as `TEXT[]` (array of text/URLs).

```sql
images TEXT[] NOT NULL DEFAULT '{}'
```

## Admin Product Form

### Adding/Editing Products

When creating or editing a product, you can now:

1. **Add multiple image URLs** - Click the "Add Image" button to add more image fields
2. **Remove images** - Click the X button next to any image URL to remove it
3. **Preview all images** - See thumbnails of all images before saving
4. **Reorder images** - The first image will be the primary product image

**Supported Formats:**
- JPG/JPEG
- PNG
- GIF (including animated GIFs)
- WebP

### Image Input Features

- Dynamic add/remove of image fields
- Live preview of all images
- Error handling for invalid URLs (shows placeholder)
- At least one image is required
- Grid layout for image previews

## Product Detail Page (Customer View)

### Image Gallery Features

1. **Main Image Display**
   - Large main image with proper aspect ratio (2:3)
   - Image counter showing current position (e.g., "2 / 4")
   - Error handling with placeholder fallback

2. **Navigation Controls**
   - Previous/Next arrow buttons on hover
   - Keyboard navigation ready
   - Smooth transitions between images

3. **Thumbnail Strip**
   - Shows all product images as thumbnails
   - Click any thumbnail to view full size
   - Active thumbnail highlighted with border
   - Only visible when product has multiple images

4. **Mobile Optimized**
   - Touch-friendly navigation
   - Responsive thumbnail grid
   - Properly scaled images

## Sample Data

The database seed script (`app/scripts/seed-database.ts`) now includes products with multiple images:

- 2-4 images per product
- Mix of product angles and views
- All using high-quality Unsplash images

## Technical Implementation

### Frontend Components

**Admin Form (`app/routes/admin.product.$id.tsx`):**
- Dynamic state management for image array
- Form handling for multiple image inputs
- Preview grid with error handling

**Product Detail (`app/routes/product.$id.tsx`):**
- Image carousel with navigation
- Thumbnail selection
- Image counter overlay
- Error boundary for missing images

### Styling

**Admin Form CSS:**
- Grid layout for image previews
- Responsive design for different screen sizes
- Visual feedback for active/hover states

**Product Detail CSS:**
- Positioned navigation arrows
- Overlay image counter
- Thumbnail grid with active state
- Smooth hover transitions

## Usage Examples

### Admin: Adding a Product with Multiple Images

```
1. Go to Admin Panel
2. Click "Add Product"
3. Fill in product details
4. Add first image URL
5. Click "+ Add Image" for each additional image
6. Preview all images before saving
7. Click "Create Product"
```

### Customer: Viewing Product Images

```
1. Click on any product
2. View main image
3. Hover to see navigation arrows
4. Click arrows or thumbnails to switch images
5. See image counter at bottom-right
```

## Best Practices

### For Image URLs

1. Use high-quality images (minimum 800x800px)
2. Maintain consistent aspect ratios
3. Use reliable image hosting (Unsplash, Cloudinary, etc.)
4. Test URLs before saving
5. Consider image loading performance

### For Image Order

1. First image = Primary product image (used in listings)
2. Additional images = Detail shots, different angles
3. Include variety: front, back, detail, lifestyle shots

### For SEO

- Use descriptive alt text (auto-generated from product name)
- Optimize image file sizes
- Use modern formats (WebP) when possible

## Error Handling

**Invalid URLs:**
- Shows placeholder image: `https://placehold.co/600x600/e5e5e5/999999?text=Image+Error`
- Prevents broken image icons
- Maintains layout integrity

**Missing Images:**
- Defaults to first image in array
- Shows "No Image" placeholder if array is empty
- Cart and wishlist use first image safely

## Future Enhancements

Potential improvements for future versions:

1. **Image Upload**
   - Direct file upload instead of URLs
   - Integration with Supabase Storage
   - Drag-and-drop reordering

2. **Image Optimization**
   - Automatic resizing
   - Format conversion (to WebP)
   - Lazy loading

3. **Advanced Gallery**
   - Zoom on hover
   - Lightbox/modal view
   - 360-degree view support
   - Video support

4. **Image Management**
   - Bulk upload
   - Image library/media manager
   - CDN integration

## Migration Notes

If you have existing products with single images:

1. The database already supports arrays
2. Existing single images are at `product.images[0]`
3. Add more images via admin panel
4. No data migration required

## Testing Checklist

- [ ] Add product with 1 image
- [ ] Add product with multiple images (2-5)
- [ ] Edit product and add/remove images
- [ ] View product with single image (no thumbnails shown)
- [ ] View product with multiple images (gallery works)
- [ ] Test navigation arrows
- [ ] Test thumbnail selection
- [ ] Test on mobile devices
- [ ] Test with invalid image URLs
- [ ] Test image counter display
