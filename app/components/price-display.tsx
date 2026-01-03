import styles from "./price-display.module.css";

interface PriceDisplayProps {
  price: number;
  discountPrice?: number | null;
  className?: string;
}

export function PriceDisplay({ price, discountPrice, className }: PriceDisplayProps) {
  const finalPrice = discountPrice || price;
  const hasDiscount = discountPrice && discountPrice < price;

  return (
    <div className={`${styles.priceDisplay} ${className || ""}`}>
      {hasDiscount && (
        <span className={styles.originalPrice}>₹{price.toLocaleString("en-IN")}</span>
      )}
      <span className={styles.finalPrice}>₹{finalPrice.toLocaleString("en-IN")}</span>
    </div>
  );
}
