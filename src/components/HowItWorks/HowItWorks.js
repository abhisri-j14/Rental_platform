"use client";

import styles from "./HowItWorks.module.css";
import { ArrowRight, ArrowDown, ArrowLeft } from "lucide-react";

const FLOW_STEPS = [
  { id: 1, emoji: "🏪", title: "1. Retailer Lists", desc: "Owners list idle tech in minutes to start earning.", colorClass: styles.step1 },
  { id: 2, emoji: "🕵️‍♂️", title: "2. We Verify", desc: "Platform checks quality to ensure 100% trust.", colorClass: styles.step2 },
  { id: 3, emoji: "👨‍🎓", title: "3. You Browse", desc: "Students find affordable tech for urgent needs.", colorClass: styles.step3 },
  
  { id: 4, emoji: "💳", title: "4. KYC & Pay", desc: "Secure ID check. Pay Rent + Protection + Deposit.", colorClass: styles.step4 },
  { id: 5, emoji: "🤝", title: "5. Revenue Split", desc: "Owner keeps 80%. Platform takes 20%. Fair play.", colorClass: styles.step5 },
  { id: 6, emoji: "🛵", title: "6. Delivered", desc: "Instant, safe doorstep delivery with OTP.", colorClass: styles.step6 },
  
  { id: 7, emoji: "💻", title: "7. Usage Period", desc: "Crush your project without buying expensive gear.", colorClass: styles.step7 },
  { id: 8, emoji: "🔍", title: "8. Pickup Check", desc: "Hassle-free return pickup and quick safety inspection.", colorClass: styles.step8 },
  { id: 9, emoji: "💸", title: "9. Refunded", desc: "Device returned clean? Instant deposit refund!", colorClass: styles.step9 }
];

export default function HowItWorks() {
  return (
    <section className={styles.section}>
      <div className={styles.headerBox}>
        <h2>How Gizzmo Works ♻️</h2>
        <p>A simple, secure, and profitable cycle for both renters and retailers.</p>
      </div>

      <div className={styles.boardContainer}>
        <div className={styles.gridBoard}>
          {FLOW_STEPS.map((step, idx) => {
            return (
              <div key={step.id} className={`${styles.gridCell} ${styles['cell'+step.id]}`}>
                <div className={`${styles.stepCard} ${step.colorClass}`}>
                  <div className={styles.emojiBox}>{step.emoji}</div>
                  <div className={styles.stepText}>
                    <h3>{step.title}</h3>
                    <p>{step.desc}</p>
                  </div>
                </div>
                
                {/* Desktop Arrows */}
                {step.id === 1 && <ArrowRight className={`${styles.arrow} ${styles.arrowRight}`} size={40} />}
                {step.id === 2 && <ArrowRight className={`${styles.arrow} ${styles.arrowRight}`} size={40} />}
                {step.id === 3 && <ArrowDown className={`${styles.arrow} ${styles.arrowDownRight}`} size={40} />}
                {step.id === 4 && <ArrowLeft className={`${styles.arrow} ${styles.arrowLeft}`} size={40} />}
                {step.id === 5 && <ArrowLeft className={`${styles.arrow} ${styles.arrowLeft}`} size={40} />}
                {step.id === 6 && <ArrowDown className={`${styles.arrow} ${styles.arrowDownLeft}`} size={40} />}
                {step.id === 7 && <ArrowRight className={`${styles.arrow} ${styles.arrowRight}`} size={40} />}
                {step.id === 8 && <ArrowRight className={`${styles.arrow} ${styles.arrowRight}`} size={40} />}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
