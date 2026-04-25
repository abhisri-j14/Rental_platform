"use client";
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Laptop, Camera, Smartphone, Tablet, Plane,
  Gamepad2, Headphones, Glasses, Zap, Package,
  ArrowRight, Store, BarChart2, Tv,
} from 'lucide-react';
import styles from './Sidebar.module.css';

// ─── Category list ──────────────────────────────────────────
const categories = [
  {
    name: 'Laptops',
    desc: 'MacBooks, ThinkPads & more',
    icon: Laptop,
    path: '/category/laptops',
    color: '#c7d2fe',
    textColor: '#3730a3',
  },
  {
    name: 'Cameras & Lenses',
    desc: 'DSLRs, mirrorless, GoPros',
    icon: Camera,
    path: '/category/cameras',
    color: '#fde68a',
    textColor: '#92400e',
  },
  {
    name: 'Smartphones',
    desc: 'iPhones, Samsung, Pixel',
    icon: Smartphone,
    path: '/category/phones',
    color: '#bbf7d0',
    textColor: '#14532d',
  },
  {
    name: 'Drones',
    desc: 'DJI, aerial photography kits',
    icon: Plane,
    path: '/category/drones',
    color: '#bae6fd',
    textColor: '#0c4a6e',
  },
  {
    name: 'Tablets & iPads',
    desc: 'iPad Pro, Galaxy Tab & more',
    icon: Tablet,
    path: '/category/tablets',
    color: '#f5d0fe',
    textColor: '#6b21a8',
  },
  {
    name: 'Gaming Consoles',
    desc: 'PS5, Xbox, Nintendo Switch',
    icon: Gamepad2,
    path: '/category/gaming',
    color: '#fecaca',
    textColor: '#991b1b',
  },
  {
    name: 'Audio & Headphones',
    desc: 'Sony WH, AirPods & speakers',
    icon: Headphones,
    path: '/category/audio',
    color: '#d1fae5',
    textColor: '#064e3b',
  },
  {
    name: 'VR Headsets',
    desc: 'Meta Quest, Vision Pro',
    icon: Glasses,
    path: '/category/vr',
    color: '#e0e7ff',
    textColor: '#312e81',
  },
  {
    name: 'Smart TVs',
    desc: '4K, OLED, QLED screens',
    icon: Tv,
    path: '/category/tv',
    color: '#fef3c7',
    textColor: '#78350f',
  },
  {
    name: 'Accessories',
    desc: 'Lenses, mics, tripods & more',
    icon: Package,
    path: '/category/accessories',
    color: '#f1f5f9',
    textColor: '#334155',
  },
];

// ─── Component ───────────────────────────────────────────────
export default function Sidebar({ isOpen, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Dark overlay */}
          <motion.div
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Sidebar panel */}
          <motion.div
            className={styles.sidebar}
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', bounce: 0, duration: 0.35 }}
          >
            {/* ── Brand header ── */}
            <div className={styles.header}>
              <div className={styles.brand}>
                Gadget<span className={styles.accent}>Go</span>
              </div>
              <button className={styles.closeBtn} onClick={onClose} aria-label="Close menu">
                <X size={24} />
              </button>
            </div>

            {/* ── Section label ── */}
            <div className={styles.sectionLabel}>
              <Zap size={14} />
              Browse Categories
            </div>

            {/* ── Categories ── */}
            <nav className={styles.nav}>
              {categories.map((cat, i) => (
                <Link
                  key={cat.path}
                  href={cat.path}
                  className={styles.categoryLink}
                  onClick={onClose}
                  style={{ animationDelay: `${i * 30}ms` }}
                >
                  {/* Icon box */}
                  <div
                    className={styles.iconBox}
                    style={{ background: cat.color, color: cat.textColor }}
                  >
                    <cat.icon size={20} />
                  </div>

                  {/* Text */}
                  <div className={styles.catText}>
                    <span className={styles.catName}>{cat.name}</span>
                    <span className={styles.catDesc}>{cat.desc}</span>
                  </div>

                  {/* Arrow */}
                  <ArrowRight size={16} className={styles.arrow} />
                </Link>
              ))}
            </nav>

            {/* ── Footer quick links ── */}
            <div className={styles.footer}>
              <Link href="/compare" className={styles.footerLink} onClick={onClose}>
                <BarChart2 size={16} /> Compare Devices
              </Link>
              <Link href="/owner" className={styles.footerLinkHighlight} onClick={onClose}>
                <Store size={16} /> List Your Device
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
