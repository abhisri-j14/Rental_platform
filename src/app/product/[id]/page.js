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
          <Check size={16} /> Added to cart!
        </div>
      )}

      {/* Left Column (Images & Actions) */}
      <div className={styles.leftColumn}>
        <div className={styles.imageGalleryWrapper}>
          <div className={styles.thumbnailGallery}>
            <div className={`${styles.thumbnail} ${styles.activeThumb}`}>
              {emojiMap[product.category] || '📦'}
            </div>
          </div>
          <div className={styles.mainImage}>
            {emojiMap[product.category] || '📦'} {product.brand}
          </div>
        </div>

        <div className={styles.actionButtons}>
          <button className={styles.addToCartBtn} onClick={handleAddToCart}>
            <ShoppingCart size={20} /> Add to Cart
          </button>
          <button className={styles.bookNowBtn} onClick={handleBookNow}>
            <ChevronsRight size={20} /> Rent Now
          </button>
        </div>
      </div>

      {/* Right Column (Details Cards) */}
      <div className={styles.rightColumn}>

        {/* Card 1: Title & Price */}
        <div className={styles.card}>
          <h1 className={styles.title}>{product.title}</h1>

          {/* Rental Price */}
          <div className={styles.priceRow}>
            <span className={styles.rupee}>₹</span>
            <span className={styles.price}>{product.pricePerDay.toLocaleString('en-IN')}</span>
            <span className={styles.perDay}>/ day</span>
            <Info size={16} className={styles.infoIcon} title="Plus refundable damage deposit"/>
          </div>

          {/* Actual / MRP Price */}
          {product.actualPrice > 0 && (
            <div className={styles.mrpRow}>
              <Tag size={13} className={styles.mrpIcon} />
              <span className={styles.mrpLabel}>Market Price (if you buy):</span>
              <span className={styles.mrpValue}>₹{product.actualPrice.toLocaleString('en-IN')}</span>
              <span className={styles.mrpSave}>
                Save ₹{(product.actualPrice - product.pricePerDay * 30).toLocaleString('en-IN')} over a month!
              </span>
            </div>
          )}

          <div className={styles.ratingBadgeWrapper}>
            <div className={styles.ratingBadge}>
              {product.rating} <Star size={12} fill="#fff" />
            </div>
            <span className={styles.ratingText}>
              {(product.totalRatings || 0).toLocaleString()} Ratings
            </span>
          </div>
        </div>

        {/* Card 2: Select Duration */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Select Rental Duration</h2>

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
              Or enter custom days:
            </label>
            <input
              id="customDays"
              type="number"
              min="1"
              max="365"
              placeholder="e.g. 21"
              className={styles.customDaysInput}
              value={customDays}
              onChange={handleDaysChange}
            />
            <span className={styles.customDaysUnit}>days</span>
          </div>

          <div className={styles.estimateRow}>
            <span>
              Rental for <strong>{effectiveDays} day{effectiveDays !== 1 ? 's' : ''}</strong>:{' '}
              <strong className={styles.estimateAmount}>₹{estimatedRent.toLocaleString('en-IN')}</strong>
            </span>
            <span className={styles.estimateDeposit}>
              + ₹{product.damageDeposit.toLocaleString('en-IN')} refundable deposit
            </span>
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
            {product.actualPrice > 0 && (
              <div className={styles.highlightItem}>
                <span className={styles.highlightLabel}>Device Market Value</span>
                <span className={styles.highlightValue}>₹{product.actualPrice.toLocaleString('en-IN')}</span>
              </div>
            )}
            {product.manufactureDate && (
              <div className={styles.highlightItem}>
                <span className={styles.highlightLabel}>Mfg Date</span>
                <span className={styles.highlightValue}>{product.manufactureDate}</span>
              </div>
            )}
            <div className={styles.highlightItem}>
              <span className={styles.highlightLabel}>Damage Deposit</span>
              <span className={styles.highlightValue}>₹{product.damageDeposit.toLocaleString('en-IN')} (Refundable)</span>
            </div>
            <div className={styles.highlightItem}>
              <span className={styles.highlightLabel}>Times Rented</span>
              <span className={styles.highlightValue}>{product.rentedCount} successful rentals</span>
            </div>
          </div>

          <div className={styles.divider}></div>
          <h3 className={styles.subTitle}>Description</h3>
          <p className={styles.description}>{product.description}</p>

          {product.specs && Object.keys(product.specs).length > 0 && (
            <>
              <h3 className={styles.subTitle}>Specifications</h3>
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
          <h2 className={styles.cardTitle}>Owned By</h2>
          <div className={styles.ownerRow}>
            <div className={styles.ownerAvatar}>
              <Store size={24} color="#555" />
            </div>
            <div className={styles.ownerInfo}>
              <h3 className={styles.ownerName}>{product.owner?.name || 'GadgetGo Partner'}</h3>
              <span className={styles.verifiedTag}>
                <CheckCircle size={14} color="#008000" /> Verified Partner
              </span>
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
                {(product.totalRatings || 0).toLocaleString()} Ratings
              </p>
            </div>
            <div className={styles.reviewRight}>
              <div className={styles.barRow}>
                <span>Excellent</span>
                <div className={styles.barBg}><div className={styles.barFill} style={{width: '60%', backgroundColor: '#038d63'}}></div></div>
              </div>
              <div className={styles.barRow}>
                <span>Very Good</span>
                <div className={styles.barBg}><div className={styles.barFill} style={{width: '25%', backgroundColor: '#038d63'}}></div></div>
              </div>
              <div className={styles.barRow}>
                <span>Good</span>
                <div className={styles.barBg}><div className={styles.barFill} style={{width: '10%', backgroundColor: '#f5a623'}}></div></div>
              </div>
              <div className={styles.barRow}>
                <span>Average</span>
                <div className={styles.barBg}><div className={styles.barFill} style={{width: '3%', backgroundColor: '#f5a623'}}></div></div>
              </div>
              <div className={styles.barRow}>
                <span>Poor</span>
                <div className={styles.barBg}><div className={styles.barFill} style={{width: '2%', backgroundColor: '#d32f2f'}}></div></div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
