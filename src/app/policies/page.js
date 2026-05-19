import React from 'react';
import Image from 'next/image';
import styles from './policies.module.css';
import { Shield, AlertTriangle, Lock, CheckCircle } from 'lucide-react';

export const metadata = {
  title: 'Damage Control Policy | Gizzmo',
  description: 'Understand Gizzmo\'s transparent damage control policy and security deposits.',
};

export default function PoliciesPage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Damage Control Policy</h1>
        <p>Transparent, fair, and secure. Everything you need to know about deposits and damages.</p>
      </header>

      {/* Main Content Layout */}
      <div className={styles.contentLayout}>
        
        {/* Left Side: Policies */}
        <div className={styles.policiesCol}>
          <div className={styles.policyCard}>
            <div className={styles.cardHeader}>
              <Shield className={styles.iconBlue} size={28} />
              <h3>Safety First: KYC</h3>
            </div>
            <p>
              To ensure platform safety, <strong>Aadhar-verified KYC is mandatory</strong> for all renters. 
              We do not allow anonymous renting. This protects owners from fraud and theft.
            </p>
          </div>

          <div className={styles.policyCard}>
            <div className={styles.cardHeader}>
              <AlertTriangle className={styles.iconYellow} size={28} />
              <h3>Damage Scenarios</h3>
            </div>
            <p className={styles.subtext}>We handle damages systematically based on severity:</p>
            <ul className={styles.list}>
              <li><strong>Return Inspection:</strong> The delivery person checks the device condition at the time of return to accurately verify who caused any damages.</li>
              <li><strong>Minor Damage:</strong> Covered entirely by the Insurance Pool. Deposit is refunded.</li>
              <li><strong>High Damage:</strong> Your Damage Deposit is forfeited. The Insurance Pool covers the rest.</li>
              <li><strong>Theft/Total Loss:</strong> Deposit forfeited + Insurance Pool used + Police Report filed. Legal action will be pursued.</li>
            </ul>
          </div>

          <div className={styles.policyCard}>
            <div className={styles.cardHeader}>
              <Lock className={styles.iconGreen} size={28} />
              <h3>Security Deposits</h3>
            </div>
            <p>
              A refundable security deposit is collected to cover negligence. 
              It is <strong>100% refundable</strong> upon returning the device clean and undamaged.
            </p>
            <ul className={styles.list}>
              <li><strong>Standard Rate:</strong> Usually 10% to 15% of the device's actual price.</li>
              <li><strong>Safe Deposit Badge:</strong> Items with deposits ≤15% get a trust badge.</li>
            </ul>
          </div>

          <div className={styles.policyCard}>
            <div className={styles.cardHeader}>
              <CheckCircle className={styles.iconRed} size={28} />
              <h3>Protection Fee (Insurance)</h3>
            </div>
            <p>
              A mandatory, non-refundable fee paid by renters. This goes into the <strong>Gizzmo Insurance Pool</strong> to reimburse owners for repair or replacement costs.
            </p>
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Device Value (MRP)</th>
                    <th>Fee</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>Below ₹25,000</td><td>₹59</td></tr>
                  <tr><td>₹25,000 - ₹49,999</td><td>₹99</td></tr>
                  <tr><td>₹50,000 - ₹89,999</td><td>₹129</td></tr>
                  <tr><td>₹90,000 - ₹149,999</td><td>₹199</td></tr>
                  <tr><td>₹150,000+</td><td>₹299</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Side: Image */}
        <div className={styles.imageCol}>
          <div className={styles.imageWrapper}>
            <Image 
              src="/damage_policy.jpg" 
              alt="Damage Scenarios and Security Deposits" 
              fill
              className={styles.policyImage}
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}
