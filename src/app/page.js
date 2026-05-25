"use client";

import { useState } from "react";
import Link from "next/link";
import { Star, Plus, Minus } from "lucide-react";
import styles from "./page.module.css";

const faqs = [
  {
    q: "How fast can I get a device delivered?",
    a: "Same-day delivery is available in all metro cities. For other locations, expect delivery within 24–48 hours. You'll get real-time tracking from the moment your order is confirmed.",
  },
  {
    q: "Is my data safe on a rented device?",
    a: "Absolutely. Every device goes through Gizzmo's mandatory Data Safe Protocol before each rental — factory reset, secure erase, BIOS clear, and a brand new user account. We are the only rental platform in India with this guarantee. We also recommend signing out of all accounts before returning.",
  },
  {
    q: "What happens if the device gets damaged?",
    a: "Every rental includes basic damage protection. For accidental damage, you'll only pay a small deductible — not the full repair cost. We also offer premium coverage plans for complete peace of mind.",
  },
  {
    q: "How is identity verification handled?",
    a: "Both renters and owners go through Aadhaar-based verification. This ensures a safe, trustworthy marketplace where every transaction is between verified individuals.",
  },
  {
    q: "Can I extend my rental period?",
    a: "Absolutely! You can extend directly from your dashboard with one tap. Extensions are prorated, so you only pay for the extra days you need.",
  },
  {
    q: "How do owners list their devices?",
    a: "Listing is free and takes under 2 minutes. Just upload photos, set your daily rate, and define availability. We handle payments, verification, and logistics.",
  },
  {
    q: "Is there a minimum rental period?",
    a: "Nope — you can rent for as little as one day. We offer daily, weekly, and monthly plans so you can pick whatever works best for your needs.",
  },
];

