"use client";
import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Store, User } from 'lucide-react';
import styles from './owner-signup.module.css';

export default function OwnerSignupPage() {
  const [accountType, setAccountType] = useState('store'); // 'store' or 'individual'

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate signup completion
    window.location.href = '/owner';
  };

  return (
    <div className={styles.container}>
      <div className={styles.authCard}>
        <div className={styles.header}>
          <h1>Partner with Us 🤝</h1>
          <p>Join GadgetGo and start earning from your idle devices.</p>
        </div>

        <div className={styles.toggleGroup}>
          <button 
            className={`${styles.toggleBtn} ${accountType === 'store' ? styles.active : ''}`}
            onClick={() => setAccountType('store')}
          >
            <Store size={18}/> Store Owner
          </button>
          <button 
            className={`${styles.toggleBtn} ${accountType === 'individual' ? styles.active : ''}`}
            onClick={() => setAccountType('individual')}
          >
            <User size={18}/> Individual
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {accountType === 'store' && (
            <div className={styles.inputGroup}>
              <label>Store Name</label>
              <input type="text" placeholder="E.g. Khosla Electronics" required />
            </div>
          )}

          <div className={styles.inputGroup}>
            <label>Full Name</label>
            <input type="text" placeholder="Your name" required />
          </div>

          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label>Phone Number</label>
              <input type="tel" placeholder="+91" required />
            </div>
            <div className={styles.inputGroup}>
              <label>Email Address</label>
              <input type="email" placeholder="email@example.com" required />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label>{accountType === 'store' ? 'GSTIN / PAN' : 'Aadhar Number'}</label>
            <input type="text" placeholder="For verification purposes" required />
          </div>

          <button type="submit" className={styles.primaryBtn}>
            Create Partner Account <ArrowRight size={20} />
          </button>
        </form>

        <p className={styles.footer}>
          Already a partner? <Link href="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
}
