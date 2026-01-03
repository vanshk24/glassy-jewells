import { Link } from "react-router";
import { Instagram, Facebook, Twitter, Linkedin, Youtube } from "lucide-react";
import styles from "./footer.module.css";

interface FooterProps {
  className?: string;
  brandName?: string;
  contactEmail?: string;
  contactPhone?: string;
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    youtube?: string;
  };
}

/**
 * Site footer with newsletter, links, and social media
 */
export function Footer({ className, brandName, contactEmail, contactPhone, socialLinks }: FooterProps) {
  const displayBrandName = brandName || "Lumière";
  return (
    <footer className={`${styles.footer} ${className || ""}`}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.section}>
            <h3 className={styles.title}>Newsletter</h3>
            <p className={styles.link}>Exclusive updates and offers</p>
            <form className={styles.newsletterForm}>
              <input type="email" placeholder="Enter your email" className={styles.newsletterInput} />
              <button type="submit" className={styles.newsletterButton}>
                Subscribe
              </button>
            </form>
          </div>

          <div className={styles.section}>
            <h3 className={styles.title}>Shop</h3>
            <Link to="/shop?category=earrings" className={styles.link}>
              Earrings
            </Link>
            <Link to="/shop?category=necklaces" className={styles.link}>
              Necklaces
            </Link>
            <Link to="/shop?category=rings" className={styles.link}>
              Rings
            </Link>
            <Link to="/shop?category=bracelets" className={styles.link}>
              Bracelets
            </Link>
          </div>

          <div className={styles.section}>
            <h3 className={styles.title}>Information</h3>
            <Link to="/about" className={styles.link}>
              About Us
            </Link>
            <Link to="/contact" className={styles.link}>
              Contact
            </Link>
            <a href="#" className={styles.link}>
              Shipping Policy
            </a>
            <a href="#" className={styles.link}>
              Returns & Exchanges
            </a>
          </div>

          <div className={styles.section}>
            <h3 className={styles.title}>Contact</h3>
            {contactEmail && (
              <a href={`mailto:${contactEmail}`} className={styles.link}>
                {contactEmail}
              </a>
            )}
            {contactPhone && (
              <a href={`tel:${contactPhone}`} className={styles.link}>
                {contactPhone}
              </a>
            )}
            {socialLinks && (
              <div className={styles.social}>
                {socialLinks.instagram && (
                  <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Instagram">
                    <Instagram className={styles.socialIcon} />
                  </a>
                )}
                {socialLinks.facebook && (
                  <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Facebook">
                    <Facebook className={styles.socialIcon} />
                  </a>
                )}
                {socialLinks.twitter && (
                  <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Twitter">
                    <Twitter className={styles.socialIcon} />
                  </a>
                )}
                {socialLinks.linkedin && (
                  <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="LinkedIn">
                    <Linkedin className={styles.socialIcon} />
                  </a>
                )}
                {socialLinks.youtube && (
                  <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="YouTube">
                    <Youtube className={styles.socialIcon} />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        <div className={styles.bottom}>
          <p>&copy; {new Date().getFullYear()} {displayBrandName}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
