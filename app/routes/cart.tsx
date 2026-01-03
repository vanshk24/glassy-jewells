import { Link, useLoaderData } from "react-router";
import { Trash2, Plus, Minus } from "lucide-react";
import type { Route } from "./+types/cart";
import { Header } from "~/components/header";
import { Footer } from "~/components/footer";
import { useCart } from "~/hooks/use-cart";
import { getSiteSettings } from "~/services/site-settings.service";
import styles from "./cart.module.css";

export async function loader() {
  const siteSettings = await getSiteSettings();
  return { siteSettings };
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Shopping Cart - Lumière" },
    {
      name: "description",
      content: "Review your selected items and proceed to checkout.",
    },
  ];
}

export default function Cart() {
  const { siteSettings } = useLoaderData<typeof loader>();
  const { items, updateQuantity, removeItem, getTotalItems, getTotalPrice } = useCart();
  const cartItemCount = getTotalItems();
  const totalPrice = getTotalPrice();
  const shippingCost = totalPrice > 0 ? (totalPrice >= 16600 ? 0 : 1245) : 0;
  const tax = totalPrice * 0.1;
  const grandTotal = totalPrice + shippingCost + tax;

  return (
    <div className={styles.container}>
      <Header 
        cartItemCount={cartItemCount}
        brandName={siteSettings?.brand_name}
        logoUrl={siteSettings?.logo_url || undefined}
        announcementText={siteSettings?.announcement_text || undefined}
        announcementBehavior={siteSettings?.announcement_behavior}
      />

      <div className={styles.content}>
        <h1 className={styles.title}>Shopping Cart</h1>

        {items.length === 0 ? (
          <div className={styles.empty}>
            <h2 className={styles.emptyTitle}>Your cart is empty</h2>
            <p className={styles.emptyText}>Add some beautiful pieces to get started.</p>
            <Link to="/shop" className={styles.shopButton}>
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className={styles.cartLayout}>
            <div className={styles.cartItems}>
              {items.map((item) => (
                <div key={item.product.id} className={styles.cartItem}>
                  <Link to={`/product/${item.product.id}`} className={styles.itemImage}>
                    <img src={item.product.image} alt={item.product.name} />
                  </Link>
                  
                  <div className={styles.itemDetails}>
                    <Link to={`/product/${item.product.id}`} className={styles.itemName}>
                      {item.product.name}
                    </Link>
                    <p className={styles.itemCategory}>{item.product.category}</p>
                    <div className={styles.priceWrapper}>
                      {item.product.discountPrice ? (
                        <>
                          <span className={styles.itemDiscountPrice}>₹{item.product.discountPrice.toLocaleString('en-IN')}</span>
                          <span className={styles.itemOriginalPrice}>₹{item.product.price.toLocaleString('en-IN')}</span>
                        </>
                      ) : (
                        <span className={styles.itemPrice}>₹{item.product.price.toLocaleString('en-IN')}</span>
                      )}
                    </div>
                  </div>

                  <div className={styles.itemActions}>
                    <div className={styles.quantitySelector}>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className={styles.quantityButton}
                        aria-label="Decrease quantity"
                      >
                        <Minus size={16} />
                      </button>
                      <span className={styles.quantity}>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className={styles.quantityButton}
                        aria-label="Increase quantity"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    <p className={styles.itemTotal}>
                      ₹{((item.product.discountPrice || item.product.price) * item.quantity).toLocaleString('en-IN')}
                    </p>

                    <button
                      onClick={() => removeItem(item.product.id)}
                      className={styles.removeButton}
                      aria-label="Remove item"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.summary}>
              <h2 className={styles.summaryTitle}>Order Summary</h2>
              
              <div className={styles.summaryRow}>
                <span>Subtotal ({cartItemCount} items)</span>
                <span>₹{totalPrice.toLocaleString('en-IN')}</span>
              </div>
              
              <div className={styles.summaryRow}>
                <span>Shipping</span>
                <span>{shippingCost === 0 ? 'Free' : `₹${shippingCost.toLocaleString('en-IN')}`}</span>
              </div>
              
              <div className={styles.summaryRow}>
                <span>Tax (10%)</span>
                <span>₹{tax.toLocaleString('en-IN')}</span>
              </div>
              
              <div className={styles.summaryDivider} />
              
              <div className={styles.summaryTotal}>
                <span>Total</span>
                <span>₹{grandTotal.toLocaleString('en-IN')}</span>
              </div>

              {totalPrice < 16600 && totalPrice > 0 && (
                <p className={styles.freeShipping}>
                  Add ₹{(16600 - totalPrice).toLocaleString('en-IN')} more for free shipping
                </p>
              )}
              
              <Link to="/checkout" className={styles.checkoutButton}>
                Proceed to Checkout
              </Link>
              
              <Link to="/shop" className={styles.continueButton}>
                Continue Shopping
              </Link>
            </div>
          </div>
        )}
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