export default function Home() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (i) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <div className={styles.container}>
      {/* 1. Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.innerSection}>
          <div className={styles.heroContent}>
            <h1 className={styles.title}>
              Tech without the <span className={styles.highlight}>price tag</span>.
            </h1>
            <p className={styles.subtitle}>
              Rent premium laptops, cameras, drones, and more for a fraction of the cost.
              Delivered straight to your doorstep.
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
            <img src="/chatgpt.png" alt="Electronic devices" className={styles.heroImage} />
          </div>
        </div>
      </section>

      {/* 2. How Gizzmo Works Section */}
      <section className={styles.howItWorksSection}>
        <div className={styles.innerSectionColumn}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>How Gizzmo Works ♻️</h2>
            <p className={styles.sectionSubtitle}>
              A simple, secure, and profitable circular lifecycle for both renters and owners.
            </p>
          </div>
          <div className={styles.infographicContainer}>
            <img 
              src="/how_we_work.png" 
              alt="Gizzmo Rental Platform: How It Works Infographic" 
              className={styles.infographic}
            />
          </div>
        </div>
      </section>

      {/* 3. Why Choose Gizzmo (Advantages) Section */}
      <section className={styles.advantagesSection}>
        <div className={styles.innerSectionColumn}>
          <div className={styles.communityPill}>
            <img src="/community.png" alt="Community illustration" className={styles.communityImg} />
          </div>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Why choose Gizzmo?</h2>
            <p className={styles.sectionSubtitle}>
              A simpler, smarter, and safer tech rental marketplace built for the modern consumer.
            </p>
          </div>
          <div className={styles.advantagesGrid}>
            <div className={styles.advantageCard}>
              <span className={styles.advantageIcon}>⚡</span>
              <h3>Lightning fast delivery</h3>
              <p>Get your rented device delivered to your doorstep within hours through our hyperlocal network.</p>
            </div>
            <div className={styles.advantageCard}>
              <span className={styles.advantageIcon}>✨</span>
              <h3>Effortless process</h3>
              <p>Instant bookings, Aadhaar-verified users, and standard paperless flows—designed to be frictionless.</p>
            </div>
            <div className={styles.advantageCard}>
              <span className={styles.advantageIcon}>♻️</span>
              <h3>Sustainable choice</h3>
              <p>Renting instead of buying reduces electronic waste, supporting a cleaner circular economy.</p>
            </div>
            <div className={styles.advantageCard}>
              <span className={styles.advantageIcon}>🛡️</span>
              <h3>Damage protection</h3>
              <p>Accidental damage coverage and secure handovers on every transaction for ultimate peace of mind.</p>
            </div>
            <div className={styles.advantageCard}>
              <span className={styles.advantageIcon}>🤝</span>
              <h3>Community first</h3>
              <p>Connecting tech enthusiasts and local retailers who care about quality and secure sharing.</p>
            </div>
            <div className={styles.advantageCard}>
              <span className={styles.advantageIcon}>⭐</span>
              <h3>Ratings & reviews</h3>
              <p>Transparent peer feedback and user history ensure a reliable, verified community.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Data Safe Trust Section */}
      <section className={styles.dataSafeSection}>
        <div className={styles.innerSectionColumn}>
          <div className={styles.dataSafeBanner}>
            <div className={styles.dataSafeLeft}>
              <div className={styles.dataSafePill}>🔒 India's Only Mandatory Data Safe Protocol</div>
              <h2 className={styles.dataSafeTitle}>Your data, always safe.</h2>
              <p className={styles.dataSafeText}>
                Before every rental, devices are fully factory reset and secure wiped by our verified
                retailers. We are the <strong>only electronics rental platform in India</strong> with
                this guarantee — building trust that Flipkart refurbished and OLX can never offer.
              </p>
              <p className={styles.dataSafeText}>
                We recommend signing out of all accounts before returning. For extra peace of mind,
                avoid saving sensitive passwords on rented devices.
              </p>
              <Link href="/policies#datasafe" className={styles.dataSafeLink}>
                Read the full Data Safe Protocol →
              </Link>
            </div>
            <div className={styles.dataSafeRight}>
              <div className={styles.dataSafeStep}>
                <div className={styles.dataSafeIcon}>🖥️</div>
                <div>
                  <strong>Factory Reset</strong>
                  <span>All files wiped before every rental</span>
                </div>
              </div>
              <div className={styles.dataSafeStep}>
                <div className={styles.dataSafeIcon}>🛡️</div>
                <div>
                  <strong>Secure Erase</strong>
                  <span>Deleted files overwritten, unrecoverable</span>
                </div>
              </div>
              <div className={styles.dataSafeStep}>
                <div className={styles.dataSafeIcon}>👤</div>
                <div>
                  <strong>Fresh User Account</strong>
                  <span>New clean account for every renter</span>
                </div>
              </div>
              <div className={styles.dataSafeStep}>
                <div className={styles.dataSafeIcon}>📷</div>
                <div>
                  <strong>Camera SD Card Cleared</strong>
                  <span>SD removed or formatted before rental</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Testimonials Section */}
      <section className={styles.testimonialsSection}>
        <div className={styles.innerSectionColumn}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>What our users say</h2>
            <p className={styles.sectionSubtitle}>Real reviews from renters and store owners in our community.</p>
          </div>
          <div className={styles.reviewsGrid}>
            <div className={styles.reviewCard}>
              <div className={styles.stars}>
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
              </div>
              <p className={styles.reviewText}>
                "Needed a Macbook for a hackathon. Gizzmo saved my life! Super smooth process and the device was brand new."
              </p>
              <span className={styles.reviewAuthor}>— Rahul S. (Student)</span>
            </div>
            <div className={styles.reviewCard}>
              <div className={styles.stars}>
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
              </div>
              <p className={styles.reviewText}>
                "As a store owner, my unsold inventory was gathering dust. Now I make passive income every week! Highly recommend."
              </p>
              <span className={styles.reviewAuthor}>— Amit's Electronics</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FAQ Section */}
      <section className={styles.faqSection}>
        <div className={styles.innerSection}>
          <div className={styles.faqSidebar}>
            <h2 className={styles.faqTitle}>FAQ</h2>
            <p className={styles.faqSubtitle}>
              Frequently asked questions about our platform, security, and rentals.
            </p>
          </div>
          <div className={styles.faqAccordion}>
            {faqs.map((item, i) => (
              <div
                key={i}
                className={`${styles.faqItem} ${openIndex === i ? styles.faqItemOpen : ""}`}
              >
                <button 
                  className={styles.faqQuestion} 
                  onClick={() => toggleFAQ(i)}
                  suppressHydrationWarning
                >
                  <span>{item.q}</span>
                  <span className={styles.faqToggleIcon}>
                    {openIndex === i ? <Minus size={20} /> : <Plus size={20} />}
                  </span>
                </button>
                <div
                  className={styles.faqAnswer}
                  style={{
                    maxHeight: openIndex === i ? "200px" : "0",
                  }}
                >
                  <p>{item.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
