# Admin Panel - Quick Start

## TL;DR - Get Admin Access in 3 Steps

### 1. Seed the Database
```bash
npm run seed:all
```
This creates sample products AND an admin user in one command.

### 2. Login to Admin Panel
- Open: `http://localhost:5173/admin-login`
- Email: `admin@luxecraft.com`
- Password: `admin123`

### 3. Start Managing Products
You're in! You can now:
- View all products at `/admin`
- Edit products by clicking them
- Create new products with the "+ Add Product" button

---

## What Just Happened?

The `npm run seed:all` command:
1. ✅ Created 10 sample jewelry products with multiple images
2. ✅ Created an admin user in Supabase `admin_users` table
3. ✅ Hashed the password securely using bcrypt

---

## Available Seed Commands

| Command | What It Does |
|---------|--------------|
| `npm run seed` | Add sample products only |
| `npm run seed:admin` | Create admin user only |
| `npm run seed:all` | Products + Admin user (recommended) |
| `npm run seed:force` | Delete existing products and reseed |

---

## Admin Credentials

**Default Credentials** (created by seed script):
- Email: `admin@luxecraft.com`
- Password: `admin123`

⚠️ **IMPORTANT**: Change this password in production!

---

## Creating Additional Admin Users

### Option 1: Use Supabase SQL Editor

```sql
-- Enable pgcrypto if not already enabled
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create new admin
INSERT INTO admin_users (email, password_hash, role)
VALUES (
  'newadmin@example.com',
  crypt('yourpassword', gen_salt('bf')),
  'admin'
);
```

### Option 2: Hash Password Locally

```bash
node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('yourpassword', 10));"
```

Then insert the hash manually in Supabase.

---

## Admin Panel Features

### Dashboard (`/admin`)
- View all products (active and inactive)
- Quick filters by category
- Click any product to edit

### Product Management (`/admin/product/:id`)
- Edit product details
- Upload multiple images (URLs)
- Set pricing and discounts
- Manage inventory stock
- Toggle active/inactive status
- Delete products

### Security Features
- ✅ Password hashing with bcrypt
- ✅ Secure httpOnly session cookies
- ✅ 7-day session expiration
- ✅ Auto-redirect unauthenticated users
- ✅ Session persistence across refreshes

---

## Troubleshooting

### Can't Login?
1. Check admin user exists: Supabase Dashboard → Table Editor → `admin_users`
2. Verify credentials match
3. Clear browser cookies and try again

### Seed Command Failed?
1. Check `.env` has `SUPABASE_URL` and `SUPABASE_ANON_KEY`
2. Verify Supabase project is running
3. Ensure database schema is applied (`app/supabase/schema.sql`)

### Products Not Showing?
1. Check Supabase Table Editor → `products` table
2. Verify products have `is_active = true`
3. Check browser console for errors

---

## Security Notes

### Development
- Default credentials are fine for local development
- Sessions stored in httpOnly cookies
- SESSION_SECRET auto-generated

### Production
1. **Create new admin users** with strong passwords
2. **Delete seed admin** or change its password
3. **Rotate SESSION_SECRET** to a new random value
4. **Use HTTPS** to protect credentials in transit
5. **Enable 2FA** (if implementing)
6. **Monitor login attempts** via Supabase logs

---

## File Structure

```
app/
├── services/
│   └── auth.service.ts          # Admin authentication logic
├── utils/
│   └── session.server.ts        # Session management
├── routes/
│   ├── admin-login.tsx          # Admin login page
│   ├── admin.tsx                # Admin dashboard
│   └── admin.product.$id.tsx    # Product edit page
├── scripts/
│   └── seed-database.ts         # Database seeding
└── supabase/
    ├── schema.sql               # Database schema
    └── client.ts                # Supabase client

ADMIN_ACCESS_GUIDE.md            # Detailed access guide
ADMIN_SECURITY.md                # Security implementation
SUPABASE_SETUP.md               # Complete Supabase setup
```

---

## Next Steps

1. ✅ Login to admin panel
2. 📝 Edit a sample product
3. ➕ Create your first real product
4. 🔐 Change the default password
5. 📚 Read [ADMIN_ACCESS_GUIDE.md](./ADMIN_ACCESS_GUIDE.md) for advanced features

---

## Need Help?

- **Detailed Admin Guide**: [ADMIN_ACCESS_GUIDE.md](./ADMIN_ACCESS_GUIDE.md)
- **Supabase Setup**: [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
- **Security Details**: [ADMIN_SECURITY.md](./ADMIN_SECURITY.md)
- **Product Features**: [MULTIPLE_IMAGES_FEATURE.md](./MULTIPLE_IMAGES_FEATURE.md)
