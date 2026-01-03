import { Link } from "react-router";
import { X, Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { useCart } from "~/hooks/use-cart";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "~/components/ui/sheet/sheet";
import { Button } from "~/components/ui/button/button";
import styles from "./cart-drawer.module.css";

interface CartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CartDrawer({ open, onOpenChange }: CartDrawerProps) {
  const { items, updateQuantity, removeItem, getTotalItems, getTotalPrice } = useCart();
  const cartItemCount = getTotalItems();
  const totalPrice = getTotalPrice();
  const shippingCost = totalPrice > 0 ? (totalPrice >= 16600 ? 0 : 1245) : 0;
  const tax = totalPrice * 0.1;
  const grandTotal = totalPrice + shippingCost + tax;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className={styles.sheetContent}>
        <SheetHeader className={styles.header}>
          <SheetTitle className={styles.title}>
            Shopping Cart ({cartItemCount})
          </SheetTitle>
          <SheetClose className={styles.closeButton}>
            <X size={20} />
          </SheetClose>
        </SheetHeader>

        {items.length === 0 ? (
          <div className={styles.empty}>
            <ShoppingBag size={48} className={styles.emptyIcon} />
            <p className={styles.emptyText}>Your cart is empty</p>
            <Button asChild onClick={() => onOpenChange(false)}>
              <Link to="/shop">Continue Shopping</Link>
            </Button>
          </div>
        ) : (
          <div className={styles.content}>
            <div className={styles.items}>
              {items.map((item) => (
                <div key={item.product.id} className={styles.item}>
                  <Link
                    to={`/product/${item.product.id}`}
                    className={styles.itemImage}
                    onClick={() => onOpenChange(false)}
                  >
                    <img src={item.product.image} alt={item.product.name} />
                  </Link>

                  <div className={styles.itemInfo}>
                    <Link
                      to={`/product/${item.product.id}`}
                      className={styles.itemName}
                      onClick={() => onOpenChange(false)}
                    >
                      {item.product.name}
                    </Link>
                    <p className={styles.itemCategory}>{item.product.category}</p>
                    <div className={styles.priceRow}>
                      {item.product.discountPrice ? (
                        <>
                          <span className={styles.discountPrice}>₹{item.product.discountPrice.toLocaleString('en-IN')}</span>
                          <span className={styles.originalPrice}>₹{item.product.price.toLocaleString('en-IN')}</span>
                        </>
                      ) : (
                        <span className={styles.price}>₹{item.product.price.toLocaleString('en-IN')}</span>
                      )}
                    </div>

                    <div className={styles.itemControls}>
                      <div className={styles.quantitySelector}>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className={styles.quantityButton}
                          disabled={item.quantity <= 1}
                          aria-label="Decrease quantity"
                        >
                          <Minus size={14} />
                        </button>
                        <span className={styles.quantity}>{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className={styles.quantityButton}
                          aria-label="Increase quantity"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.product.id)}
                        className={styles.removeButton}
                        aria-label="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <p className={styles.itemTotal}>
                      Subtotal: ₹{((item.product.discountPrice || item.product.price) * item.quantity).toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.summary}>
              <div className={styles.summaryRow}>
                <span>Subtotal</span>
                <span>₹{totalPrice.toLocaleString('en-IN')}</span>
              </div>

              <div className={styles.summaryRow}>
                <span>Shipping</span>
                <span>{shippingCost === 0 ? "Free" : `₹${shippingCost.toLocaleString('en-IN')}`}</span>
              </div>

              <div className={styles.summaryRow}>
                <span>Tax (10%)</span>
                <span>₹{tax.toLocaleString('en-IN')}</span>
              </div>

              <div className={styles.divider} />

              <div className={styles.total}>
                <span>Total</span>
                <span>₹{grandTotal.toLocaleString('en-IN')}</span>
              </div>

              {totalPrice < 16600 && totalPrice > 0 && (
                <p className={styles.freeShippingMessage}>
                  Add ₹{(16600 - totalPrice).toLocaleString('en-IN')} more for free shipping
                </p>
              )}

              <Button asChild size="lg" className={styles.checkoutButton}>
                <Link to="/checkout" onClick={() => onOpenChange(false)}>
                  Proceed to Checkout
                </Link>
              </Button>

              <Button asChild variant="outline" size="lg" onClick={() => onOpenChange(false)}>
                <Link to="/cart">View Full Cart</Link>
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
