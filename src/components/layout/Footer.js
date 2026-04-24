import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.section}>
          <h3 className={styles.brand}>Gadget<span className={styles.accent}>Go</span></h3>
          <p className={styles.tagline}>Rent the best tech, for less.</p>
          <div className={styles.socials}>
            <Link href="#" className={styles.socialIcon}>Facebook</Link>
            <Link href="#" className={styles.socialIcon}>Twitter</Link>
            <Link href="#" className={styles.socialIcon}>Instagram</Link>
          </div>

        </div>
        <div className={styles.section}>
          <h4 className={styles.heading}>Rent</h4>
          <Link href="/category/laptops" className={styles.link}>Laptops</Link>
          <Link href="/category/cameras" className={styles.link}>Cameras</Link>
          <Link href="/category/drones" className={styles.link}>Drones</Link>
          <Link href="/category/phones" className={styles.link}>Phones</Link>
        </div>
        <div className={styles.section}>
          <h4 className={styles.heading}>Company</h4>
          <Link href="/about" className={styles.link}>About Us</Link>
          <Link href="/owner" className={styles.link}>List Your Device</Link>
          <Link href="/contact" className={styles.link}>Contact</Link>
        </div>
        <div className={styles.section}>
          <h4 className={styles.heading}>Support</h4>
          <Link href="/faq" className={styles.link}>FAQ</Link>
          <Link href="/terms" className={styles.link}>Terms of Service</Link>
          <Link href="/privacy" className={styles.link}>Privacy Policy</Link>
        </div>
      </div>
      <div className={styles.bottom}>
        <p>&copy; {new Date().getFullYear()} GadgetGo. All rights reserved.</p>
      </div>
    </footer>
  );
}
