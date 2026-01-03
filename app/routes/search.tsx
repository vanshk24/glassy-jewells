import { useState } from "react";
import { Link, useLoaderData } from "react-router";
import { Search as SearchIcon } from "lucide-react";
import { Header } from "../components/header";
import { Footer } from "../components/footer";
import { PriceDisplay } from "../components/price-display";
import { getAllProducts } from "../services/products.service";
import { getSiteSettings } from "../services/site-settings.service";
import { useCart } from "../hooks/use-cart";
import type { Route } from "./+types/search";
import type { Product } from "../types/product";
import styles from "./search.module.css";

export async function loader() {
  try {
    const [products, siteSettings] = await Promise.all([
      getAllProducts(),
      getSiteSettings()
    ]);
    return { products, siteSettings, error: null };
  } catch (error) {
    console.error("Error loading products for search:", error);
    return { products: [], siteSettings: null, error: "Failed to load products" };
  }
}

export function meta() {
  return [
    { title: "Search - Lumière" },
    { name: "description", content: "Search our collection of luxury jewelry" },
  ];
}

export default function Search() {
  const { products, siteSettings, error } = useLoaderData<typeof loader>();
  const [searchQuery, setSearchQuery] = useState("");
  const { getTotalItems } = useCart();
  const cartItemCount = getTotalItems();

  const filteredProducts = (products || []).filter(
    (product: Product) =>
      product?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product?.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product?.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <h1 className={styles.title}>Search</h1>

          <div className={styles.searchBox}>
            <SearchIcon className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          {error ? (
            <div className={styles.errorState}>
              <p className={styles.errorText}>Unable to load products at this time.</p>
              <p>Please try again later or contact support if the issue persists.</p>
            </div>
          ) : !searchQuery ? (
            <div className={styles.emptyState}>
              <p>Start typing to search for products...</p>
            </div>
          ) : (
            <div className={styles.results}>
              <p className={styles.resultsCount}>
                {filteredProducts.length} {filteredProducts.length === 1 ? "result" : "results"} found
              </p>

              {filteredProducts.length > 0 ? (
                <div className={styles.grid}>
                  {filteredProducts.map((product: Product) => (
                    <Link key={product.id} to={`/product/${product.id}`} className={styles.card}>
                      <div className={styles.imageWrapper}>
                        <img 
                          src={product.images?.[0] || "https://placehold.co/400x400/e5e5e5/666?text=No+Image"} 
                          alt={product.name} 
                          className={styles.image} 
                        />
                      </div>
                      <div className={styles.info}>
                        <h3 className={styles.productName}>{product.name}</h3>
                        <p className={styles.category}>{product.category}</p>
                        <PriceDisplay price={product.price} discountPrice={product.discount_price} />
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className={styles.noResults}>No products found matching your search.</p>
              )}
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
