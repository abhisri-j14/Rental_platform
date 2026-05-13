"use client";

import styles from "./HowItWorks.module.css";
import { useRef } from "react";

const LISTER_STEPS = [
  {
    title: "Snap & List",
    desc: "Take high-quality photos of your gadget, set your daily price, and list it in under 2 minutes. Our platform handles the discovery.",
    colorClass: styles.bgGreen
  },
  {
    title: "Verify & Trust",
    desc: "Complete our seamless Aadhaar verification to unlock the 'Verified Owner' badge and build instant trust with potential renters.",
    colorClass: styles.bgLavender
  },
  {
    title: "Handoff & Earn",
    desc: "Approve booking requests, meet the renter (or ship it), and start earning passive income immediately into your wallet.",
    colorClass: styles.bgLime
  }
];

const BUYER_STEPS = [
  {
    title: "Find Your Tech",
    desc: "Browse through hundreds of verified gadgets from local owners. Use filters to find exactly what you need for your project.",
    colorClass: styles.bgBlue
  },
  {
    title: "Book Instantly",
    desc: "Select your dates, pay the rental fee and a small refundable deposit securely. No hidden charges, just transparent pricing.",
    colorClass: styles.bgOrange
  },
  {
    title: "Return & Repeat",
    desc: "Enjoy the tech! When you're done, return it to the owner and get your deposit back instantly. Renting is the new owning.",
    colorClass: styles.bgTea
  }
];

export default function HowItWorks() {
  return (
    <section className={styles.section}>
      {/* Conveyor Header */}
      <div className={styles.conveyorWrapper}>
        <div className={styles.conveyorTrack}>
          {[...Array(6)].map((_, i) => (
            <h2 key={i} className={styles.conveyorText}>
              Get started with a simple <span className={styles.numberGreen}>2</span> way approach
            </h2>
          ))}
        </div>
      </div>

      <div className={styles.mainContainer}>
        {/* Lister Row: Video Left, Text Right */}
        <div className={styles.row}>
          <div className={styles.videoCol}>
            <div className={styles.videoWrapper}>
              <video 
                src="/lister.mp4" 
                autoPlay 
                muted 
                loop 
                playsInline 
                className={styles.video}
              />
              <div className={styles.videoLabel}>LISTER</div>
            </div>
          </div>
          <div className={styles.textCol}>
            {LISTER_STEPS.map((step, idx) => (
              <div key={idx} className={`${styles.stepBlock} ${step.colorClass}`}>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDesc}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Buyer Row: Text Left, Video Right */}
        <div className={`${styles.row} ${styles.rowReversed}`}>
          <div className={styles.videoCol}>
            <div className={styles.videoWrapper}>
              <video 
                src="/buyer.mp4" 
                autoPlay 
                muted 
                loop 
                playsInline 
                className={styles.video}
              />
              <div className={styles.videoLabel}>RENTER</div>
            </div>
          </div>
          <div className={styles.textCol}>
            {BUYER_STEPS.map((step, idx) => (
              <div key={idx} className={`${styles.stepBlock} ${step.colorClass}`}>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDesc}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
