import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star, ShieldCheck, Zap } from "lucide-react";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>
            Tech without the <span className={styles.highlight}>price tag</span>.
          </h1>
          <p className={styles.subtitle}>
            Rent premium laptops, cameras, drones, and more for a fraction of the cost. 
            Delivered to your door.
          </p>
          <div className={styles.ctaGroup}>
            <Link href="/category/all" className={styles.primaryBtn}>
              Start Renting
            </Link>
            <Link href="/compare" className={styles.secondaryBtn}>
              Compare Devices
            </Link>
            <Link href="/owner" className={styles.secondaryBtn}>
              List Your Device
            </Link>
          </div>
        </div>
        <div className={styles.heroImageContainer}>
          <div className={styles.gadgetMockup}>
            <div className={styles.mockupScreen}>
              <div className={styles.mockupText}>Use a Macbook for 3 days at Rs 1500!</div>
            </div>
          </div>
        </div>
      </section>

      {/* Promotions */}
      <section className={styles.promos}>
        <div className={styles.promoCard}>
          <h3>📸 DSLR Cameras</h3>
          <p>Brand new DSLRs with 30% off renting price this weekend.</p>
        </div>
        <div className={`${styles.promoCard} ${styles.promoCardAlt}`}>
          <h3>💻 MacBooks</h3>
          <p>Ace your college project. Rent from Rs 300/day.</p>
        </div>
        <div className={styles.promoCard}>
          <h3>🚁 Drones</h3>
          <p>Capture memories. DJI Drones starting at Rs 500/day.</p>
        </div>
      </section>

      {/* How it Works */}
      <section className={styles.howItWorks}>
        <h2 className={styles.sectionTitle}>How GadgetGo Works</h2>
        <div className={styles.steps}>
          <div className={styles.step}>
            <div className={styles.stepIcon}><Zap size={32} /></div>
            <h3>1. Choose Device</h3>
            <p>Browse our catalog of Aadhar-verified devices from top store owners.</p>
          </div>
          <div className={styles.step}>
            <div className={styles.stepIcon}><ShieldCheck size={32} /></div>
            <h3>2. Book & Pay</h3>
            <p>Select your dates, pay securely online, and leave a refundable deposit.</p>
          </div>
          <div className={styles.step}>
            <div className={styles.stepIcon}><ArrowRight size={32} /></div>
            <h3>3. Get Delivered</h3>
            <p>We deliver the device to your doorstep. Use it, love it, and return it easily.</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className={styles.testimonials}>
        <h2 className={styles.sectionTitle}>What our users say</h2>
        <div className={styles.reviews}>
          <div className={styles.review}>
            <div className={styles.stars}>
              <Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" />
            </div>
            <p>"Needed a Macbook for a hackathon. GadgetGo saved my life! Super smooth process and the device was brand new."</p>
            <h4>- Rahul S. (Student)</h4>
          </div>
          <div className={styles.review}>
             <div className={styles.stars}>
              <Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" />
            </div>
            <p>"As a store owner, my unsold inventory was gathering dust. Now I make passive income every week! Highly recommend."</p>
            <h4>- Amit's Electronics</h4>
          </div>
        </div>
      </section>
    </div>
  );
}
