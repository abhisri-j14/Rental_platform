"use client";
import { useState, useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, BarChart2, Check, Zap } from 'lucide-react';
import Spline from '@splinetool/react-spline';
import styles from './compare.module.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const CATEGORIES = [
  { id: 'laptops', name: 'Laptops' },
  { id: 'phones', name: 'Smartphones' },
  { id: 'cameras', name: 'Cameras' },
  { id: 'tablets', name: 'Tablets' },
  { id: 'drones', name: 'Drones' },
  { id: 'gaming', name: 'Gaming Consoles' },
  { id: 'vr', name: 'VR Headsets' },
  { id: 'audio', name: 'Audio' },
];

export default function ComparePage() {
  const [category, setCategory] = useState('laptops');
  const [products, setProducts] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: direction === 'left' ? -260 : 260, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    setLoading(true);
    setFetchError(false);
    fetch(`${API_URL}/api/products?category=${category}`)
      .then(res => res.json())
      .then(data => {
        setProducts(data.products || []);
        setLoading(false);
        setSelectedIds([]);
      })
      .catch(err => {
        console.error(err);
        setFetchError(true);
        setLoading(false);
      });
  }, [category]);

  const toggleSelection = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(prev => prev.filter(pid => pid !== id));
    } else {
      if (selectedIds.length >= 3) return;
      setSelectedIds(prev => [...prev, id]);
    }
  };

  const selectedProducts = products.filter(p => selectedIds.includes(p._id));

  const allSpecKeys = new Set();
  selectedProducts.forEach(p => {
    if (p.specs) Object.keys(p.specs).forEach(key => allSpecKeys.add(key));
  });
  const specKeysArray = Array.from(allSpecKeys);

  return (
    <div className={styles.container}>

      {/* ══ HERO BAND — robot lives here ══ */}
      <div className={styles.heroBand}>
        <div className={styles.backgroundScene}>
          <Spline scene="/robo.splinecode" />
        </div>

        <div className={styles.heroText}>
          <div className={styles.headerBadge}>
            <Zap size={11} />
            Side-by-Side Analysis
          </div>
          <h1>Product <span>Showdown</span></h1>
          <p>Compare specs, price &amp; ratings across up to 3 devices.</p>
        </div>
      </div>

      {/* ══ MAIN CONTENT — full width centered ══ */}
      <div className={styles.contentWrapper}>

        {/* Controls row */}
        <div className={styles.controlsRow}>
          <div className={styles.categorySelect}>
            <label>Filter by Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              {CATEGORIES.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <span className={styles.selectionHint}>
            Pick up to <strong>3 devices</strong> to compare side by side.
          </span>
        </div>

        {/* Product picker */}
        <div className={styles.picker}>
          <div className={styles.pickerHeader}>
            <span className={styles.pickerTitle}>Choose Devices to Compare</span>
            <span className={styles.pickerBadge}>{selectedIds.length} / 3 selected</span>
          </div>

          {loading ? (
            <div className={styles.loading}>Fetching inventory…</div>
          ) : fetchError ? (
            <div className={styles.loading}>⚠ Server unavailable — start the backend and refresh.</div>
          ) : products.length === 0 ? (
            <div className={styles.loading}>No products found in this category.</div>
          ) : (
            <div className={styles.scrollWrapper}>
              <button className={styles.navBtn} onClick={() => scroll('left')} aria-label="Scroll left">
                <ChevronLeft size={18} />
              </button>

              <div className={styles.productGrid} ref={scrollRef}>
                {products.map(product => {
                  const isSelected = selectedIds.includes(product._id);
                  return (
                    <div
                      key={product._id}
                      className={`${styles.productCard} ${isSelected ? styles.selected : ''}`}
                      onClick={() => toggleSelection(product._id)}
                      role="button"
                      aria-pressed={isSelected}
                    >
                      <div className={styles.cardImageWrap}>
                        <img src={product.images?.[0]} alt={product.title} className={styles.cardImage} />
                      </div>
                      <div className={styles.cardInfo}>
                        <span className={styles.cardTitle}>{product.title}</span>
                        <span className={styles.cardPrice}>₹{product.pricePerDay}/day</span>
                        {isSelected && (
                          <span className={styles.selectedCheckmark}>
                            <Check size={11} /> Selected
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <button className={styles.navBtn} onClick={() => scroll('right')} aria-label="Scroll right">
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>

        {/* Comparison table or empty state */}
        {selectedProducts.length === 0 ? (
          <div className={styles.emptyState}>
            <BarChart2 size={40} strokeWidth={1.5} />
            <p>Select at least one device above to begin the comparison.</p>
          </div>
        ) : (
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <colgroup>
                <col className={styles.specCol} style={{ width: '160px' }} />
                {selectedProducts.map(p => <col key={p._id} />)}
              </colgroup>
              <thead>
                <tr>
                  <th className={styles.featureCol}>Spec</th>
                  {selectedProducts.map(p => (
                    <th key={p._id}>
                      <div className={styles.tableHeaderCell}>
                        <button
                          className={styles.removeBtn}
                          onClick={() => toggleSelection(p._id)}
                          aria-label={`Remove ${p.title}`}
                        >
                          <X size={12} />
                        </button>
                        <div className={styles.tableHeaderImg}>
                          <img src={p.images?.[0]} alt={p.title} />
                        </div>
                        <div className={styles.tableHeaderTitle}>{p.title}</div>
                        <a href={`/product/${p._id}`} className={styles.viewLink}>View Details →</a>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className={styles.featureCol}>Price / Day</td>
                  {selectedProducts.map(p => (
                    <td key={`price-${p._id}`} className={styles.priceCell}>
                      ₹{p.pricePerDay?.toLocaleString()}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className={styles.featureCol}>Market Value</td>
                  {selectedProducts.map(p => (
                    <td key={`actual-${p._id}`}>₹{p.actualPrice?.toLocaleString()}</td>
                  ))}
                </tr>
                <tr>
                  <td className={styles.featureCol}>Rating</td>
                  {selectedProducts.map(p => (
                    <td key={`rating-${p._id}`}>{p.rating?.toFixed(1) || '—'} / 5.0</td>
                  ))}
                </tr>
                {specKeysArray.map(key => (
                  <tr key={key}>
                    <td className={styles.featureCol}>{key}</td>
                    {selectedProducts.map(p => (
                      <td key={`${p._id}-${key}`}>
                        {p.specs?.[key] ?? '—'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
}
