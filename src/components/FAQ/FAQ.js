"use client";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import styles from "./FAQ.module.css";

const faqs = [
  {
    q: "How fast can I get a device delivered?",
    a: "Same-day delivery is available in all metro cities. For other locations, expect delivery within 24–48 hours. You'll get real-time tracking from the moment your order is confirmed.",
  },
  {
    q: "What happens if the device gets damaged?",
    a: "Every rental includes basic damage protection. For accidental damage, you'll only pay a small deductible — not the full repair cost. We also offer premium coverage plans for complete peace of mind.",
  },
  {
    q: "How is identity verification handled?",
    a: "Both renters and owners go through Aadhaar-based verification. This ensures a safe, trustworthy marketplace where every transaction is between verified individuals.",
  },
  {
    q: "Can I extend my rental period?",
    a: "Absolutely! You can extend directly from your dashboard with one tap. Extensions are prorated, so you only pay for the extra days you need.",
  },
  {
    q: "How do owners list their devices?",
    a: "Listing is free and takes under 2 minutes. Just upload photos, set your daily rate, and define availability. We handle payments, verification, and logistics.",
  },
  {
    q: "Is there a minimum rental period?",
    a: "Nope — you can rent for as little as one day. We offer daily, weekly, and monthly plans so you can pick whatever works best for your needs.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (i) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section className={styles.faqSection}>
      <div className={styles.faqInner}>
        {/* Sticky left column */}
        <div className={styles.faqLeft}>
          <h2 className={styles.faqTitle}>FAQ</h2>
          <p className={styles.faqSub}>
            Answers to commonly
            <br />
            asked questions
            <br />
            about our platform
          </p>
        </div>

        {/* Accordion right column */}
        <div className={styles.faqRight}>
          {faqs.map((item, i) => (
            <div
              key={i}
              className={`${styles.faqItem} ${openIndex === i ? styles.faqItemOpen : ""}`}
            >
              <button className={styles.faqQuestion} onClick={() => toggle(i)} suppressHydrationWarning>
                <span>{item.q}</span>
                <span className={styles.faqIcon}>
                  {openIndex === i ? <Minus size={22} /> : <Plus size={22} />}
                </span>
              </button>
              <div
                className={styles.faqAnswer}
                style={{
                  maxHeight: openIndex === i ? "200px" : "0",
                }}
              >
                <p>{item.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
