"use client";
import { useState, useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, BarChart2 } from 'lucide-react';
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
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/api/products?category=${category}`)
      .then(res => res.json())
      .then(data => {
        setProducts(data.products || []);
        setLoading(false);
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
        return;
      }
      setSelectedIds(prev => [...prev, id]);
    }
  };

  const selectedProducts = products.filter(p => selectedIds.includes(p._id));

  const allSpecKeys = new Set();
  selectedProducts.forEach(p => {
    if (p.specs) {
      Object.keys(p.specs).forEach(key => allSpecKeys.add(key));
    }
  });
  const specKeysArray = Array.from(allSpecKeys);

  return (
    <div className={styles.container}>
      {/* 3D Background Scene - Adjusted Position */}
      <div className={styles.backgroundScene}>
        <Spline scene="/robo.splinecode" />
      </div>

      <div className={styles.contentWrapper}>

        <div className={styles.header}>
          <div className={styles.headerContent}>
            <h1>PRODUCT SHOWDOWN</h1>
            <p>TECHNICAL COMPARISON FOR SIDE-BY-SIDE PERFORMANCE ANALYSIS.</p>
          </div>
        </div>

        <div className={styles.selectionArea}>
          <div className={styles.categorySelect}>
            <label>SELECT CLASSIFICATION</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              {CATEGORIES.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className={styles.picker}>
            <div className={styles.pickerHeader}>
              <span className={styles.pickerTitle}>SELECT DEVICES ({selectedIds.length}/3)</span>
            </div>

            {loading ? (
              <div className={styles.loading}>FETCHING INVENTORY...</div>
            ) : (
              <div className={styles.scrollWrapper}>
                <button className={styles.navBtn} onClick={() => scroll('left')}><ChevronLeft size={20} /></button>

                <div className={styles.productGrid} ref={scrollRef}>
                  {products.map(product => (
                    <div
                      key={product._id}
                      className={`${styles.productCard} ${selectedIds.includes(product._id) ? styles.selected : ''}`}
                      onClick={() => toggleSelection(product._id)}
                    >
                      <div className={styles.cardImageWrap}>
                        <img src={product.images[0]} alt="" className={styles.cardImage} />
                      </div>
                      <div className={styles.cardInfo}>
                        <span className={styles.cardTitle}>{product.title}</span>
                        <span className={styles.cardPrice}>₹{product.pricePerDay}/DAY</span>
                      </div>
                    </div>
                  ))}
                </div>

                <button className={styles.navBtn} onClick={() => scroll('right')}><ChevronRight size={20} /></button>
              </div>
            )}
          </div>
        </div>

        {selectedProducts.length === 0 ? (
          <div className={styles.emptyState}>
            <BarChart2 size={40} />
            <p>SELECT AT LEAST ONE DEVICE TO BEGIN DATA COMPARISON</p>
          </div>
        ) : (
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.featureCol}>SPECIFICATIONS</th>
                  {selectedProducts.map(p => (
                    <th key={p._id} className={styles.productCol}>
                      <div className={styles.tableHeaderCell}>
                        <button className={styles.removeBtn} onClick={() => toggleSelection(p._id)}><X size={14} /></button>
                        <div className={styles.tableHeaderImg}>
                          <img src={p.images[0]} alt="" />
                        </div>
                        <div className={styles.tableHeaderTitle}>{p.title}</div>
                        <a href={`/product/${p._id}`} className={styles.viewLink}>VIEW TECHNICAL SPECS</a>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className={styles.featureCol}>PRICE PER DAY</td>
                  {selectedProducts.map(p => (
                    <td key={`price-${p._id}`} className={styles.priceCell}>₹{p.pricePerDay.toLocaleString()}</td>
                  ))}
                </tr>
                <tr>
                  <td className={styles.featureCol}>ORIGINAL VALUE</td>
                  {selectedProducts.map(p => (
                    <td key={`actual-${p._id}`}>₹{p.actualPrice.toLocaleString()}</td>
                  ))}
                </tr>
                <tr>
                  <td className={styles.featureCol}>TRUST RATING</td>
                  {selectedProducts.map(p => (
                    <td key={`rating-${p._id}`}>{p.rating?.toFixed(1) || 'NEW'} / 5.0</td>
                  ))}
                </tr>
                {specKeysArray.map(key => (
                  <tr key={key}>
                    <td className={styles.featureCol}>{key.toUpperCase()}</td>
                    {selectedProducts.map(p => (
                      <td key={`${p._id}-${key}`}>
                        {p.specs && p.specs[key] ? p.specs[key] : 'N/A'}
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
