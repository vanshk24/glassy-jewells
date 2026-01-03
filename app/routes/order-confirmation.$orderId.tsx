import { useEffect, useState } from "react";
import { Link, useParams, useLoaderData } from "react-router";
import { CheckCircle2, Package, Truck } from "lucide-react";
import type { Route } from "./+types/order-confirmation.$orderId";
import { Header } from "~/components/header";
import { Footer } from "~/components/footer";
import { useCart } from "~/hooks/use-cart";
import { getSiteSettings } from "~/services/site-settings.service";
import styles from "./order-confirmation.module.css";

export async function loader() {
  const siteSettings = await getSiteSettings();
  return { siteSettings };
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Order Confirmation - Lumière" },
    {
      name: "description",
      content: "Your order has been confirmed.",
    },
  ];
}

interface OrderData {
  orderId: string;
  items: Array<{
    product: {
      id: string;
      name: string;
      price: number;
      discountPrice?: number;
      image: string;
    };
    quantity: number;
  }>;
  totalPrice: number;
  shippingCost: number;
  tax: number;
  grandTotal: number;
  paymentMethod?: string;
  date: string;
}

export default function OrderConfirmation() {
  const { orderId } = useParams();
  const { siteSettings } = useLoaderData<typeof loader>();
  const { getTotalItems } = useCart();
  const [orderData, setOrderData] = useState<OrderData | null>(null);

  useEffect(() => {
    const storedOrder = localStorage.getItem("lastOrder");
    if (storedOrder) {
      const data = JSON.parse(storedOrder);
      if (data.orderId === orderId) {
        setOrderData(data);
      }
    }
  }, [orderId]);

  if (!orderData) {
    return (
      <div className={styles.container}>
        <Header 
          cartItemCount={getTotalItems()}
          brandName={siteSettings?.brand_name}
          logoUrl={siteSettings?.logo_url || undefined}
          announcementText={siteSettings?.announcement_text || undefined}
          announcementBehavior={siteSettings?.announcement_behavior}
        />
        <div className={styles.content}>
          <div className={styles.notFound}>
            <h1>Order Not Found</h1>
            <p>We couldn't find this order. Please check your email for order details.</p>
            <Link to="/shop" className={styles.button}>
              Continue Shopping
            </Link>
          </div>
        </div>
        <Footer 
          brandName={siteSettings?.brand_name}
          contactEmail={siteSettings?.contact_email || undefined}
          contactPhone={siteSettings?.contact_phone || undefined}
          socialLinks={siteSettings?.social_links}
        />
      </div>
    );
  }

  const orderDate = new Date(orderData.date);
  const estimatedDelivery = new Date(orderDate);
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 7);

  return (
    <div className={styles.container}>
      <Header 
        cartItemCount={getTotalItems()}
        brandName={siteSettings?.brand_name}
        logoUrl={siteSettings?.logo_url || undefined}
        announcementText={siteSettings?.announcement_text || undefined}
        announcementBehavior={siteSettings?.announcement_behavior}
      />

      <div className={styles.content}>
        <div className={styles.success}>
          <CheckCircle2 className={styles.successIcon} />
          <h1 className={styles.title}>Order Confirmed!</h1>
          <p className={styles.subtitle}>
            Thank you for your purchase. Your order has been successfully placed.
          </p>
        </div>

        <div className={styles.orderDetails}>
          <div className={styles.orderHeader}>
            <div>
              <h2 className={styles.orderTitle}>Order Details</h2>
              <p className={styles.orderId}>Order #{orderData.orderId}</p>
              <p className={styles.orderDate}>
                Placed on {orderDate.toLocaleDateString("en-US", { 
                  year: "numeric", 
                  month: "long", 
                  day: "numeric" 
                })}
              </p>
            </div>
          </div>

          <div className={styles.timeline}>
            <div className={styles.timelineItem}>
              <div className={styles.timelineIconWrapper}>
                <CheckCircle2 className={styles.timelineIcon} />
              </div>
              <div className={styles.timelineContent}>
                <h3 className={styles.timelineTitle}>Order Confirmed</h3>
                <p className={styles.timelineDate}>
                  {orderDate.toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className={`${styles.timelineItem} ${styles.pending}`}>
              <div className={styles.timelineIconWrapper}>
                <Package className={styles.timelineIcon} />
              </div>
              <div className={styles.timelineContent}>
                <h3 className={styles.timelineTitle}>Processing</h3>
                <p className={styles.timelineDate}>1-2 business days</p>
              </div>
            </div>

            <div className={`${styles.timelineItem} ${styles.pending}`}>
              <div className={styles.timelineIconWrapper}>
                <Truck className={styles.timelineIcon} />
              </div>
              <div className={styles.timelineContent}>
                <h3 className={styles.timelineTitle}>Estimated Delivery</h3>
                <p className={styles.timelineDate}>
                  {estimatedDelivery.toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>

          <div className={styles.items}>
            <h3 className={styles.itemsTitle}>Items Ordered</h3>
            {orderData.items.map((item) => (
              <div key={item.product.id} className={styles.item}>
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className={styles.itemImage}
                />
                <div className={styles.itemDetails}>
                  <p className={styles.itemName}>{item.product.name}</p>
                  <p className={styles.itemQty}>Quantity: {item.quantity}</p>
                </div>
                <p className={styles.itemPrice}>
                  ₹{((item.product.discountPrice || item.product.price) * item.quantity).toLocaleString('en-IN')}
                </p>
              </div>
            ))}
          </div>

          <div className={styles.summary}>
            <div className={styles.summaryRow}>
              <span>Subtotal</span>
              <span>₹{orderData.totalPrice.toLocaleString('en-IN')}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Shipping</span>
              <span>
                {orderData.shippingCost === 0
                  ? "Free"
                  : `₹${orderData.shippingCost.toLocaleString('en-IN')}`}
              </span>
            </div>
            <div className={styles.summaryRow}>
              <span>Tax</span>
              <span>₹{orderData.tax.toLocaleString('en-IN')}</span>
            </div>
            <div className={styles.summaryDivider} />
            <div className={styles.summaryTotal}>
              <span>Total</span>
              <span>₹{orderData.grandTotal.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className={styles.actions}>
            <Link to="/shop" className={styles.button}>
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>

      <Footer 
        brandName={siteSettings?.brand_name}
        contactEmail={siteSettings?.contact_email || undefined}
        contactPhone={siteSettings?.contact_phone || undefined}
        socialLinks={siteSettings?.social_links}
      />
    </div>
  );
}
