"use client";

import styles from "./HowItWorks.module.css";

export default function HowItWorks() {
  return (
    <section className={styles.section}>
      <div className={styles.headerBox}>
        <h2>How Gizzmo Works ♻️</h2>
        <p>A simple, secure, and profitable cycle for both renters and retailers.</p>
      </div>

      <div className={styles.imageContainer}>
        <img 
          src="/how_we_work.jpg" 
          alt="Gizzmo Rental Platform: How It Works Infographic" 
          className={styles.infographic}
        />
      </div>
    </section>
  );
}
