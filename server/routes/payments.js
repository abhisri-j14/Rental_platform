const express = require('express');
const router = express.Router();
const instamojo = require('../utils/instamojo');
const { protect } = require('../middleware/auth');
const { Order } = require('../models');

const crypto = require('crypto');

router.post('/create-request', protect, async (req, res) => {
  try {
    const { amount, purpose, buyerName, email, phone, orderId } = req.body;
    console.log(`💳 Creating payment request for Order: ${orderId}, Amount: ${amount}`);

    const paymentRequest = await instamojo.createPaymentRequest({
      amount,
      purpose,
      buyerName,
      email,
      phone,
      redirectUrl: `${process.env.CLIENT_URL}/order/${orderId}/tracking?payment_success=true`
    });

    console.log(`🔗 Generated Instamojo Link: ${paymentRequest.longurl}`);

    // Update order with payment request ID
    await Order.findByIdAndUpdate(orderId, { paymentRequestId: paymentRequest.id });

    res.json({
      success: true,
      paymentRequestUrl: paymentRequest.longurl,
      requestId: paymentRequest.id
    });
  } catch (error) {
    console.error('❌ Payment Creation Failed:', error.message);
    res.status(500).json({ 
      success: false,
      error: error.message || 'Internal Server Error' 
    });
  }
});

// Webhook for Instamojo
router.post('/webhook', async (req, res) => {
  try {
    const data = req.body;
    const macSent = data.mac;
    delete data.mac;

    // Sort keys alphabetically
    const keys = Object.keys(data).sort();
    let str = "";
    for (const key of keys) {
      str += data[key] + "|";
    }
    // Remove last pipe
    str = str.slice(0, -1);

    const macCalculated = crypto
      .createHmac('sha1', process.env.INSTAMOJO_SALT)
      .update(str)
      .digest('hex');

    if (macCalculated === macSent) {
      if (data.status === 'Credit') {
        const order = await Order.findOne({ paymentRequestId: data.payment_request_id });
        if (order) {
          order.paymentStatus = 'paid';
          order.trackingStatus = 'Payment Verified';
          await order.save();
          console.log(`✅ Order ${order._id} updated to PAID via Webhook`);
        }
      }
    } else {
      console.log('⚠️ Invalid Webhook MAC signature');
    }
    
    res.status(200).send('OK');
  } catch (error) {
    console.error('Webhook Error:', error);
    res.status(500).send('Error');
  }
});

module.exports = router;
