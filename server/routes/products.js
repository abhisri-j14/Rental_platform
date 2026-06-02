const express = require('express');
const jwt = require('jsonwebtoken');
const { Product, User } = require('../models');
const upload = require('../utils/upload');

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

// Owner-only middleware (Verifies from DB to handle role updates without re-login)
async function ownerOnly(req, res, next) {
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.role !== 'owner') {
      return res.status(403).json({ error: 'Only store owners can do this' });
    }
    next();
  } catch (err) {
    return res.status(500).json({ error: 'Server error during authorization' });
  }
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

    let sortOption = { isBoosted: -1, createdAt: -1 }; // boosted first, then newest first by default
    if (sort === 'price_asc') sortOption = { isBoosted: -1, pricePerDay: 1 };
    if (sort === 'price_desc') sortOption = { isBoosted: -1, pricePerDay: -1 };
    if (sort === 'rating') sortOption = { isBoosted: -1, rating: -1 };

    const products = await Product.find(filter)
      .sort(sortOption)
      .populate('owner', 'name avatar role')
      .lean();

    const host = req.get('host');
    const protocol = req.protocol;
    const formattedProducts = products.map(product => {
      if (product.images) {
        product.images = product.images.map(img => {
          if (img && img.startsWith('http://localhost:5000')) {
            return img.replace('http://localhost:5000', `${protocol}://${host}`);
          }
          return img;
        });
      }
      return product;
    });

    res.json({ products: formattedProducts, total: formattedProducts.length });
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
      .populate('owner', 'name avatar role isPhoneVerified isKycVerified');

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const host = req.get('host');
    const protocol = req.protocol;
    const productObj = product.toObject();
    if (productObj.images) {
      productObj.images = productObj.images.map(img => {
        if (img && img.startsWith('http://localhost:5000')) {
          return img.replace('http://localhost:5000', `${protocol}://${host}`);
        }
        return img;
      });
    }

    res.json({ product: productObj });
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
      .sort({ createdAt: -1 })
      .lean();

    const host = req.get('host');
    const protocol = req.protocol;
    const formattedProducts = products.map(product => {
      if (product.images) {
        product.images = product.images.map(img => {
          if (img && img.startsWith('http://localhost:5000')) {
            return img.replace('http://localhost:5000', `${protocol}://${host}`);
          }
          return img;
        });
      }
      return product;
    });

    res.json({ products: formattedProducts });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch listings' });
  }
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  CREATE PRODUCT (owner only + File Uploads)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
router.post('/', auth, ownerOnly, upload.array('images', 10), async (req, res) => {
  try {
    const { title, brand, description, category, pricePerDay, actualPrice, damageDeposit, specs, manufactureDate } = req.body;
    const isShopOwner = req.body.isShopOwner === 'true' || req.body.isShopOwner === true;
    const isShopRegistered = req.body.isShopRegistered === 'true' || req.body.isShopRegistered === true;
    const shopName = req.body.shopName || '';
    const shopOpenedYear = req.body.shopOpenedYear || '';
    const shopLicenseNo = req.body.shopLicenseNo || '';

    if (!title || !brand || !category || !pricePerDay || !damageDeposit) {
      return res.status(400).json({ error: 'Title, brand, category, price, and damage deposit are required' });
    }

    // Check listing fee subscription — skip during trial (listingFeeExpiresAt is set when they become owner)
    const ownerUser = await User.findById(req.user.id);
    if (ownerUser && ownerUser.listingFeeExpiresAt && ownerUser.listingFeeExpiresAt < new Date()) {
      return res.status(403).json({
        error: 'Your listing subscription has expired. Please renew (₹399/month) to continue listing devices.',
        subscriptionExpired: true,
      });
    }

    // Process uploaded files
    const imageUrls = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        if (file.buffer) {
          const base64Data = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
          imageUrls.push(base64Data);
        } else {
          // Construct public URL
          const url = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
          imageUrls.push(url);
        }
      });
    }

    // If no files uploaded, check if URLs were provided (fallback)
    const finalImages = imageUrls.length > 0 ? imageUrls : (req.body.images || []);

    // Parse specs if it's a string (multipart/form-data sends everything as string)
    let parsedSpecs = specs;
    if (typeof specs === 'string') {
      try {
        parsedSpecs = JSON.parse(specs);
      } catch (e) {
        parsedSpecs = {};
      }
    }

    const product = await Product.create({
      title,
      brand,
      description: description || '',
      category,
      pricePerDay: Number(pricePerDay),
      actualPrice: Number(actualPrice) || 0,
      damageDeposit: Number(damageDeposit),
      specs: parsedSpecs || {},
      images: finalImages,
      manufactureDate: manufactureDate || '',
      owner: req.user.id,
      isShopOwner,
      shopName,
      shopOpenedYear,
      shopLicenseNo,
      isShopRegistered
    });

    // SMS notification to owner
    const owner = await User.findById(req.user.id);
    if (owner && owner.phone) {
      const twilioSid = process.env.TWILIO_ACCOUNT_SID;
      if (twilioSid && twilioSid !== 'your_account_sid') {
        try {
          const twilio = require('twilio')(twilioSid, process.env.TWILIO_AUTH_TOKEN);
          await twilio.messages.create({
            body: `✅ Your device "${title}" has been listed on Gizzmo at ₹${pricePerDay}/day! Track it at gizzmo.com/owner`,
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

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  BOOST PRODUCT (owner only, own product)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
router.post('/:id/boost', auth, ownerOnly, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    if (product.owner.toString() !== req.user.id) {
      return res.status(403).json({ error: 'You can only boost your own products' });
    }

    // Simulate ₹99 payment — boost for 7 days
    const boostedUntil = new Date();
    boostedUntil.setDate(boostedUntil.getDate() + 7);

    product.isBoosted = true;
    product.boostedUntil = boostedUntil;
    await product.save();

    console.log(`⚡ Product "${product.title}" boosted until ${boostedUntil.toISOString()} by owner ${req.user.id}`);

    res.json({
      message: 'Product boosted for 7 days! It will appear at the top of search results.',
      boostedUntil,
      product,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to boost product' });
  }
});

module.exports = router;
