import { useLoaderData, useNavigate, type LoaderFunctionArgs } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card/card';
import { Button } from '~/components/ui/button/button';
import { requireAdminUser } from '~/utils/session.server';
import { getAllProducts } from '~/services/products.service';
import { getAllOrders } from '~/services/orders.service';
import { hasPermission } from '~/types/admin';
import { Package, ShoppingBag, Users, Settings, DollarSign } from 'lucide-react';
import styles from './admin._index.module.css';

export async function loader({ request }: LoaderFunctionArgs) {
  const adminSession = await requireAdminUser(request);

  const [products, orders] = await Promise.all([getAllProducts(), getAllOrders()]);

  // Calculate stats
  const totalProducts = products.length;
  const lowStockProducts = products.filter((p) => p.stock < 10).length;
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.order_status === 'pending').length;
  const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total_amount), 0);

  return {
    adminSession,
    stats: {
      totalProducts,
      lowStockProducts,
      totalOrders,
      pendingOrders,
      totalRevenue,
    },
  };
}

export default function AdminDashboard() {
  const { adminSession, stats } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Dashboard</h1>
          <p className={styles.subtitle}>Welcome back, {adminSession.email}</p>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <Card>
          <CardHeader>
            <div className={styles.cardHeader}>
              <CardTitle>Total Products</CardTitle>
              <Package className={styles.icon} />
            </div>
          </CardHeader>
          <CardContent>
            <div className={styles.statValue}>{stats.totalProducts}</div>
            {stats.lowStockProducts > 0 && (
              <p className={styles.statSubtext}>{stats.lowStockProducts} low stock items</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className={styles.cardHeader}>
              <CardTitle>Total Orders</CardTitle>
              <ShoppingBag className={styles.icon} />
            </div>
          </CardHeader>
          <CardContent>
            <div className={styles.statValue}>{stats.totalOrders}</div>
            {stats.pendingOrders > 0 && (
              <p className={styles.statSubtext}>{stats.pendingOrders} pending orders</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className={styles.cardHeader}>
              <CardTitle>Total Revenue</CardTitle>
              <DollarSign className={styles.icon} />
            </div>
          </CardHeader>
          <CardContent>
            <div className={styles.statValue}>₹{stats.totalRevenue.toLocaleString('en-IN')}</div>
            <p className={styles.statSubtext}>All time</p>
          </CardContent>
        </Card>
      </div>

      <div className={styles.quickActions}>
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className={styles.actionsGrid}>
              {hasPermission(adminSession.role, 'can_manage_products') && (
                <>
                  <Button onClick={() => navigate('/admin/products')} variant="outline" className={styles.actionBtn}>
                    <Package />
                    <span>Manage Products</span>
                  </Button>
                  <Button onClick={() => navigate('/admin/product/new')} className={styles.actionBtn}>
                    <Package />
                    <span>Add New Product</span>
                  </Button>
                </>
              )}

              {hasPermission(adminSession.role, 'can_manage_orders') && (
                <Button onClick={() => navigate('/admin/orders')} variant="outline" className={styles.actionBtn}>
                  <ShoppingBag />
                  <span>View All Orders</span>
                </Button>
              )}

              {hasPermission(adminSession.role, 'can_manage_users') && (
                <Button onClick={() => navigate('/admin/users')} variant="outline" className={styles.actionBtn}>
                  <Users />
                  <span>Manage Users</span>
                </Button>
              )}

              {adminSession.role === 'super_admin' && (
                <Button onClick={() => navigate('/admin/settings')} variant="outline" className={styles.actionBtn}>
                  <Settings />
                  <span>Site Settings</span>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
