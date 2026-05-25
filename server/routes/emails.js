const express = require('express');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
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

// ─── Email Transporter Setup ───────────────────────────────
// Uses Gmail SMTP with App Password from .env
// To get an App Password: Google Account → Security → 2-Step Verification → App Passwords
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // your Gmail address
    pass: process.env.EMAIL_PASS, // your Gmail App Password (not your actual password)
  },
});

// Helper: verify email config on startup
transporter.verify((error) => {
  if (error) {
    console.log('⚠️  Email transporter not configured:', error.message);
  } else {
    console.log('✅ Email service ready (Gmail SMTP)');
  }
});

// ─── Helper: Send Email ─────────────────────────────────────
async function sendEmail(to, subject, html) {
  // If email credentials are not set, just log in dev mode
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log(`📧 [DEV] Email to ${to}: ${subject}`);
    return;
  }
  try {
    await transporter.sendMail({
      from: `"Gizzmo Rentals" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`✅ Email sent to ${to}`);
  } catch (err) {
    // Don't crash the app if email fails — just log it
    console.log(`⚠️  Email failed to ${to}:`, err.message);
  }
}

// ─── Helper: Format currency ───────────────────────────────
const fmt = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

// ─── Helper: Format date ────────────────────────────────────
const fmtDate = (d) => new Date(d).toLocaleDateString('en-IN', {
  day: 'numeric', month: 'long', year: 'numeric'
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  POST /api/emails/inspection-complete
//  Called by Gizzmo support team after return inspection.
//  Sends post-return summary emails to both renter and retailer.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
router.post('/inspection-complete', auth, async (req, res) => {
  try {
    const {
      orderId,
      damageLevel,       // 'none' | 'minor' | 'moderate' | 'severe'
      damageDescription, // short description of damage (if any)
      deductedAmount,    // how much was deducted from deposit (number)
      poolContribution,  // how much the protection pool contributed (number)
    } = req.body;

    if (!orderId) {
      return res.status(400).json({ error: 'orderId is required' });
    }

    // Fetch the order with all related data populated
    const order = await Order.findById(orderId)
      .populate('product', 'title brand actualPrice protectionFee pricePerDay')
      .populate('renter', 'name email phone')
      .populate('owner', 'name email phone');

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Only the owner or a verified admin can trigger this endpoint
    // (For now: owner can trigger it — in production, restrict to admin role)
    if (order.owner._id.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Only the device owner can trigger inspection completion' });
    }

    // Calculate refund amounts
    const deposit = order.damageDeposit || 0;
    const deducted = Number(deductedAmount || 0);
    const refundAmount = Math.max(0, deposit - deducted);

    // ── Condition display strings ──────────────────────────
    const conditionBadge = {
      none:     '✅ No damage found',
      minor:    '⚠️ Minor damage found',
      moderate: '⚠️ Moderate damage found',
      severe:   '❌ Severe damage / Theft',
    }[damageLevel] || '✅ Inspection complete';

    const depositStatusLine = damageLevel === 'none'
      ? `<span style="color:#16a34a;font-weight:700;">✅ Full deposit refunded — ${fmt(deposit)}</span>`
      : deducted >= deposit
        ? `<span style="color:#dc2626;font-weight:700;">❌ Full deposit retained — ${fmt(deposit)} deducted</span>`
        : `<span style="color:#d97706;font-weight:700;">⚠️ Partial deduction — ${fmt(deducted)} deducted, ${fmt(refundAmount)} refunded</span>`;

    // ── RENTER EMAIL ───────────────────────────────────────
    const renterHtml = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;color:#1f2937;">
        <div style="background:linear-gradient(135deg,#1a1a2e,#0f3460);padding:2rem;border-radius:12px 12px 0 0;text-align:center;">
          <h1 style="color:#f5f0e8;font-size:1.6rem;margin:0;">Gizzmo Rental Summary</h1>
          <p style="color:rgba(255,255,255,0.6);margin:0.5rem 0 0 0;font-size:0.9rem;">Order #${order._id.toString().slice(-8).toUpperCase()}</p>
        </div>

        <div style="background:#fff;padding:2rem;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px;">

          <h2 style="color:#111;font-size:1.1rem;margin-bottom:1.25rem;border-bottom:1px solid #f3f4f6;padding-bottom:0.75rem;">
            📦 Rental Summary
          </h2>
          <table style="width:100%;border-collapse:collapse;font-size:0.93rem;color:#4b5563;">
            <tr><td style="padding:0.4rem 0;color:#9ca3af;">Device</td><td style="padding:0.4rem 0;text-align:right;font-weight:600;">${order.product?.title || 'Device'}</td></tr>
            <tr><td style="padding:0.4rem 0;color:#9ca3af;">Brand</td><td style="padding:0.4rem 0;text-align:right;font-weight:600;">${order.product?.brand || ''}</td></tr>
            <tr><td style="padding:0.4rem 0;color:#9ca3af;">Rental Period</td><td style="padding:0.4rem 0;text-align:right;font-weight:600;">${fmtDate(order.startDate)} – ${fmtDate(order.endDate)} (${order.days} days)</td></tr>
            <tr><td style="padding:0.4rem 0;color:#9ca3af;">Rental Fee Paid</td><td style="padding:0.4rem 0;text-align:right;font-weight:600;">${fmt(order.totalRent)}</td></tr>
            <tr><td style="padding:0.4rem 0;color:#9ca3af;">Protection Fee</td><td style="padding:0.4rem 0;text-align:right;">${fmt(order.protectionFee)} <span style="color:#9ca3af;font-size:0.8rem;">(non-refundable)</span></td></tr>
            <tr><td style="padding:0.4rem 0;color:#9ca3af;">Delivery Fee</td><td style="padding:0.4rem 0;text-align:right;">${order.deliveryFee === 0 ? 'FREE' : fmt(order.deliveryFee)}</td></tr>
          </table>

          <div style="background:#f9fafb;border-radius:8px;padding:1.25rem;margin:1.5rem 0;">
            <h2 style="color:#111;font-size:1rem;margin:0 0 0.75rem 0;">🔍 Device Condition Report</h2>
            <table style="width:100%;border-collapse:collapse;font-size:0.9rem;color:#4b5563;">
              <tr><td style="padding:0.35rem 0;color:#9ca3af;">Post-Return Condition</td><td style="padding:0.35rem 0;text-align:right;">${conditionBadge}</td></tr>
              ${damageDescription ? `<tr><td style="padding:0.35rem 0;color:#9ca3af;">Details</td><td style="padding:0.35rem 0;text-align:right;">${damageDescription}</td></tr>` : ''}
              <tr><td style="padding:0.35rem 0;color:#9ca3af;">Inspected By</td><td style="padding:0.35rem 0;text-align:right;">Gizzmo Support Team</td></tr>
              <tr><td style="padding:0.35rem 0;color:#9ca3af;">Inspection Date</td><td style="padding:0.35rem 0;text-align:right;">${fmtDate(new Date())}</td></tr>
            </table>
          </div>

          <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:1.25rem;margin-bottom:1.5rem;">
            <h2 style="color:#111;font-size:1rem;margin:0 0 0.75rem 0;">💰 Deposit Status</h2>
            <table style="width:100%;border-collapse:collapse;font-size:0.9rem;color:#4b5563;">
              <tr><td style="padding:0.35rem 0;color:#9ca3af;">Deposit Paid</td><td style="padding:0.35rem 0;text-align:right;font-weight:600;">${fmt(deposit)}</td></tr>
              <tr><td style="padding:0.35rem 0;color:#9ca3af;">Amount Deducted</td><td style="padding:0.35rem 0;text-align:right;color:#dc2626;font-weight:600;">${deducted > 0 ? `− ${fmt(deducted)}` : '₹0'}</td></tr>
              <tr><td style="padding:0.35rem 0;color:#9ca3af;">Refund Amount</td><td style="padding:0.35rem 0;text-align:right;">${depositStatusLine}</td></tr>
            </table>
            ${refundAmount > 0 ? '<p style="margin:0.75rem 0 0 0;font-size:0.82rem;color:#15803d;">Your refund will be processed within 2 hours of this notification.</p>' : ''}
          </div>

          <p style="font-size:0.85rem;color:#9ca3af;text-align:center;margin-top:1.5rem;">
            Thank you for renting with Gizzmo 🚀<br/>
            Questions? Email us at <a href="mailto:support@gizzmo.in" style="color:#4f46e5;">support@gizzmo.in</a>
          </p>
        </div>
      </div>
    `;

    // ── RETAILER EMAIL ─────────────────────────────────────
    const commission = order.platformFee || Math.round(order.totalRent * 0.2);
    const ownerPayout = order.totalRent - commission;

    const retailerHtml = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;color:#1f2937;">
        <div style="background:linear-gradient(135deg,#1a1a2e,#0f3460);padding:2rem;border-radius:12px 12px 0 0;text-align:center;">
          <h1 style="color:#f5f0e8;font-size:1.6rem;margin:0;">Gizzmo — Rental Completion Report</h1>
          <p style="color:rgba(255,255,255,0.6);margin:0.5rem 0 0 0;font-size:0.9rem;">Order #${order._id.toString().slice(-8).toUpperCase()}</p>
        </div>

        <div style="background:#fff;padding:2rem;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px;">

          <h2 style="color:#111;font-size:1.1rem;margin-bottom:1.25rem;border-bottom:1px solid #f3f4f6;padding-bottom:0.75rem;">
            📦 Rental Summary
          </h2>
          <table style="width:100%;border-collapse:collapse;font-size:0.93rem;color:#4b5563;">
            <tr><td style="padding:0.4rem 0;color:#9ca3af;">Device</td><td style="padding:0.4rem 0;text-align:right;font-weight:600;">${order.product?.title || 'Device'}</td></tr>
            <tr><td style="padding:0.4rem 0;color:#9ca3af;">Renter</td><td style="padding:0.4rem 0;text-align:right;font-weight:600;">${order.renter?.name || 'Customer'}</td></tr>
            <tr><td style="padding:0.4rem 0;color:#9ca3af;">Rental Period</td><td style="padding:0.4rem 0;text-align:right;font-weight:600;">${fmtDate(order.startDate)} – ${fmtDate(order.endDate)} (${order.days} days)</td></tr>
          </table>

          <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:1.25rem;margin:1.5rem 0;">
            <h2 style="color:#111;font-size:1rem;margin:0 0 0.75rem 0;">💸 Your Payout</h2>
            <table style="width:100%;border-collapse:collapse;font-size:0.9rem;color:#4b5563;">
              <tr><td style="padding:0.35rem 0;color:#9ca3af;">Total Rental Fee</td><td style="padding:0.35rem 0;text-align:right;">${fmt(order.totalRent)}</td></tr>
              <tr><td style="padding:0.35rem 0;color:#9ca3af;">Gizzmo Commission (20%)</td><td style="padding:0.35rem 0;text-align:right;color:#dc2626;">− ${fmt(commission)}</td></tr>
              <tr style="border-top:1px solid #e5e7eb;"><td style="padding:0.5rem 0;font-weight:700;color:#111;">Net Payout to You</td><td style="padding:0.5rem 0;text-align:right;font-weight:800;font-size:1.1rem;color:#16a34a;">${fmt(ownerPayout)}</td></tr>
            </table>
            ${poolContribution > 0 ? `<p style="margin:0.75rem 0 0 0;font-size:0.82rem;color:#15803d;">+ ${fmt(poolContribution)} damage compensation from Protection Pool (separate transfer).</p>` : ''}
          </div>

          <div style="background:#f9fafb;border-radius:8px;padding:1.25rem;margin-bottom:1.5rem;">
            <h2 style="color:#111;font-size:1rem;margin:0 0 0.75rem 0;">🔍 Device Condition Report</h2>
            <table style="width:100%;border-collapse:collapse;font-size:0.9rem;color:#4b5563;">
              <tr><td style="padding:0.35rem 0;color:#9ca3af;">Return Condition</td><td style="padding:0.35rem 0;text-align:right;">${conditionBadge}</td></tr>
              ${damageDescription ? `<tr><td style="padding:0.35rem 0;color:#9ca3af;">Damage Details</td><td style="padding:0.35rem 0;text-align:right;">${damageDescription}</td></tr>` : ''}
              ${deducted > 0 ? `<tr><td style="padding:0.35rem 0;color:#9ca3af;">Compensation to You</td><td style="padding:0.35rem 0;text-align:right;font-weight:600;color:#d97706;">${fmt(deducted + (poolContribution || 0))}</td></tr>` : ''}
              <tr><td style="padding:0.35rem 0;color:#9ca3af;">Inspection Date</td><td style="padding:0.35rem 0;text-align:right;">${fmtDate(new Date())}</td></tr>
            </table>
          </div>

          <p style="font-size:0.85rem;color:#9ca3af;text-align:center;margin-top:1.5rem;">
            Thank you for listing on Gizzmo 🚀<br/>
            Questions? Email us at <a href="mailto:support@gizzmo.in" style="color:#4f46e5;">support@gizzmo.in</a>
          </p>
        </div>
      </div>
    `;

    // ── Send both emails ───────────────────────────────────
    const deviceName = order.product?.title || 'Device';
    const subjectSuffix = `${deviceName} | Order #${order._id.toString().slice(-8).toUpperCase()}`;

    await Promise.all([
      sendEmail(
        order.renter?.email,
        `Gizzmo Rental Summary — ${subjectSuffix}`,
        renterHtml
      ),
      sendEmail(
        order.owner?.email,
        `Gizzmo Rental Completion — ${subjectSuffix}`,
        retailerHtml
      ),
    ]);

    // ── Update order status in DB ──────────────────────────
    order.trackingStatus = 'Returned';
    order.inspectionResult = {
      damageLevel,
      damageDescription: damageDescription || '',
      deductedAmount: deducted,
      poolContribution: poolContribution || 0,
      refundAmount,
      inspectedAt: new Date(),
    };
    await order.save();

    res.json({
      message: 'Inspection complete. Summary emails sent to both renter and retailer.',
      refundAmount,
      ownerPayout,
      emailsSent: {
        renter: order.renter?.email,
        owner: order.owner?.email,
      },
    });

  } catch (err) {
    console.error('❌ Inspection-complete error:', err.message);
    res.status(500).json({ error: 'Failed to process inspection completion' });
  }
});

module.exports = router;
