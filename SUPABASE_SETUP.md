# Supabase Database Setup Guide

This guide will help you set up Supabase as the backend database for your e-commerce application.

## Prerequisites

- A Supabase account (sign up at https://supabase.com)
- Node.js installed locally

## Step 1: Create a Supabase Project

1. Go to https://app.supabase.com
2. Click "New Project"
3. Fill in the details:
   - **Project Name**: Choose a name (e.g., "luxecraft-store")
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose the region closest to your users
4. Click "Create new project" and wait for it to initialize (~2 minutes)

## Step 2: Set Up the Database Schema

1. In your Supabase dashboard, go to the **SQL Editor** (left sidebar)
2. Click "New Query"
3. Copy and paste the entire contents of `app/supabase/schema.sql`
4. Click "Run" to execute the SQL script

This will create:
- `products` table
- `orders` table
- `order_items` table
- `admin_users` table
- All necessary indexes and Row Level Security policies

## Step 3: Get Your Environment Variables

1. In your Supabase dashboard, click on the **Settings** icon (gear icon in left sidebar)
2. Go to **API** settings
3. You'll find:
   - **Project URL** (this is your `SUPABASE_URL`)
   - **anon public** key (this is your `SUPABASE_ANON_KEY`)

## Step 4: Configure Environment Variables

1. In your project root, you should have a `.env` file
2. Add your Supabase credentials:

```env
SUPABASE_URL=your_project_url_here
SUPABASE_ANON_KEY=your_anon_key_here
SESSION_SECRET=generate_a_random_secret_here
```

To generate a secure `SESSION_SECRET`, run:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Step 5: Create an Admin User

You need to create an admin user to access the admin panel. Run this SQL in the Supabase SQL Editor:

```sql
-- Replace with your desired admin email and password
INSERT INTO admin_users (email, password_hash, role)
VALUES (
  'admin@example.com',
  crypt('your_password_here', gen_salt('bf')),
  'admin'
);
```

**Important**: Replace `admin@example.com` and `your_password_here` with your actual credentials.

Note: This uses PostgreSQL's built-in `crypt` function. If you get an error, you may need to enable the `pgcrypto` extension first:

```sql
CREATE EXTENSION IF NOT EXISTS pgcrypto;
```

Alternatively, you can hash the password using bcrypt in Node.js and insert it directly:

```bash
node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('your_password_here', 10));"
```

Then insert manually:
```sql
INSERT INTO admin_users (email, password_hash, role)
VALUES ('admin@example.com', 'hashed_password_from_above', 'admin');
```

## Step 6: Seed Sample Products (Optional)

To add sample products for testing, you can run the seed script:

1. Make sure your `.env` file has the correct Supabase credentials
2. Run: `npm run seed` (if you create this script)

Or manually insert products via SQL:

```sql
INSERT INTO products (name, description, price, discount_price, category, images, stock, is_active)
VALUES 
(
  'Crystal Drop Earrings',
  'Elegant crystal drop earrings with silver-tone finish. Perfect for special occasions.',
  2499,
  1999,
  'earrings',
  ARRAY['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80'],
  50,
  true
),
(
  'Pearl Necklace Set',
  'Classic pearl necklace with matching earrings. Timeless elegance.',
  4999,
  3999,
  'necklaces',
  ARRAY['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80'],
  30,
  true
),
(
  'Gold-Tone Ring',
  'Delicate gold-tone ring with intricate design. Adjustable size.',
  1499,
  NULL,
  'rings',
  ARRAY['https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80'],
  100,
  true
);
```

## Step 7: Test the Connection

1. Start your development server: `npm run dev`
2. Navigate to your application
3. Products should load from Supabase
4. Try logging into the admin panel at `/admin-login` with the credentials you created

## Step 8: Enable Row Level Security (Already Done)

The schema includes RLS policies that:
- Allow public read access to active products
- Restrict admin operations to authenticated admin users
- Protect sensitive admin and order data

## Troubleshooting

### "Missing Supabase environment variables" Error
- Make sure your `.env` file exists and has `SUPABASE_URL` and `SUPABASE_ANON_KEY`
- Restart your development server after adding environment variables

### Products Not Loading
- Check if products exist in the database: Go to Supabase Dashboard → Table Editor → products
- Verify the products have `is_active = true`
- Check the browser console for any errors

### Admin Login Not Working
- Verify the admin user exists in the `admin_users` table
- Make sure you're using the correct email and password
- Check that `SESSION_SECRET` is set in your `.env`

### Cannot Insert Products via Admin Panel
- Check that you're logged in as an admin user
- Verify Row Level Security policies are correctly set up
- Check browser console and server logs for specific errors

## Production Deployment

When deploying to production:

1. **Use environment variables on your hosting platform** (not `.env` file)
2. **Generate a new SESSION_SECRET** for production
3. **Review and tighten RLS policies** if needed
4. **Set up backups** in Supabase dashboard
5. **Monitor database usage** to stay within free tier limits or upgrade as needed

## Free Tier Limits

Supabase free tier includes:
- 500 MB database space
- 1 GB file storage
- 2 GB bandwidth per month
- Up to 50,000 monthly active users

For production use, consider upgrading to a paid plan.

## Need Help?

- Supabase Documentation: https://supabase.com/docs
- Supabase Discord: https://discord.supabase.com
- Project GitHub Issues: [Your repo link]
