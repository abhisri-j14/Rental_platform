"use client";
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
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

const emojiMap = {
  laptops: '💻', cameras: '📸', phones: '📱', drones: '🚁',
  tablets: '📱', gaming: '🎮', vr: '🥽', audio: '🎧', accessories: '🔌',
};

export default function ComparePage() {
  const [category, setCategory] = useState('laptops');
  const [products, setProducts] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  // Fetch products when category changes
  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/api/products?category=${category}`)
      .then(res => res.json())
      .then(data => {
        setProducts(data.products || []);
        setLoading(false);
        // Reset selections when changing category
        setSelectedIds([]);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [category]);

  const toggleSelection = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(prev => prev.filter(pid => pid !== id));
    } else {
      if (selectedIds.length >= 3) {
        alert("You can compare a maximum of 3 devices at a time.");
        return;
      }
      setSelectedIds(prev => [...prev, id]);
    }
  };

  const selectedProducts = products.filter(p => selectedIds.includes(p._id));

  // Collect all unique spec keys from selected products
  const allSpecKeys = new Set();
  selectedProducts.forEach(p => {
    if (p.specs) {
      Object.keys(p.specs).forEach(key => allSpecKeys.add(key));
    }
  });
  const specKeysArray = Array.from(allSpecKeys);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>The Ultimate Showdown 🥊</h1>
        <p>Select a category, pick up to 3 devices, and compare the raw facts!</p>
      </div>

      <div className={styles.controls}>
        <div className={styles.categorySelect}>
          <label>Step 1: Choose Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATEGORIES.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div className={styles.picker}>
          <div className={styles.pickerTitle}>Step 2: Pick up to 3 devices to compare ({selectedIds.length}/3)</div>
          {loading ? (
            <div className={styles.loading}>Loading devices...</div>
          ) : (
            <div className={styles.scrollContainer}>
              <button className={`${styles.scrollBtn} ${styles.scrollLeft}`} onClick={() => scroll('left')}>
                <ChevronLeft size={24} />
              </button>
              
              <div className={styles.productGrid} ref={scrollRef}>
                {products.map(product => (
                  <div 
                    key={product._id} 
                    className={`${styles.productCard} ${selectedIds.includes(product._id) ? styles.selected : ''}`}
                    onClick={() => toggleSelection(product._id)}
                  >
                    <div className={styles.productCardImage}>{emojiMap[product.category] || '📦'}</div>
                    <div className={styles.productCardTitle} title={product.title}>{product.title}</div>
                    <div className={styles.productCardPrice}>₹{product.pricePerDay}/day</div>
                  </div>
                ))}
              </div>

              <button className={`${styles.scrollBtn} ${styles.scrollRight}`} onClick={() => scroll('right')}>
                <ChevronRight size={24} />
              </button>
            </div>
          )}
        </div>
      </div>

      {selectedProducts.length === 0 ? (
        <div className={styles.emptyState}>
          👆 Select at least one device from above to start comparing.
        </div>
      ) : (
        <div className={styles.compareTableWrapper}>
          <table className={styles.compareTable}>
            <thead>
              <tr>
                <th className={styles.rowLabel}>Features</th>
                {selectedProducts.map(p => (
                  <th key={p._id}>
                    <div className={styles.headerCell}>
                      <button className={styles.removeBtn} onClick={() => toggleSelection(p._id)} title="Remove"><X size={16}/></button>
                      <div className={styles.headerEmoji}>{emojiMap[p.category] || '📦'}</div>
                      <div className={styles.headerTitle}>{p.title}</div>
                      <div className={styles.headerBrand}>{p.brand}</div>
                      <Link href={`/product/${p._id}`} className={styles.rentBtn}>
                        View Device
                      </Link>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Pricing Row */}
              <tr>
                <td className={styles.rowLabel}>Price</td>
                {selectedProducts.map(p => (
                  <td key={`price-${p._id}`}>
                    {p.actualPrice > 0 && <div className={styles.actualPrice}>MRP: ₹{p.actualPrice.toLocaleString('en-IN')}</div>}
                    <div className={styles.rentPrice}>₹{p.pricePerDay}/day</div>
                  </td>
                ))}
              </tr>

              {/* Rating Row */}
              <tr>
                <td className={styles.rowLabel}>Rating</td>
                {selectedProducts.map(p => (
                  <td key={`rating-${p._id}`}>⭐ {p.rating?.toFixed(1) || 'New'} ({p.totalRatings || 0} reviews)</td>
                ))}
              </tr>

              {/* Rented Count Row */}
              <tr>
                <td className={styles.rowLabel}>Popularity</td>
                {selectedProducts.map(p => (
                  <td key={`pop-${p._id}`}>Rented {p.rentedCount || 0} times</td>
                ))}
              </tr>

              {/* Dynamic Specs Rows */}
              {specKeysArray.map(key => (
                <tr key={key}>
                  <td className={styles.rowLabel}>{key}</td>
                  {selectedProducts.map(p => (
                    <td key={`${p._id}-${key}`}>
                      {p.specs && p.specs[key] ? p.specs[key] : '—'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
