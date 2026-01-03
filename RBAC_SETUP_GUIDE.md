# Role-Based Access Control (RBAC) Guide

## Overview

LuxeCraft now implements a comprehensive role-based access control system with three distinct admin roles, each with specific permissions and access levels.

## Admin Roles

### 1. Super Admin
**Full System Access**

- ✅ Manage products (create, edit, delete)
- ✅ Manage orders (view, update status)
- ✅ Manage admin users (create, edit roles, activate/deactivate)
- ✅ View analytics and reports
- ✅ Access all admin features

**Use Case**: System administrators, business owners

### 2. Manager
**Product & Order Management**

- ✅ Manage products (create, edit, delete)
- ✅ Manage orders (view, update status)
- ❌ Manage admin users
- ✅ View analytics and reports

**Use Case**: Store managers, inventory managers

### 3. Staff
**Order Management Only**

- ❌ Manage products
- ✅ View and update orders (status updates only)
- ❌ Manage admin users
- ❌ View analytics

**Use Case**: Customer service representatives, order fulfillment staff

---

## Quick Start

### 1. Create Admin Users

Run the seed script to create all three admin roles:

```bash
npm run seed:all
```

This creates:
- **Super Admin**: `superadmin@luxecraft.com` / `super123`
- **Manager**: `manager@luxecraft.com` / `manager123`
- **Staff**: `staff@luxecraft.com` / `staff123`

### 2. Login

Visit: `http://localhost:5173/admin-login`

Use any of the credentials above based on the access level you need.

### 3. Manage Users (Super Admin Only)

1. Login as super admin
2. Navigate to **Admin Panel** → **Manage Users**
3. Create new admin users, assign roles, and manage access

---

## Admin Panel Features

### Super Admin Dashboard

```
┌─────────────────────────────────────┐
│  Admin Panel                        │
│  Logged in as: superadmin@...       │
│  [Manage Users] [Logout]            │
├─────────────────────────────────────┤
│  ┌─────────┐  ┌────────┐            │
│  │Products │  │ Orders │            │
│  └─────────┘  └────────┘            │
│                                     │
│  - Add/Edit/Delete Products         │
│  - View/Update Orders               │
│  - Full System Access               │
└─────────────────────────────────────┘
```

### User Management Page (`/admin/users`)

**Features:**
- View all admin users in a table
- Create new admin users with email, password, and role
- Update user roles (dropdown selection)
- Activate/deactivate users (toggle button)
- Delete users (with protection for last super admin)
- Visual role permissions reference

**Security:**
- Only super admins can access this page
- Cannot delete yourself
- Cannot delete the last super admin
- Cannot deactivate yourself
- Passwords are always hashed (bcrypt with 10 rounds)

---

## Permission Matrix

| Feature | Super Admin | Manager | Staff |
|---------|-------------|---------|-------|
| View Products | ✅ | ✅ | ✅ |
| Add/Edit Products | ✅ | ✅ | ❌ |
| Delete Products | ✅ | ✅ | ❌ |
| View Orders | ✅ | ✅ | ✅ |
| Update Order Status | ✅ | ✅ | ✅ |
| Manage Admin Users | ✅ | ❌ | ❌ |
| View Analytics | ✅ | ✅ | ❌ |

---

## Security Features

### Password Security
- **Hashing**: bcrypt with 10 rounds (salt + hash)
- **No Plain Text**: Passwords never stored or transmitted in plain text
- **Minimum Length**: 8 characters required

### Session Management
- **Secure Cookies**: httpOnly, SameSite=lax
- **7-Day Expiration**: Auto-logout after 7 days
- **Active Check**: Verifies user is still active on each request
- **Role Verification**: Checks permissions on protected routes

### Route Protection
- **Middleware**: All admin routes require authentication
- **Role Checks**: Specific routes check for required role level
- **Automatic Redirect**: Unauthorized users redirected to login or dashboard

### Database Security
- **Row Level Security (RLS)**: Supabase policies enforce role-based access
- **Super Admin Policies**: Only super admins can view/modify admin users
- **Active User Check**: Inactive users cannot authenticate

---

## Database Schema

### admin_users Table

```sql
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'staff',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT valid_admin_role CHECK (role IN ('super_admin', 'manager', 'staff'))
);
```

### Indexes
- `idx_admin_users_role`: Fast role-based queries
- `idx_admin_users_is_active`: Quick active user lookups

---

## API Reference

### Admin User Service

