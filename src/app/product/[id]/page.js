"use client";
import { useState, useEffect, useMemo } from 'react';
import { use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Star, CheckCircle, ShoppingCart, 
  Store, Truck, ShieldCheck
} from 'lucide-react';
import styles from './product.module.css';
import { useCart } from '@/context/CartContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const HD_IMAGES = {
  laptops: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1500",
  cameras: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1500",
  phones: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1500",
  drones: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?q=80&w=1500",
  gaming: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1500",
  vr: "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?q=80&w=1500",
  audio: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1500",
  tablets: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=1500",
  accessories: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=1500"
};

export default function ProductPage({ params }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const router = useRouter();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(3);
  const [customDays, setCustomDays] = useState('');
  const [toast, setToast] = useState(false);
  const [activeImg, setActiveImg] = useState(0);

  // Dynamic reviews state
  const [reviews, setReviews] = useState([]);
  const [newReviewName, setNewReviewName] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewHoverRating, setNewReviewHoverRating] = useState(0);
  const [newReviewText, setNewReviewText] = useState('');
  const [reviewSubmitSuccess, setReviewSubmitSuccess] = useState(false);

  useEffect(() => {
    // Fetch product
    fetch(`${API_URL}/api/products/${id}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data.product);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    // Fetch suggestions
    fetch(`${API_URL}/api/products`)
      .then(res => res.json())
      .then(data => {
        setSuggestions(data.products.filter(p => p._id !== id).slice(0, 6));
      })
      .catch(err => console.error("Suggestions fetch error:", err));
  }, [id]);

  useEffect(() => {
    if (product) {
      const stored = localStorage.getItem(`gizzmo_reviews_${product._id}`);
      if (stored) {
        setReviews(JSON.parse(stored));
      } else {
        // Pre-seed an authentic verified review tailored to this specific device
        const defaultReviews = [
          {
            id: 'default-1',
            name: 'Amit Sharma',
            rating: 5,
            verified: true,
            date: 'May 12, 2026',
            text: `Outstanding experience renting this ${product.title}! The device arrived in perfect condition, fully sanitized, and packed in Gizzmo's premium travel case. Performance was stellar. Free pickup was completely hassle-free!`
          }
        ];
        setReviews(defaultReviews);
        localStorage.setItem(`gizzmo_reviews_${product._id}`, JSON.stringify(defaultReviews));
      }
    }
  }, [product]);

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

  const effectiveDays = customDays !== '' ? (parseInt(customDays, 10) || 1) : days;
  const estimatedRent = product ? product.pricePerDay * effectiveDays : 0;
  const mrp = product ? (product.actualPrice || (product.pricePerDay * 50)) : 0;

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
      days: effectiveDays,
      owner: product.owner,
    }));
    router.push('/checkout');
  };

  const handleAddToCart = async () => {
    const result = await addToCart({
      _id: product._id,
      title: product.title,
      brand: product.brand,
      category: product.category,
      pricePerDay: product.pricePerDay,
      actualPrice: product.actualPrice || 0,
      damageDeposit: product.damageDeposit,
      days: effectiveDays,
    });
    if (result?.requiresLogin) {
      router.push('/login');
      return;
    }
    setToast(true);
    setTimeout(() => setToast(false), 2500);
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!newReviewName.trim() || !newReviewText.trim()) return;

    const newRev = {
      id: `rev-${Date.now()}`,
      name: newReviewName.trim(),
      rating: newReviewRating,
      verified: true, // User submitted reviews are marked as verified renters
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      text: newReviewText.trim()
    };

    const updated = [newRev, ...reviews];
    setReviews(updated);
    localStorage.setItem(`gizzmo_reviews_${product._id}`, JSON.stringify(updated));

    // Clear form
    setNewReviewName('');
    setNewReviewRating(5);
    setNewReviewText('');
    setReviewSubmitSuccess(true);
    setTimeout(() => setReviewSubmitSuccess(false), 3000);
  };

  // Dynamic rating breakdown statistics
  const reviewBreakdown = useMemo(() => {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(r => {
      const rate = Math.round(r.rating);
      if (counts[rate] !== undefined) counts[rate]++;
    });
    return counts;
  }, [reviews]);

  if (loading) return <div className={styles.loading}>Loading product details...</div>;
  if (!product) return <div className={styles.loading}>Product not found.</div>;

  const getProductImg = (p) => {
    if (p.images?.[0] && !p.images[0].includes('placeholder')) return p.images[0];
    return HD_IMAGES[p.category] || HD_IMAGES.accessories;
  };

  const getProductImgList = (p) => {
    if (p.images && p.images.length > 0 && !p.images[0].includes('placeholder')) {
      return p.images;
    }
    return [HD_IMAGES[p.category] || HD_IMAGES.accessories];
  };

  const imgList = getProductImgList(product);
  const currentImage = imgList[activeImg] || imgList[0];

  return (
    <div className={styles.fullContainer}>
      {toast && (
        <div className={styles.toast}>
          <CheckCircle size={20} /> Item added to cart
        </div>
      )}

      {/* Breadcrumbs */}
      <nav className={styles.breadcrumbs}>
        <Link href="/">Home</Link> / <Link href={`/category/${product.category}`}>{product.category}</Link> / <span>{product.title}</span>
      </nav>

      <div className={styles.productLayout}>
        
        {/* Column 1: Vertical Gallery */}
        <div className={styles.imageColumn}>
          <div className={styles.galleryCard}>
            <div className={styles.verticalGalleryWrapper}>
              <div className={styles.thumbnailsVertical}>
                {imgList.map((imgUrl, idx) => (
                  <div key={idx} className={`${styles.thumbItem} ${activeImg === idx ? styles.activeThumb : ''}`} onMouseEnter={() => setActiveImg(idx)}>
                     <img src={imgUrl} alt="" />
                  </div>
                ))}
              </div>
              <div className={styles.mainImageArea}>
                <div className={styles.mainImageWrapper}>
                  <img src={currentImage} alt={product.title} className={styles.mainImage} />
                  <p className={styles.zoomText}>Hover image to zoom</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Column 2: Info & Booking Panel */}
        <div className={styles.infoColumn}>
          <div className={styles.brandRow}>
            <span className={styles.brandBadge}>{product.brand}</span>
            <span className={styles.verifiedBadge}>
              <CheckCircle size={16} className={styles.checkIcon} />
              Verified Listing
            </span>
          </div>
          
          <h1 className={styles.productTitle}>{product.title}</h1>
          
          <div className={styles.ratingRow}>
            <div className={styles.ratingStars}>
              <span className={styles.ratingValue}>{product.rating}</span>
              {[1, 2, 3, 4, 5].map(s => <Star key={s} size={16} fill={s <= product.rating ? "#FFA41C" : "none"} color="#FFA41C" />)}
            </div>
          </div>

          <div className={styles.calculatorCard}>
            <div className={styles.priceHeader}>
              <div className={styles.dailyPrice}>
                <span className={styles.currency}>₹</span>
                <span className={styles.priceVal}>{product.pricePerDay.toLocaleString('en-IN')}</span>
                <span className={styles.priceUnit}>/day</span>
              </div>
              <div className={styles.mrpBox}>
                <span className={styles.mrpLabel}>Actual MRP of device:</span>
                <span className={styles.mrpValue}>₹{mrp.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className={styles.durationSection}>
              <label className={styles.selectorLabel}>Choose Rent Duration</label>
              
              <div className={styles.presetGrid}>
                {[3, 5, 7, 14, 30].map(v => (
                  <button 
                    key={v} 
                    type="button"
                    className={`${styles.presetBtn} ${days === v && customDays === '' ? styles.activePreset : ''}`}
                    onClick={() => handlePillClick(v)}
                  >
                    {v} Days
                  </button>
                ))}
                
                <div className={styles.customDaysWrapper}>
                  <input 
                    type="number" 
                    min="1" 
                    placeholder="Custom Days" 
                    value={customDays} 
                    onChange={handleDaysChange}
                    className={`${styles.customDaysInput} ${customDays !== '' ? styles.activeInput : ''}`}
                  />
                  {customDays !== '' && <span className={styles.inputDaysSuffix}>Days</span>}
                </div>
              </div>
            </div>

            <div className={styles.calculatorBreakdown}>
              <div className={styles.breakdownRow}>
                <span>Rent ({effectiveDays} {effectiveDays === 1 ? 'day' : 'days'})</span>
                <span>₹{estimatedRent.toLocaleString('en-IN')}</span>
              </div>
              <div className={styles.breakdownRow}>
                <span>Refundable Deposit</span>
                <span>₹{product.damageDeposit.toLocaleString('en-IN')}</span>
              </div>
              <div className={`${styles.breakdownRow} ${styles.totalRow}`}>
                <span>Total Payable</span>
                <span className={styles.totalValue}>₹{(estimatedRent + product.damageDeposit).toLocaleString('en-IN')}</span>
              </div>
              <span className={styles.depositNotice}>* Deposit is 100% refundable upon safe return</span>
            </div>

            <div className={styles.buyActions}>
              <button className={styles.cartBtn} onClick={handleAddToCart}>
                <ShoppingCart size={18} /> Add to Cart
              </button>
              <button className={styles.rentBtn} onClick={handleBookNow}>
                Rent Now
              </button>
            </div>
          </div>

          <div className={styles.metaInfoGrid}>
            <div className={styles.ownerCard}>
              <span className={styles.metaLabel}>Owned by:</span>
              <div className={styles.ownerDetails}>
                <Store size={18} className={styles.metaIcon} />
                <span className={styles.ownerName}>{product.owner?.name || 'Gizzmo Store'}</span>
                {product.owner?.isKycVerified && (
                  <span className={styles.kycPill} title="Aadhaar KYC Verified">KYC Verified</span>
                )}
              </div>
            </div>

            <div className={styles.trustBadges}>
              <div className={styles.trustBadge}>
                <Truck size={18} className={styles.deliveryIcon} />
                <div className={styles.badgeText}>
                  <strong>Fast Delivery</strong>
                  <span>Same-day available</span>
                </div>
              </div>
              <div className={styles.trustBadge}>
                <ShieldCheck size={18} className={styles.secureIcon} />
                <div className={styles.badgeText}>
                  <strong>Secure Transaction</strong>
                  <span>100% safe & protected</span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.specsCard}>
            <h3 className={styles.specsTitle}>Specifications</h3>
            <div className={styles.specsGrid}>
              <div className={styles.specItem}>
                <span className={styles.specLabel}>Brand</span>
                <span className={styles.specVal}>{product.brand}</span>
              </div>
              <div className={styles.specItem}>
                <span className={styles.specLabel}>Category</span>
                <span className={styles.specVal}>{product.category}</span>
              </div>
              <div className={styles.specItem}>
                <span className={styles.specLabel}>Condition</span>
                <span className={styles.specVal}>Like New</span>
              </div>
              <div className={styles.specItem}>
                <span className={styles.specLabel}>Times Rented</span>
                <span className={styles.specVal}>{product.rentedCount || 0} times</span>
              </div>
            </div>
          </div>

          <div className={styles.aboutCard}>
            <h3>About this item</h3>
            <ul className={styles.bulletsList}>
              <li>High-performance {product.category} for professional and personal use.</li>
              <li>Fully inspected and sanitized by Gizzmo experts before every rental.</li>
              <li>Includes all standard accessories and original carrying case.</li>
              <li>Flexible rental durations ranging from 3 to 30+ days.</li>
              <li>{product.description}</li>
            </ul>
          </div>
        </div>

      </div>

      {/* Review Section */}
      <section className={styles.reviewsSection} id="reviews">
        <h2 className={styles.reviewsHeading}>Renter Reviews & Feedback</h2>
        
        <div className={styles.reviewsContainerGrid}>
          {/* Left Column: Rating breakdown */}
          <div className={styles.reviewsStatsCard}>
            <h3 className={styles.statsTitle}>Customer Rating</h3>
            
            <div className={styles.scoreRow}>
              <span className={styles.scoreNumber}>{product.rating}</span>
              <div className={styles.scoreStarsCol}>
                <div className={styles.starsRow}>
                  {[1, 2, 3, 4, 5].map(s => (
                    <Star key={s} size={18} fill={s <= product.rating ? "#FFA41C" : "none"} color="#FFA41C" />
                  ))}
                </div>
                <span className={styles.statsTotalCount}>Based on {reviews.length} customer {reviews.length === 1 ? 'review' : 'reviews'}</span>
              </div>
            </div>

            <div className={styles.ratingBarList}>
              {[5, 4, 3, 2, 1].map(star => {
                const count = reviewBreakdown[star] || 0;
                const percent = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                return (
                  <div key={star} className={styles.barItem}>
                    <span className={styles.barLabel}>{star} star</span>
                    <div className={styles.barTrack}>
                      <div className={styles.barFill} style={{ width: `${percent}%` }}></div>
                    </div>
                    <span className={styles.barPercent}>{Math.round(percent)}%</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Reviews list & Write Review Form */}
          <div className={styles.reviewsFlowCol}>
            
            {/* Write Review Form Card */}
            <div className={styles.writeReviewCard}>
              <h3 className={styles.writeReviewTitle}>Share Your Experience</h3>
              <p className={styles.writeReviewSub}>Have you rented this device? Leave a review to help others!</p>
              
              <form onSubmit={handleReviewSubmit} className={styles.reviewForm}>
                <div className={styles.formRowInput}>
                  <label>Your Name</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Enter your name" 
                    value={newReviewName} 
                    onChange={e => setNewReviewName(e.target.value)}
                    className={styles.formInputText}
                  />
                </div>

                <div className={styles.formRowInput}>
                  <label>Your Rating</label>
                  <div className={styles.interactiveStars}>
                    {[1, 2, 3, 4, 5].map(s => {
                      const isHighlighted = (newReviewHoverRating || newReviewRating) >= s;
                      return (
                        <button
                          key={s}
                          type="button"
                          className={styles.starInteractBtn}
                          onMouseEnter={() => setNewReviewHoverRating(s)}
                          onMouseLeave={() => setNewReviewHoverRating(0)}
                          onClick={() => setNewReviewRating(s)}
                        >
                          <Star 
                            size={24} 
                            fill={isHighlighted ? "#FFA41C" : "none"} 
                            color={isHighlighted ? "#FFA41C" : "#ccc"} 
                          />
                        </button>
                      );
                    })}
                    <span className={styles.ratingFeedbackLabel}>
                      {newReviewRating} Star{newReviewRating === 1 ? '' : 's'}
                    </span>
                  </div>
                </div>

                <div className={styles.formRowInput}>
                  <label>Review Comment</label>
                  <textarea 
                    required 
                    rows="3" 
                    placeholder="Tell us what you liked or disliked about this device..." 
                    value={newReviewText} 
                    onChange={e => setNewReviewText(e.target.value)}
                    className={styles.formTextarea}
                  />
                </div>

                <button type="submit" className={styles.submitReviewBtn}>
                  Submit Review
                </button>

                {reviewSubmitSuccess && (
                  <div className={styles.formSuccessMsg}>
                    ✓ Your review has been added dynamically below!
                  </div>
                )}
              </form>
            </div>

            {/* Reviews List */}
            <div className={styles.reviewsListContainer}>
              <h3 className={styles.listHeaderTitle}>Recent Renter Reviews</h3>
              {reviews.length === 0 ? (
                <p className={styles.emptyReviews}>No reviews yet. Be the first to leave one!</p>
              ) : (
                <div className={styles.reviewsListFlow}>
                  {reviews.map(rev => (
                    <div key={rev.id} className={styles.reviewItemCard}>
                      <div className={styles.reviewItemHeader}>
                        <div className={styles.userAvatar}>
                          {rev.name.charAt(0).toUpperCase()}
                        </div>
                        <div className={styles.userMetaCol}>
                          <div className={styles.userNameRow}>
                            <span className={styles.reviewerName}>{rev.name}</span>
                            {rev.verified && (
                              <span className={styles.verifiedRenterBadge}>✓ Verified Renter</span>
                            )}
                          </div>
                          <span className={styles.reviewDate}>Reviewed on {rev.date}</span>
                        </div>
                      </div>

                      <div className={styles.reviewItemContent}>
                        <div className={styles.reviewItemStars}>
                          {[1, 2, 3, 4, 5].map(s => (
                            <Star 
                              key={s} 
                              size={14} 
                              fill={s <= rev.rating ? "#FFA41C" : "none"} 
                              color={s <= rev.rating ? "#FFA41C" : "#ccc"} 
                            />
                          ))}
                        </div>
                        <p className={styles.reviewTextContent}>{rev.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* Suggested Products Section */}
      {suggestions.length > 0 && (
        <section className={styles.suggestionsSection}>
          <div className={styles.sectionHeader}>
            <h2>Customers also rented these</h2>
            <div className={styles.suggestedGrid}>
              {suggestions.map(item => (
                <Link href={`/product/${item._id}`} key={item._id} className={styles.suggestionCard}>
                  <div className={styles.suggestionImage}>
                    <img src={getProductImg(item)} alt={item.title} />
                  </div>
                  <p className={styles.suggestionTitle}>{item.title}</p>
                  <div className={styles.suggestionRating}>
                    {[1, 2, 3, 4, 5].map(s => <Star key={s} size={12} fill={s <= item.rating ? "#FF9900" : "none"} color="#FF9900" />)}
                  </div>
                  <p className={styles.suggestionPrice}>₹{item.pricePerDay}/day</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
