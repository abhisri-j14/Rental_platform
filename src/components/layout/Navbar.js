"use client";
import Link from 'next/link';
import { Menu, Search, ShoppingCart, User } from 'lucide-react';
import styles from './Navbar.module.css';

export default function Navbar({ toggleSidebar }) {
  return (
    <header className={styles.navbar}>
      
      {/* Top Row: Logo, Search, Actions */}
      <div className={styles.topRow}>
        <div className={styles.logoContainer}>
          <button className={styles.hamburger} onClick={toggleSidebar}>
            <Menu size={24} />
          </button>
          <Link href="/" className={styles.brand}>Gadget<span className={styles.accent}>Go</span></Link>
        </div>

        <div className={styles.searchContainer}>
          <Search size={20} className={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="Try Laptops, Cameras or Search by Device Name" 
            className={styles.searchInput} 
          />
        </div>

        <div className={styles.rightActions}>
          <Link href="/owner" className={styles.actionText}>List Your Device</Link>
          <div className={styles.divider}></div>
          <Link href="/compare" className={styles.actionText}>Compare</Link>
          <div className={styles.divider}></div>
          <Link href="/login" className={styles.iconAction}>
            <User size={22} />
            <span>Profile</span>
          </Link>
          <Link href="/checkout" className={styles.iconAction}>
            <ShoppingCart size={22} />
            <span>Cart</span>
          </Link>
        </div>
      </div>

      {/* Bottom Row: Horizontal Categories List */}
      <div className={styles.bottomRow}>
        <nav className={styles.categories}>
          <Link href="/category/all">Popular</Link>
          <Link href="/category/laptops">Laptops</Link>
          <Link href="/category/cameras">Cameras & Lenses</Link>
          <Link href="/category/phones">Smartphones</Link>
          <Link href="/category/drones">Drones</Link>
          <Link href="/category/tablets">Tablets</Link>
          <Link href="/category/gaming">Gaming Consoles</Link>
          <Link href="/category/vr">VR Headsets</Link>
          <Link href="/category/audio">Audio & Music</Link>
          <Link href="/category/accessories">Accessories</Link>
        </nav>
      </div>

    </header>
  );
}
