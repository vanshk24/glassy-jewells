import { useState } from "react";
import { Link, useSearchParams, useLoaderData, type LoaderFunctionArgs } from "react-router";
import type { Route } from "./+types/shop";
import { Header } from "~/components/header";
import { Footer } from "~/components/footer";
import { PriceDisplay } from "~/components/price-display";
import { getActiveProducts, getProductsByCategory } from "~/services/products.service";
import { getSiteSettings } from "~/services/site-settings.service";
import { useCart } from "~/hooks/use-cart";
import styles from "./shop.module.css";

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const url = new URL(request.url);
    const category = url.searchParams.get('category');
    
    const [products, siteSettings] = await Promise.all([
      category && category !== 'all'
        ? getProductsByCategory(category)
        : getActiveProducts(),
      getSiteSettings(),
    ]);
    
    return { products, siteSettings, initialCategory: category || 'all', error: null };
  } catch (error) {
    console.error("Error loading shop page:", error);
    return { products: [], siteSettings: null, initialCategory: 'all', error: "Failed to load products" };
  }
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Shop - Lumière" },
    {
      name: "description",
      content: "Browse our complete collection of luxury artificial jewelry.",
    },
  ];
}

const categories = ["all", "earrings", "necklaces", "rings", "bracelets"];

function LoadingProducts() {
  return (
    <div className={styles.products}>
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className={styles.productCard}>
          <div className={styles.productImageWrapper}>
            <div className={styles.skeleton}></div>
          </div>
          <div className={styles.productInfo}>
            <div className={`${styles.skeleton} ${styles.skeletonText}`}></div>
            <div className={`${styles.skeleton} ${styles.skeletonText} ${styles.skeletonShort}`}></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Shop() {
  const { products, siteSettings, initialCategory, error } = useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const { getTotalItems } = useCart();
  const cartItemCount = getTotalItems();

  const filteredProducts = products || [];

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    if (category === "all") {
      setSearchParams({});
    } else {
      setSearchParams({ category });
    }
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
        <div className={styles.header}>
          <h1 className={styles.title}>Shop All</h1>
          <div className={styles.filters}>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`${styles.filterButton} ${selectedCategory === category ? styles.active : ""}`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {error ? (
          <div className={styles.empty}>
            <p className={styles.errorText}>Unable to load products at this time.</p>
            <p>Please try again later or contact support if the issue persists.</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className={styles.products}>
            {filteredProducts.map((product) => (
              <Link key={product.id} to={`/product/${product.id}`} className={styles.productCard}>
                <div className={styles.productImageWrapper}>
                  <img 
                    src={product.images?.[0] || "https://placehold.co/400x400/e5e5e5/666?text=No+Image"} 
                    alt={product.name} 
                    className={styles.productImage} 
                  />
                </div>
                <div className={styles.productInfo}>
                  <h3 className={styles.productName}>{product.name}</h3>
                  <PriceDisplay price={product.price} discountPrice={product.discount_price} />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className={styles.empty}>
            <p>No products found in this category.</p>
            <p>Try selecting a different category or check back later.</p>
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
