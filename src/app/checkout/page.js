"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Shield } from 'lucide-react';
import styles from './page.module.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function CheckoutPage() {
  const router = useRouter();
  const [isPlaced, setIsPlaced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderResult, setOrderResult] = useState(null);
  const [product, setProduct] = useState(null);

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
      setProduct(JSON.parse(stored));
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

  if (!product) {
    return (
      <div className={styles.successContainer}>
        <h1>No product selected</h1>
        <p>Please browse our catalog and select a device to rent.</p>
        <Link href="/category/all" className={styles.primaryBtn}>Browse Devices</Link>
      </div>
    );
  }

  const totalRent = product.pricePerDay * product.days;
  const platformFee = Math.round(totalRent * 0.10);
  const deliveryFee = 150;
  const totalAmount = totalRent + platformFee + deliveryFee + product.damageDeposit;

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
      const res = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: product._id,
          days: product.days,
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
        return;
      }

      setOrderResult(data.order);
      setIsPlaced(true);
      sessionStorage.removeItem('checkout_product');
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
        <h1>Order Placed Successfully!</h1>
        <p>Your <strong>{product.title}</strong> is confirmed for <strong>{product.days} days</strong>.</p>
        <p>Total: <strong>₹{orderResult.totalAmount}</strong></p>

        <div className={styles.txHashBox}>
          <Shield size={16} />
          <div>
            <strong>Web3 Transaction Hash</strong>
            <p className={styles.txHash}>{orderResult.txHash}</p>
          </div>
        </div>

        <p>Delivery details will be sent to your email and phone.</p>
        <Link href="/" className={styles.primaryBtn}>Return to Home</Link>
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

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? 'Placing Order...' : `Place Order & Pay ₹${totalAmount}`}
            </button>
          </form>
        </div>

        <div className={styles.billSection}>
          <h2>Order Summary</h2>
          <div className={styles.billCard}>
            <div className={styles.productInfo}>
              <h3>{product.title}</h3>
              <p>Duration: {product.days} Days</p>
            </div>
            <div className={styles.billRow}>
              <span>Rent ({product.days} days × ₹{product.pricePerDay})</span>
              <span>₹{totalRent}</span>
            </div>
            <div className={styles.billRow}>
              <span>Platform Fee (10%)</span>
              <span>₹{platformFee}</span>
            </div>
            <div className={styles.billRow}>
              <span>Delivery Fee</span>
              <span>₹{deliveryFee}</span>
            </div>
            <div className={styles.billRow}>
              <span>Damage Deposit (Refundable)</span>
              <span>₹{product.damageDeposit}</span>
            </div>
            <div className={styles.divider}></div>
            <div className={styles.totalRow}>
              <span>Total Amount</span>
              <span>₹{totalAmount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
