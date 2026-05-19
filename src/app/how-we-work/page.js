import React from 'react';
import Image from 'next/image';
// Reusing the clean, subtle styles from the policies page
import styles from '../policies/policies.module.css';
import { Camera, RefreshCw, Truck, FileText } from 'lucide-react';

export const metadata = {
  title: 'How We Work | Gizzmo',
  description: 'Understand the Gizzmo business model, revenue splits, and logistics process for renters and listers.',
};

export default function HowWeWorkPage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>How We Work</h1>
        <p>A fair, transparent marketplace for renters and listers. Here is how the ecosystem operates.</p>
      </header>

      {/* Main Content Layout */}
      <div className={styles.contentLayout}>
        
        {/* Left Side: Business Model */}
        <div className={styles.policiesCol}>
          
          <div className={styles.policyCard}>
            <div className={styles.cardHeader}>
              <Camera className={styles.iconBlue} size={28} />
              <h3>The Money Split</h3>
            </div>
            <p>
              Gizzmo operates on a marketplace model connecting device owners with renters fairly.
            </p>
            <ul className={styles.list}>
              <li><strong>Owner Earnings (80%):</strong> Listers take home the vast majority of the base rental amount for providing quality gear.</li>
              <li><strong>Gizzmo Commission (20%):</strong> We retain a commission to cover platform operations, 24/7 support, and marketing.</li>
              <li><strong>Note:</strong> Protection and delivery fees are retained by the platform to manage logistics and fund the insurance pool.</li>
            </ul>
          </div>

          <div className={styles.policyCard}>
            <div className={styles.cardHeader}>
              <RefreshCw className={styles.iconYellow} size={28} />
              <h3>Duration Discounts</h3>
            </div>
            <p className={styles.subtext}>
              Rent longer, pay less. Discounts are applied automatically to favor renters on extended projects.
            </p>
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Rental Duration</th>
                    <th>Discount Applied</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>1 - 2 Days</td><td>None</td></tr>
                  <tr><td>3 - 6 Days</td><td>10% Off Base Rent</td></tr>
                  <tr><td>7 - 29 Days</td><td>25% Off Base Rent</td></tr>
                  <tr><td>30+ Days</td><td>50% Off Base Rent</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className={styles.policyCard}>
            <div className={styles.cardHeader}>
              <Truck className={styles.iconGreen} size={28} />
              <h3>Dynamic Delivery</h3>
            </div>
            <p>
              We subsidize delivery for larger orders to encourage higher cart values. Delivery fees are dynamically calculated based on the base rent total.
            </p>
            <ul className={styles.list}>
              <li><strong>Below ₹500:</strong> ₹20 Delivery Fee</li>
              <li><strong>₹500 - ₹1,500:</strong> ₹12 Delivery Fee</li>
              <li><strong>Above ₹1,500:</strong> <strong style={{ color: '#10b981' }}>FREE DELIVERY</strong></li>
            </ul>
          </div>

          <div className={styles.policyCard}>
            <div className={styles.cardHeader}>
              <FileText className={styles.iconRed} size={28} />
              <h3>6-Hour Return Policy</h3>
            </div>
            <p>
              Customer satisfaction is our priority. If a device isn't up to standard (e.g. scratches or not clean), you have a <strong>6-hour window</strong> from delivery to return it.
            </p>
            <ul className={styles.list}>
              <li><strong>Refund:</strong> 100% instant cashback of the rental amount and security deposit.</li>
              <li><strong>Note:</strong> Consumed services (delivery logistics) may be excluded from the refund depending on the case.</li>
            </ul>
          </div>
          
        </div>

        {/* Right Side: Image */}
        <div className={styles.imageCol}>
          <div className={styles.imageWrapper}>
            <Image 
              src="/how_we_work.png" 
              alt="How We Work - Business Model and Renter Flow" 
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
