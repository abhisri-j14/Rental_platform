const express = require('express');
const jwt = require('jsonwebtoken');
const { Product, User } = require('../models');

const router = express.Router();

// ─── Auth Middleware ────────────────────────────────────────
function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  try {
    req.user = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// Owner-only middleware
function ownerOnly(req, res, next) {
  if (req.user.role !== 'owner') {
    return res.status(403).json({ error: 'Only store owners can do this' });
  }
  next();
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  GET ALL PRODUCTS (public — with search, filter, sort)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
router.get('/', async (req, res) => {
  try {
    const { category, brand, search, minPrice, maxPrice, sort } = req.query;

    const filter = {};
    if (category && category !== 'all') filter.category = category;
    if (brand) filter.brand = brand;
    if (minPrice || maxPrice) {
      filter.pricePerDay = {};
      if (minPrice) filter.pricePerDay.$gte = Number(minPrice);
      if (maxPrice) filter.pricePerDay.$lte = Number(maxPrice);
    }
    if (search) {
      filter.$text = { $search: search };
    }

    let sortOption = { createdAt: -1 }; // newest first by default
    if (sort === 'price_asc') sortOption = { pricePerDay: 1 };
    if (sort === 'price_desc') sortOption = { pricePerDay: -1 };
    if (sort === 'rating') sortOption = { rating: -1 };

    const products = await Product.find(filter)
      .sort(sortOption)
      .populate('owner', 'name avatar role')
      .lean();

    res.json({ products, total: products.length });
  } catch (err) {
    console.error('❌ Products fetch error:', err.message);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  GET SINGLE PRODUCT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('owner', 'name avatar role isPhoneVerified');

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ product });
  } catch (err) {
    console.error('❌ Product fetch error:', err.message);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  MY LISTINGS (owner's products)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
router.get('/my/listings', auth, ownerOnly, async (req, res) => {
  try {
    const products = await Product.find({ owner: req.user.id })
      .sort({ createdAt: -1 });
    res.json({ products });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch listings' });
  }
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  CREATE PRODUCT (owner only)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
router.post('/', auth, ownerOnly, async (req, res) => {
  try {
    const { title, brand, description, category, pricePerDay, actualPrice, damageDeposit, specs, images, manufactureDate } = req.body;

    if (!title || !brand || !category || !pricePerDay || !damageDeposit) {
      return res.status(400).json({ error: 'Title, brand, category, price, and damage deposit are required' });
    }

    const product = await Product.create({
      title,
      brand,
      description: description || '',
      category,
      pricePerDay,
      actualPrice: actualPrice || 0,
      damageDeposit,
      specs: specs || {},
      images: images || [],
      manufactureDate: manufactureDate || '',
      owner: req.user.id,
    });

    // SMS notification to owner
    const owner = await User.findById(req.user.id);
    if (owner && owner.phone) {
      const twilioSid = process.env.TWILIO_ACCOUNT_SID;
      if (twilioSid && twilioSid !== 'your_account_sid') {
        try {
          const twilio = require('twilio')(twilioSid, process.env.TWILIO_AUTH_TOKEN);
          await twilio.messages.create({
            body: `✅ Your device "${title}" has been listed on GadgetGo at ₹${pricePerDay}/day! Track it at gadgetgo.com/owner`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: owner.phone,
          });
        } catch (smsErr) {
          console.log('⚠️  SMS failed (Twilio):', smsErr.message);
        }
      } else {
        console.log(`📱 [DEV] SMS to owner ${owner.phone}: Your device "${title}" listed at ₹${pricePerDay}/day`);
      }
    }

    res.status(201).json({ message: 'Product listed!', product });
  } catch (err) {
    console.error('❌ Product create error:', err.message);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  UPDATE PRODUCT (owner only, own product)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
router.put('/:id', auth, ownerOnly, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    if (product.owner.toString() !== req.user.id) {
      return res.status(403).json({ error: 'You can only edit your own products' });
    }

    const allowed = ['title', 'brand', 'description', 'category', 'pricePerDay', 'actualPrice', 'damageDeposit', 'specs', 'images', 'isAvailable', 'manufactureDate'];
    allowed.forEach(key => {
      if (req.body[key] !== undefined) product[key] = req.body[key];
    });

    await product.save();
    res.json({ message: 'Product updated', product });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  DELETE PRODUCT (owner only, own product)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
router.delete('/:id', auth, ownerOnly, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    if (product.owner.toString() !== req.user.id) {
      return res.status(403).json({ error: 'You can only delete your own products' });
    }

    await product.deleteOne();
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

module.exports = router;
