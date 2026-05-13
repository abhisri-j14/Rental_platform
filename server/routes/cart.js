const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { Cart } = require('../models');

// ─── Auth middleware ────────────────────────────────────────
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  GET CART — Fetch current user's cart
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
router.get('/', requireAuth, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.userId });
    if (!cart) {
      cart = await Cart.create({ user: req.userId, items: [] });
    }
    res.json({ items: cart.items });
  } catch (err) {
    console.error('❌ Get cart error:', err);
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  ADD / UPDATE ITEM — Add item or update days if already in cart
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
router.post('/', requireAuth, async (req, res) => {
  try {
    const { productId, title, brand, category, pricePerDay, actualPrice, damageDeposit, days } = req.body;

    if (!productId) {
      return res.status(400).json({ error: 'productId is required' });
    }

    let cart = await Cart.findOne({ user: req.userId });
    if (!cart) {
      cart = await Cart.create({ user: req.userId, items: [] });
    }

    // Check if product already in cart
    const existingIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    );

    if (existingIndex >= 0) {
      // Update days
      cart.items[existingIndex].days = days || cart.items[existingIndex].days;
    } else {
      // Add new item
      cart.items.push({
        product: productId,
        title,
        brand,
        category,
        pricePerDay,
        actualPrice: actualPrice || 0,
        damageDeposit,
        days: days || 1,
      });
    }

    await cart.save();
    res.json({ items: cart.items });
  } catch (err) {
    console.error('❌ Add to cart error:', err);
    res.status(500).json({ error: 'Failed to add to cart' });
  }
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  REMOVE ITEM — Remove a single product from cart
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
router.delete('/:productId', requireAuth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.userId });
    if (!cart) {
      return res.json({ items: [] });
    }

    cart.items = cart.items.filter(
      item => item.product.toString() !== req.params.productId
    );
    await cart.save();
    res.json({ items: cart.items });
  } catch (err) {
    console.error('❌ Remove from cart error:', err);
    res.status(500).json({ error: 'Failed to remove from cart' });
  }
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  CLEAR CART — Remove all items from user's cart
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
router.delete('/', requireAuth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.userId });
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    res.json({ items: [] });
  } catch (err) {
    console.error('❌ Clear cart error:', err);
    res.status(500).json({ error: 'Failed to clear cart' });
  }
});

module.exports = router;
