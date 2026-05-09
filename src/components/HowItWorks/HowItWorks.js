"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import styles from "./HowItWorks.module.css";

const LISTER_STEPS = [
  {
    number: "01",
    title: "Create Your Listing",
    desc: "Snap a few photos, set your price, and describe your device. It only takes 2 minutes.",
  },
  {
    number: "02",
    title: "Get Verified",
    desc: "Complete Aadhaar verification to build trust with renters and unlock premium features.",
  },
  {
    number: "03",
    title: "Accept a Booking",
    desc: "Review rental requests, approve the ones you like, and coordinate the handoff.",
  },
  {
    number: "04",
    title: "Earn Passive Income",
    desc: "Get paid securely into your account. Track earnings from your dashboard anytime.",
  },
];

const BUYER_STEPS = [
  {
    number: "01",
    title: "Browse Devices",
    desc: "Explore hundreds of verified gadgets near you — laptops, cameras, drones, and more.",
  },
  {
    number: "02",
    title: "Pick Your Dates",
    desc: "Select when you need the device. Flexible daily, weekly, and monthly plans available.",
  },
  {
    number: "03",
    title: "Pay & Get Delivered",
    desc: "Pay securely online. The device gets delivered to your doorstep — hassle free.",
  },
  {
    number: "04",
    title: "Use & Return",
    desc: "Enjoy your rental. When done, schedule a pickup and get your deposit back instantly.",
  },
];

const STEP_DURATION = 7000;
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%";

/* ── Character-scramble hook ──────────────────────────────── */
function useScrambleText(target, duration = 600) {
  const [display, setDisplay] = useState(target);
  const prevRef = useRef(target);
  const rafRef = useRef(null);

  useEffect(() => {
    if (target === prevRef.current) return;

    const old = prevRef.current;
    prevRef.current = target;

    const maxLen = Math.max(old.length, target.length);
    const perChar = duration / maxLen;
    const start = performance.now();

    const tick = (now) => {
      const elapsed = now - start;
      let result = "";

      for (let i = 0; i < maxLen; i++) {
        const charDone = elapsed >= (i + 1) * perChar;
        if (charDone) {
          result += target[i] ?? "";
        } else if (elapsed >= i * perChar) {
          // currently scrambling this character
          result += CHARS[Math.floor(Math.random() * CHARS.length)];
        } else {
          result += old[i] ?? " ";
        }
      }

      setDisplay(result);

      if (elapsed < duration) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setDisplay(target);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);

  return display;
}

/* ── Single process bar ───────────────────────────────────── */
function ProcessBar({ steps, color, videoSrc, btnLabel, btnClass, reversed, label, subtitle }) {
  const [index, setIndex] = useState(0);
  const [timerKey, setTimerKey] = useState(0); // reset CSS animation
  const intervalRef = useRef(null);

  const resetTimer = useCallback(() => {
    clearInterval(intervalRef.current);
    setTimerKey((k) => k + 1);
    intervalRef.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % steps.length);
      setTimerKey((k) => k + 1);
    }, STEP_DURATION);
  }, [steps.length]);

  useEffect(() => {
    resetTimer();
    return () => clearInterval(intervalRef.current);
  }, [resetTimer]);

  const goNext = () => {
    setIndex((prev) => (prev + 1) % steps.length);
    resetTimer();
  };

  const goPrev = () => {
    setIndex((prev) => (prev - 1 + steps.length) % steps.length);
    resetTimer();
  };

  const step = steps[index];

  const displayNumber = useScrambleText(step.number, 300);
  const displayTitle = useScrambleText(step.title, 500);
  const displayDesc = useScrambleText(step.desc, 700);

  return (
    <div className={`${styles.bar} ${reversed ? styles.barReversed : ''}`}>
      <div className={styles.videoContainer}>
        <video
          className={styles.video}
          src={videoSrc}
          autoPlay
          muted
          loop
          playsInline
        />
        <button className={`${styles.overlayBtn} ${btnClass}`}>
          {btnLabel}
        </button>
      </div>

      <div className={styles.processArea}>
        <div className={styles.labelBlock}>
          <span className={styles.barLabel}>{label}</span>
          <span className={styles.barSubtitle}>{subtitle}</span>
        </div>
        {/* Scrambling text */}
        <div className={styles.stepTextBlock}>
          <span
            className={styles.stepNumber}
            style={{ color: color }}
          >
            {displayNumber}
          </span>
          <h3 className={styles.stepTitle}>{displayTitle}</h3>
          <p className={styles.stepDesc}>{displayDesc}</p>
        </div>

        {/* Timer bar — CSS animation resets via key */}
        <div className={styles.timerTrack}>
          <div
            key={timerKey}
            className={styles.timerFill}
            style={{
              "--fill-color": color,
              animationDuration: `${STEP_DURATION}ms`,
            }}
          />
        </div>

        {/* Nav */}
        <div className={styles.navRow}>
          <button className={styles.navBtn} onClick={goPrev} aria-label="Previous step">
            ‹
          </button>
          <span className={styles.stepIndicator}>
            {step.number} / 0{steps.length}
          </span>
          <button className={styles.navBtn} onClick={goNext} aria-label="Next step">
            ›
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main section ─────────────────────────────────────────── */
export default function HowItWorks() {
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>How Gi<span className={styles.tiltedZ}>z</span>zmo Works</h2>

      <div className={styles.barsWrapper}>
        <ProcessBar
          steps={LISTER_STEPS}
          color="#22c55e"
          videoSrc="/lister.mp4"
          btnLabel="List Now →"
          btnClass={styles.btnGreen}
          label="Lister"
          subtitle="List your idle gadgets and earn passive income"
        />
        <ProcessBar
          steps={BUYER_STEPS}
          color="#648DE5"
          videoSrc="/buyer.mp4"
          btnLabel="← Buy Now"
          btnClass={styles.btnBlue}
          reversed
          label="Renter"
          subtitle="Rent/Buy premium devices at a fraction of the cost"
        />
      </div>
    </section>
  );
}
