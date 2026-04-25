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
  const { addToCart, cartItems } = useCart();

  const categoryName = slug === 'all'
    ? 'All Devices'
    : slug.charAt(0).toUpperCase() + slug.slice(1);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState('popular');
  const [addedIds, setAddedIds] = useState({});

  useEffect(() => {
    setLoading(true);
    let url = slug === 'all'
      ? `${API_URL}/api/products`
      : `${API_URL}/api/products?category=${slug}`;
    
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
  }, [slug]);

  // Sort products in-memory based on selected sort option
  const sortedProducts = useMemo(() => {
    const arr = [...products];
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
  }, [products, sort]);

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

  return (
    <div className={styles.container}>

      {/* Main Content Area */}
      <main className={styles.mainContent}>

        {/* Results Header with Sort */}
        <div className={styles.resultsHeader}>
          <div className={styles.titleArea}>
            <h1>
              {searchQuery 
                ? `Search Results for "${searchQuery}"` 
                : `${categoryName} Rentals`}
            </h1>
            <span className={styles.itemCount}>{sortedProducts.length} devices available</span>
          </div>
          <div className={styles.sortRow}>
            <ArrowUpDown size={16} className={styles.sortIcon} />
            <select
              className={styles.sortSelect}
              value={sort}
              onChange={e => setSort(e.target.value)}
            >
              <option value="popular">Most Popular</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Best Rating</option>
              <option value="newest">Newest First</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className={styles.loadingText}>Loading products...</div>
        ) : sortedProducts.length === 0 ? (
          <div className={styles.loadingText}>No products found in this category.</div>
        ) : (
          <div className={styles.productList}>
            {sortedProducts.map(product => (
              <div key={product._id} className={styles.productCard}>

                <div className={styles.imageCol}>
                  <div className={styles.imagePlaceholder}>
                    {product.images?.[0] || emojiMap[product.category] || '📦'}
                  </div>
                </div>

                <div className={styles.detailsCol}>
                  {product.sponsored && (
                    <span className={styles.sponsoredTag}>Sponsored <ShieldCheck size={12}/></span>
                  )}

                  <Link href={`/product/${product._id}`} className={styles.productName}>
                    {product.title}
                  </Link>

                  <div className={styles.ratingRow}>
                    <span className={styles.rating}>{product.rating} <Star size={14} fill="#FF9900" color="#FF9900"/></span>
                    <span className={styles.reviews}>({product.totalRatings?.toLocaleString() || 0})</span>
                  </div>

                  <div className={styles.rentedCount}>
                    {product.rentedCount > 0
                      ? `${product.rentedCount >= 1000 ? (product.rentedCount / 1000).toFixed(0) + 'K' : product.rentedCount}+ rented`
                      : 'New listing'}
                  </div>

                  {/* Rental Price */}
                  <div className={styles.priceRow}>
                    <span className={styles.priceSymbol}>₹</span>
                    <span className={styles.priceValue}>{product.pricePerDay.toLocaleString('en-IN')}</span>
                    <span className={styles.perDay}>/day</span>
                  </div>

                  {/* Actual Market Price (MRP) */}
                  {product.actualPrice > 0 && (
                    <div className={styles.actualPriceRow}>
                      <Tag size={12} className={styles.tagIcon} />
                      <span className={styles.actualPriceLabel}>Market Price:</span>
                      <span className={styles.actualPriceValue}>₹{product.actualPrice.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  <div className={styles.fulfillment}>
                    <span className={styles.fulfilledBadge}><Check size={12}/> GadgetGo Fulfilled</span>
                  </div>

                  <div className={styles.deliveryInfo}>
                    FREE delivery <strong>{product.delivery || 'Tomorrow'}</strong>
                  </div>

                  {/* Both action buttons */}
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
                      <ChevronsRight size={15}/> Rent Now
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
