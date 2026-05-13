"use client";
import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

const CartContext = createContext(null);
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

/**
 * Helper: get the current token from localStorage.
 */
function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('gadgetgo_token') || null;
}

/**
 * Convert server cart items (with `product` ObjectId) to the shape
 * the frontend expects (with `_id` as the product identifier).
 */
function normalizeItems(serverItems) {
  return (serverItems || []).map(item => ({
    _id: item.product, // ObjectId string
    title: item.title,
    brand: item.brand,
    category: item.category,
    pricePerDay: item.pricePerDay,
    actualPrice: item.actualPrice || 0,
    damageDeposit: item.damageDeposit,
    days: item.days,
  }));
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [hydrated, setHydrated] = useState(false);
  const fetchingRef = useRef(false);

  // ─── Fetch cart from server ──────────────────────────────
  const fetchCart = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setCartItems([]);
      setHydrated(true);
      return;
    }

    // Prevent duplicate fetches
    if (fetchingRef.current) return;
    fetchingRef.current = true;

    try {
      const res = await fetch(`${API_URL}/api/cart`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!res.ok) {
        setCartItems([]);
      } else {
        const data = await res.json();
        setCartItems(normalizeItems(data.items));
      }
    } catch {
      setCartItems([]);
    } finally {
      fetchingRef.current = false;
      setHydrated(true);
    }
  }, []);

  // Load cart on mount
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  /**
   * refreshCart — call this after login / signup to reload the user's cart.
   */
  const refreshCart = useCallback(() => {
    return fetchCart();
  }, [fetchCart]);

  /**
   * addToCart — requires auth.
   * Returns { requiresLogin: true } if the user is not logged in,
   * so callers can redirect to /login.
   */
  const addToCart = useCallback(async (item) => {
    const token = getToken();
    if (!token) {
      return { requiresLogin: true };
    }

    // Optimistically update local state
    setCartItems(prev => {
      const existing = prev.find(i => i._id === item._id);
      if (existing) {
        return prev.map(i => i._id === item._id ? { ...i, days: item.days } : i);
      }
      return [...prev, item];
    });

    // Persist to server
    try {
      const res = await fetch(`${API_URL}/api/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: item._id,
          title: item.title,
          brand: item.brand,
          category: item.category,
          pricePerDay: item.pricePerDay,
          actualPrice: item.actualPrice || 0,
          damageDeposit: item.damageDeposit,
          days: item.days,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setCartItems(normalizeItems(data.items));
      }
    } catch {
      // best effort
    }

    return { requiresLogin: false };
  }, []);

  const removeFromCart = useCallback(async (id) => {
    const token = getToken();
    setCartItems(prev => prev.filter(i => i._id !== id));
    if (!token) return;

    try {
      const res = await fetch(`${API_URL}/api/cart/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setCartItems(normalizeItems(data.items));
      }
    } catch {}
  }, []);

  const clearCart = useCallback(async () => {
    const token = getToken();
    setCartItems([]);
    if (!token) return;

    try {
      await fetch(`${API_URL}/api/cart`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
    } catch {}
  }, []);

  /**
   * clearLocalCart — clears local state only (used on logout).
   * Does NOT delete server-side cart data so it persists for next login.
   */
  const clearLocalCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const cartCount = cartItems.length;
  const cartSubtotal = cartItems.reduce(
    (sum, item) => sum + item.pricePerDay * item.days,
    0
  );

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      clearCart,
      clearLocalCart,
      refreshCart,
      cartCount,
      cartSubtotal,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
