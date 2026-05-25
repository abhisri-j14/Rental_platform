"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Shield, ShoppingCart, Loader2, AlertTriangle } from 'lucide-react';
import styles from './page.module.css';
import { useCart } from '@/context/CartContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function CheckoutPage() {
  const router = useRouter();
  const [isPlaced, setIsPlaced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderResult, setOrderResult] = useState(null);
  const [paymentError, setPaymentError] = useState('');
  const [checkoutItems, setCheckoutItems] = useState([]);
  const { cartItems, clearCart } = useCart();

  // Policy consent checkboxes — all 3 must be agreed before checkout
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [agreedDamage, setAgreedDamage] = useState(false);
  const [agreedDeposit, setAgreedDeposit] = useState(false);
  const allPoliciesAgreed = agreedTerms && agreedDamage && agreedDeposit;

  // Delivery form
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('online');
  const [deliveryType, setDeliveryType] = useState('standard');

  useEffect(() => {
    const token = localStorage.getItem('gadgetgo_token');
    if (!token) { router.push('/login'); return; }

    // Pre-fill user data
    fetch(`${API_URL}/api/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setFullName(data.user.name || '');
          setPhone(data.user.phone?.replace('+91', '').replace(/^google_pending.*/, '') || '');
          setEmail(data.user.email || '');
        }
      })
      .catch(() => {});
  }, [router]);

  useEffect(() => {
    const stored = sessionStorage.getItem('checkout_product');
    if (stored) {
      setCheckoutItems([JSON.parse(stored)]);
    } else if (cartItems.length > 0) {
      setCheckoutItems(cartItems);
    }
  }, [cartItems]);

  if (checkoutItems.length === 0) {
    return (
      <div className={styles.successContainer}>
        <ShoppingCart size={60} />
        <h1>Your Checkout is Empty</h1>
        <p>Please browse our catalog and select a device to rent.</p>
        <Link href="/category/all" className={styles.primaryBtn}>Browse Devices</Link>
      </div>
    );
  }

  // ── Pricing ──────────────────────────────────────────────
  // Compute the discount % label for each item so the bill clearly shows why
  const getDiscountLabel = (days) => {
    if (days >= 30) return '50% off (30+ days)';
    if (days >= 7)  return '25% off (7–29 days)';
    if (days >= 3)  return '10% off (3–6 days)';
    return null; // No discount for 1–2 days
  };

  const totalRent = checkoutItems.reduce((sum, item) => {
    let price = item.pricePerDay * item.days;
    if (item.days >= 30) price *= 0.5;
    else if (item.days >= 7) price *= 0.75;
    else if (item.days >= 3) price *= 0.9;
    return sum + price;
  }, 0);

  // Dynamic Delivery Fee based on selection
  let deliveryFee = 0;
  if (deliveryType === 'express') {
    deliveryFee = 149;
  } else if (deliveryType === 'midnight') {
    deliveryFee = 249;
  } else {
    if (totalRent < 500) deliveryFee = 20;
    else if (totalRent <= 1500) deliveryFee = 12;
    else deliveryFee = 0;
  }

  // Tiered Protection Fee
  const totalProtectionFee = checkoutItems.reduce((sum, item) => {
    const mrp = item.actualPrice || 0;
    if (mrp >= 150000) return sum + 299;
    if (mrp >= 90000) return sum + 199;
    if (mrp >= 50000) return sum + 129;
    if (mrp >= 25000) return sum + 99;
    return sum + 59;
  }, 0);

  const totalDamageDeposit = checkoutItems.reduce((sum, item) => sum + (item.damageDeposit || 0), 0);
  const totalAmount = Math.round(totalRent + deliveryFee + totalProtectionFee + totalDamageDeposit);
  const savings = checkoutItems.reduce((sum, item) => sum + (item.pricePerDay * item.days), 0) - totalRent;

  // ── Razorpay Payment Flow ────────────────────────────────
  const handleRazorpayPayment = async (orderData, token) => {
    const res = await loadRazorpayScript();
    
    if (!res) {
      setPaymentError('Razorpay SDK failed to load. Are you online?');
      setPaymentLoading(false);
      setIsPlaced(true);
      return;
    }

    try {
      const orderRes = await fetch(`${API_URL}/api/payments/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: totalAmount,
          orderId: orderData._id
        })
      });

      const orderResponseData = await orderRes.json();

      if (!orderRes.ok) {
        setPaymentError(orderResponseData.error || 'Server error creating Razorpay order');
        setPaymentLoading(false);
        setIsPlaced(true);
        return;
      }

      const options = {
        key: orderResponseData.keyId,
        amount: orderResponseData.amount,
        currency: orderResponseData.currency,
        name: 'Gizzmo Rentals',
        description: `Rental payment for ${checkoutItems.length} items`,
        order_id: orderResponseData.razorpayOrderId,
        handler: async function (response) {
          // Payment succeeded, now verify on backend
          try {
            const verifyRes = await fetch(`${API_URL}/api/payments/verify-razorpay`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: orderData._id
              })
            });
            const verifyData = await verifyRes.json();
            
            if (verifyData.success) {
              // Successfully paid
              router.push(`/order/${orderData._id}/tracking?payment_success=true`);
            } else {
              setPaymentError('Payment verification failed. Contact support.');
              setIsPlaced(true);
            }
          } catch (err) {
            setPaymentError('Network error during verification. We will sync this shortly.');
            setIsPlaced(true);
          }
        },
        prefill: {
          name: fullName,
          email: email,
          contact: phone,
        },
        theme: {
          color: '#648DE5'
        },
        modal: {
          ondismiss: function() {
            setPaymentLoading(false);
            setPaymentError('Payment window was closed. You can retry paying from your orders page.');
            setIsPlaced(true);
          }
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.on('payment.failed', function (response) {
        setPaymentError('Payment failed. Please try again.');
        setPaymentLoading(false);
        setIsPlaced(true);
      });
      
      paymentObject.open();

    } catch (err) {
      setPaymentError('Could not reach payment server.');
      setPaymentLoading(false);
      setIsPlaced(true);
    }
  };

  // ── Submit Order ──────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const token = localStorage.getItem('gadgetgo_token');
    if (!token) { router.push('/login'); return; }

    try {
      // Place orders for each item
      let lastOrder = null;
      for (let i = 0; i < checkoutItems.length; i++) {
        const item = checkoutItems[i];
        const res = await fetch(`${API_URL}/api/orders`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            productId: item._id,
            days: item.days,
            paymentMethod,
            deliveryFee: i === 0 ? deliveryFee : 0,
            deliveryType,
            deliveryAddress: {
              fullName,
              phone: `+91${phone}`,
              email,
              address,
            },
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || 'Failed to place order');
          setLoading(false);
          return;
        }
        lastOrder = data.order;
      }

      setOrderResult(lastOrder);
      sessionStorage.removeItem('checkout_product');
      clearCart();

      // ── Online payment: open Razorpay ──
      if (paymentMethod === 'online') {
        setPaymentLoading(true);
        setLoading(false);
        await handleRazorpayPayment(lastOrder, token);
      } else {
        // COD
        setIsPlaced(true);
        setLoading(false);
      }
    } catch {
      setError('Network error. Is the server running?');
      setLoading(false);
    }
  };

  // ── Order placed + COD / payment error fallback screen ────
  if (isPlaced && orderResult) {
    const displayTitle = orderResult.product?.title || 'device';
    const displayAmount = orderResult.totalAmount || totalAmount;

    return (
      <div className={styles.successContainer}>
        <CheckCircle2 size={80} className={styles.successIcon} />
        <h1>
          {paymentMethod === 'cod' ? 'Order Confirmed!' : 'Order Placed!'}
        </h1>
        <p>
          Your <strong>{checkoutItems.length > 1 ? `${checkoutItems.length} devices` : displayTitle}</strong> rental is being processed.
        </p>

        {/* COD confirmation */}
        {paymentMethod === 'cod' && (
          <div className={styles.instamojoBox}>
            <p>✅ Cash on Delivery selected. Pay <strong>₹{displayAmount.toLocaleString()}</strong> when your device arrives.</p>
          </div>
        )}

        {/* Payment Warning if Razorpay failed/cancelled */}
        {paymentMethod === 'online' && paymentError && (
          <div className={styles.instamojoBox}>
            <div className={styles.paymentWarning}>
              <AlertTriangle size={18} />
              <p>{paymentError}</p>
            </div>
            <span className={styles.instamojoNote}>
              Your order ID: #{orderResult._id.slice(-8).toUpperCase()}
            </span>
          </div>
        )}

        <div className={styles.actionRow}>
          <Link href={`/order/${orderResult._id}/tracking`} className={styles.primaryBtn}>
            Track Order Status
          </Link>
          <Link href="/" className={styles.secondaryBtn}>Return to Home</Link>
        </div>

        {/* Helpful reminder after successful order */}
        <div className={styles.policyBox}>
          <Shield size={20} />
          <p>Your order is protected by the <strong>Gizzmo Damage Protection System</strong>. Keep the device safe and return it on time for a full deposit refund. 😊</p>
        </div>
      </div>
    );
  }

  const phoneIsValid = phone && phone.length === 10 && !phone.includes('google_pending');

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button onClick={() => router.back()} className={styles.backLink}>
          <ArrowLeft size={20} /> Back
        </button>
        <h1>Checkout</h1>
      </div>

      <div className={styles.content}>
        {/* ── Form ── */}
        <div className={styles.formSection}>
          <h2>Delivery Details</h2>
          {error && <p className={styles.errorMsg}>{error}</p>}

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <label>Full Name</label>
              <input
                type="text" required
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="John Doe"
              />
            </div>

            <div className={styles.row}>
              <div className={styles.inputGroup}>
                <label>Phone Number</label>
                <input
                  type="tel" required
                  value={phone}
                  onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="10-digit mobile number"
                />
              </div>
              <div className={styles.inputGroup}>
                <label>Email Address</label>
                <input
                  type="email" required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label>Full Delivery Address</label>
              <textarea
                required
                value={address}
                onChange={e => setAddress(e.target.value)}
                placeholder="House No, Street, City, Pincode"
                rows="3"
              />
            </div>

            <h2>Delivery Speed</h2>
            <div className={styles.paymentMethods} style={{ marginBottom: '24px' }}>
              <label className={`${styles.radioLabel} ${deliveryType === 'standard' ? styles.radioSelected : ''}`}>
                <input
                  type="radio" name="delivery" value="standard"
                  checked={deliveryType === 'standard'}
                  onChange={() => setDeliveryType('standard')}
                />
                <div className={styles.radioContent}>
                  <span className={styles.radioTitle}>Standard Delivery</span>
                  <span className={styles.radioSub}>Delivered within 2 days (₹0–₹20 based on order value)</span>
                </div>
              </label>

              <label className={`${styles.radioLabel} ${deliveryType === 'express' ? styles.radioSelected : ''}`}>
                <input
                  type="radio" name="delivery" value="express"
                  checked={deliveryType === 'express'}
                  onChange={() => setDeliveryType('express')}
                />
                <div className={styles.radioContent}>
                  <span className={styles.radioTitle}>⚡ Express 2-Hour Delivery</span>
                  <span className={styles.radioSub}>Dedicated campus rider (₹149 flat)</span>
                </div>
              </label>

              <label className={`${styles.radioLabel} ${deliveryType === 'midnight' ? styles.radioSelected : ''}`}>
                <input
                  type="radio" name="delivery" value="midnight"
                  checked={deliveryType === 'midnight'}
                  onChange={() => setDeliveryType('midnight')}
                />
                <div className={styles.radioContent}>
                  <span className={styles.radioTitle}>🌙 Midnight / Emergency Delivery</span>
                  <span className={styles.radioSub}>Night rider (₹249 flat)</span>
                </div>
              </label>
            </div>

            <h2>Payment Method</h2>
            <div className={styles.paymentMethods}>
              <label className={`${styles.radioLabel} ${paymentMethod === 'online' ? styles.radioSelected : ''}`}>
                <input
                  type="radio" name="payment" value="online"
                  checked={paymentMethod === 'online'}
                  onChange={() => setPaymentMethod('online')}
                />
                <div className={styles.radioContent}>
                  <span className={styles.radioTitle}>Pay Online (Razorpay)</span>
                  <span className={styles.radioSub}>UPI · Cards · Net Banking</span>
                </div>
              </label>

              <label className={`${styles.radioLabel} ${paymentMethod === 'cod' ? styles.radioSelected : ''}`}>
                <input
                  type="radio" name="payment" value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                />
                <div className={styles.radioContent}>
                  <span className={styles.radioTitle}>Cash on Delivery</span>
                  <span className={styles.radioSub}>Pay when your device arrives</span>
                </div>
              </label>
            </div>

            {!phoneIsValid && (
              <div className={styles.phoneWarning}>
                <Shield size={18} />
                <span>A valid 10-digit phone number is required for delivery coordination.</span>
              </div>
            )}

            {/* ── Policy Consent Checkboxes ── */}
            {/* All 3 must be checked before the Pay button becomes active */}
            <div className={styles.policyConsent}>
              <p className={styles.policyConsentTitle}>Before you pay, please confirm:</p>

              <label className={styles.consentRow}>
                <input
                  type="checkbox"
                  checked={agreedTerms}
                  onChange={e => setAgreedTerms(e.target.checked)}
                />
                <span>
                  I agree to the{' '}
                  <a href="/policies#terms" target="_blank" rel="noreferrer" className={styles.policyConsentLink}>
                    Terms & Conditions
                  </a>
                </span>
              </label>

              <label className={styles.consentRow}>
                <input
                  type="checkbox"
                  checked={agreedDamage}
                  onChange={e => setAgreedDamage(e.target.checked)}
                />
                <span>
                  I have read and accept the{' '}
                  <a href="/policies#damage" target="_blank" rel="noreferrer" className={styles.policyConsentLink}>
                    Damage Policy
                  </a>
                </span>
              </label>

              <label className={styles.consentRow}>
                <input
                  type="checkbox"
                  checked={agreedDeposit}
                  onChange={e => setAgreedDeposit(e.target.checked)}
                />
                <span>
                  I understand the{' '}
                  <a href="/policies#deposit" target="_blank" rel="noreferrer" className={styles.policyConsentLink}>
                    Deposit Refund Policy
                  </a>{' '}
                  — my deposit of ₹{totalDamageDeposit.toLocaleString()} is fully refundable if the device is returned undamaged.
                </span>
              </label>

              {/* Friendly nudge if user tries to pay without checking all boxes */}
              {!allPoliciesAgreed && (
                <p className={styles.consentHint}>
                  💡 Please check all 3 boxes above to enable payment.
                </p>
              )}
            </div>

            {phoneIsValid ? (
              <button
                type="submit"
                className={styles.submitBtn}
                disabled={loading || paymentLoading || !allPoliciesAgreed}
                title={!allPoliciesAgreed ? 'Please agree to all policies above first' : ''}
              >
                {loading || paymentLoading ? (
                  <>
                    <Loader2 size={18} className={styles.spinner} />
                    {paymentLoading ? 'Opening Payment Gateway…' : 'Placing Order…'}
                  </>
                ) : (
                  paymentMethod === 'online'
                    ? `Place Order & Pay ₹${totalAmount.toLocaleString()}`
                    : `Confirm Order — ₹${totalAmount.toLocaleString()} COD`
                )}
              </button>
            ) : (
              <Link
                href="/profile"
                className={styles.submitBtn}
                style={{ textAlign: 'center', background: '#666' }}
              >
                Add Phone Number in Profile First
              </Link>
            )}
          </form>
        </div>

        {/* ── Order Summary ── */}
        <div className={styles.billSection}>
          <h2>Order Summary</h2>
          <div className={styles.billCard}>
            <div className={styles.productList}>
              {checkoutItems.map(item => (
                <div key={item._id} className={styles.productInfo}>
                  <h3>{item.title}</h3>
                  <p>Duration: {item.days} Days</p>
                  <p className={styles.itemPrice}>
                    ₹{(item.pricePerDay * item.days).toLocaleString()} + ₹{item.damageDeposit} deposit
                  </p>
                  <div className={styles.miniDivider} />
                </div>
              ))}
            </div>

            <div className={styles.billRow}>
              <span>Total Rent (Base)</span>
              <span>₹{checkoutItems.reduce((sum, item) => sum + (item.pricePerDay * item.days), 0).toLocaleString()}</span>
            </div>
            {/* Show each item's discount label so users know exactly what they're saving */}
            {checkoutItems.map(item => {
              const label = getDiscountLabel(item.days);
              return label ? (
                <div key={`disc-${item._id}`} className={styles.billRow} style={{ color: '#22c55e', fontSize: '0.85rem' }}>
                  <span>✨ {item.title.length > 20 ? item.title.slice(0, 20) + '…' : item.title} — {label}</span>
                  <span></span>
                </div>
              ) : null;
            })}
            {savings > 0 && (
              <div className={styles.billRow} style={{ color: '#22c55e', fontWeight: 800 }}>
                <span>Total Discount Applied</span>
                <span>− ₹{Math.round(savings).toLocaleString()}</span>
              </div>
            )}
            <div className={styles.billRow}>
              <span>Delivery Fee</span>
              <span>{deliveryFee === 0 ? <span style={{color: '#22c55e'}}>FREE</span> : `₹${deliveryFee}`}</span>
            </div>
            <div className={styles.billRow}>
              <span>Protection Fee (Non-refundable)</span>
              <span>₹{totalProtectionFee}</span>
            </div>
            <div className={styles.billRow}>
              <span>Damage Deposit (Refundable)</span>
              <span>₹{totalDamageDeposit}</span>
            </div>
            <div className={styles.divider} />
            <div className={styles.totalRow}>
              <span>Total to Pay</span>
              <span>₹{totalAmount.toLocaleString()}</span>
            </div>
            
            <div className={styles.secureNote}>
              <Shield size={14} />
              <span>Payments secured with 256-bit encryption</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
