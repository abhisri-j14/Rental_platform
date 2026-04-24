"use client";
import Link from 'next/link';
import { Check, X, Trophy, Sparkles } from 'lucide-react';
import styles from './compare.module.css';

export default function ComparePage() {
  const devices = [
    {
      id: 1,
      name: "Dell XPS 15",
      image: "💻",
      price: 500,
      rating: 4.8,
      specs: {
        Processor: "Intel Core i7 13th Gen",
        RAM: "16GB DDR5",
        Display: "15.6\" OLED Touch",
        Battery: "Up to 14 hours"
      },
      vibe: "The Professional's Choice 👔",
      sponsorTier: "gold",
      tagline: "Sleek, powerful, and ready for business."
    },
    {
      id: 2,
      name: "Lenovo Legion Pro 5",
      image: "🎮",
      price: 450,
      rating: 4.7,
      specs: {
        Processor: "AMD Ryzen 7 7745HX",
        RAM: "16GB DDR5",
        Display: "16\" WQXGA 165Hz",
        Battery: "Up to 6 hours"
      },
      vibe: "The Gamer's Beast 🐉",
      sponsorTier: "silver",
      tagline: "Destroy your enemies, not your wallet."
    },
    {
      id: 3,
      name: "HP Envy x360",
      image: "🎨",
      price: 350,
      rating: 4.5,
      specs: {
        Processor: "Intel Core i5 13th Gen",
        RAM: "8GB DDR4",
        Display: "15.6\" FHD Touch (2-in-1)",
        Battery: "Up to 11 hours"
      },
      vibe: "The Creative Flexer 🤸",
      sponsorTier: "none",
      tagline: "Bend it like Beckham, create like Picasso."
    }
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>The Ultimate Showdown 🥊</h1>
        <p>Compare devices side-by-side. No rivalries here, just pure facts (and maybe a little fun).</p>
      </div>

      <div className={styles.compareGrid}>
        {/* Empty top-left corner */}
        <div className={styles.cornerCell}></div>

        {/* Device Headers */}
        {devices.map(device => (
          <div key={`header-${device.id}`} className={`${styles.deviceHeader} ${styles[device.sponsorTier]}`}>
            {device.sponsorTier === 'gold' && <div className={styles.sponsorBadge}><Sparkles size={14}/> Top Pick</div>}
            <div className={styles.imagePlaceholder}>{device.image}</div>
            <h2>{device.name}</h2>
            <p className={styles.tagline}>{device.tagline}</p>
            <div className={styles.vibe}>{device.vibe}</div>
            <Link href={`/product/${device.id}`} className={styles.bookBtn}>Rent from Rs {device.price}/day</Link>
          </div>
        ))}

        {/* Rows */}
        <div className={styles.rowLabel}>Rating</div>
        {devices.map(device => (
          <div key={`rating-${device.id}`} className={styles.cell}>
            <span className={styles.ratingText}>⭐ {device.rating}/5.0</span>
          </div>
        ))}

        <div className={styles.rowLabel}>Processor</div>
        {devices.map(device => (
          <div key={`cpu-${device.id}`} className={styles.cell}>{device.specs.Processor}</div>
        ))}

        <div className={styles.rowLabel}>RAM</div>
        {devices.map(device => (
          <div key={`ram-${device.id}`} className={styles.cell}>{device.specs.RAM}</div>
        ))}

        <div className={styles.rowLabel}>Display</div>
        {devices.map(device => (
          <div key={`disp-${device.id}`} className={styles.cell}>{device.specs.Display}</div>
        ))}

        <div className={styles.rowLabel}>Battery Life</div>
        {devices.map(device => (
          <div key={`batt-${device.id}`} className={styles.cell}>{device.specs.Battery}</div>
        ))}

        <div className={styles.rowLabel}>Can run Crysis?</div>
        {devices.map(device => (
          <div key={`crysis-${device.id}`} className={styles.cell}>
            {device.id === 2 ? <Check color="green" size={28}/> : (device.id === 1 ? "Maybe? 🤷‍♂️" : <X color="red" size={28}/>)}
          </div>
        ))}
      </div>

      <div className={styles.disclaimer}>
        * Comparison is for entertainment and educational purposes. GadgetGo loves all brands equally (but we love the ones that sponsor us a tiny bit more 😉).
      </div>
    </div>
  );
}
