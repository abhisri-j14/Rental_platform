"use client";
import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Smartphone } from 'lucide-react';
import styles from './login.module.css';

export default function LoginPage() {
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');

  const handlePhoneSubmit = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    // Simulate successful login
    window.location.href = '/';
  };

  return (
    <div className={styles.container}>
      <div className={styles.authCard}>
        <div className={styles.brand}>Gadget<span className={styles.accent}>Go</span></div>
        
        {step === 1 ? (
          <>
            <h1 className={styles.title}>Welcome Back! 👋</h1>
            <p className={styles.subtitle}>Enter your phone number to sign in or create a new account.</p>
            
            <form onSubmit={handlePhoneSubmit} className={styles.form}>
              <div className={styles.inputGroup}>
                <label>Phone Number</label>
                <div className={styles.phoneInputContainer}>
                  <span className={styles.countryCode}>+91</span>
                  <input 
                    type="tel" 
                    placeholder="Enter 10-digit number" 
                    required 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={styles.input}
                  />
                </div>
              </div>
              <button type="submit" className={styles.primaryBtn}>
                Get OTP <ArrowRight size={20} />
              </button>
            </form>
          </>
        ) : (
          <>
            <h1 className={styles.title}>Enter OTP 🔐</h1>
            <p className={styles.subtitle}>We've sent a 6-digit code to +91 {phone}</p>
            
            <form onSubmit={handleOtpSubmit} className={styles.form}>
              <div className={styles.inputGroup}>
                <label>One Time Password</label>
                <input 
                  type="text" 
                  placeholder="000000" 
                  required 
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className={styles.input}
                  maxLength={6}
                />
              </div>
              <button type="submit" className={styles.primaryBtn}>
                Verify & Login
              </button>
              <button type="button" onClick={() => setStep(1)} className={styles.linkBtn}>
                Change Phone Number
              </button>
            </form>
          </>
        )}

        <div className={styles.footer}>
          <p>By logging in, you agree to our <Link href="#">Terms of Service</Link> and <Link href="#">Privacy Policy</Link>.</p>
          <p className={styles.aadharNote}>Aadhar Verification will be required for your first rental.</p>
        </div>
      </div>
    </div>
  );
}
