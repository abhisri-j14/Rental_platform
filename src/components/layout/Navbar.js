"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, Search, ShoppingCart, User, X, Trash2, ChevronsRight } from 'lucide-react';
import styles from './Navbar.module.css';
import { useCart } from '@/context/CartContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function Navbar({ onMenuClick }) {
  const [user, setUser] = useState(null);
  const [checked, setChecked] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const { cartItems, removeFromCart, cartCount, cartSubtotal } = useCart();

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

  const emojiMap = {
    laptops: '💻', cameras: '📸', phones: '📱', drones: '🚁',
    tablets: '📱', gaming: '🎮', vr: '🥽', audio: '🎧', accessories: '🔌',
  };

  return (
    <>
      <header className={styles.navbar}>
        {/* Top Row: Logo, Search, Actions */}
        <div className={styles.topRow}>
          <div className={styles.logoContainer}>
            <button className={styles.hamburger} onClick={onMenuClick}>
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchQuery.trim()) {
                  router.push(`/category/all?search=${encodeURIComponent(searchQuery.trim())}`);
                }
              }}
            />
          </div>

          <div className={styles.rightActions}>
            <Link href="/owner" className={styles.actionText}>List Your Device</Link>
            <div className={styles.divider}></div>
            <Link href="/compare" className={styles.actionText}>Compare</Link>
            <div className={styles.divider}></div>

            {checked && user ? (
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
              <Link href="/login" className={styles.iconAction}>
                <User size={22} />
                <span>Login</span>
              </Link>
            )}

            {/* Cart Button with badge */}
            <button
              className={styles.cartBtn}
              onClick={() => setCartOpen(true)}
              aria-label="Open Cart"
            >
              <div className={styles.cartIconWrapper}>
                <ShoppingCart size={22} />
                {cartCount > 0 && (
                  <span className={styles.cartBadge}>{cartCount > 99 ? '99+' : cartCount}</span>
                )}
              </div>
              <span>Cart</span>
            </button>
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

      {/* Cart Drawer Overlay */}
      {cartOpen && (
        <div className={styles.drawerOverlay} onClick={() => setCartOpen(false)}>
          <aside className={styles.cartDrawer} onClick={e => e.stopPropagation()}>
            {/* Drawer Header */}
            <div className={styles.drawerHeader}>
              <h2 className={styles.drawerTitle}>
                <ShoppingCart size={20} /> Your Cart
                {cartCount > 0 && <span className={styles.drawerBadge}>{cartCount} item{cartCount !== 1 ? 's' : ''}</span>}
              </h2>
              <button className={styles.drawerClose} onClick={() => setCartOpen(false)}>
                <X size={22} />
              </button>
            </div>

            {/* Drawer Body */}
            <div className={styles.drawerBody}>
              {cartItems.length === 0 ? (
                <div className={styles.emptyCart}>
                  <div className={styles.emptyIcon}>🛒</div>
                  <p>Your cart is empty</p>
                  <span>Add items to get started!</span>
                </div>
              ) : (
                <ul className={styles.cartList}>
                  {cartItems.map(item => (
                    <li key={item._id} className={styles.cartItem}>
                      <div className={styles.cartItemEmoji}>
                        {emojiMap[item.category] || '📦'}
                      </div>
                      <div className={styles.cartItemInfo}>
                        <p className={styles.cartItemTitle}>{item.title}</p>
                        <p className={styles.cartItemBrand}>{item.brand}</p>
                        <p className={styles.cartItemDays}>
                          {item.days} day{item.days !== 1 ? 's' : ''} × ₹{item.pricePerDay}/day
                        </p>
                        <p className={styles.cartItemTotal}>
                          ₹{(item.pricePerDay * item.days).toLocaleString('en-IN')}
                        </p>
                        {item.damageDeposit > 0 && (
                          <p className={styles.cartItemDeposit}>
                            + ₹{item.damageDeposit.toLocaleString('en-IN')} refundable deposit
                          </p>
                        )}
                      </div>
                      <button
                        className={styles.cartItemRemove}
                        onClick={() => removeFromCart(item._id)}
                        title="Remove from cart"
                      >
                        <Trash2 size={16} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Drawer Footer */}
            {cartItems.length > 0 && (
              <div className={styles.drawerFooter}>
                <div className={styles.subtotalRow}>
                  <span>Subtotal ({cartCount} item{cartCount !== 1 ? 's' : ''})</span>
                  <strong>₹{cartSubtotal.toLocaleString('en-IN')}</strong>
                </div>
                <p className={styles.depositNote}>
                  * Refundable deposits charged separately at checkout
                </p>
                <Link
                  href="/checkout"
                  className={styles.checkoutBtn}
                  onClick={() => setCartOpen(false)}
                >
                  <ChevronsRight size={18} /> Proceed to Checkout
                </Link>
              </div>
            )}
          </aside>
        </div>
      )}
    </>
  );
}
