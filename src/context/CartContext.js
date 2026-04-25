"use client";
import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [hydrated, setHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('gadgetgo_cart');
      if (stored) {
        setCartItems(JSON.parse(stored));
      }
    } catch {
      // ignore parse errors
    }
    setHydrated(true);
  }, []);

  // Persist to localStorage whenever cartItems changes (after hydration)
  useEffect(() => {
    if (hydrated) {
      localStorage.setItem('gadgetgo_cart', JSON.stringify(cartItems));
    }
  }, [cartItems, hydrated]);

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
