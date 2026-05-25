const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const passport = require('passport');
const nodemailer = require('nodemailer');
const { User, OTP } = require('../models');

// ─── Twilio setup ──────────────────────────────────────────
let twilioClient = null;
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_ACCOUNT_SID !== 'your_account_sid') {
  const twilio = require('twilio');
  twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
}

// ─── Email transporter ────────────────────────────────────
let emailTransporter = null;
if (process.env.EMAIL_USER && process.env.EMAIL_PASS && process.env.EMAIL_USER !== 'your-email@gmail.com') {
  emailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

// ─── Helper: generate JWT ──────────────────────────────────
function generateToken(user) {
  const secret = process.env.JWT_SECRET || 'dev-jwt-secret-key-12345';
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    secret,
    { expiresIn: '7d' }
  );
}

// ─── Helper: generate 6-digit OTP ─────────────────────────
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// ─── Helper: send verification email ──────────────────────
async function sendVerificationEmail(user) {
  try {
    const token = crypto.randomBytes(32).toString('hex');
    user.emailVerifyToken = token;
    await user.save();

    const verifyUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/verify-email?token=${token}`;

    if (emailTransporter) {
      await emailTransporter.sendMail({
        from: `"Gizzmo" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: 'Verify your Gizzmo email',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 2rem;">
            <h2>Welcome to Gizzmo! 🎉</h2>
            <p>Hi ${user.name},</p>
            <p>Click the button below to verify your email address:</p>
            <a href="${verifyUrl}" style="display: inline-block; padding: 12px 24px; background: #648DE5; color: #fff; text-decoration: none; border-radius: 8px; font-weight: bold;">
              Verify Email
            </a>
            <p style="margin-top: 1rem; color: #888; font-size: 0.9rem;">
              Or copy this link: ${verifyUrl}
            </p>
          </div>
        `,
      });
      console.log(`📧 Verification email sent to ${user.email}`);
    } else {
      console.log(`📧 [DEV] Email verify link for ${user.email}: ${verifyUrl}`);
    }
  } catch (err) {
    console.error('❌ Failed to send verification email:', err.message);
    // Don't throw here, we want the user to still be created
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  SIGNUP
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
router.post('/signup', async (req, res) => {
  console.log('👤 Signup request received:', req.body.email);
  try {
    const { name, email, password, phone, role } = req.body;

    if (!name || !email || !password || !phone) {
      console.log('⚠️ Signup failed: Missing fields');
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Validate role
    const validRoles = ['user', 'owner'];
    const assignedRole = validRoles.includes(role) ? role : 'user';
    console.log(`📝 Assigning role: ${assignedRole} (Requested: ${role})`);

    // Check if user already exists
    console.log('🔍 Checking for existing user...');
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      console.log('⚠️ Signup failed: User already exists');
      const field = existingUser.email === email ? 'email' : 'phone number';
      return res.status(400).json({ error: `An account with this ${field} already exists` });
    }

    // Hash password and create user
    console.log('🔐 Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 10);
    
    console.log('💾 Creating user in database...');
    const user = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      role: assignedRole,
    });

    user.referralCode = 'GZZM-' + user._id.toString().slice(-4).toUpperCase();

    // Verify referredBy code if provided
    const { referredBy } = req.body;
    if (referredBy) {
      const referrer = await User.findOne({ referralCode: referredBy.toUpperCase().trim() });
      if (referrer) {
        user.referredBy = referrer.referralCode;
        console.log(`🔗 User referred by: ${referrer.email}`);
      }
    }

    await user.save();

    console.log(`✅ User created successfully: ${user._id} as ${user.role} with referralCode ${user.referralCode}`);

    // Send verification email (non-blocking catch inside helper)
    console.log('📧 Triggering verification email...');
    await sendVerificationEmail(user);

    console.log('🎫 Generating token...');
    const token = generateToken(user);
    
    console.log('🚀 Signup complete!');
    res.status(201).json({
      message: 'Account created! Please verify your email and phone number.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        isPhoneVerified: user.isPhoneVerified,
        isEmailVerified: user.isEmailVerified,
        isKycVerified: user.isKycVerified,
        aadhaarNumber: user.aadhaarNumber,
        role: user.role,
        referralCode: user.referralCode,
        credits: user.credits,
      },
    });
  } catch (err) {
    console.error('❌ Signup error stack:', err);
    res.status(500).json({ error: 'Signup failed. ' + err.message });
  }
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  LOGIN (email + password)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user || !user.password) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = generateToken(user);
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        isPhoneVerified: user.isPhoneVerified,
        isEmailVerified: user.isEmailVerified,
        isKycVerified: user.isKycVerified,
        aadhaarNumber: user.aadhaarNumber,
        avatar: user.avatar,
        role: user.role,
        referralCode: user.referralCode,
        credits: user.credits,
      },
    });
  } catch (err) {
    console.error('❌ Login error:', err);
    res.status(500).json({ error: 'Login failed. ' + err.message });
  }
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  SEND OTP (phone verification via Twilio)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
router.post('/send-otp', async (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ error: 'Phone number is required' });
  }

  // Delete any existing OTP for this phone
  await OTP.deleteMany({ phone });

  const code = generateOTP();
  await OTP.create({ phone, code });

  if (twilioClient) {
    // Send real SMS via Twilio
    await twilioClient.messages.create({
      body: `Your GadgetGo verification code is: ${code}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone,
    });
    console.log(`📱 OTP sent via Twilio to ${phone}`);
  } else {
    // No Twilio configured — log OTP for development
    console.log(`📱 [DEV] OTP for ${phone}: ${code}`);
  }

  res.json({ message: 'OTP sent successfully' });
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  VERIFY OTP
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
router.post('/verify-otp', async (req, res) => {
  const { phone, code } = req.body;

  if (!phone || !code) {
    return res.status(400).json({ error: 'Phone and OTP code are required' });
  }

  const otpDoc = await OTP.findOne({ phone, code });
  if (!otpDoc) {
    return res.status(400).json({ error: 'Invalid or expired OTP' });
  }

  if (otpDoc.expiresAt < new Date()) {
    await OTP.deleteOne({ _id: otpDoc._id });
    return res.status(400).json({ error: 'OTP has expired. Request a new one.' });
  }

  // Mark phone as verified
  const user = await User.findOneAndUpdate(
    { phone },
    { isPhoneVerified: true },
    { new: true }
  );

  // Clean up used OTP
  await OTP.deleteMany({ phone });

  if (!user) {
    return res.status(404).json({ error: 'No account found with this phone number' });
  }

  const token = generateToken(user);
  res.json({
    message: 'Phone verified successfully!',
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      isPhoneVerified: user.isPhoneVerified,
      isEmailVerified: user.isEmailVerified,
      isKycVerified: user.isKycVerified,
      aadhaarNumber: user.aadhaarNumber,
      role: user.role,
      referralCode: user.referralCode,
      credits: user.credits,
    },
  });
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  VERIFY EMAIL (via token link)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
router.get('/verify-email/:token', async (req, res) => {
  const { token } = req.params;

  const user = await User.findOne({ emailVerifyToken: token });
  if (!user) {
    return res.status(400).json({ error: 'Invalid or expired verification link' });
  }

  user.isEmailVerified = true;
  user.emailVerifyToken = null;
  await user.save();

  // Redirect to frontend with success
  res.redirect(`${process.env.CLIENT_URL || 'http://localhost:3000'}/login?emailVerified=true`);
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  GOOGLE OAUTH
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  (req, res) => {
    // req.user is set by passport — generate JWT and redirect to frontend
    const token = generateToken(req.user);
    res.redirect(`${process.env.CLIENT_URL || 'http://localhost:3000'}/login?token=${token}`);
  }
);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  GET CURRENT USER (protected route)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
router.get('/me', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const secret = process.env.JWT_SECRET || 'dev-jwt-secret-key-12345';
    const decoded = jwt.verify(token, secret);
    const user = await User.findById(decoded.id).select('-password -emailVerifyToken');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Auto-initialize listingFeeExpiresAt for legacy store owners who don't have it set
    if (user.role === 'owner' && !user.listingFeeExpiresAt) {
      const trialExpiry = new Date();
      trialExpiry.setDate(trialExpiry.getDate() + 90);
      user.listingFeeExpiresAt = trialExpiry;
      await user.save();
    }

    res.json({ user });
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  UPDATE PROFILE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
router.put('/profile', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const secret = process.env.JWT_SECRET || 'dev-jwt-secret-key-12345';
    const decoded = jwt.verify(token, secret);
    const { name, phone } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;

    const user = await User.findByIdAndUpdate(
      decoded.id,
      updateData,
      { new: true }
    ).select('-password -emailVerifyToken');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'Profile updated', user });
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  RESEND VERIFICATION EMAIL
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
router.post('/resend-verify-email', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-jwt-secret-key-12345');
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (user.isEmailVerified) {
      return res.status(400).json({ error: 'Email already verified' });
    }

    await sendVerificationEmail(user);
    res.json({ message: 'Verification email sent' });
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  BECOME OWNER
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
router.put('/become-owner', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const secret = process.env.JWT_SECRET || 'dev-jwt-secret-key-12345';
    const decoded = jwt.verify(token, secret);

    // 3-month free trial from the day they become owner
    const trialExpiry = new Date();
    trialExpiry.setDate(trialExpiry.getDate() + 90);
    
    const user = await User.findByIdAndUpdate(
      decoded.id,
      { role: 'owner', listingFeeExpiresAt: trialExpiry },
      { new: true }
    ).select('-password -emailVerifyToken');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'Congratulations! You are now a Store Owner. 3-month free trial started.', user });
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  SIMULATED AADHAAR KYC VERIFICATION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
router.post('/kyc/verify-aadhaar', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const { aadhaarNumber } = req.body;
  if (!aadhaarNumber || aadhaarNumber.length !== 12) {
    return res.status(400).json({ error: 'Valid 12-digit Aadhaar number required' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const secret = process.env.JWT_SECRET || 'dev-jwt-secret-key-12345';
    const decoded = jwt.verify(token, secret);
    
    // Mask the Aadhaar number for privacy (only keep last 4 digits)
    const maskedAadhaar = `XXXX-XXXX-${aadhaarNumber.slice(-4)}`;

    const user = await User.findByIdAndUpdate(
      decoded.id,
      { isKycVerified: true, aadhaarNumber: maskedAadhaar },
      { new: true }
    ).select('-password -emailVerifyToken');

    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({ message: 'Aadhaar verified successfully (Simulated)', user });
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  PAY LISTING FEE (renew subscription by 30 days)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
router.post('/pay-listing-fee', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const secret = process.env.JWT_SECRET || 'dev-jwt-secret-key-12345';
    const decoded = jwt.verify(token, secret);
    const user = await User.findById(decoded.id);

    if (!user) return res.status(404).json({ error: 'User not found' });
    if (user.role !== 'owner') return res.status(403).json({ error: 'Only store owners can pay listing fee' });

    // Simulate ₹399 payment — extend subscription by 30 days from now or from existing expiry
    const base = user.listingFeeExpiresAt && user.listingFeeExpiresAt > new Date()
      ? new Date(user.listingFeeExpiresAt)
      : new Date();
    base.setDate(base.getDate() + 30);

    user.listingFeeExpiresAt = base;
    await user.save();

    const updatedUser = await User.findById(decoded.id).select('-password -emailVerifyToken');
    console.log(`💰 Listing fee paid by ${user.email}. New expiry: ${base.toISOString()}`);

    res.json({
      message: 'Listing fee paid! Subscription extended by 30 days.',
      listingFeeExpiresAt: base,
      user: updatedUser,
    });
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  GET REFERRALS (referred users list)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
router.get('/referrals', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const secret = process.env.JWT_SECRET || 'dev-jwt-secret-key-12345';
    const decoded = jwt.verify(token, secret);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const referredUsers = await User.find({ referredBy: user.referralCode })
      .select('name email createdAt');

    res.json({
      referralCode: user.referralCode,
      referredCount: referredUsers.length,
      credits: user.credits || 0,
      referredUsers,
    });
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
});

module.exports = router;
