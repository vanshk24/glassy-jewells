import { useState } from "react";
import { Link, useLoaderData, useNavigate, type LoaderFunctionArgs } from "react-router";
import { Truck, RefreshCw, Heart, ChevronLeft, ChevronRight } from "lucide-react";
import type { Route } from "./+types/product.$id";
import { Header } from "~/components/header";
import { Footer } from "~/components/footer";
import { PriceDisplay } from "~/components/price-display";
import { getProductById } from "~/services/products.service";
import { getSiteSettings } from "~/services/site-settings.service";
import { useCart } from "~/hooks/use-cart";
import { useWishlist } from "~/hooks/use-wishlist";
import { toast } from "~/hooks/use-toast";
import styles from "./product.$id.module.css";

export async function loader({ params }: LoaderFunctionArgs) {
  try {
    const [product, siteSettings] = await Promise.all([
      getProductById(params.id!),
      getSiteSettings(),
    ]);
    return { product, siteSettings };
  } catch (error) {
    return { product: null, siteSettings: null };
  }
}

export function meta({ data }: Route.MetaArgs) {
  const product = data?.product;

  if (!product) {
    return [{ title: "Product Not Found - Lumière" }];
  }

  return [
    { title: `${product.name} - Lumière` },
    {
      name: "description",
      content: product.description,
    },
  ];
}

