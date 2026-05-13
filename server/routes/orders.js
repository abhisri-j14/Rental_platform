const express = require('express');
const jwt = require('jsonwebtoken');
const { ethers } = require('ethers');
const { Order, Product, User } = require('../models');

const router = express.Router();

// ─── Auth Middleware ────────────────────────────────────────
function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  try {
    const secret = process.env.JWT_SECRET || 'dev-jwt-secret-key-12345';
    req.user = jwt.verify(header.split(' ')[1], secret);
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// ─── Generate Web3 Hash ────────────────────────────────────
function generateTxHash(orderData) {
  const payload = JSON.stringify({
    product: orderData.product,
    renter: orderData.renter,
    owner: orderData.owner,
    amount: orderData.totalAmount,
    days: orderData.days,
    timestamp: Date.now(),
    nonce: Math.random().toString(36).slice(2),
  });
  return ethers.keccak256(ethers.toUtf8Bytes(payload));
}

// ─── Send SMS helper ───────────────────────────────────────
async function sendSMS(to, body) {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  if (sid && sid !== 'your_account_sid') {
    try {
      const twilio = require('twilio')(sid, process.env.TWILIO_AUTH_TOKEN);
      await twilio.messages.create({
        body,
        from: process.env.TWILIO_PHONE_NUMBER,
        to,
      });
    } catch (err) {
      console.log('⚠️  SMS failed:', err.message);
    }
  } else {
    console.log(`📱 [DEV] SMS to ${to}: ${body}`);
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  PLACE ORDER
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
router.post('/', auth, async (req, res) => {
  try {
    const { productId, days, paymentMethod, deliveryAddress } = req.body;

    if (!productId || !days || !deliveryAddress) {
      return res.status(400).json({ error: 'Product, days, and delivery address are required' });
    }

    const product = await Product.findById(productId).populate('owner');
    if (!product) return res.status(404).json({ error: 'Product not found' });
    if (!product.isAvailable) return res.status(400).json({ error: 'Product is not available' });

    // Calculate pricing
    const totalRent = product.pricePerDay * days;
    const platformFee = Math.round(totalRent * 0.10);
    const deliveryFee = 150;
    const totalAmount = totalRent + platformFee + deliveryFee + product.damageDeposit;

    const startDate = new Date();
    const endDate = new Date(startDate.getTime() + days * 24 * 60 * 60 * 1000);

    // Create order
    const order = await Order.create({
      product: product._id,
      renter: req.user.id,
      owner: product.owner._id,
      days,
      startDate,
      endDate,
      totalRent,
      platformFee,
      deliveryFee,
      damageDeposit: product.damageDeposit,
      totalAmount,
      paymentStatus: 'pending',
      trackingStatus: 'Order Placed',
      estimatedDelivery: '2 Days',
      paymentMethod: paymentMethod || 'online',
      deliveryAddress,
    });

    // Generate Web3 transaction hash
    const txHash = generateTxHash({
      product: product._id.toString(),
      renter: req.user.id,
      owner: product.owner._id.toString(),
      totalAmount,
      days,
    });
    order.txHash = txHash;
    await order.save();

    // Update product rented count
    product.rentedCount += 1;
    await product.save();

    // SMS to renter
    const renter = await User.findById(req.user.id);
    if (renter?.phone) {
      await sendSMS(renter.phone, `✅ Your order for "${product.title}" is confirmed! ${days} days rental. Order total: ₹${totalAmount}. TxHash: ${txHash.slice(0, 10)}...`);
    }

    // SMS to owner
    if (product.owner?.phone) {
      await sendSMS(product.owner.phone, `🎉 New booking! "${product.title}" rented for ${days} days by ${renter?.name || 'a customer'}. Amount: ₹${totalAmount}. Check your dashboard.`);
    }

    res.status(201).json({
      message: 'Order placed successfully!',
      order: {
        _id: order._id,
        product: { title: product.title, brand: product.brand },
        days,
        totalRent,
        platformFee,
        deliveryFee,
        damageDeposit: product.damageDeposit,
        totalAmount,
        paymentStatus: order.paymentStatus,
        trackingStatus: order.trackingStatus,
        estimatedDelivery: order.estimatedDelivery,
        txHash,
        startDate,
        endDate,
      },
    });
  } catch (err) {
    console.error('❌ Order create error:', err.message);
    res.status(500).json({ error: 'Failed to place order' });
  }
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  MY ORDERS (renter view)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
router.get('/my-orders', auth, async (req, res) => {
  try {
    const orders = await Order.find({ renter: req.user.id })
      .populate('product', 'title brand images pricePerDay')
      .sort({ createdAt: -1 });
    res.json({ orders });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  MY SALES (owner view)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
router.get('/my-sales', auth, async (req, res) => {
  try {
    const orders = await Order.find({ owner: req.user.id })
      .populate('product', 'title brand images pricePerDay')
      .populate('renter', 'name email phone')
      .sort({ createdAt: -1 });
    res.json({ orders });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch sales' });
  }
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  GET SINGLE ORDER
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('product', 'title brand images pricePerDay')
      .populate('renter', 'name email phone')
      .populate('owner', 'name email phone');

    if (!order) return res.status(404).json({ error: 'Order not found' });

    // Only renter or owner can view
    if (order.renter._id.toString() !== req.user.id && order.owner._id.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    res.json({ order });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  UPDATE ORDER STATUS (owner only)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const { trackingStatus, paymentStatus } = req.body;
    
    const order = await Order.findById(req.params.id).populate('product', 'title');
    if (!order) return res.status(404).json({ error: 'Order not found' });
    if (order.owner.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Only the product owner can update order status' });
    }

    if (trackingStatus) {
      const validTracking = ['Order Placed', 'Payment Verified', 'Handed over to Courier', 'In Transit', 'Out for Delivery', 'Delivered'];
      if (!validTracking.includes(trackingStatus)) {
        return res.status(400).json({ error: 'Invalid tracking status' });
      }
      order.trackingStatus = trackingStatus;
    }

    if (paymentStatus) {
      const validPayment = ['pending', 'paid', 'failed'];
      if (!validPayment.includes(paymentStatus)) {
        return res.status(400).json({ error: 'Invalid payment status' });
      }
      order.paymentStatus = paymentStatus;
    }

    await order.save();

    // Notify renter about update
    const renter = await User.findById(order.renter);
    if (renter?.phone) {
      const updateMsg = trackingStatus ? `now "${trackingStatus}"` : `payment is "${paymentStatus}"`;
      await sendSMS(renter.phone, `📦 Order update: Your rental of "${order.product.title}" ${updateMsg}.`);
    }

    res.json({ message: 'Order status updated', order });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

module.exports = router;
