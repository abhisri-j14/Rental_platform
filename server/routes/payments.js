const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { Order } = require('../models');
const crypto = require('crypto');
const Razorpay = require('razorpay');

let razorpayInstance = null;
try {
  if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    console.log('✅ Razorpay instance initialized');
  } else {
    console.warn('⚠️  Razorpay keys not set in .env');
  }
} catch (error) {
  console.error('Failed to initialize Razorpay:', error);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  CREATE RAZORPAY ORDER
//  POST /api/payments/create-order
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
router.post('/create-order', protect, async (req, res) => {
  try {
    const { amount, orderId } = req.body;

    if (!amount || !orderId) {
      return res.status(400).json({ error: 'amount and orderId are required' });
    }

    console.log(`💳 Creating Razorpay order | Internal Order: ${orderId} | Amount: ₹${amount}`);

    if (!razorpayInstance) {
      return res.status(503).json({
        error: 'Payment gateway not configured. Please add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to .env',
        missingConfig: true,
      });
    }

    // Razorpay amount is in paise (multiply by 100)
    const options = {
      amount: Math.round(amount * 100),
      currency: 'INR',
      receipt: `receipt_${orderId}`,
    };

    const razorpayOrder = await razorpayInstance.orders.create(options);

    console.log(`🔗 Razorpay order generated: ${razorpayOrder.id}`);

    // Save payment request ID on the order for lookup
    await Order.findByIdAndUpdate(orderId, {
      paymentRequestId: razorpayOrder.id,
      paymentStatus: 'pending',
    });

    res.json({
      success: true,
      razorpayOrderId: razorpayOrder.id,
      amount: options.amount,
      currency: options.currency,
      keyId: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    console.error('❌ Razorpay order creation failed:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to create payment request',
    });
  }
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  VERIFY RAZORPAY PAYMENT (called by frontend after modal success)
//  POST /api/payments/verify-razorpay
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
router.post('/verify-razorpay', protect, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !orderId) {
      return res.status(400).json({ error: 'Missing payment verification details' });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      order.paymentStatus = 'paid';
      order.trackingStatus = 'Payment Verified';
      order.paymentId = razorpay_payment_id;
      await order.save();
      
      console.log(`✅ Order ${order._id} marked PAID via Razorpay verify`);
      
      res.json({ success: true, orderId: order._id });
    } else {
      console.warn('⚠️ Invalid Razorpay signature');
      res.status(400).json({ success: false, error: 'Invalid payment signature' });
    }
  } catch (error) {
    console.error('❌ Payment verify error:', error.message);
    res.status(500).json({ error: 'Verification failed' });
  }
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  CHECK PAYMENT STATUS (frontend polling/refresh)
//  GET /api/payments/status/:orderId
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
router.get('/status/:orderId', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId).select('paymentStatus trackingStatus paymentRequestId');
    if (!order) return res.status(404).json({ error: 'Order not found' });

    res.json({
      orderId: order._id,
      paymentStatus: order.paymentStatus,
      trackingStatus: order.trackingStatus,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch payment status' });
  }
});

module.exports = router;
