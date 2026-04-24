"use client";
import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import styles from './checkout.module.css';

export default function CheckoutPage() {
  const [isPlaced, setIsPlaced] = useState(false);

  // Dummy product data
  const product = {
    name: "MacBook Pro M2 14-inch",
    pricePerDay: 400,
    days: 5,
    damageFee: 5000,
    deliveryFee: 150,
    platformFeeRate: 0.10
  };

  const totalRent = product.pricePerDay * product.days;
  const platformFee = totalRent * product.platformFeeRate;
  const totalAmount = totalRent + platformFee + product.deliveryFee + product.damageFee;

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate order placement
    setIsPlaced(true);
  };

  if (isPlaced) {
    return (
      <div className={styles.successContainer}>
        <CheckCircle2 size={80} className={styles.successIcon} />
        <h1>Order Placed Successfully!</h1>
        <p>Your {product.name} is confirmed for {product.days} days.</p>
        <p>Delivery address and tracking details will be sent to your email.</p>
        <Link href="/" className={styles.primaryBtn}>Return to Home</Link>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link href="#" className={styles.backLink}><ArrowLeft size={20} /> Back</Link>
        <h1>Checkout</h1>
      </div>

      <div className={styles.content}>
        <div className={styles.formSection}>
          <h2>Delivery Details</h2>
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <label>Full Name</label>
              <input type="text" required placeholder="John Doe" />
            </div>
            <div className={styles.row}>
              <div className={styles.inputGroup}>
                <label>Phone Number</label>
                <input type="tel" required placeholder="+91 XXXXX XXXXX" />
              </div>
              <div className={styles.inputGroup}>
                <label>Email Address</label>
                <input type="email" required placeholder="john@example.com" />
              </div>
            </div>
            <div className={styles.inputGroup}>
              <label>Full Address</label>
              <textarea required placeholder="House No, Street, City, Pincode" rows="3"></textarea>
            </div>
            
            <h2>Payment Method</h2>
            <div className={styles.paymentMethods}>
              <label className={styles.radioLabel}>
                <input type="radio" name="payment" value="online" defaultChecked />
                <span>Pay Online (UPI / Card / Netbanking)</span>
              </label>
              <label className={styles.radioLabel}>
                <input type="radio" name="payment" value="cod" />
                <span>Cash on Delivery</span>
              </label>
            </div>

            <button type="submit" className={styles.submitBtn}>Place Order & Pay Rs {totalAmount}</button>
          </form>
        </div>

        <div className={styles.billSection}>
          <h2>Order Summary</h2>
          <div className={styles.billCard}>
            <div className={styles.productInfo}>
              <h3>{product.name}</h3>
              <p>Duration: {product.days} Days</p>
            </div>
            <div className={styles.billRow}>
              <span>Rent ({product.days} days x Rs {product.pricePerDay})</span>
              <span>Rs {totalRent}</span>
            </div>
            <div className={styles.billRow}>
              <span>Platform Fee (10%)</span>
              <span>Rs {platformFee}</span>
            </div>
            <div className={styles.billRow}>
              <span>Delivery Fee</span>
              <span>Rs {product.deliveryFee}</span>
            </div>
            <div className={styles.billRow}>
              <span>Damage Deposit (Refundable)</span>
              <span>Rs {product.damageFee}</span>
            </div>
            <div className={styles.divider}></div>
            <div className={styles.totalRow}>
              <span>Total Amount</span>
              <span>Rs {totalAmount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
