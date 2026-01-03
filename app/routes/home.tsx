import { Link, useLoaderData, type LoaderFunctionArgs } from "react-router";
import type { Route } from "./+types/home";
import { Header } from "~/components/header";
import { Footer } from "~/components/footer";
import { PriceDisplay } from "~/components/price-display";
import { getActiveProducts } from "~/services/products.service";
import { getSiteSettings } from "~/services/site-settings.service";
import { useCart } from "~/hooks/use-cart";
import styles from "./home.module.css";

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const [products, siteSettings] = await Promise.all([
      getActiveProducts(),
      getSiteSettings(),
    ]);
    // Filter bestsellers (first 4 products for demo)
    const bestsellers = products.slice(0, 4);
    return { bestsellers, siteSettings, error: null };
  } catch (error) {
    console.error("Error loading home page:", error);
    return { bestsellers: [], siteSettings: null, error: "Failed to load products" };
  }
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Lumière - Luxury Artificial Jewelry" },
    {
      name: "description",
      content:
        "Discover our curated collection of premium artificial jewelry. Earrings, necklaces, rings, and bracelets crafted with elegance.",
    },
  ];
}

const categories = [
  {
    name: "Earrings",
    slug: "earrings",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80",
  },
  {
    name: "Necklaces",
    slug: "necklaces",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80",
  },
  {
    name: "Rings",
    slug: "rings",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80",
  },
  {
    name: "Bracelets",
    slug: "bracelets",
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80",
  },
];

const instagramImages = [
  "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80",
  "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&q=80",
  "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80",
  "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&q=80",
  "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=80",
  "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=600&q=80",
];

function LoadingProducts() {
  return (
    <div className={styles.products}>
      {[1, 2, 3, 4].map((i) => (
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

export default function Home() {
  const { bestsellers, siteSettings, error } = useLoaderData<typeof loader>();
  const { getTotalItems } = useCart();
  const cartItemCount = getTotalItems();

  const heroImage = siteSettings?.hero_banner_url || "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1600&q=80";
  const heroHeading = siteSettings?.hero_heading || "TIMELESS ELEGANCE";
  const heroSubheading = siteSettings?.hero_subheading || "Curated Collection";

  return (
    <div className={styles.container}>
      <Header 
        cartItemCount={cartItemCount}
        brandName={siteSettings?.brand_name}
        logoUrl={siteSettings?.logo_url || undefined}
        announcementText={siteSettings?.announcement_text || undefined}
        announcementBehavior={siteSettings?.announcement_behavior}
      />

      <section className={styles.hero}>
        <img
          src={heroImage}
          alt="Hero banner"
          className={styles.heroImage}
        />
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>{heroHeading}</h1>
          <p className={styles.heroSubtitle}>{heroSubheading}</p>
          <Link to="/shop" className={styles.heroButton}>
            Explore Collection
          </Link>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Categories</h2>
        <div className={styles.categories}>
          {categories.map((category) => (
            <Link key={category.slug} to={`/shop?category=${category.slug}`} className={styles.categoryCard}>
              <img src={category.image} alt={category.name} className={styles.categoryImage} />
              <div className={styles.categoryOverlay}>
                <h3 className={styles.categoryName}>{category.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Bestsellers</h2>
        {error ? (
          <div className={styles.emptyState}>
            <p className={styles.errorText}>Unable to load products at this time.</p>
            <p>Please try again later or contact support if the issue persists.</p>
          </div>
        ) : bestsellers.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No products available at the moment.</p>
            <p>Please check back later.</p>
          </div>
        ) : (
          <div className={styles.products}>
            {bestsellers.map((product) => (
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
        )}
      </section>

      <section className={`${styles.section} ${styles.instagram}`}>
        <h2 className={styles.sectionTitle}>Follow Us @lumiere</h2>
        <div className={styles.instagramGrid}>
          {instagramImages.map((image, index) => (
            <a
              key={index}
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.instagramImage}
            >
              <img src={image} alt={`Instagram post ${index + 1}`} />
            </a>
          ))}
        </div>
      </section>

      <Footer 
        brandName={siteSettings?.brand_name}
        contactEmail={siteSettings?.contact_email || undefined}
        contactPhone={siteSettings?.contact_phone || undefined}
        socialLinks={siteSettings?.social_links}
      />
    </div>
  );
}
