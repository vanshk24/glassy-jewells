# Admin Panel Access Guide

## Admin Login URL

**Admin Login Page**: `http://localhost:5173/admin-login`

Once logged in, you'll have access to:
- **Admin Dashboard**: `/admin`
- **Product Management**: `/admin/product/:id` (edit/create products)

---

## Authentication Method

The application uses **bcrypt-hashed password authentication** with **secure server-side sessions**.

### How It Works:
1. **Login**: User submits email and password at `/admin-login`
2. **Verification**: Server verifies credentials against `admin_users` table in Supabase
3. **Session**: On success, creates a secure httpOnly cookie session (7-day expiration)
4. **Protection**: All `/admin` routes require valid session via `requireAdminUser()` middleware
5. **Logout**: Clears session and redirects to login page

---

## Creating the First Admin User

You need to create an admin user in the Supabase `admin_users` table before you can log in.

### Method 1: Using Seed Script (Easiest)

Run this command in your terminal:

```bash
npm run seed:admin
```

This will create an admin user with:
- **Email**: `admin@luxecraft.com`
- **Password**: `admin123`

**Important**: Change this password after first login!

If you want to seed products AND create admin user in one command:

```bash
npm run seed:all
```

### Method 2: Using Supabase SQL Editor

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor** (left sidebar)
3. Click "New Query"
4. Run this SQL:

```sql
-- Enable pgcrypto extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create your admin user
INSERT INTO admin_users (email, password_hash, role)
VALUES (
  'admin@luxecraft.com',           -- Replace with your email
  crypt('yourpassword', gen_salt('bf')),  -- Replace with your password
  'admin'
);
```

**Replace**:
- `admin@luxecraft.com` with your desired admin email
- `yourpassword` with your desired admin password

5. Click "Run"

### Method 2: Using Node.js bcrypt (Alternative)

If you prefer to hash the password locally:

1. Open your terminal
2. Run this command (replace `yourpassword` with your actual password):

```bash
node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('yourpassword', 10));"
```

3. Copy the output hash (e.g., `$2a$10$abc123...`)
4. Go to Supabase SQL Editor and run:

```sql
INSERT INTO admin_users (email, password_hash, role)
VALUES (
  'admin@luxecraft.com',
  '$2a$10$abc123...',  -- Paste the hash from step 2
  'admin'
);
```

### Method 3: Using the Seed Script (Future Enhancement)

Currently, the seed script (`app/scripts/seed-database.ts`) only creates products. You can enhance it to create an admin user:

Add this function to the seed script:

```typescript
async function createInitialAdmin() {
  const bcrypt = await import('bcryptjs');
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const { error } = await supabase
    .from('admin_users')
    .insert({
      email: 'admin@luxecraft.com',
      password_hash: hashedPassword,
      role: 'admin'
    });
  
  if (error && error.code !== '23505') { // Ignore duplicate error
    throw error;
  }
  
  console.log('✅ Admin user created: admin@luxecraft.com');
}
```

Then call it in the `seedDatabase()` function.

---

## Verifying Admin User Creation

To confirm your admin user was created successfully:

1. Go to Supabase Dashboard
2. Navigate to **Table Editor** (left sidebar)
3. Click on **admin_users** table
4. You should see your admin user with:
   - Email: your email
   - Password Hash: encrypted string starting with `$2a$` or `$2b$`
   - Role: `admin`

---

## Logging In

1. Navigate to: `http://localhost:5173/admin-login`
2. Enter your admin email and password
3. Click "Sign In"
4. On success, you'll be redirected to `/admin`

### Security Features:
- Sessions persist across browser refreshes
- Invalid credentials show error message
- Already logged-in users are auto-redirected
- Sessions expire after 7 days of inactivity
- Logout clears session and returns to login page

---

## Default Credentials (Legacy - Not Recommended)

**Note**: The file `app/data/admin.ts` contains hardcoded credentials, but these are **NOT USED** by the current authentication system. The app now uses the Supabase-based authentication.

If you see references to:
```javascript
email: 'admin@luxecraft.com',
password: 'admin123',
```

These are legacy and should be ignored. Always use the Supabase `admin_users` table.

---

## Managing Multiple Admin Users

To create additional admin users, repeat the SQL insert process:

```sql
INSERT INTO admin_users (email, password_hash, role)
VALUES (
  'newadmin@example.com',
  crypt('newpassword', gen_salt('bf')),
  'admin'
);
```

### Future Enhancement: Admin User Management UI

Consider adding an admin users management page at `/admin/users` where admins can:
- View all admin users
- Create new admin users
- Update passwords
- Deactivate users

---

## Security Best Practices

1. **Strong Passwords**: Use passwords with at least 12 characters, including uppercase, lowercase, numbers, and symbols
2. **Unique Emails**: Each admin should have a unique email address
3. **Password Changes**: Regularly update admin passwords (every 90 days recommended)
4. **Session Secret**: Ensure `SESSION_SECRET` in `.env` is a strong random string (already configured)
5. **HTTPS**: In production, always use HTTPS to protect credentials in transit
6. **Monitor Access**: Review Supabase logs for suspicious login attempts

---

## Troubleshooting

### "Invalid credentials" error
- Verify the admin user exists in `admin_users` table
- Confirm you're using the correct email and password
- Check that the password was hashed with bcrypt (not plain text)

### "Session expired" error
- Sessions expire after 7 days
- Log in again to create a new session

### Cannot access `/admin` pages
- Ensure you're logged in (visit `/admin-login`)
- Check browser cookies are enabled
- Clear browser cookies and try logging in again

### Admin user not found in database
- Run the SQL insert command again
- Check the Supabase Table Editor to verify the insert succeeded
- Ensure the `admin_users` table exists (run `schema.sql` if needed)

---

## Quick Start Checklist

- [ ] Supabase project created
- [ ] Database schema applied (`app/supabase/schema.sql`)
- [ ] Environment variables configured in `.env`
- [ ] Admin user created in `admin_users` table
- [ ] Tested login at `/admin-login`
- [ ] Accessed admin dashboard at `/admin`
- [ ] Created/edited a test product

---

## Production Deployment Notes

When deploying to production:

1. **Create new admin users** with production-specific credentials
2. **Delete or disable** any test/demo admin accounts
3. **Rotate SESSION_SECRET** with a new random value
4. **Enable 2FA** (if implementing multi-factor authentication)
5. **Monitor admin activity** via Supabase logs
6. **Set up alerts** for failed login attempts

---

## Related Documentation

- [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) - Complete Supabase setup guide
- [ADMIN_SECURITY.md](./ADMIN_SECURITY.md) - Security implementation details
- [ADMIN_PROTECTION_SUMMARY.md](./ADMIN_PROTECTION_SUMMARY.md) - Route protection overview

---

## Support

If you encounter issues:
1. Check the Supabase dashboard for error logs
2. Review browser console for client-side errors
3. Verify all environment variables are set correctly
4. Consult the troubleshooting section above
