"use client";
import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [hydrated, setHydrated] = useState(false);

  // Storage key depends on user ID
  const storageKey = useMemo(() => {
    return user ? `gadgetgo_cart_${user.id || user._id}` : 'gadgetgo_cart_guest';
  }, [user]);

  // Load from localStorage when storageKey changes
  useEffect(() => {
    setHydrated(false); // Reset hydration to prevent accidental overwrite
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        setCartItems(JSON.parse(stored));
      } else {
        setCartItems([]);
      }
    } catch {
      setCartItems([]);
    }
    setHydrated(true);
  }, [storageKey]);

  // Persist to localStorage whenever cartItems changes (after hydration)
  useEffect(() => {
    if (hydrated) {
      localStorage.setItem(storageKey, JSON.stringify(cartItems));
    }
  }, [cartItems, hydrated, storageKey]);

  /**
   * addToCart — merges if same _id already exists (updates days).
   * item shape: { _id, title, brand, category, pricePerDay, actualPrice, damageDeposit, days }
   */
  const addToCart = useCallback((item) => {
    setCartItems(prev => {
      const existing = prev.find(i => i._id === item._id);
      if (existing) {
        // Update days if product already in cart
        return prev.map(i => i._id === item._id ? { ...i, days: item.days } : i);
      }
      return [...prev, item];
    });
  }, []);

  const removeFromCart = useCallback((id) => {
    setCartItems(prev => prev.filter(i => i._id !== id));
  }, []);

  const clearCart = useCallback(() => {
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
