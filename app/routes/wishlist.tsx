import { Link, useLoaderData } from "react-router";
import { Heart, ShoppingBag } from "lucide-react";
import type { Route } from "./+types/wishlist";
import { Header } from "~/components/header";
import { Footer } from "~/components/footer";
import { useWishlist } from "~/hooks/use-wishlist";
import { useCart } from "~/hooks/use-cart";
import { toast } from "~/hooks/use-toast";
import { getSiteSettings } from "~/services/site-settings.service";
import styles from "./wishlist.module.css";

export async function loader() {
  const siteSettings = await getSiteSettings();
  return { siteSettings };
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Wishlist - Lumière" },
    {
      name: "description",
      content: "Your saved items and favorites.",
    },
  ];
}

export default function Wishlist() {
  const { siteSettings } = useLoaderData<typeof loader>();
  const { items, removeItem } = useWishlist();
  const { addItem, getTotalItems } = useCart();
  const cartItemCount = getTotalItems();

  const handleAddToCart = (productId: string) => {
    const product = items.find((item) => item.id === productId);
    if (product) {
      addItem(product);
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      });
    }
  };

  const handleRemove = (productId: string) => {
    const product = items.find((item) => item.id === productId);
    removeItem(productId);
    if (product) {
      toast({
        title: "Removed from wishlist",
        description: `${product.name} has been removed from your wishlist.`,
      });
    }
  };

  return (
    <div className={styles.page}>
      <Header 
        cartItemCount={cartItemCount}
        brandName={siteSettings?.brand_name}
        logoUrl={siteSettings?.logo_url || undefined}
        announcementText={siteSettings?.announcement_text || undefined}
        announcementBehavior={siteSettings?.announcement_behavior}
      />
      <main className={styles.main}>
        <div className={styles.container}>
          <h1 className={styles.title}>Your Wishlist</h1>

          {items.length === 0 ? (
            <div className={styles.empty}>
              <Heart className={styles.emptyIcon} />
              <p className={styles.emptyText}>Your wishlist is empty</p>
              <Link to="/shop" className={styles.shopButton}>
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className={styles.grid}>
              {items.map((product) => (
                <div key={product.id} className={styles.card}>
                  <Link to={`/product/${product.id}`} className={styles.imageWrapper}>
                    <img src={product.image} alt={product.name} className={styles.image} />
                  </Link>
                  <div className={styles.info}>
                    <Link to={`/product/${product.id}`}>
                      <h3 className={styles.productName}>{product.name}</h3>
                    </Link>
                    <p className={styles.category}>{product.category}</p>
                    <div className={styles.priceWrapper}>
                      {product.discountPrice ? (
                        <>
                          <span className={styles.discountPrice}>₹{product.discountPrice.toLocaleString('en-IN')}</span>
                          <span className={styles.originalPrice}>₹{product.price.toLocaleString('en-IN')}</span>
                        </>
                      ) : (
                        <span className={styles.price}>₹{product.price.toLocaleString('en-IN')}</span>
                      )}
                    </div>
                    <div className={styles.actions}>
                      <button
                        onClick={() => handleAddToCart(product.id)}
                        className={styles.addButton}
                      >
                        <ShoppingBag className={styles.addIcon} />
                        Add to Cart
                      </button>
                      <button
                        className={styles.removeButton}
                        title="Remove from wishlist"
                        onClick={() => handleRemove(product.id)}
                      >
                        <Heart className={styles.removeIcon} fill="currentColor" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer 
        brandName={siteSettings?.brand_name}
        contactEmail={siteSettings?.contact_email || undefined}
        contactPhone={siteSettings?.contact_phone || undefined}
        socialLinks={siteSettings?.social_links}
      />
    </div>
  );
}
