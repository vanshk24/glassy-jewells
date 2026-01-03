# Quick Start Guide

Get your Lumière e-commerce store up and running in 5 minutes.

## Prerequisites

- Node.js 18+ installed
- A Supabase account (free at https://supabase.com)

## Step 1: Clone and Install

```bash
git clone <your-repo-url>
cd <project-folder>
npm install
```

## Step 2: Set Up Supabase (2 minutes)

1. Go to https://app.supabase.com
2. Click "New Project"
3. Fill in:
   - **Name**: lumiere-store (or any name)
   - **Password**: Create a strong password
   - **Region**: Choose closest to you
4. Wait ~2 minutes for setup

## Step 3: Create Database Tables

1. In Supabase dashboard, go to **SQL Editor** (left sidebar)
2. Click "New Query"
3. Copy the entire content of `app/supabase/schema.sql` from this project
4. Paste and click **Run**
5. You should see "Success. No rows returned"

## Step 4: Get Your API Keys

1. In Supabase, click **Settings** (gear icon)
2. Go to **API** section
3. Copy:
   - **Project URL** 
   - **anon public** key

## Step 5: Configure Environment

1. Create a `.env` file in your project root:

```bash
cp .env.example .env
```

2. Open `.env` and add your Supabase credentials:

```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SESSION_SECRET=any-random-string-here
```

To generate a secure `SESSION_SECRET`:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Step 6: Create Admin User

In Supabase SQL Editor, run:

```sql
-- Enable password hashing extension
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create your admin account (change email and password!)
INSERT INTO admin_users (email, password_hash, role)
VALUES (
  'admin@example.com',
  crypt('your_password_here', gen_salt('bf')),
  'admin'
);
```

**Important:** Replace `admin@example.com` and `your_password_here` with your actual credentials!

## Step 7: Add Sample Products (Optional)

```bash
npx tsx app/scripts/seed-database.ts
```

This adds 8 sample products. You can skip this and add products manually via the admin panel.

## Step 8: Start the App

```bash
npm run dev
```

Open http://localhost:5173

## Step 9: Test It Out

1. **Browse Products**: Go to http://localhost:5173
2. **Admin Panel**: Go to http://localhost:5173/admin-login
3. **Login**: Use the admin credentials you created in Step 6
4. **Add Products**: Click "Add Product" in the admin panel
5. **Test Orders**: Add items to cart and go through checkout (use Razorpay test mode)

## Troubleshooting

### "Missing Supabase environment variables" Error
- Make sure `.env` file exists in project root
- Restart the dev server after creating `.env`
- Check that `SUPABASE_URL` and `SUPABASE_ANON_KEY` are set

### Products Not Loading
- Check if products exist in Supabase: Dashboard → Table Editor → products
- Make sure products have `is_active = true`
- Check browser console for errors

### Can't Login to Admin
- Verify admin user exists: Dashboard → Table Editor → admin_users
- Make sure you're using the correct email and password
- Check that `SESSION_SECRET` is set in `.env`

### "Password hashing failed" Error
- Run: `CREATE EXTENSION IF NOT EXISTS pgcrypto;` in SQL Editor
- Or use this alternative method:

```bash
# Generate hashed password
node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('your_password', 10));"

# Then insert manually in SQL Editor:
INSERT INTO admin_users (email, password_hash, role)
VALUES ('admin@example.com', 'paste_hashed_password_here', 'admin');
```

## What's Next?

- Read `SUPABASE_SETUP.md` for detailed setup information
- Check `README.md` for full documentation
- Customize your theme in `app/styles/theme.css`
- Add your own products via admin panel
- Set up Razorpay for real payments (see `RAZORPAY_SETUP.md`)

## Production Deployment

When you're ready to deploy:

1. Create a production Supabase project
2. Run the schema on production database
3. Create production admin user
4. Set environment variables on your hosting platform
5. Build and deploy: `npm run build`

Recommended hosts:
- Vercel
- Netlify
- Railway
- Render

## Need Help?

- Supabase Docs: https://supabase.com/docs
- React Router Docs: https://reactrouter.com
- Open an issue on GitHub

---

**You're all set!** 🎉

Your e-commerce store is now running with a real database backend.
