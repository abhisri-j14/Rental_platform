"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Menu, Search, ShoppingCart, User, X, Trash2, ChevronsRight, ShieldCheck } from 'lucide-react';
import styles from './Navbar.module.css';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const CATEGORY_MENU = [
  {
    key: 'popular',
    label: 'Popular',
    href: '/category/all',
    imageQuery: 'https://www.google.com/search?tbm=isch&q=best+rated+tech+rentals+hd',
    previewTitle: 'Top rated all-rounder',
    previewImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1000',
    review: 'Fast delivery, spotless condition and excellent support. Feels premium every time.',
    brands: ['Apple', 'Sony', 'Canon', 'Dell', 'Samsung'],
  },
  {
    key: 'laptops',
    label: 'Laptops',
    href: '/category/laptops',
    imageQuery: 'https://www.google.com/search?tbm=isch&q=hd+laptop+image+google+images',
    previewTitle: 'Creator laptop with RTX power',
    previewImage: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1000',
    review: 'Perfect for editing, coding and presentations. Great battery life and very clean.',
    brands: ['Apple', 'Dell', 'HP', 'Lenovo', 'Asus', 'MSI'],
  },
  {
    key: 'cameras',
    label: 'Cameras & Lenses',
    href: '/category/cameras',
    imageQuery: 'https://www.google.com/search?tbm=isch&q=hd+camera+lens+image+google+images',
    previewTitle: 'Best-selling camera setup',
    previewImage: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1000',
    review: 'Sharp photos, professional feel and reliable for shoots. The image quality is excellent.',
    brands: ['Canon', 'Nikon', 'Sony', 'Fujifilm', 'GoPro'],
  },
  {
    key: 'phones',
    label: 'Smartphones',
    href: '/category/phones',
    imageQuery: 'https://www.google.com/search?tbm=isch&q=hd+smartphone+image+google+images',
    previewTitle: 'Flagship phone with great reviews',
    previewImage: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1000',
    review: 'Smooth booking, premium finish and exactly as described. Highly rated owner.',
    brands: ['Apple', 'Samsung', 'Google', 'OnePlus', 'Xiaomi'],
  },
  {
    key: 'drones',
    label: 'Drones',
    href: '/category/drones',
    imageQuery: 'https://www.google.com/search?tbm=isch&q=hd+drone+image+google+images',
    previewTitle: 'Best rated drone for aerial shots',
    previewImage: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?q=80&w=1000',
    review: 'Stable flight, impressive camera and fully charged on delivery. A solid rental.',
    brands: ['DJI', 'Autel', 'Parrot', 'Ryze'],
  },
  {
    key: 'tablets',
    label: 'Tablets',
    href: '/category/tablets',
    imageQuery: 'https://www.google.com/search?tbm=isch&q=hd+tablet+image+google+images',
    previewTitle: 'Tablet for work and entertainment',
    previewImage: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=1000',
    review: 'Very neat device, great display and easy checkout. Felt like a premium marketplace purchase.',
    brands: ['Apple', 'Samsung', 'Lenovo', 'Microsoft'],
  },
  {
    key: 'gaming',
    label: 'Gaming Consoles',
    href: '/category/gaming',
    imageQuery: 'https://www.google.com/search?tbm=isch&q=hd+gaming+console+image+google+images',
    previewTitle: 'Most loved gaming console',
    previewImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000',
    review: 'Low latency, excellent condition and a great controller setup. Booked in minutes.',
    brands: ['PlayStation', 'Xbox', 'Nintendo'],
  },
  {
    key: 'vr',
    label: 'VR Headsets',
    href: '/category/vr',
    imageQuery: 'https://www.google.com/search?tbm=isch&q=hd+vr+headset+image+google+images',
    previewTitle: 'Immersive VR experience',
    previewImage: 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?q=80&w=1000',
    review: 'Comfortable fit and very immersive. The owner was helpful and the listing was accurate.',
    brands: ['Meta', 'Apple', 'Pico', 'HTC'],
  },
  {
    key: 'audio',
    label: 'Audio & Music',
    href: '/category/audio',
    imageQuery: 'https://www.google.com/search?tbm=isch&q=hd+audio+equipment+image+google+images',
    previewTitle: 'Studio-grade audio pick',
    previewImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000',
    review: 'Clean sound, premium delivery and the best option for short events or editing sessions.',
    brands: ['Sony', 'Bose', 'Sennheiser', 'JBL', 'Audio-Technica'],
  },
  {
    key: 'accessories',
    label: 'Accessories',
    href: '/category/accessories',
    imageQuery: 'https://www.google.com/search?tbm=isch&q=hd+camera+accessories+image+google+images',
    previewTitle: 'Pro Camera & Tech Gear',
    previewImage: 'https://images.unsplash.com/photo-1493723843671-1d655e66ac1c?q=80&w=1000',
    review: 'Perfect add-ons for every shoot. The equipment was well-maintained and delivered on time.',
    brands: ['Manfrotto', 'Rode', 'SanDisk', 'Anker', 'Ulanzi'],
  },
];

