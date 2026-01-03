/**
 * @deprecated This file is no longer used for authentication.
 * 
 * The application now uses Supabase-based authentication with bcrypt password hashing.
 * See: app/services/auth.service.ts and app/utils/session.server.ts
 * 
 * Admin users are stored in the Supabase `admin_users` table.
 * See ADMIN_ACCESS_GUIDE.md for creating admin users.
 * 
 * This file is kept for reference only and may be removed in the future.
 */

// LEGACY - NOT USED
export const ADMIN_CREDENTIALS = {
  email: 'admin@luxecraft.com',
  password: 'admin123',
};

// LEGACY - NOT USED
const ADMIN_SESSION_KEY = 'luxecraft_admin_session';

export function createAdminSession() {
  console.warn('createAdminSession is deprecated. Using server-side sessions instead.');
  if (typeof window !== 'undefined') {
    sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
  }
}

export function checkAdminSession(): boolean {
  console.warn('checkAdminSession is deprecated. Using server-side sessions instead.');
  if (typeof window !== 'undefined') {
    return sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true';
  }
  return false;
}

export function clearAdminSession() {
  console.warn('clearAdminSession is deprecated. Using server-side sessions instead.');
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
  }
}
