# Admin Panel Security Documentation

## Overview

The admin panel is fully secured with authentication, session management, and route protection. All admin routes require valid authentication and redirect unauthorized users to the login page.

## Security Features

### 1. Authentication System

**Location:** `app/services/auth.service.ts`

- Password hashing using bcrypt (salt rounds: 10)
- Secure credential verification
- Admin user management with role-based access

### 2. Session Management

**Location:** `app/utils/session.server.ts`

**Features:**
- Cookie-based sessions with httpOnly flag
- 7-day session duration
- Secure cookies in production (HTTPS only)
- Session secret from environment variable
- Automatic session cleanup on logout

**Session Configuration:**
```typescript
{
  name: "admin_session",
  secure: process.env.NODE_ENV === "production",
  secrets: [SESSION_SECRET],
  sameSite: "lax",
  path: "/",
  maxAge: 60 * 60 * 24 * 7, // 7 days
  httpOnly: true
}
```

### 3. Route Protection

All admin routes are protected with `requireAdminUser()` middleware:

**Protected Routes:**
- `/admin` - Main admin dashboard
- `/admin/product/:id` - Product management (create/edit)

**How It Works:**
1. Loader checks for valid session
2. If no session exists, redirects to `/admin-login`
3. Clears any corrupted session data
4. Preserves session across page refreshes

### 4. Login Flow

**Location:** `app/routes/admin-login.tsx`

**Features:**
- Prevents already-authenticated users from accessing login page
- Validates credentials against Supabase admin_users table
- Creates secure session on successful login
- Displays clear error messages
- Auto-redirects to admin dashboard after login

**Login Process:**
```
1. User enters email and password
2. System verifies credentials in admin_users table
3. Password checked using bcrypt
4. Session created with userId
5. Redirect to /admin
```

### 5. Logout Flow

**How to Logout:**
- Click "Logout" button in admin header
- Session is destroyed
- User redirected to login page

## Environment Variables

**Required:**
- `SESSION_SECRET` - Secret key for session encryption (auto-configured)

## Database Schema

**Admin Users Table:** `admin_users`

```sql
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Creating Admin Users

### Method 1: Using Supabase SQL Editor

```sql
-- Replace with your desired email and password
INSERT INTO admin_users (email, password_hash, role)
VALUES (
  'admin@luxecraft.com',
  crypt('your-secure-password', gen_salt('bf')),
  'admin'
);
```

Note: Requires pgcrypto extension:
```sql
CREATE EXTENSION IF NOT EXISTS pgcrypto;
```

### Method 2: Using createAdminUser() Function

```typescript
import { createAdminUser } from '~/services/auth.service';

// In a server context (loader/action)
await createAdminUser('admin@luxecraft.com', 'secure-password');
```

## Security Best Practices

### ✅ Implemented

- [x] Password hashing with bcrypt
- [x] HttpOnly session cookies
- [x] Secure cookies in production
- [x] Session expiration (7 days)
- [x] Route-level authentication checks
- [x] Automatic session cleanup
- [x] Redirect loops prevention
- [x] Already-authenticated user handling

### 🔒 Recommended Enhancements

For production deployment, consider:

1. **Rate Limiting** - Limit login attempts to prevent brute force
2. **CSRF Protection** - Already handled by React Router's form handling
3. **Two-Factor Authentication** - Add OTP or authenticator app support
4. **Password Requirements** - Enforce strong password policies
5. **Session Rotation** - Rotate session IDs after login
6. **Audit Logging** - Track admin actions and login attempts
7. **IP Whitelisting** - Restrict admin access to specific IPs

## Testing the Security

### 1. Test Unauthenticated Access

Try accessing `/admin` without logging in:
- Should redirect to `/admin-login`
- Should not expose any admin data

### 2. Test Session Persistence

1. Login to admin panel
2. Refresh the page
3. Should remain logged in (session persists)

### 3. Test Logout

1. Login to admin panel
2. Click "Logout"
3. Try accessing `/admin` again
4. Should redirect to login page

### 4. Test Already-Authenticated

1. Login to admin panel
2. Try accessing `/admin-login`
3. Should auto-redirect to `/admin`

## Troubleshooting

### Issue: Session not persisting

**Solution:** Ensure SESSION_SECRET is set in environment variables

### Issue: Redirect loop on admin pages

**Solution:** Check that admin user exists in database and session is valid

### Issue: Can't login with correct credentials

**Solution:** Verify password hash in database matches bcrypt format

### Issue: Session expires too quickly

**Solution:** Adjust maxAge in session configuration (currently 7 days)

## API Reference

### requireAdminUser(request)

Protects routes by verifying admin authentication.

**Usage in Loaders:**
```typescript
export async function loader({ request }: LoaderFunctionArgs) {
  await requireAdminUser(request);
  // ... rest of loader logic
}
```

**Usage in Actions:**
```typescript
export async function action({ request }: ActionFunctionArgs) {
  await requireAdminUser(request);
  // ... rest of action logic
}
```

**Returns:** `userId` (string)  
**Throws:** Redirect to `/admin-login` if not authenticated

### getAdminUser(request)

Gets current admin user without requiring authentication.

**Returns:** `userId | null`

### logout(request)

Destroys session and redirects to login.

**Usage:**
```typescript
export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  if (formData.get('intent') === 'logout') {
    return logout(request);
  }
}
```

## Support

For security concerns or questions, refer to:
- React Router Authentication Guide
- Supabase Security Documentation
- bcrypt Documentation
