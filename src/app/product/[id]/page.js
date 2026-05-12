"use client";
import { useState, useEffect } from 'react';
import { use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Star, CheckCircle, Info, ShoppingCart, ChevronsRight, Store, Tag, Check } from 'lucide-react';
import styles from './product.module.css';
import { useCart } from '@/context/CartContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function ProductPage({ params }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const router = useRouter();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(3);
  const [customDays, setCustomDays] = useState('');
  const [toast, setToast] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/api/products/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then(data => {
        setProduct(data.product);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [id]);

  const handleDaysChange = (e) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val) && val >= 1) {
      setDays(val);
      setCustomDays(e.target.value);
    } else {
      setCustomDays(e.target.value);
    }
  };

  const handlePillClick = (opt) => {
    setDays(opt);
    setCustomDays('');
  };

  const handleBookNow = () => {
    const token = localStorage.getItem('gadgetgo_token');
    if (!token) {
      router.push('/login');
      return;
    }
    sessionStorage.setItem('checkout_product', JSON.stringify({
      _id: product._id,
      title: product.title,
      brand: product.brand,
      pricePerDay: product.pricePerDay,
      damageDeposit: product.damageDeposit,
      days: days,
      owner: product.owner,
    }));
    router.push('/checkout');
  };

  const handleAddToCart = () => {
    addToCart({
      _id: product._id,
      title: product.title,
      brand: product.brand,
      category: product.category,
      pricePerDay: product.pricePerDay,
      actualPrice: product.actualPrice || 0,
      damageDeposit: product.damageDeposit,
      days: days,
    });
    setToast(true);
    setTimeout(() => setToast(false), 2500);
  };

  const durationOptions = [3, 5, 7, 14, 30];

  if (loading) {
    return <div className={styles.container}><p style={{padding: '3rem', fontWeight: 700}}>Loading product...</p></div>;
  }

  if (!product) {
    return <div className={styles.container}><p style={{padding: '3rem', fontWeight: 700}}>Product not found.</p></div>;
  }

  const emojiMap = {
    laptops: '💻', cameras: '📸', phones: '📱', drones: '🚁',
    tablets: '📱', gaming: '🎮', vr: '🥽', audio: '🎧', accessories: '🔌',
  };

  const effectiveDays = customDays !== '' ? (parseInt(customDays, 10) || 1) : days;
  const estimatedRent = product.pricePerDay * effectiveDays;

  return (
    <div className={styles.container}>

      {/* Toast Notification */}
      {toast && (
        <div className={styles.toast}>
          <Check size={20} strokeWidth={3} /> Added to cart!
        </div>
      )}

      {/* Left Column (Images & Actions) */}
      <div className={styles.leftColumn}>
        <div className={styles.imageGalleryWrapper}>
          <div className={styles.mainImage}>
            {product.images?.[0] ? (
              <img src={product.images[0]} alt={product.title} />
            ) : (
              <span className={styles.emojiBig}>{emojiMap[product.category] || '📦'}</span>
            )}
          </div>
          <div className={styles.thumbnailGallery}>
            <div className={`${styles.thumbnail} ${styles.activeThumb}`}>
              {emojiMap[product.category] || '📦'}
            </div>
            {/* If there were more images, we'd map them here */}
            <div className={styles.thumbnail}>
              <Store size={24} />
            </div>
            <div className={styles.thumbnail}>
              <Info size={24} />
            </div>
          </div>
        </div>

        <div className={styles.actionButtons}>
          <button className={styles.addToCartBtn} onClick={handleAddToCart}>
            <ShoppingCart size={24} strokeWidth={3} /> Add to Cart
          </button>
          <button className={styles.bookNowBtn} onClick={handleBookNow}>
            <ChevronsRight size={24} strokeWidth={3} /> Rent Now
          </button>
        </div>
      </div>

      {/* Right Column (Details Cards) */}
      <div className={styles.rightColumn}>

        {/* Card 1: Title & Price */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.brandName}>{product.brand}</span>
            <h1 className={styles.title}>{product.title}</h1>
          </div>

          <div className={styles.ratingBadgeWrapper}>
            <div className={styles.ratingBadge}>
              {product.rating} <Star size={16} fill="#fff" />
            </div>
            <span className={styles.ratingText}>
              {(product.totalRatings || 0).toLocaleString()} Reviews &bull; {product.rentedCount}+ Rentals
            </span>
          </div>

          <div className={styles.divider}></div>

          {/* Rental Price */}
          <div className={styles.priceRow}>
            <span className={styles.rupee}>₹</span>
            <span className={styles.price}>{product.pricePerDay.toLocaleString('en-IN')}</span>
            <span className={styles.perDay}>per day</span>
          </div>

          {/* Actual / MRP Price */}
          {product.actualPrice > 0 && (
            <div className={styles.mrpRow}>
              <Tag size={18} className={styles.mrpIcon} strokeWidth={3} />
              <span className={styles.mrpLabel}>Buy New Price:</span>
              <span className={styles.mrpValue}>₹{product.actualPrice.toLocaleString('en-IN')}</span>
              <span className={styles.mrpSave}>
                Rent & Save ₹{(product.actualPrice - product.pricePerDay * effectiveDays).toLocaleString('en-IN')}!
              </span>
            </div>
          )}
        </div>

        {/* Card 2: Select Duration */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Choose Rental Duration</h2>

          {/* Preset Pills */}
          <div className={styles.durationPills}>
            {durationOptions.map(opt => (
              <button
                key={opt}
                className={`${styles.pill} ${days === opt && customDays === '' ? styles.activePill : ''}`}
                onClick={() => handlePillClick(opt)}
              >
                {opt} Days
              </button>
            ))}
          </div>

          {/* Custom Days Input */}
          <div className={styles.customDaysRow}>
            <label className={styles.customDaysLabel} htmlFor="customDays">
              Need it for more or less?
            </label>
            <input
              id="customDays"
              type="number"
              min="1"
              max="365"
              placeholder="Qty"
              className={styles.customDaysInput}
              value={customDays}
              onChange={handleDaysChange}
            />
            <span className={styles.customDaysUnit}>days</span>
          </div>

          <div className={styles.estimateRow}>
            <span>
              Total Rental for <strong>{effectiveDays} days</strong>:
            </span>
            <strong className={styles.estimateAmount}>₹{estimatedRent.toLocaleString('en-IN')}</strong>
            <span className={styles.estimateDeposit}>
              + ₹{product.damageDeposit.toLocaleString('en-IN')} refundable security deposit
            </span>
          </div>
        </div>

        {/* Card 3: Product Highlights */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Tech Specs & Info</h2>
          <div className={styles.highlightsGrid}>
            <div className={styles.highlightItem}>
              <span className={styles.highlightLabel}>Condition</span>
              <span className={styles.highlightValue}>Excellent / Like New</span>
            </div>
            <div className={styles.highlightItem}>
              <span className={styles.highlightLabel}>Delivery</span>
              <span className={styles.highlightValue}>{product.delivery || 'Tomorrow'}</span>
            </div>
            {product.manufactureDate && (
              <div className={styles.highlightItem}>
                <span className={styles.highlightLabel}>Release Year</span>
                <span className={styles.highlightValue}>{product.manufactureDate}</span>
              </div>
            )}
            <div className={styles.highlightItem}>
              <span className={styles.highlightLabel}>Security</span>
              <span className={styles.highlightValue}>Aadhaar Verified</span>
            </div>
          </div>

          <div className={styles.divider}></div>
          <h3 className={styles.subTitle}>About this device</h3>
          <p className={styles.description}>{product.description}</p>

          {product.specs && Object.keys(product.specs).length > 0 && (
            <>
              <h3 className={styles.subTitle}>Technical Details</h3>
              <ul className={styles.specList}>
                {Object.entries(product.specs).map(([k, v]) => (
                  <li key={k}><strong>{k}:</strong> {v}</li>
                ))}
              </ul>
            </>
          )}
        </div>

        {/* Card 4: Owned By */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Listed By</h2>
          <div className={styles.ownerRow}>
            <div className={styles.ownerAvatar}>
              <Store size={40} color="#000" strokeWidth={2.5} />
            </div>
            <div className={styles.ownerInfo}>
              <h3 className={styles.ownerName}>{product.owner?.name || 'Gizzmo Certified Store'}</h3>
              <div className={styles.verifiedTag}>
                <CheckCircle size={16} strokeWidth={3} /> Gizzmo Verified Partner
              </div>
            </div>
            <button className={styles.viewShopBtn}>Explore Shop</button>
          </div>
        </div>

        {/* Card 5: Ratings & Reviews */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Customer Feedback</h2>
          <div className={styles.reviewSummary}>
            <div className={styles.reviewLeft}>
              <div className={styles.hugeRating}>
                {product.rating} <Star size={40} fill="#000" strokeWidth={3}/>
              </div>
              <p className={styles.ratingTextSmall}>
                Based on {(product.totalRatings || 0).toLocaleString()} rentals
              </p>
            </div>
            <div className={styles.reviewRight}>
              <div className={styles.barRow}>
                <span>5 Star</span>
                <div className={styles.barBg}><div className={styles.barFill} style={{width: '75%', backgroundColor: 'var(--tea-green)'}}></div></div>
              </div>
              <div className={styles.barRow}>
                <span>4 Star</span>
                <div className={styles.barBg}><div className={styles.barFill} style={{width: '15%', backgroundColor: 'var(--lavender-veil)'}}></div></div>
              </div>
              <div className={styles.barRow}>
                <span>3 Star</span>
                <div className={styles.barBg}><div className={styles.barFill} style={{width: '7%', backgroundColor: 'var(--lime-cream)'}}></div></div>
              </div>
              <div className={styles.barRow}>
                <span>2 Star</span>
                <div className={styles.barBg}><div className={styles.barFill} style={{width: '2%', backgroundColor: '#eee'}}></div></div>
              </div>
              <div className={styles.barRow}>
                <span>1 Star</span>
                <div className={styles.barBg}><div className={styles.barFill} style={{width: '1%', backgroundColor: '#eee'}}></div></div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
