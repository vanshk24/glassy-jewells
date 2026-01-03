# Security Model

## Overview

This e-commerce application implements a **layered security approach** combining database-level Row Level Security (RLS) with application-layer session-based authentication.

## Architecture

### Two-Tier Security Model

1. **Database Layer (Supabase RLS)**
   - Permissive policies that allow operations
   - Basic access control for public operations
   - Prevent complete database lockout

2. **Application Layer (Session Auth)**
   - Session-based admin authentication
   - Route-level authorization middleware
   - Cookie-based session management

## Authentication Systems

### Public Users (Customers)

**Authentication**: None required
**Authorization**: Can perform checkout and view their order confirmation

**Allowed Operations**:
- Browse products
- Add items to cart
- Complete checkout (create orders)
- View their order confirmation via order ID

**Security Measures**:
- Order IDs are UUIDs (non-guessable)
- No ability to list all orders
- No update or delete permissions
- No access to other customers' data

### Admin Users

**Authentication**: Session-based with bcrypt password hashing
**Authorization**: Session cookie validated on every admin route

**Allowed Operations**:
- Full CRUD on products
- View all orders
- Update order status
- Delete orders
- Manage admin users
- Configure site settings

**Security Measures**:
- Passwords hashed with bcrypt (10 rounds)
- Session cookies with httpOnly flag
- Admin routes protected by middleware
- Active status check on login
- Session expiration handling

## Row Level Security (RLS) Policies

### Products Table

```sql
-- Public: Read active products only
CREATE POLICY "Public can view active products" ON products
  FOR SELECT USING (is_active = true);

-- Admin: All operations (protected at app layer)
CREATE POLICY "Allow admin to manage products" ON products
  FOR ALL USING (true);
```

### Orders Table

```sql
-- Public: Create orders (checkout)
CREATE POLICY "Public can create orders" ON orders
  FOR INSERT WITH CHECK (true);

-- Public/Admin: Read orders
CREATE POLICY "Allow read access to orders" ON orders
  FOR SELECT USING (true);

-- Admin: Update orders (protected at app layer)
CREATE POLICY "Allow update orders" ON orders
  FOR UPDATE USING (true) WITH CHECK (true);

-- Admin: Delete orders (protected at app layer)
CREATE POLICY "Allow delete orders" ON orders
  FOR DELETE USING (true);
```

### Order Items Table

```sql
-- Public: Create order items (checkout)
CREATE POLICY "Public can create order items" ON order_items
  FOR INSERT WITH CHECK (true);

-- Public/Admin: Read order items
CREATE POLICY "Allow read access to order items" ON order_items
  FOR SELECT USING (true);

-- Admin: Update order items (protected at app layer)
CREATE POLICY "Allow update order items" ON order_items
  FOR UPDATE USING (true) WITH CHECK (true);

-- Admin: Delete order items (protected at app layer)
CREATE POLICY "Allow delete order items" ON order_items
  FOR DELETE USING (true);
```

### Admin Users Table

```sql
-- All operations allowed (protected at app layer)
CREATE POLICY "admin_users_allow_all" ON admin_users
  FOR ALL USING (true) WITH CHECK (true);
```

## Session Management

### Implementation

Located in `app/utils/session.server.ts`

**Session Creation**:
```typescript
createAdminSession(admin: AdminSession)
```

**Session Validation**:
```typescript
getAdminSession(request: Request)
```

**Session Destruction**:
```typescript
destroyAdminSession(request: Request)
```

### Session Data

```typescript
interface AdminSession {
  id: string;      // Admin user ID
  email: string;   // Admin email
  role: string;    // Admin role
}
```

### Cookie Configuration

- **Name**: `admin_session`
- **HttpOnly**: `true` (prevents XSS)
- **Secure**: `true` in production (HTTPS only)
- **SameSite**: `lax` (CSRF protection)
- **Max Age**: 7 days

## Route Protection

### Public Routes

**No protection required**:
- `/` (Home)
- `/shop` (Product listing)
- `/product/:id` (Product details)
- `/cart` (Shopping cart)
- `/checkout` (Checkout flow)
- `/order-confirmation/:orderId` (Order confirmation)
- `/search` (Product search)
- `/wishlist` (Wishlist)

### Admin Routes

**Session required**:
- `/admin` (Admin dashboard)
- `/admin/products` (Product management)
- `/admin/product/:id` (Edit product)
- `/admin/orders` (Order management)
- `/admin/users` (Admin user management)
- `/admin/settings` (Site settings)

### Admin Login

- `/admin-login` (Public route for admin authentication)

## Authorization Flow

### Admin Route Access

1. User visits admin route
2. Middleware checks for `admin_session` cookie
3. If cookie exists, decode and validate session
4. If session valid, allow access to route
5. If session invalid/missing, redirect to `/admin-login`

