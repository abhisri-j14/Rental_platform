"use client";
import { useState, useEffect } from 'react';
import { use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Star, CheckCircle, Info, ShoppingCart, ChevronsRight, 
  Store, Tag, Check, Truck, ShieldCheck, ArrowLeft,
  Share2, Heart, Award
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

  if (loading) return <div className={styles.loading}>Loading product details...</div>;
  if (!product) return <div className={styles.loading}>Product not found.</div>;

  const getProductImg = (p) => {
    if (p.images?.[0] && !p.images[0].includes('placeholder')) return p.images[0];
    return HD_IMAGES[p.category] || HD_IMAGES.accessories;
  };

  const effectiveDays = customDays !== '' ? (parseInt(customDays, 10) || 1) : days;
  const estimatedRent = product.pricePerDay * effectiveDays;
  const mrp = product.actualPrice || (product.pricePerDay * 50);

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
          <div className={styles.verticalGalleryWrapper}>
            <div className={styles.thumbnailsVertical}>
              {[0, 1, 2, 3, 4, 5].map((idx) => (
                <div key={idx} className={`${styles.thumbItem} ${activeImg === idx ? styles.activeThumb : ''}`} onMouseEnter={() => setActiveImg(idx)}>
                   <img src={getProductImg(product)} alt="" />
                </div>
              ))}
            </div>
            <div className={styles.mainImageArea}>
              <div className={styles.mainImageWrapper}>
                <img src={getProductImg(product)} alt={product.title} className={styles.mainImage} />
                <p className={styles.zoomText}>Roll over image to zoom in</p>
              </div>
            </div>
          </div>
        </div>

        {/* Column 2: Info */}
        <div className={styles.infoColumn}>
          <div className={styles.topMeta}>
            <Link href="/owner" className={styles.brandLink}>Visit the {product.brand} Store</Link>
            <div className={styles.gizzmoChoice}>
              <span className={styles.choiceText}>Gizzmo's</span> <span className={styles.choiceCategory}>Choice</span>
              <span className={styles.choiceSub}>for "{product.title.split(' ')[0]}"</span>
            </div>
          </div>
          
          <h1 className={styles.productTitle}>{product.title}</h1>
          
          <div className={styles.ratingRow}>
            <div className={styles.ratingStars}>
              <span className={styles.ratingValue}>{product.rating}</span>
              {[1, 2, 3, 4, 5].map(s => <Star key={s} size={16} fill={s <= product.rating ? "#FFA41C" : "none"} color="#FFA41C" />)}
              <ChevronsRight size={14} className={styles.downArrow} />
            </div>
            <Link href="#reviews" className={styles.amazonLink}>{(product.totalRatings || 1240).toLocaleString()} ratings</Link>
            <span className={styles.separator}>|</span>
            <Link href="#qa" className={styles.amazonLink}>500+ answered questions</Link>
          </div>

          <div className={styles.divider}></div>

          <div className={styles.priceSection}>
            <div className={styles.dealBadge}>Limited time deal</div>
            <div className={styles.priceContainer}>
              <span className={styles.discountPercent}>-15%</span>
              <div className={styles.priceBlock}>
                <span className={styles.currency}>₹</span>
                <span className={styles.priceLarge}>{product.pricePerDay.toLocaleString('en-IN')}</span>
                <span className={styles.pricePeriod}>/day</span>
              </div>
            </div>
            <p className={styles.mrpLine}>M.R.P.: <span className={styles.strike}>₹{mrp.toLocaleString('en-IN')}</span></p>
            <p className={styles.taxesInfo}>Inclusive of all taxes</p>
          </div>

          <div className={styles.amazonOffers}>
            <div className={styles.offerItem}>
              <Tag size={16} color="#B12704" />
              <strong>Partner Offers</strong>
              <p>Get GST invoice and save up to 28% on business rentals.</p>
            </div>
          </div>

          <div className={styles.divider}></div>

          <div className={styles.iconFeatures}>
            <div className={styles.featureItem}>
              <div className={styles.featureIcon}><Truck size={24} /></div>
              <span>Free Delivery</span>
            </div>
            <div className={styles.featureItem}>
              <div className={styles.featureIcon}><ShieldCheck size={24} /></div>
              <span>Secure Transaction</span>
            </div>
            <div className={styles.featureItem}>
              <div className={styles.featureIcon}><Award size={24} /></div>
              <span>6-Hr Return</span>
            </div>
            <div className={styles.featureItem}>
              <div className={styles.featureIcon}><CheckCircle size={24} /></div>
              <span>100% Cashback</span>
            </div>
          </div>

          <div className={styles.divider}></div>

          <div className={styles.detailsTable}>
            <div className={styles.detailRow}><strong>Brand</strong><span>{product.brand}</span></div>
            <div className={styles.detailRow}><strong>Category</strong><span>{product.category}</span></div>
            <div className={styles.detailRow}><strong>Condition</strong><span>Like New</span></div>
          </div>

          <div className={styles.divider}></div>

          <div className={styles.aboutThisItem}>
            <h3>About this item</h3>
            <ul className={styles.amazonBullets}>
              <li>High-performance {product.category} for professional and personal use.</li>
              <li>Fully inspected and sanitized by Gizzmo experts before every rental.</li>
              <li>Includes all standard accessories and original carrying case.</li>
              <li>Flexible rental durations ranging from 3 to 30+ days.</li>
              <li>{product.description}</li>
            </ul>
          </div>
        </div>

        {/* Column 3: Buy Box */}
        <div className={styles.buyColumn}>
          <div className={styles.buyBoxAmazon}>
            <div className={styles.buyBoxPrice}>
              <span className={styles.currency}>₹</span>
              <span className={styles.amount}>{product.pricePerDay.toLocaleString('en-IN')}</span>
              <span className={styles.unit}>/day</span>
            </div>
            
            <div className={styles.deliveryInfo}>
              <p>FREE delivery <strong className={styles.black}>Tomorrow</strong>. Order within <span className={styles.time}>6 hrs 2 mins</span>. <Link href="#" className={styles.amazonLink}>Details</Link></p>
              <p className={styles.location}><Info size={14} /> Deliver to New Delhi 110001</p>
            </div>

            <div className={styles.stockStatusAmazon}>In Stock</div>

            <div className={styles.selectorRow}>
              <span>Payment:</span>
              <strong>Monthly/Daily</strong>
            </div>

            <div className={styles.durationSelector}>
              <label>Quantity / Days</label>
              <select className={styles.amazonSelect} value={days} onChange={(e) => setDays(parseInt(e.target.value))}>
                {[1, 2, 3, 4, 5, 6, 7, 10, 14, 21, 30].map(v => <option key={v} value={v}>{v} Days</option>)}
              </select>
            </div>

            <div className={styles.buyActionsAmazon}>
              <button className={styles.amazonBtnYellow} onClick={handleAddToCart}>Add to Cart</button>
              <button className={styles.amazonBtnOrange} onClick={handleBookNow}>Rent Now</button>
            </div>

            <div className={styles.amazonTableDetails}>
              <div className={styles.amazonTableRow}>
                <span>Ships from</span>
                <span>Gizzmo</span>
              </div>
              <div className={styles.amazonTableRow}>
                <span>Sold by</span>
                <span>{product.brand} Authorized</span>
              </div>
            </div>

            <div className={styles.amazonSecurity}>
              <ShieldCheck size={16} /> <Link href="#" className={styles.amazonLink}>Secure transaction</Link>
            </div>
          </div>
        </div>
      </div>

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
div>

      </div>
    </div>
  );
}
