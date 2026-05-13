"use client";
import Link from 'next/link';
import { Star, ShieldCheck, Check, ArrowUpDown, ShoppingCart, ChevronsRight, Tag } from 'lucide-react';
import { use, useState, useEffect, useMemo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './category.module.css';
import { useCart } from '@/context/CartContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

function CategoryContent({ params }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const brandQuery = searchParams.get('brand') || '';
  const { addToCart, cartItems } = useCart();

  const categoryName = slug === 'all'
    ? 'All Devices'
    : slug.charAt(0).toUpperCase() + slug.slice(1);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState('popular');
  const [addedIds, setAddedIds] = useState({});
  
  // Filters
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [minRating, setMinRating] = useState(0);
  const [deliveryFilter, setDeliveryFilter] = useState([]);
  const [conditionFilter, setConditionFilter] = useState([]);
  const [discountFilter, setDiscountFilter] = useState(0);

  useEffect(() => {
    setLoading(true);
    let url = slug === 'all'
      ? `${API_URL}/api/products`
      : `${API_URL}/api/products?category=${slug}`;

    if (brandQuery) {
      url += (url.includes('?') ? '&' : '?') + `brand=${encodeURIComponent(brandQuery)}`;
    }
    
    if (searchQuery) {
      url += (url.includes('?') ? '&' : '?') + `search=${encodeURIComponent(searchQuery)}`;
    }

    fetch(url)
      .then(res => res.json())
      .then(data => {
        setProducts(data.products || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug, searchQuery, brandQuery]);

  // Derived data for filters
  const brands = ['Apple', 'Samsung', 'OnePlus', 'Sony', 'Canon', 'DJI', 'Dell', 'iQOO', 'Redmi', 'realme', 'vivo', 'Motorola', 'Nokia', 'OPPO'];

  // Filter and Sort products
  const processedProducts = useMemo(() => {
    let arr = products.filter(p => {
      const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(p.brand);
      const matchesPrice = p.pricePerDay >= priceRange[0] && p.pricePerDay <= priceRange[1];
      const matchesRating = (p.rating || 0) >= minRating;
      const matchesDelivery = deliveryFilter.length === 0 || deliveryFilter.includes(p.delivery);
      const matchesCondition = conditionFilter.length === 0 || conditionFilter.includes('New');
      
      // Calculate discount % (approximate for UI)
      const discountPercent = p.actualPrice > 0 ? ((p.actualPrice - (p.pricePerDay * 30)) / p.actualPrice) * 100 : 0;
      const matchesDiscount = discountFilter === 0 || discountPercent >= discountFilter;

      return matchesBrand && matchesPrice && matchesRating && matchesDelivery && matchesCondition && matchesDiscount;
    });

    switch (sort) {
      case 'popular':
        return arr.sort((a, b) => (b.rentedCount || 0) - (a.rentedCount || 0));
      case 'price_asc':
        return arr.sort((a, b) => a.pricePerDay - b.pricePerDay);
      case 'price_desc':
        return arr.sort((a, b) => b.pricePerDay - a.pricePerDay);
      case 'rating':
        return arr.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case 'newest':
        return arr.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      default:
        return arr;
    }
  }, [products, sort, selectedBrands, priceRange, minRating]);

  const emojiMap = {
    laptops: '💻', cameras: '📸', phones: '📱', drones: '🚁',
    tablets: '📱', gaming: '🎮', vr: '🥽', audio: '🎧', accessories: '🔌',
  };

  const handleAddToCart = (product) => {
    addToCart({
      _id: product._id,
      title: product.title,
      brand: product.brand,
      category: product.category,
      pricePerDay: product.pricePerDay,
      actualPrice: product.actualPrice || 0,
      damageDeposit: product.damageDeposit,
      days: 1,
    });
    setAddedIds(prev => ({ ...prev, [product._id]: true }));
    setTimeout(() => setAddedIds(prev => ({ ...prev, [product._id]: false })), 2000);
  };

  const handleRentNow = (product) => {
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
      days: 1,
      owner: product.owner,
    }));
    router.push('/checkout');
  };

  const isInCart = (id) => cartItems.some(i => i._id === id);

  const toggleFilter = (list, setList, value) => {
    setList(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]);
  };

  return (
    <div className={styles.container}>
      
      {/* Sidebar Filters */}
      <aside className={styles.sidebar}>
        
        {/* Delivery Day */}
        <div className={styles.filterSection}>
          <h3 className={styles.filterTitle}>Delivery Day</h3>
          <div className={styles.filterList}>
            {['Get It Today', 'Get It by Tomorrow'].map(d => (
              <label key={d} className={styles.filterItem}>
                <input 
                  type="checkbox" 
                  checked={deliveryFilter.includes(d)}
                  onChange={() => toggleFilter(deliveryFilter, setDeliveryFilter, d)}
                />
                <span>{d}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Brands */}
        <div className={styles.filterSection}>
          <h3 className={styles.filterTitle}>Brands</h3>
          <div className={styles.filterList}>
            {brands.map(brand => (
              <label key={brand} className={styles.filterItem}>
                <input 
                  type="checkbox" 
                  checked={selectedBrands.includes(brand)}
                  onChange={() => toggleFilter(selectedBrands, setSelectedBrands, brand)}
                />
                <span>{brand}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Customer Reviews */}
        <div className={styles.filterSection}>
          <h3 className={styles.filterTitle}>Customer Reviews</h3>
          <div className={styles.ratingFilters}>
            {[4, 3, 2, 1].map(r => (
              <button 
                key={r} 
                className={`${styles.ratingFilterBtn} ${minRating === r ? styles.activeRating : ''}`}
                onClick={() => setMinRating(minRating === r ? 0 : r)}
              >
                <div className={styles.starsContainer}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill={i < r ? "#FF9900" : "none"} color={i < r ? "#FF9900" : "#ccc"} />
                  ))}
                </div>
                <span>& Up</span>
              </button>
            ))}
          </div>
        </div>

        {/* Item Condition */}
        <div className={styles.filterSection}>
          <h3 className={styles.filterTitle}>Item Condition</h3>
          <div className={styles.filterList}>
            <label className={styles.filterItem}>
              <input 
                type="checkbox" 
                checked={conditionFilter.includes('New')}
                onChange={() => toggleFilter(conditionFilter, setConditionFilter, 'New')}
              />
              <span>New</span>
            </label>
          </div>
        </div>

        {/* Price Ranges */}
        <div className={styles.filterSection}>
          <h3 className={styles.filterTitle}>Price</h3>
          <div className={styles.filterList}>
            {[
              { label: 'Under ₹1,000', range: [0, 1000] },
              { label: '₹1,000 - ₹5,000', range: [1000, 5000] },
              { label: '₹5,000 - ₹10,000', range: [5000, 10000] },
              { label: '₹10,000 - ₹20,000', range: [10000, 20000] },
              { label: 'Over ₹20,000', range: [20000, 1000000] }
            ].map(p => (
              <button 
                key={p.label}
                className={`${styles.ratingFilterBtn} ${priceRange[0] === p.range[0] && priceRange[1] === p.range[1] ? styles.activeRating : ''}`}
                onClick={() => setPriceRange(p.range)}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Discount */}
        <div className={styles.filterSection}>
          <h3 className={styles.filterTitle}>Discount</h3>
          <div className={styles.filterList}>
            {[10, 25, 35, 50, 60, 70].map(d => (
              <button 
                key={d}
                className={`${styles.ratingFilterBtn} ${discountFilter === d ? styles.activeRating : ''}`}
                onClick={() => setDiscountFilter(d)}
              >
                {d}% Off or more
              </button>
            ))}
          </div>
        </div>

        <button 
          className={styles.clearFilters}
          onClick={() => {
            setSelectedBrands([]);
            setPriceRange([0, 100000]);
            setMinRating(0);
            setDeliveryFilter([]);
            setConditionFilter([]);
            setDiscountFilter(0);
          }}
        >
          Clear All Filters
        </button>
      </aside>

      {/* Main Content Area */}
      <main className={styles.mainContent}>

        {/* Results Header with Sort */}
        <div className={styles.resultsHeader}>
          <div className={styles.titleArea}>
            <h1>
              {brandQuery
                ? slug === 'all'
                  ? `${brandQuery} Rentals`
                  : `${brandQuery} ${categoryName}`
                : searchQuery 
                  ? `Search Results for "${searchQuery}"` 
                  : `${categoryName} Rentals`}
            </h1>
            <span className={styles.itemCount}>{processedProducts.length} devices found</span>
          </div>
          <div className={styles.sortRow}>
            <ArrowUpDown size={16} className={styles.sortIcon} />
            <select
              className={styles.sortSelect}
              value={sort}
              onChange={e => setSort(e.target.value)}
            >
              <option value="popular">Featured</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Best Rating</option>
              <option value="newest">Newest First</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className={styles.loadingText}>Loading products...</div>
        ) : processedProducts.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No products match your criteria.</p>
            <button onClick={() => {
              setSelectedBrands([]);
              setPriceRange([0, 10000]);
              setMinRating(0);
            }} className={styles.secondaryBtn}>Reset Filters</button>
          </div>
        ) : (
          <div className={styles.productList}>
            {processedProducts.map(product => (
              <div key={product._id} className={styles.productCard}>

                <div className={styles.imageCol}>
                  <div className={styles.imagePlaceholder}>
                    {product.images?.[0] ? (
                      <img src={product.images[0]} alt={product.title} className={styles.productImg} />
                    ) : (
                      <span className={styles.emojiIcon}>{emojiMap[product.category] || '📦'}</span>
                    )}
                    <div className={styles.discountBadge}>UP TO 50% OFF</div>
                  </div>
                  {product.sponsored && (
                    <span className={styles.sponsoredBadge}>Sponsored</span>
                  )}
                </div>

                <div className={styles.detailsCol}>
                  <div className={styles.cardHeader}>
                    <Link href={`/product/${product._id}`} className={styles.productName}>
                      {product.title}
                    </Link>
                    <span className={styles.brandName}>{product.brand}</span>
                  </div>

                  <div className={styles.ratingRow}>
                    <div className={styles.starsContainer}>
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={14} 
                          fill={i < Math.floor(product.rating || 0) ? "#FF9900" : "none"} 
                          color={i < Math.floor(product.rating || 0) ? "#FF9900" : "#ccc"} 
                        />
                      ))}
                    </div>
                    <span className={styles.reviews}>{(product.totalRatings || 0).toLocaleString()}</span>
                    <span className={styles.rentedBadge}>
                      {product.rentedCount > 0 ? `${product.rentedCount}+ rented` : 'New'}
                    </span>
                  </div>

                  <div className={styles.priceSection}>
                    <div className={styles.mainPrice}>
                      <span className={styles.currency}>₹</span>
                      <span className={styles.amount}>{product.pricePerDay.toLocaleString('en-IN')}</span>
                      <span className={styles.period}>/day</span>
                    </div>
                    {product.actualPrice > 0 && (
                      <div className={styles.mrpPrice}>
                        MRP: <span className={styles.strike}>₹{product.actualPrice.toLocaleString('en-IN')}</span>
                      </div>
                    )}
                  </div>

                  <div className={styles.perks}>
                    <div className={styles.perk}>
                      <Check size={14} className={styles.checkIcon} />
                      <span>Free Delivery <strong>{product.delivery || 'Tomorrow'}</strong></span>
                    </div>
                    <div className={styles.perk}>
                      <ShieldCheck size={14} className={styles.checkIcon} />
                      <span>Gizzmo Verified</span>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className={styles.actions}>
                    <button
                      className={`${styles.addToCartBtn} ${isInCart(product._id) ? styles.inCart : ''}`}
                      onClick={() => handleAddToCart(product)}
                    >
                      {addedIds[product._id] ? (
                        <><Check size={15}/> Added!</>
                      ) : isInCart(product._id) ? (
                        <><ShoppingCart size={15}/> In Cart</>
                      ) : (
                        <><ShoppingCart size={15}/> Add to Cart</>
                      )}
                    </button>

                    <button
                      className={styles.rentNowBtn}
                      onClick={() => handleRentNow(product)}
                    >
                      Rent Now
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </main>

    </div>
  );
}

export default function CategoryPage({ params }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CategoryContent params={params} />
    </Suspense>
  );
}