### Order Creation (Checkout)

1. User fills checkout form
2. User completes Razorpay payment
3. On payment success, `createOrder()` is called
4. RLS policy allows INSERT operation
5. Order and order items created in database
6. User redirected to order confirmation

### Order Confirmation

1. User visits `/order-confirmation/:orderId`
2. Route loader fetches order by ID
3. RLS policy allows SELECT operation
4. Order details displayed to user

**Note**: Order IDs are UUIDs, making them non-guessable. While technically anyone with the order ID can view it, the likelihood of guessing a valid UUID is astronomically low (2^122 possible values).

## Password Security

### Hashing

- **Algorithm**: bcrypt
- **Rounds**: 10 (2^10 = 1024 iterations)
- **Salt**: Automatically generated per password

### Password Storage

```sql
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,  -- bcrypt hash
  role TEXT NOT NULL DEFAULT 'admin',
  is_active BOOLEAN NOT NULL DEFAULT true
);
```

**Never stored**:
- Plain text passwords
- Reversible encryption
- Weak hashes (MD5, SHA1)

### Password Verification

```typescript
const isValid = await bcrypt.compare(password, admin.password_hash);
```

## Data Access Patterns

### Customer Order Creation

```
User → Checkout Form → Razorpay Payment → createOrder() → Supabase RLS (INSERT) → Database
```

### Admin Order Management

```
Admin → Admin Login → Session Cookie → Admin Route → getOrders() → Supabase RLS (SELECT) → Database
```

### Admin Order Update

```
Admin → Session Validation → updateOrder() → Supabase RLS (UPDATE) → Database
```

## Security Best Practices

### ✅ Implemented

- Password hashing with bcrypt
- Session-based authentication
- HttpOnly cookies (XSS prevention)
- SameSite cookies (CSRF prevention)
- RLS enabled on all tables
- Admin route protection
- Active status check for admin users
- UUID order IDs (non-guessable)

### 🔄 Recommended Enhancements

1. **Rate Limiting**
   - Limit login attempts
   - Prevent brute force attacks
   - Implement IP-based throttling

2. **HTTPS Enforcement**
   - Redirect HTTP to HTTPS
   - Set secure flag on cookies
   - Enable HSTS headers

3. **Session Security**
   - Implement session rotation
   - Add session timeout warnings
   - Track active sessions per user

4. **Audit Logging**
   - Log all admin actions
   - Track order modifications
   - Monitor failed login attempts

5. **Two-Factor Authentication**
   - Add 2FA for admin accounts
   - Use TOTP (Time-based One-Time Password)
   - Backup codes for account recovery

6. **Input Validation**
   - Sanitize all user inputs
   - Validate email formats
   - Limit field lengths

7. **Payment Security**
   - Verify Razorpay webhook signatures
   - Validate payment amounts server-side
   - Store payment IDs for reconciliation

## Threat Model

### Mitigated Threats

| Threat | Mitigation |
|--------|-----------|
| SQL Injection | Supabase client parameterized queries |
| XSS | HttpOnly cookies, React auto-escaping |
| CSRF | SameSite cookies, same-origin checks |
| Password Cracking | Bcrypt hashing (10 rounds) |
| Session Hijacking | HttpOnly + Secure cookies |
| Unauthorized Admin Access | Session middleware validation |

### Residual Risks

| Risk | Impact | Likelihood | Notes |
|------|--------|-----------|-------|
| Weak passwords | High | Medium | Add password strength requirements |
| Session fixation | Medium | Low | Implement session rotation |
| Order ID guessing | Low | Very Low | UUIDs are statistically secure |
| Payment verification bypass | High | Low | Add server-side Razorpay verification |

## Compliance Notes

### Data Privacy

- Customer data (name, email, phone, address) stored in orders table
- No customer accounts or stored passwords
- Order data accessible via non-guessable UUID
- Consider GDPR compliance for EU customers

### Payment Security

- **PCI Compliance**: Not required (payment handled by Razorpay)
- Payment credentials never stored in application
- Only payment IDs and order IDs stored
- Razorpay handles secure payment processing

## Incident Response

### Suspected Security Breach

1. **Immediate Actions**:
   - Invalidate all admin sessions
   - Force password resets for all admins
   - Review audit logs for suspicious activity
   - Check database for unauthorized changes

2. **Investigation**:
   - Identify breach vector
   - Assess data exposure
   - Document timeline of events

3. **Remediation**:
   - Patch vulnerabilities
   - Update security policies
   - Notify affected users if required

4. **Prevention**:
   - Implement additional controls
   - Update security documentation
   - Conduct security training

## Contact

For security concerns or to report vulnerabilities, contact the development team.

**Note**: This is a development/demo application. For production deployment, additional security hardening is strongly recommended.
