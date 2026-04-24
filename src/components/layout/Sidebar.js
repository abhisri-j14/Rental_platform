"use client";
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Laptop, Camera, Smartphone, Tablet, Plane } from 'lucide-react';
import styles from './Sidebar.module.css';

const categories = [
  { name: 'Laptops', icon: Laptop, path: '/category/laptops' },
  { name: 'Cameras', icon: Camera, path: '/category/cameras' },
  { name: 'Phones', icon: Smartphone, path: '/category/phones' },
  { name: 'Tablets', icon: Tablet, path: '/category/tablets' },
  { name: 'Drones', icon: Plane, path: '/category/drones' },
];

export default function Sidebar({ isOpen, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className={styles.sidebar}
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
          >
            <div className={styles.header}>
              <h2 className={styles.title}>Categories</h2>
              <button className={styles.closeButton} onClick={onClose}>
                <X size={28} />
              </button>
            </div>
            <nav className={styles.nav}>
              {categories.map((cat) => (
                <Link key={cat.name} href={cat.path} className={styles.link} onClick={onClose}>
                  <cat.icon size={24} className={styles.icon} />
                  <span>{cat.name}</span>
                </Link>
              ))}
              <div className={styles.divider} />
              <Link href="/compare" className={styles.linkSpecial} onClick={onClose}>
                Compare Devices
              </Link>
              <Link href="/owner" className={styles.linkSpecialOutline} onClick={onClose}>
                List Your Device
              </Link>
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
