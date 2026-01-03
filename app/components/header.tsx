import { Link } from "react-router";
import { User, Search, ShoppingBag, Heart } from "lucide-react";
import { useState } from "react";
import { useCart } from "~/hooks/use-cart";
import { CartDrawer } from "~/components/cart-drawer";
import type { AnnouncementBehavior } from "~/types/site-settings";
import styles from "./header.module.css";

interface HeaderProps {
  cartItemCount?: number;
  className?: string;
  brandName?: string;
  logoUrl?: string;
  announcementText?: string;
  announcementBehavior?: AnnouncementBehavior;
}

/**
 * Main navigation header component
 */
export function Header({ cartItemCount: propCount, className, brandName, logoUrl, announcementText, announcementBehavior = 'static' }: HeaderProps) {
  const { getTotalItems } = useCart();
  const cartItemCount = propCount ?? getTotalItems();
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [showAnnouncement, setShowAnnouncement] = useState(true);

  const displayBrandName = brandName || "vansh";

  const announcementClass = `${styles.announcement} ${announcementBehavior === 'scroll' ? styles.scroll : ''} ${announcementBehavior === 'hover' ? styles.hover : ''}`;

  return (
    <>
      {announcementText && showAnnouncement && (
        <div className={announcementClass}>
          <div className={styles.announcementContent}>
            <span>{announcementText}</span>
            {announcementBehavior === 'scroll' && (
              <span aria-hidden="true">{announcementText}</span>
            )}
          </div>
          <button
            onClick={() => setShowAnnouncement(false)}
            className={styles.announcementClose}
            aria-label="Close announcement"
          >
            ×
          </button>
        </div>
      )}
      <header className={`${styles.header} ${className || ""}`}>
        <div className={styles.container}>
          <Link to="/" className={styles.logo}>
            {logoUrl ? (
              <img src={logoUrl} alt={displayBrandName} className={styles.logoImage} />
            ) : (
              displayBrandName
            )}
          </Link>

          <nav className={styles.nav}>
            <Link to="/shop" className={styles.iconLink} title="Shop">
              <User className={styles.icon} />
            </Link>
            <Link to="/search" className={styles.iconLink} title="Search">
              <Search className={styles.icon} />
            </Link>
            <button onClick={() => setCartDrawerOpen(true)} className={styles.iconButton} title="Cart">
              <ShoppingBag className={styles.icon} />
              {cartItemCount > 0 && <span className={styles.badge}>{cartItemCount}</span>}
            </button>
            <Link to="/wishlist" className={styles.iconLink} title="Wishlist">
              <Heart className={styles.icon} />
            </Link>
          </nav>
        </div>
      </header>

      <CartDrawer open={cartDrawerOpen} onOpenChange={setCartDrawerOpen} />
    </>
  );
}