```typescript
// Get all admin users (super admin only)
getAllAdminUsers(): Promise<AdminUser[]>

// Get admin user by ID
getAdminUserById(id: string): Promise<AdminUser | null>

// Create new admin user
createAdminUser(
  email: string, 
  password: string, 
  role: AdminRole
): Promise<AdminUser>

// Update user role
updateAdminUserRole(id: string, role: AdminRole): Promise<AdminUser>

// Activate/deactivate user
updateAdminUserStatus(id: string, isActive: boolean): Promise<AdminUser>

// Update user password
updateAdminPassword(id: string, newPassword: string): Promise<void>

// Delete user (protects last super admin)
deleteAdminUser(id: string): Promise<void>
```

### Session Utilities

```typescript
// Require authenticated admin (optional role check)
requireAdminUser(request: Request, requiredRole?: AdminRole): Promise<AdminSession>

// Require super admin specifically
requireSuperAdmin(request: Request): Promise<AdminSession>

// Get current admin session (no redirect)
getAdminSession(request: Request): Promise<AdminSession | null>

// Create user session and redirect
createUserSession(adminSession: AdminSession, redirectTo: string): Promise<Response>

// Logout and destroy session
logout(request: Request): Promise<Response>
```

### Permission Helper

```typescript
import { hasPermission } from '~/types/admin';

// Check if role has specific permission
if (hasPermission(adminSession.role, 'can_manage_users')) {
  // Show user management button
}
```

---

## Common Tasks

### Create a New Admin User

1. **Via Admin Panel** (Recommended):
   - Login as super admin
   - Go to "Manage Users"
   - Click "Add Admin User"
   - Fill in email, password (min 8 chars), and role
   - Click "Create Admin User"

2. **Via Seed Script**:
   ```bash
   npm run seed:admin
   ```

3. **Programmatically**:
   ```typescript
   import { createAdminUser } from '~/services/admin-users.service';
   
   await createAdminUser(
     'newadmin@example.com',
     'securepassword123',
     'manager'
   );
   ```

### Change User Role

1. **Via Admin Panel**:
   - Login as super admin
   - Go to "Manage Users"
   - Select new role from dropdown
   - Changes save automatically

2. **Programmatically**:
   ```typescript
   import { updateAdminUserRole } from '~/services/admin-users.service';
   
   await updateAdminUserRole(userId, 'super_admin');
   ```

### Deactivate User

```typescript
import { updateAdminUserStatus } from '~/services/admin-users.service';

await updateAdminUserStatus(userId, false); // Deactivate
await updateAdminUserStatus(userId, true);  // Activate
```

### Protect a New Route

```typescript
// app/routes/admin.new-feature.tsx
import { requireAdminUser } from '~/utils/session.server';
import { hasPermission } from '~/types/admin';

export async function loader({ request }: LoaderFunctionArgs) {
  const adminSession = await requireAdminUser(request);
  
  // Optional: Check specific permission
  if (!hasPermission(adminSession.role, 'can_manage_products')) {
    throw redirect('/admin');
  }
  
  // Your loader logic
  return { adminSession };
}
```

---

## Production Checklist

Before deploying to production:

- [ ] Change all default admin passwords
- [ ] Set strong `SESSION_SECRET` environment variable
- [ ] Enable SSL/HTTPS for secure cookies
- [ ] Review and audit admin user list
- [ ] Test all role permissions thoroughly
- [ ] Set up monitoring for admin access
- [ ] Configure password rotation policy
- [ ] Enable 2FA if available
- [ ] Set up admin activity logging
- [ ] Review Supabase RLS policies

---

## Troubleshooting

### "Access Denied" or Redirect Loop

**Cause**: Session corruption or inactive user

**Solution**:
1. Clear browser cookies
2. Login again
3. Check if user is active in database
4. Verify user role matches required permission

### Cannot Create Users

**Cause**: Not logged in as super admin

**Solution**:
- Login with super admin credentials
- Only super admins can manage users

### Password Too Short Error

**Cause**: Password less than 8 characters

**Solution**:
- Use at least 8 characters
- Include mix of letters, numbers, and symbols (recommended)

### Last Super Admin Cannot Be Deleted

**Cause**: System protection to prevent lockout

**Solution**:
- Create another super admin first
- Then delete the original one

---

## Further Reading

- [Supabase Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [bcrypt Password Hashing](https://github.com/kelektiv/node.bcrypt.js)
- [React Router Sessions](https://reactrouter.com/how-to/session-management)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)

---

## Support

For issues or questions:
1. Check this guide thoroughly
2. Review existing documentation files
3. Check Supabase dashboard for RLS policy issues
4. Verify environment variables are set correctly
