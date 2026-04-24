"use client";
import { useState } from 'react';
import Link from 'next/link';
import { Star, ShieldCheck, CheckCircle, Info, ShoppingCart, ChevronsRight, Store } from 'lucide-react';
import styles from './product.module.css';

export default function ProductPage() {
  const [days, setDays] = useState(3);
  
  // Dummy product data
  const product = {
    name: "MacBook Pro M2 14-inch (2023) | 16GB Unified RAM | 512GB SSD | Pristine Condition",
    brand: "Apple",
    description: "Supercharged by M2 Pro, this MacBook Pro is perfect for heavy tasks like video editing, coding, and 3D rendering. Pristine condition with no scratches.",
    pricePerDay: 400,
    damageDeposit: 5000,
    owner: {
      name: "Amit's Electronics",
      rating: 4.8,
      verified: true
    },
    specs: {
      "Processor": "Apple M2 Pro",
      "RAM": "16GB Unified",
      "Storage": "512GB SSD",
      "Display": "14.2-inch Liquid Retina XDR"
    },
    manufactureDate: "Feb 2023",
    rentedCount: 14,
    rating: 4.3,
    totalRatings: 27190,
    totalReviews: 12862
  };

  const durationOptions = [3, 5, 7, 14, 30];

  return (
    <div className={styles.container}>
      
      {/* Left Column (Images & Actions) */}
      <div className={styles.leftColumn}>
        <div className={styles.imageGalleryWrapper}>
          <div className={styles.thumbnailGallery}>
            <div className={`${styles.thumbnail} ${styles.activeThumb}`}>💻</div>
            <div className={styles.thumbnail}>⌨️</div>
            <div className={styles.thumbnail}>🔋</div>
          </div>
          <div className={styles.mainImage}>
            💻 MacBook Pro
          </div>
        </div>

        <div className={styles.actionButtons}>
          <button className={styles.addToCartBtn}>
            <ShoppingCart size={20} /> Add to Cart
          </button>
          <Link href="/checkout" className={styles.bookNowBtn}>
            <ChevronsRight size={20} /> Book Now
          </Link>
        </div>
      </div>

      {/* Right Column (Details Cards) */}
      <div className={styles.rightColumn}>
        
        {/* Card 1: Title & Price */}
        <div className={styles.card}>
          <h1 className={styles.title}>{product.name}</h1>
          <div className={styles.priceRow}>
            <span className={styles.rupee}>₹</span>
            <span className={styles.price}>{product.pricePerDay}</span>
            <span className={styles.perDay}>/ day</span>
            <Info size={16} className={styles.infoIcon} title="Plus refundable damage deposit"/>
          </div>
          <div className={styles.ratingBadgeWrapper}>
            <div className={styles.ratingBadge}>
              {product.rating} <Star size={12} fill="#fff" />
            </div>
            <span className={styles.ratingText}>
              {product.totalRatings.toLocaleString()} Ratings, {product.totalReviews.toLocaleString()} Reviews
            </span>
          </div>
        </div>

        {/* Card 2: Select Duration */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Select Duration (Days)</h2>
          <div className={styles.durationPills}>
            {durationOptions.map(opt => (
              <button 
                key={opt}
                className={`${styles.pill} ${days === opt ? styles.activePill : ''}`}
                onClick={() => setDays(opt)}
              >
                {opt} Days
              </button>
            ))}
          </div>
        </div>

        {/* Card 3: Product Highlights */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Device Highlights</h2>
          <div className={styles.highlightsGrid}>
            <div className={styles.highlightItem}>
              <span className={styles.highlightLabel}>Brand</span>
              <span className={styles.highlightValue}>{product.brand}</span>
            </div>
            <div className={styles.highlightItem}>
              <span className={styles.highlightLabel}>Mfg Date</span>
              <span className={styles.highlightValue}>{product.manufactureDate}</span>
            </div>
            <div className={styles.highlightItem}>
              <span className={styles.highlightLabel}>Damage Deposit</span>
              <span className={styles.highlightValue}>₹{product.damageDeposit} (Refundable)</span>
            </div>
            <div className={styles.highlightItem}>
              <span className={styles.highlightLabel}>Times Rented</span>
              <span className={styles.highlightValue}>{product.rentedCount} successful rentals</span>
            </div>
          </div>
          
          <div className={styles.divider}></div>
          <h3 className={styles.subTitle}>Additional Details</h3>
          <p className={styles.description}>{product.description}</p>
          <ul className={styles.specList}>
            {Object.entries(product.specs).map(([k, v]) => (
              <li key={k}><strong>{k}:</strong> {v}</li>
            ))}
          </ul>
        </div>

        {/* Card 4: Owned By */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Owned By</h2>
          <div className={styles.ownerRow}>
            <div className={styles.ownerAvatar}>
              <Store size={24} color="#555" />
            </div>
            <div className={styles.ownerInfo}>
              <h3 className={styles.ownerName}>{product.owner.name}</h3>
              {product.owner.verified && (
                <span className={styles.verifiedTag}>
                  <CheckCircle size={14} color="#008000" /> Verified Partner
                </span>
              )}
            </div>
            <button className={styles.viewShopBtn}>View Shop</button>
          </div>
        </div>

        {/* Card 5: Ratings & Reviews */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Device Ratings & Reviews</h2>
          <div className={styles.reviewSummary}>
            <div className={styles.reviewLeft}>
              <div className={styles.hugeRating}>
                {product.rating} <Star size={24} fill="#038d63" color="#038d63"/>
              </div>
              <p className={styles.ratingTextSmall}>
                {product.totalRatings.toLocaleString()} Ratings,<br/>
                {product.totalReviews.toLocaleString()} Reviews
              </p>
            </div>
            <div className={styles.reviewRight}>
              {/* Bar Charts */}
              <div className={styles.barRow}>
                <span>Excellent</span>
                <div className={styles.barBg}><div className={styles.barFill} style={{width: '60%', backgroundColor: '#038d63'}}></div></div>
                <span>14975</span>
              </div>
              <div className={styles.barRow}>
                <span>Very Good</span>
                <div className={styles.barBg}><div className={styles.barFill} style={{width: '30%', backgroundColor: '#038d63'}}></div></div>
                <span>6996</span>
              </div>
              <div className={styles.barRow}>
                <span>Good</span>
                <div className={styles.barBg}><div className={styles.barFill} style={{width: '10%', backgroundColor: '#f5a623'}}></div></div>
                <span>2634</span>
              </div>
              <div className={styles.barRow}>
                <span>Average</span>
                <div className={styles.barBg}><div className={styles.barFill} style={{width: '3%', backgroundColor: '#f5a623'}}></div></div>
                <span>707</span>
              </div>
              <div className={styles.barRow}>
                <span>Poor</span>
                <div className={styles.barBg}><div className={styles.barFill} style={{width: '5%', backgroundColor: '#d32f2f'}}></div></div>
                <span>1878</span>
              </div>
            </div>
          </div>

          <div className={styles.divider}></div>
          
          <div className={styles.userReview}>
            <div className={styles.reviewUser}><div className={styles.userAvatar}>R</div> Rahul S.</div>
            <div className={styles.reviewBadgeDate}>
              <span className={styles.ratingBadge}>5.0 <Star size={10} fill="#fff"/></span>
              <span className={styles.reviewDate}>Posted on 19 Apr 2026</span>
            </div>
            <p className={styles.reviewText}>Good quality for the price, Device worked perfectly for my hackathon 👍</p>
          </div>
        </div>

      </div>
    </div>
  );
}
