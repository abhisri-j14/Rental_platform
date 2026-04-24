"use client";
import Link from 'next/link';
import { Star, ShieldCheck, ChevronDown, CheckSquare, ShoppingCart, Check } from 'lucide-react';
import { use } from 'react';
import styles from './category.module.css';

export default function CategoryPage({ params }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const categoryName = slug === 'all' ? 'All Devices' : slug.charAt(0).toUpperCase() + slug.slice(1);

  const allProducts = [
    { id: 1, name: "MacBook Pro M2 14-inch [2023 Edition] 16GB Unified RAM | 512GB SSD | Liquid Retina XDR", brand: "Apple", price: 1500, mrp: 2500, rating: 4.8, reviews: 463, rented: "2K+ rented in past month", image: "💻", category: "laptops", delivery: "Tomorrow 8 am - 12 pm", sponsored: true },
    { id: 2, name: "Dell XPS 15 OLED Touchscreen | Intel Core i7 13th Gen | Content Creator Laptop", brand: "Dell", price: 1200, mrp: 1800, rating: 4.2, reviews: 120, rented: "500+ rented in past month", image: "💻", category: "laptops", delivery: "Sunday, 26 Apr", sponsored: false },
    { id: 3, name: "Lenovo Legion Pro 5 Gaming Laptop | RTX 4070 | 165Hz Display | Great for eSports", brand: "Lenovo", price: 1100, mrp: 1500, rating: 4.9, reviews: 89, rented: "1K+ rented in past month", image: "💻", category: "laptops", delivery: "Tomorrow", sponsored: true },
    { id: 4, name: "HP Spectre x360 2-in-1 Touch | Intel Core i5 | Pen Included", brand: "HP", price: 900, mrp: 1200, rating: 4.5, reviews: 56, rented: "200+ rented in past month", image: "💻", category: "laptops", delivery: "Sunday, 26 Apr", sponsored: false },
    { id: 5, name: "iPhone 15 Pro Max 256GB | Natural Titanium | Best Camera Phone", brand: "Apple", price: 800, mrp: 1200, rating: 4.9, reviews: 1024, rented: "5K+ rented in past month", image: "📱", category: "phones", delivery: "Tomorrow 8 am - 12 pm", sponsored: true },
    { id: 6, name: "Samsung Galaxy S24 Ultra AI Smartphone | S-Pen | 512GB", brand: "Samsung", price: 750, mrp: 1100, rating: 4.8, reviews: 850, rented: "3K+ rented in past month", image: "📱", category: "phones", delivery: "Tomorrow", sponsored: false },
    { id: 7, name: "Sony A7IV Mirrorless Camera Body | 33MP Full-Frame | 4K 60p Video", brand: "Sony", price: 1200, mrp: 1800, rating: 4.9, reviews: 320, rented: "1K+ rented in past month", image: "📸", category: "cameras", delivery: "Monday, 27 Apr", sponsored: true },
    { id: 8, name: "Canon EOS R5 Mirrorless Camera | 8K Video | 45MP", brand: "Canon", price: 1500, mrp: 2200, rating: 4.8, reviews: 210, rented: "800+ rented in past month", image: "📸", category: "cameras", delivery: "Tuesday, 28 Apr", sponsored: false },
    { id: 9, name: "DJI Mini 3 Pro Drone with Smart Controller | 4K HDR Video", brand: "DJI", price: 800, mrp: 1200, rating: 4.6, reviews: 450, rented: "2K+ rented in past month", image: "🚁", category: "drones", delivery: "Tomorrow", sponsored: true },
    { id: 10, name: "DJI Mavic 3 Classic Drone | Hasselblad Camera | 46 Min Flight Time", brand: "DJI", price: 1400, mrp: 2000, rating: 4.9, reviews: 150, rented: "500+ rented in past month", image: "🚁", category: "drones", delivery: "Sunday, 26 Apr", sponsored: false }
  ];

  const products = slug === 'all' ? allProducts : allProducts.filter(p => p.category === slug);
  const brands = [...new Set(products.map(p => p.brand))];

  return (
    <div className={styles.container}>
      
      {/* Left Sidebar Filters */}
      <aside className={styles.leftSidebar}>
        <div className={styles.filterGroup}>
          <h3>Popular Categories</h3>
          <Link href="/category/laptops">Laptops</Link>
          <Link href="/category/phones">Phones</Link>
          <Link href="/category/cameras">Cameras</Link>
          <Link href="/category/drones">Drones</Link>
          <Link href="/category/all" className={styles.seeMore}><ChevronDown size={14}/> See more</Link>
        </div>

        <div className={styles.filterGroup}>
          <h3>Delivery Day</h3>
          <label><input type="checkbox"/> Get It by Tomorrow</label>
          <label><input type="checkbox"/> Get It in 2 Days</label>
        </div>

        <div className={styles.filterGroup}>
          <h3>Eligible for Free Delivery</h3>
          <label><input type="checkbox"/> Free Delivery</label>
          <p className={styles.helpText}>Get FREE Delivery on eligible orders fulfilled by GadgetGo.</p>
        </div>

        <div className={styles.filterGroup}>
          <h3>Price per day</h3>
          <Link href="#">Under Rs 500</Link>
          <Link href="#">Rs 500 - Rs 1000</Link>
          <Link href="#">Rs 1000 - Rs 2000</Link>
          <Link href="#">Over Rs 2000</Link>
        </div>

        <div className={styles.filterGroup}>
          <h3>Brands</h3>
          {brands.map(brand => (
            <label key={brand}><input type="checkbox"/> {brand}</label>
          ))}
          {brands.length === 0 && <p className={styles.helpText}>No brands available.</p>}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={styles.mainContent}>
        <div className={styles.resultsHeader}>
          <h2>Results</h2>
          <p>Check each product page for other renting options and damage deposit details.</p>
        </div>

        <div className={styles.productList}>
          {products.map(product => (
            <div key={product.id} className={styles.productCard}>
              
              <div className={styles.imageCol}>
                <div className={styles.imagePlaceholder}>{product.image}</div>
              </div>

              <div className={styles.detailsCol}>
                {product.sponsored && (
                  <span className={styles.sponsoredTag}>Sponsored <ShieldCheck size={12}/></span>
                )}
                
                <Link href={`/product/${product.id}`} className={styles.productName}>
                  {product.name}
                </Link>
                
                <div className={styles.ratingRow}>
                  <span className={styles.rating}>{product.rating} <Star size={14} fill="#FF9900" color="#FF9900"/></span>
                  <span className={styles.reviews}>({product.reviews})</span>
                </div>
                <div className={styles.rentedCount}>{product.rented}</div>

                <div className={styles.priceRow}>
                  <span className={styles.priceSymbol}>₹</span>
                  <span className={styles.priceValue}>{product.price}</span>
                  <span className={styles.mrp}>M.R.P: ₹{product.mrp}</span>
                  <span className={styles.discount}>({Math.round(((product.mrp - product.price) / product.mrp) * 100)}% off)</span>
                </div>

                <div className={styles.fulfillment}>
                  <span className={styles.fulfilledBadge}><Check size={12}/> GadgetGo Fulfilled</span>
                </div>

                <div className={styles.deliveryInfo}>
                  FREE delivery <strong>{product.delivery}</strong>
                </div>

                <div className={styles.actions}>
                  <Link href={`/product/${product.id}`} className={styles.addToCartBtn}>
                    Rent Now
                  </Link>
                </div>
              </div>

            </div>
          ))}
        </div>
      </main>

      {/* Right Sidebar */}
      <aside className={styles.rightSidebar}>
        <div className={styles.cartBox}>
          <h3>Subtotal</h3>
          <p className={styles.subtotalPrice}>₹0.00</p>
          <button className={styles.goToCartBtn}>Go to Cart</button>
        </div>

        <div className={styles.adBox}>
          <p>Sponsored</p>
          <div className={styles.adImage}>📸</div>
          <p className={styles.adText}>Upgrade your gear with 20% off DSLR rentals this week!</p>
        </div>
      </aside>

    </div>
  );
}
