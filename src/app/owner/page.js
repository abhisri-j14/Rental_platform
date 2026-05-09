"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Truck, CheckCircle, Package } from 'lucide-react';
import styles from './owner.module.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function OwnerPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    brand: '',
    category: 'laptops',
    actualPrice: '',
    pricePerDay: '',
    damageDeposit: '',
    description: '',
    specs: '' // We will parse this simply
  });

  useEffect(() => {
    const token = localStorage.getItem('gadgetgo_token');
    if (!token) {
      router.push('/login?redirect=/owner');
      return;
    }

    fetch(`${API_URL}/api/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (!data.user) {
          localStorage.removeItem('gadgetgo_token');
          router.push('/login?redirect=/owner');
        } else {
          setUser(data.user);
          // If the user isn't an owner, technically the API might block it, 
          // but for this demo, we'll assume any logged-in user can reach this form,
          // and the API handles role checks (or we promote them). 
          // Note: In our current setup, seeded users have role 'owner' or 'student'.
        }
        setLoading(false);
      })
      .catch(() => {
        router.push('/login?redirect=/owner');
      });
  }, [router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('gadgetgo_token');
    
    // Parse specs if provided (e.g., "RAM: 16GB, Storage: 512GB")
    const parsedSpecs = {};
    if (formData.specs) {
      formData.specs.split(',').forEach(pair => {
        const [key, val] = pair.split(':');
        if (key && val) parsedSpecs[key.trim()] = val.trim();
      });
    }

    const payload = {
      title: formData.title,
      brand: formData.brand,
      category: formData.category,
      actualPrice: Number(formData.actualPrice),
      pricePerDay: Number(formData.pricePerDay),
      damageDeposit: Number(formData.damageDeposit),
      description: formData.description,
      specs: parsedSpecs
    };

    try {
      const res = await fetch(`${API_URL}/api/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setToast(true);
        setTimeout(() => setToast(false), 3000);
        // Reset form
        setFormData({
          title: '', brand: '', category: 'laptops',
          actualPrice: '', pricePerDay: '', damageDeposit: '',
          description: '', specs: ''
        });
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to list device. Ensure you have owner privileges.');
      }
    } catch (err) {
      alert('Error connecting to server.');
    }
  };

  if (loading) {
    return <div className={styles.loadingState}>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      {/* Left Side - Policies & Vibe */}
      <section className={styles.policiesSection}>
        <h1>Start Earning Today 💸</h1>
        <p>Turn your idle gadgets into a passive income stream. List your devices, set your price, and let Gizzmo connect you with verified renters.</p>
        
        <div className={styles.policyGrid}>
          <div className={styles.policyCard}>
            <div className={styles.policyIcon} style={{ background: '#dbeafe' }}>
              <Truck size={28} color="#2563eb" />
            </div>
            <div>
              <h3>You Manage Logistics</h3>
              <p>Just like Swiggy, you handle the delivery to the renter's address and collect the delivery charge directly.</p>
            </div>
          </div>

          <div className={styles.policyCard}>
            <div className={styles.policyIcon} style={{ background: '#fce7f3' }}>
              <ShieldCheck size={28} color="#db2777" />
            </div>
            <div>
              <h3>100% Damage & Theft Coverage</h3>
              <p>Renters pay a refundable damage deposit upfront. Inspect the device during handover—if damaged, the deposit covers it.</p>
            </div>
          </div>

          <div className={styles.policyCard}>
            <div className={styles.policyIcon} style={{ background: '#fef3c7' }}>
              <CheckCircle size={28} color="#d97706" />
            </div>
            <div>
              <h3>Aadhaar Verified Renters</h3>
              <p>Every user on our platform goes through strict Aadhaar KYC verification. Your devices are in safe hands.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Right Side - Form */}
      <section className={styles.formSection}>
        <div className={styles.formHeader}>
          <h2>List a New Device 📦</h2>
          <p>Fill out the details below to make your gadget visible to thousands of renters.</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.listingForm}>
          
          <div className={styles.inputGroup}>
            <label>Device Title (Make it catchy!)</label>
            <input 
              type="text" 
              name="title" 
              value={formData.title} 
              onChange={handleChange} 
              placeholder="e.g. MacBook Pro M2 14-inch | Pristine Condition" 
              required 
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.inputGroup}>
              <label>Brand</label>
              <input 
                type="text" 
                name="brand" 
                value={formData.brand} 
                onChange={handleChange} 
                placeholder="e.g. Apple, Dell, Sony" 
                required 
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Category</label>
              <select name="category" value={formData.category} onChange={handleChange}>
                <option value="laptops">Laptops</option>
                <option value="cameras">Cameras</option>
                <option value="phones">Phones</option>
                <option value="drones">Drones</option>
                <option value="tablets">Tablets</option>
                <option value="gaming">Gaming</option>
                <option value="vr">VR Headsets</option>
                <option value="audio">Audio</option>
                <option value="accessories">Accessories</option>
              </select>
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.inputGroup}>
              <label>Actual Market Price (₹)</label>
              <input 
                type="number" 
                name="actualPrice" 
                value={formData.actualPrice} 
                onChange={handleChange} 
                placeholder="e.g. 199900" 
                required 
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Rent per Day (₹)</label>
              <input 
                type="number" 
                name="pricePerDay" 
                value={formData.pricePerDay} 
                onChange={handleChange} 
                placeholder="e.g. 400" 
                required 
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label>Security Deposit (Refundable) (₹)</label>
            <input 
              type="number" 
              name="damageDeposit" 
              value={formData.damageDeposit} 
              onChange={handleChange} 
              placeholder="e.g. 5000" 
              required 
            />
            <small style={{ color: '#666', fontSize: '0.8rem' }}>This amount is held from the renter to protect against damages.</small>
          </div>

          <div className={styles.inputGroup}>
            <label>Device Specifications (Optional)</label>
            <input 
              type="text" 
              name="specs" 
              value={formData.specs} 
              onChange={handleChange} 
              placeholder="e.g. RAM: 16GB, Storage: 512GB, Display: OLED" 
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Description & Condition</label>
            <textarea 
              name="description" 
              value={formData.description} 
              onChange={handleChange} 
              rows="4" 
              placeholder="Describe the condition, age, and any included accessories..."
              required 
            ></textarea>
          </div>

          <button type="submit" className={styles.submitBtn}>
            List Device Now ✨
          </button>
        </form>
      </section>

      {toast && (
        <div className={styles.toast}>
          <Package size={20} />
          Device listed successfully!
        </div>
      )}
    </div>
  );
}
