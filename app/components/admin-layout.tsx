import { NavLink, Form, Outlet } from 'react-router';
import { LayoutDashboard, Package, ShoppingBag, Users, Settings, LogOut } from 'lucide-react';
import { Button } from '~/components/ui/button/button';
import type { AdminSession } from '~/types/admin';
import { hasPermission } from '~/types/admin';
import styles from './admin-layout.module.css';

interface AdminLayoutProps {
  adminSession: AdminSession;
}

export function AdminLayout({ adminSession }: AdminLayoutProps) {
  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h2 className={styles.sidebarTitle}>Admin Panel</h2>
          <p className={styles.sidebarRole}>{adminSession.role}</p>
        </div>

        <nav className={styles.nav}>
          <NavLink to="/admin" end className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}>
            <LayoutDashboard />
            <span>Dashboard</span>
          </NavLink>

          {hasPermission(adminSession.role, 'can_manage_products') && (
            <NavLink
              to="/admin/products"
              className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
            >
              <Package />
              <span>Products</span>
            </NavLink>
          )}

          {hasPermission(adminSession.role, 'can_manage_orders') && (
            <NavLink
              to="/admin/orders"
              className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
            >
              <ShoppingBag />
              <span>Orders</span>
            </NavLink>
          )}

          {hasPermission(adminSession.role, 'can_manage_users') && (
            <NavLink to="/admin/users" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}>
              <Users />
              <span>Users</span>
            </NavLink>
          )}

          {adminSession.role === 'super_admin' && (
            <NavLink
              to="/admin/settings"
              className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
            >
              <Settings />
              <span>Site Settings</span>
            </NavLink>
          )}
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.userInfo}>
            <p className={styles.userEmail}>{adminSession.email}</p>
          </div>
          <Form method="post" action="/admin">
            <input type="hidden" name="intent" value="logout" />
            <Button type="submit" variant="outline" className={styles.logoutBtn}>
              <LogOut />
              <span>Logout</span>
            </Button>
          </Form>
        </div>
      </aside>

      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
