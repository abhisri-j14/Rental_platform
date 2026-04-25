"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, Search, ShoppingCart, User, LogIn } from 'lucide-react';
import styles from './Navbar.module.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function Navbar({ toggleSidebar }) {
  const [user, setUser] = useState(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('gadgetgo_token');
    if (!token) {
      setChecked(true);
      return;
    }

    fetch(`${API_URL}/api/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` },
    })
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(data => {
        setUser(data.user);
        setChecked(true);
      })
      .catch(() => {
        localStorage.removeItem('gadgetgo_token');
        setChecked(true);
      });
  }, []);

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

          {checked && user ? (
            /* ── Logged In ── */
            <Link href="/profile" className={styles.iconAction}>
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className={styles.userAvatar} />
              ) : (
                <div className={styles.userAvatarPlaceholder}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
              <span>{user.name.split(' ')[0]}</span>
            </Link>
          ) : (
            /* ── Not Logged In ── */
            <Link href="/login" className={styles.iconAction}>
              <User size={22} />
              <span>Login</span>
            </Link>
          )}

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