export default function Navbar({ onMenuClick }) {
  const { user, loading: authLoading, logout } = useAuth();
  const [cartOpen, setCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMenu, setActiveMenu] = useState(CATEGORY_MENU[0]);
  const [categoryHoverOpen, setCategoryHoverOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const isComparePage = pathname === '/compare';

  const { cartItems, removeFromCart, cartCount, cartSubtotal } = useCart();

  const emojiMap = {
    laptops: '💻', cameras: '📸', phones: '📱', drones: '🚁',
    tablets: '📱', gaming: '🎮', vr: '🥽', audio: '🎧', accessories: '🔌',
  };

  const getBrandHref = (category, brand) => `/category/${category.key === 'popular' ? 'all' : category.key}?brand=${encodeURIComponent(brand)}`;

  return (
    <>
      <header className={styles.navbar}>
        {/* Top Row: Logo, Search, Actions */}
        <div className={styles.topRow}>
          <div className={styles.logoContainer}>
            <button className={styles.hamburger} onClick={onMenuClick}>
              <Menu size={24} />
            </button>
            <Link href="/" className={styles.brand}>Gi<span className={styles.tiltedZ}>z</span>zmo</Link>
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

            {!authLoading && user ? (
              <Link href="/profile" className={styles.iconAction}>
                <div className={styles.userActionWrapper}>
                  {user.avatar && user.avatar.startsWith('http') ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className={styles.userAvatar}
                      onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                    />
                  ) : null}
                  <div
                    className={styles.userAvatarPlaceholder}
                    style={user.avatar && user.avatar.startsWith('http') ? { display: 'none' } : {}}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                    {user.name.split(' ')[0]}
                    {user.isKycVerified && <ShieldCheck size={12} color="#16a34a" title="Verified User" />}
                  </span>
                </div>
              </Link>
            ) : (
              <Link href="/login" className={styles.iconAction}>
                <User size={22} />
                <span>Login</span>
              </Link>
            )}

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

        {/* Bottom Row: Horizontal Categories List - Hidden on Compare Page */}
        {!isComparePage && (
          <div
            className={styles.bottomArea}
            onMouseLeave={() => {
              setCategoryHoverOpen(false);
              setActiveMenu(CATEGORY_MENU[0]);
            }}
          >
            <div className={styles.bottomRow}>
              <nav className={styles.categories}>
                {CATEGORY_MENU.map(item => (
                  <Link
                    key={item.key}
                    href={item.href}
                    className={styles.categoryLink}
                    onMouseEnter={() => {
                      setActiveMenu(item);
                      setCategoryHoverOpen(true);
                    }}
                    onFocus={() => {
                      setActiveMenu(item);
                      setCategoryHoverOpen(true);
                    }}
                    onClick={() => setCategoryHoverOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              <div className={`${styles.brandPreview} ${categoryHoverOpen ? styles.brandPreviewOpen : ''}`}>
                <div className={styles.brandSide}>
                  <h3>{activeMenu.label}</h3>
                  <p className={styles.brandListLabel}>Available Brands</p>
                  <div className={styles.brandLinks}>
                    {activeMenu.brands.map(brand => (
                      <Link
                        key={brand}
                        href={getBrandHref(activeMenu, brand)}
                        className={styles.brandLinkItem}
                        onClick={() => setCategoryHoverOpen(false)}
                      >
                        {brand}
                      </Link>
                    ))}
                  </div>
                </div>

                <div className={styles.productSide}>
                  <div className={styles.bestRatedBadge}>Best Rated in {activeMenu.label}</div>
                  <div className={styles.previewImageWrap}>
                    <img src={activeMenu.previewImage} alt={activeMenu.previewTitle} className={styles.previewImage} loading="lazy" />
                  </div>
                  <div className={styles.productMeta}>
                    <h4 className={styles.productTitle}>
                      {activeMenu.previewTitle}
                    </h4>
                    <p className={styles.reviewText}>
                      "{activeMenu.review}"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {cartOpen && (
        <div className={styles.drawerOverlay} onClick={() => setCartOpen(false)}>
          <aside className={styles.cartDrawer} onClick={e => e.stopPropagation()}>
            <div className={styles.drawerHeader}>
              <h2 className={styles.drawerTitle}>
                <ShoppingCart size={20} /> Your Cart
                {cartCount > 0 && <span className={styles.drawerBadge}>{cartCount} item{cartCount !== 1 ? 's' : ''}</span>}
              </h2>
              <button className={styles.drawerClose} onClick={() => setCartOpen(false)}>
                <X size={22} />
              </button>
            </div>

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
                      <div className={styles.cartItemImage}>
                        {item.images?.[0] ? (
                          <img src={item.images[0]} alt={item.title} className={styles.cartImg} />
                        ) : (
                          <span className={styles.orderEmoji}>📦</span>
                        )}
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
