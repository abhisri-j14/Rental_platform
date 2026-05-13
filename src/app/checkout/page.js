"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Shield, ShoppingCart } from 'lucide-react';
import styles from './page.module.css';
import { useCart } from '@/context/CartContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function CheckoutPage() {
  const router = useRouter();
  const [isPlaced, setIsPlaced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderResult, setOrderResult] = useState(null);
  const [paymentLink, setPaymentLink] = useState('');
  const [checkoutItems, setCheckoutItems] = useState([]);
  const { cartItems, clearCart } = useCart();

  // Delivery form
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('online');

  // Check auth + load product from sessionStorage
  useEffect(() => {
    const token = localStorage.getItem('gadgetgo_token');
    if (!token) {
      router.push('/login');
      return;
    }

    const stored = sessionStorage.getItem('checkout_product');
    if (stored) {
      setCheckoutItems([JSON.parse(stored)]);
    } else if (cartItems.length > 0) {
      setCheckoutItems(cartItems);
    }

    // Pre-fill user data
    fetch(`${API_URL}/api/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setFullName(data.user.name);
          setPhone(data.user.phone?.replace('+91', '') || '');
          setEmail(data.user.email);
        }
      })
      .catch(() => {});
  }, [router]);

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

  // Calculate totals with duration-based discounts
  const totalRent = checkoutItems.reduce((sum, item) => {
    let price = item.pricePerDay * item.days;
    // Duration discounts
    if (item.days >= 30) price *= 0.5; // 50% off for monthly
    else if (item.days >= 7) price *= 0.75; // 25% off for weekly
    else if (item.days >= 3) price *= 0.9; // 10% off for short-term
    return sum + price;
  }, 0);

  const platformFee = Math.round(totalRent * 0.05); // Lower platform fee (5%) for better feasibility
  const deliveryFee = 150;
  const totalDamageDeposit = checkoutItems.reduce((sum, item) => sum + (item.damageDeposit || 0), 0);
  const totalAmount = Math.round(totalRent + platformFee + deliveryFee + totalDamageDeposit);

  const savings = checkoutItems.reduce((sum, item) => sum + (item.pricePerDay * item.days), 0) - totalRent;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const token = localStorage.getItem('gadgetgo_token');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      // Since backend expects one productId, we'll place orders for each item
      // For a real app, we'd have a 'bulk create' endpoint
      let lastOrder = null;
      for (const item of checkoutItems) {
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
      
      // If payment is online, generate Instamojo link
      if (paymentMethod === 'online') {
        try {
          const payRes = await fetch(`${API_URL}/api/payments/create-request`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
              amount: totalAmount,
              purpose: checkoutItems.length > 1 ? `Rental of ${checkoutItems.length} gadgets` : `Rental of ${checkoutItems[0].title}`,
              buyerName: fullName,
              email: email,
              phone: phone,
              orderId: lastOrder._id
            }),
          });
          const payData = await payRes.json();
          console.log("📥 Payment API Response:", payData);
          if (payRes.ok) {
            setPaymentLink(payData.paymentRequestUrl);
            console.log("✅ Dynamic Link Set:", payData.paymentRequestUrl);
          } else {
            console.error("❌ Payment API Error:", payData.error);
          }
        } catch (err) {
          console.error("🌐 Payment API Network Error:", err);
        }
      }

      setIsPlaced(true);
      sessionStorage.removeItem('checkout_product');
      clearCart();
    } catch {
      setError('Network error. Is the server running?');
    } finally {
      setLoading(false);
    }
  };

  if (isPlaced && orderResult) {
    return (
      <div className={styles.successContainer}>
        <CheckCircle2 size={80} className={styles.successIcon} />
        <h1>Order Placed & Payment Initiated!</h1>
        <p>Your <strong>{checkoutItems.length > 1 ? `${checkoutItems.length} items` : checkoutItems[0].title}</strong> are being processed.</p>
        
        <div className={styles.instamojoBox}>
          <p>Please complete your payment of <strong>₹{totalAmount}</strong> using the secure link below:</p>
          <a 
            href={paymentLink || "https://www.instamojo.com/@shazam101/l7f06ad5d610747d68fc751fb532bc2f7/"} 
            target="_blank" 
            rel="noopener noreferrer" 
            className={styles.instamojoBtn}
          >
            {paymentLink ? `Pay ₹${totalAmount} Now` : 'Pay on Instamojo'}
          </a>
          <span className={styles.instamojoNote}>
            {paymentLink ? '* This is a secure dynamic link for your exact total.' : '* Note: This is a standard link. Please verify the amount manually.'}
          </span>
        </div>

        <div className={styles.actionRow}>
          <Link href={`/order/${orderResult._id}/tracking`} className={styles.primaryBtn}>
            Track Order Status
          </Link>
          <Link href="/" className={styles.secondaryBtn}>Return to Home</Link>
        </div>

        <div className={styles.policyBox}>
          <Shield size={20} />
          <p><strong>6-Hour Return Policy:</strong> Not satisfied? Return within 6 hours for a 100% instant cashback.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button onClick={() => router.back()} className={styles.backLink}><ArrowLeft size={20} /> Back</button>
        <h1>Checkout</h1>
      </div>

      <div className={styles.content}>
        <div className={styles.formSection}>
          <h2>Delivery Details</h2>
          {error && <p className={styles.errorMsg}>{error}</p>}
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <label>Full Name</label>
              <input type="text" required value={fullName} onChange={e => setFullName(e.target.value)} placeholder="John Doe" />
            </div>
            <div className={styles.row}>
              <div className={styles.inputGroup}>
                <label>Phone Number</label>
                <input type="tel" required value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))} placeholder="XXXXX XXXXX" />
              </div>
              <div className={styles.inputGroup}>
                <label>Email Address</label>
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="john@example.com" />
              </div>
            </div>
            <div className={styles.inputGroup}>
              <label>Full Address</label>
              <textarea required value={address} onChange={e => setAddress(e.target.value)} placeholder="House No, Street, City, Pincode" rows="3"></textarea>
            </div>
            
            <h2>Payment Method</h2>
            <div className={styles.paymentMethods}>
              <label className={styles.radioLabel}>
                <input type="radio" name="payment" value="online" checked={paymentMethod === 'online'} onChange={() => setPaymentMethod('online')} />
                <span>Pay Online (UPI / Card / Netbanking)</span>
              </label>
              <label className={styles.radioLabel}>
                <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
                <span>Cash on Delivery</span>
              </label>
            </div>

            {(!phone || phone.includes('google_pending')) && (
              <div className={styles.phoneWarning}>
                <Shield size={18} />
                <span>A valid 10-digit phone number is required for your safety and delivery coordination.</span>
              </div>
            )}

            {(phone && !phone.includes('google_pending')) ? (
              <button type="submit" className={styles.submitBtn} disabled={loading}>
                {loading ? 'Placing Order...' : `Place Order & Pay ₹${totalAmount}`}
              </button>
            ) : (
              <Link href="/profile" className={styles.submitBtn} style={{ textAlign: 'center', background: '#555' }}>
                Verify Phone in Profile
              </Link>
            )}
          </form>
        </div>

        <div className={styles.billSection}>
          <h2>Order Summary</h2>
          <div className={styles.billCard}>
            <div className={styles.productList}>
              {checkoutItems.map(item => (
                <div key={item._id} className={styles.productInfo}>
                  <h3>{item.title}</h3>
                  <p>Duration: {item.days} Days</p>
                  <p className={styles.itemPrice}>₹{(item.pricePerDay * item.days).toLocaleString()} + ₹{item.damageDeposit} deposit</p>
                  <div className={styles.miniDivider}></div>
                </div>
              ))}
            </div>
            <div className={styles.billRow}>
              <span>Total Rent (Base)</span>
              <span>₹{checkoutItems.reduce((sum, item) => sum + (item.pricePerDay * item.days), 0).toLocaleString()}</span>
            </div>
            {savings > 0 && (
              <div className={styles.billRow} style={{ color: '#00D99F', fontWeight: 800 }}>
                <span>Student Savings ✨</span>
                <span>- ₹{savings.toLocaleString()}</span>
              </div>
            )}
            <div className={styles.billRow}>
              <span>Platform Fee (5%)</span>
              <span>₹{platformFee.toLocaleString()}</span>
            </div>
            <div className={styles.billRow}>
              <span>Delivery Fee</span>
              <span>₹{deliveryFee}</span>
            </div>
            <div className={styles.billRow}>
              <span>Total Damage Deposit</span>
              <span>₹{totalDamageDeposit.toLocaleString()}</span>
            </div>
            <div className={styles.divider}></div>
            <div className={styles.totalRow}>
              <span>Total Amount</span>
              <span>₹{totalAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