export default function ProductDetail() {
  const { product, siteSettings } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addItem, getTotalItems } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();
  const cartItemCount = getTotalItems();

  if (!product) {
    return (
      <div className={styles.container}>
        <Header 
          brandName={siteSettings?.brand_name}
          logoUrl={siteSettings?.logo_url || undefined}
          announcementText={siteSettings?.announcement_text || undefined}
          announcementBehavior={siteSettings?.announcement_behavior}
        />
        <div className={styles.notFound}>
          <h1 className={styles.notFoundTitle}>Product Not Found</h1>
          <p className={styles.notFoundText}>The product you're looking for doesn't exist.</p>
          <Link to="/shop" className={styles.backButton}>
            Continue Shopping
          </Link>
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

  const handleAddToCart = () => {
    if (product) {
      // Convert product to match cart format
      const cartProduct = {
        id: product.id,
        name: product.name,
        price: product.price,
        discountPrice: product.discount_price,
        image: product.images[0] || 'https://placehold.co/600x600/e5e5e5/999999?text=No+Image',
        category: product.category,
        description: product.description,
      };
      addItem(cartProduct, quantity);
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      });
    }
  };

  const handleBuyNow = () => {
    if (product) {
      // Create buy-now item
      const buyNowItem = {
        product: {
          id: product.id,
          name: product.name,
          price: product.price,
          discountPrice: product.discount_price,
          image: product.images[0] || 'https://placehold.co/600x600/e5e5e5/999999?text=No+Image',
          category: product.category,
          description: product.description,
        },
        quantity,
      };

      // Store in localStorage for checkout page
      localStorage.setItem("buyNowItem", JSON.stringify(buyNowItem));

      // Navigate to checkout
      navigate("/checkout");
    }
  };

  const handleToggleWishlist = () => {
    if (product) {
      // Convert product to match wishlist format
      const wishlistProduct = {
        id: product.id,
        name: product.name,
        price: product.price,
        discountPrice: product.discount_price,
        image: product.images[0] || 'https://placehold.co/600x600/e5e5e5/999999?text=No+Image',
        category: product.category,
        description: product.description,
      };
      toggleItem(wishlistProduct);
      if (isInWishlist(product.id)) {
        toast({
          title: "Removed from wishlist",
          description: `${product.name} has been removed from your wishlist.`,
        });
      } else {
        toast({
          title: "Added to wishlist",
          description: `${product.name} has been added to your wishlist.`,
        });
      }
    }
  };

  const handlePreviousImage = () => {
    setSelectedImage((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setSelectedImage((prev) => (prev === product.images.length - 1 ? 0 : prev + 1));
  };

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
        <div className={styles.product}>
          <div className={styles.gallery}>
            <div className={styles.mainImageWrapper}>
              <div className={styles.mainImage}>
                <img 
                  src={product.images[selectedImage] || 'https://placehold.co/600x600/e5e5e5/999999?text=No+Image'} 
                  alt={`${product.name} - Image ${selectedImage + 1}`}
                  onError={(e) => {
                    e.currentTarget.src = 'https://placehold.co/600x600/e5e5e5/999999?text=Image+Error';
                  }}
                />
              </div>
              
              {product.images.length > 1 && (
                <>
                  <button 
                    onClick={handlePreviousImage}
                    className={`${styles.galleryNav} ${styles.galleryNavPrev}`}
                    aria-label="Previous image"
                  >
                    <ChevronLeft />
                  </button>
                  <button 
                    onClick={handleNextImage}
                    className={`${styles.galleryNav} ${styles.galleryNavNext}`}
                    aria-label="Next image"
                  >
                    <ChevronRight />
                  </button>
                  <div className={styles.imageCounter}>
                    {selectedImage + 1} / {product.images.length}
                  </div>
                </>
              )}
            </div>
            
            {product.images.length > 1 && (
              <div className={styles.thumbnails}>
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`${styles.thumbnail} ${selectedImage === index ? styles.active : ""}`}
                  >
                    <img 
                      src={image} 
                      alt={`${product.name} view ${index + 1}`}
                      onError={(e) => {
                        e.currentTarget.src = 'https://placehold.co/200x200/e5e5e5/999999?text=Error';
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className={styles.details}>
            <div className={styles.titleRow}>
              <h1 className={styles.title}>{product.name}</h1>
              <button
                onClick={handleToggleWishlist}
                className={`${styles.wishlistButton} ${isInWishlist(product.id) ? styles.inWishlist : ""}`}
                aria-label="Add to wishlist"
              >
                <Heart className={styles.heartIcon} />
              </button>
            </div>
            
            <div className={styles.priceSection}>
              <PriceDisplay price={product.price} discountPrice={product.discount_price} />
              {product.discount_price && (
                <span className={styles.saveBadge}>
                  Save ₹{(product.price - product.discount_price).toLocaleString('en-IN')}
                </span>
              )}
            </div>
            
            <p className={styles.sku}>SKU: {product.id.slice(0, 8)}</p>
            <p className={styles.description}>{product.description}</p>
            
            <div className={styles.productDetails}>
              <div className={styles.detailSection}>
                <h3 className={styles.detailTitle}>Category</h3>
                <p className={styles.detailText}>{product.category}</p>
              </div>
              
              <div className={styles.detailSection}>
                <h3 className={styles.detailTitle}>Availability</h3>
                <p className={`${styles.detailText} ${product.stock > 0 ? styles.inStock : styles.outOfStock}`}>
                  {product.stock > 0 
                    ? `${product.stock} in stock` 
                    : 'Out of stock'}
                </p>
              </div>
            </div>

            <div className={styles.actions}>
              <div className={styles.quantitySelector}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className={styles.quantityButton}
                  aria-label="Decrease quantity"
                  disabled={product.stock === 0}
                >
                  −
                </button>
                <span className={styles.quantity}>{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className={styles.quantityButton}
                  aria-label="Increase quantity"
                  disabled={product.stock === 0}
                >
                  +
                </button>
              </div>
              <button 
                onClick={handleBuyNow} 
                className={styles.buyNow}
                disabled={product.stock === 0}
              >
                {product.stock > 0 ? 'Buy Now' : 'Out of Stock'}
              </button>
              <button 
                onClick={handleAddToCart} 
                className={styles.addToCart}
                disabled={product.stock === 0}
              >
                Add to Cart
              </button>
            </div>

            <div className={styles.trust}>
              <div className={styles.trustItem}>
                <Truck className={styles.trustIcon} />
                <span>Free Shipping</span>
              </div>
              <div className={styles.trustItem}>
                <RefreshCw className={styles.trustIcon} />
                <span>30-Day Returns</span>
              </div>
            </div>
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
