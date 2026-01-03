import { useLoaderData, Form, type LoaderFunctionArgs, type ActionFunctionArgs } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card/card';
import { getAllOrders, updateOrderStatus } from '~/services/orders.service';
import { requireAdminUser } from '~/utils/session.server';
import styles from './admin.orders.module.css';

export async function loader({ request }: LoaderFunctionArgs) {
  const adminSession = await requireAdminUser(request);
  const orders = await getAllOrders();
  return { orders, adminSession };
}

export async function action({ request }: ActionFunctionArgs) {
  await requireAdminUser(request);

  const formData = await request.formData();
  const intent = formData.get('intent');

  if (intent === 'updateOrderStatus') {
    const orderId = formData.get('orderId') as string;
    const status = formData.get('status') as string;
    const field = formData.get('field') as string;

    await updateOrderStatus(orderId, {
      [field]: status,
    });
    return { success: true };
  }

  return null;
}

export default function AdminOrders() {
  const { orders } = useLoaderData<typeof loader>();

  return (
    <div className={styles.container}>
      <Card>
        <CardHeader>
          <CardTitle>Orders</CardTitle>
          <CardDescription>Manage customer orders</CardDescription>
        </CardHeader>
        <CardContent>
          <div className={styles.ordersTable}>
            {orders.map((order) => (
              <div key={order.id} className={styles.orderCard}>
                <div className={styles.orderHeader}>
                  <div>
                    <h3 className={styles.orderId}>Order {order.id.slice(0, 8)}</h3>
                    <p className={styles.orderDate}>
                      {new Date(order.created_at).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <div className={`${styles.statusBadge} ${styles[order.order_status]}`}>{order.order_status}</div>
                </div>
                <div className={styles.orderDetails}>
                  <div className={styles.customerInfo}>
                    <h4>Customer</h4>
                    <p>{order.customer_name}</p>
                    <p className={styles.contactInfo}>{order.customer_email}</p>
                    <p className={styles.contactInfo}>{order.customer_phone}</p>
                    <p className={styles.address}>{order.shipping_address}</p>
                  </div>
                  <div className={styles.orderItems}>
                    <h4>Items</h4>
                    {order.items.map((item) => (
                      <div key={item.id} className={styles.orderItem}>
                        <span>
                          {item.product.name} × {item.quantity}
                        </span>
                        <span>₹{Number(item.price).toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                    <div className={styles.orderTotal}>
                      <span>Total</span>
                      <span>₹{Number(order.total_amount).toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>
                <div className={styles.orderActions}>
                  <Form method="post" style={{ display: 'inline' }}>
                    <input type="hidden" name="intent" value="updateOrderStatus" />
                    <input type="hidden" name="orderId" value={order.id} />
                    <input type="hidden" name="field" value="order_status" />
                    <select
                      name="status"
                      defaultValue={order.order_status}
                      onChange={(e) => e.currentTarget.form?.requestSubmit()}
                      className={styles.statusSelect}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </Form>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
