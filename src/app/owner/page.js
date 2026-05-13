"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Truck, CheckCircle, Package, Plus, Trash2, Store } from 'lucide-react';
import Spline from '@splinetool/react-spline';
import styles from './owner.module.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function OwnerPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    brand: '',
    category: 'laptops',
    actualPrice: '',
    pricePerDay: '',
    damageDeposit: '',
    description: '',
    specs: '',
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);

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
        }
        setLoading(false);
      })
      .catch(() => {
        router.push('/login?redirect=/owner');
      });
  }, [router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const next = { ...prev, [name]: value };
      
      // Auto-suggest rent and deposit when actualPrice changes
      if (name === 'actualPrice' && value > 0) {
        // Suggesting highly feasible prices for students (approx 0.5% - 0.7% per day)
        next.pricePerDay = Math.round(value * 0.005); 
        next.damageDeposit = Math.round(value * 0.10); // 10% deposit
      }
      
      return next;
    });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + selectedFiles.length > 10) {
      setError('Error: Maximum 10 images allowed.');
      return;
    }

    const newFiles = [...selectedFiles, ...files];
    setSelectedFiles(newFiles);

    // Create previews
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const removeFile = (index) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    setPreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (selectedFiles.length < 3) {
      setError('Error: At least 3 high-quality product images are required.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);
    const token = localStorage.getItem('gadgetgo_token');
    
    const parsedSpecs = {};
    if (formData.specs) {
      formData.specs.split(',').forEach(pair => {
        const [key, val] = pair.split(':');
        if (key && val) parsedSpecs[key.trim()] = val.trim();
      });
    }

    const data = new FormData();
    data.append('title', formData.title);
    data.append('brand', formData.brand);
    data.append('category', formData.category);
    data.append('actualPrice', formData.actualPrice);
    data.append('pricePerDay', formData.pricePerDay);
    data.append('damageDeposit', formData.damageDeposit);
    data.append('description', formData.description);
    data.append('specs', JSON.stringify(parsedSpecs));
    
    selectedFiles.forEach(file => {
      data.append('images', file);
    });

    try {
      const res = await fetch(`${API_URL}/api/products`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
          // Note: Browser automatically sets multipart/form-data for FormData
        },
        body: data
      });

      if (res.ok) {
        setToast(true);
        setTimeout(() => setToast(false), 3000);
        setFormData({
          title: '', brand: '', category: 'laptops',
          actualPrice: '', pricePerDay: '', damageDeposit: '',
          description: '', specs: ''
        });
        setSelectedFiles([]);
        setPreviews([]);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const result = await res.json();
        setError(result.error || 'Failed to list device.');
      }
    } catch (err) {
      setError('Network Error.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className={styles.loadingState}>AUTHENTICATING...</div>;
  }

  // Role restriction view
  if (user && user.role !== 'owner') {
    return (
      <div className={styles.container}>
        <div className={styles.restrictedView}>
          <Store size={64} color="#fff" />
          <h1>Lister Access Required</h1>
          <p>Your account is currently set to <strong>Renter</strong>. To list your gear and start earning, you need to upgrade to a <strong>Store Owner</strong> account.</p>
          <div className={styles.promoteActions}>
            <button 
              onClick={async () => {
                const token = localStorage.getItem('gadgetgo_token');
                const res = await fetch(`${API_URL}/api/auth/become-owner`, {
                  method: 'PUT',
                  headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                  const data = await res.json();
                  setUser(data.user);
                  window.location.reload(); // Hard refresh to ensure all components see the change
                }
              }}
              className={styles.promoteLargeBtn}
            >
              UNLOCK LISTER DASHBOARD
            </button>
            <Link href="/profile" className={styles.backBtn}>Go to Profile</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Left Side - 3D Scene & Policies */}
      <section className={styles.policiesSection}>
        <div className={styles.sceneWrapper}>
          <Spline scene="/owner.splinecode" />
        </div>
        
        <div className={styles.textOverlay}>
          <h1>OWNER PORTAL</h1>
          <p>Monetize your professional gear. Gizzmo provides the infrastructure and security to scale your rental business.</p>
          
          <div className={styles.policyGrid}>
            <div className={styles.policyCard}>
              <div className={styles.policyIcon}>
                <Truck size={24} color="#000" />
              </div>
              <div>
                <h3>DIRECT LOGISTICS</h3>
                <p>Take full control of the delivery process. Set your own charges and ensure safe transit.</p>
              </div>
            </div>

            <div className={styles.policyCard}>
              <div className={styles.policyIcon}>
                <ShieldCheck size={24} color="#000" />
              </div>
              <div>
                <h3>DEPOSIT PROTECTION</h3>
                <p>Transactions are backed by a mandatory security deposit for your gear's protection.</p>
              </div>
            </div>

            <div className={styles.policyCard}>
              <div className={styles.policyIcon}>
                <CheckCircle size={24} color="#000" />
              </div>
              <div>
                <h3>IDENTITY VERIFICATION</h3>
                <p>Zero anonymity. All renters must complete Aadhaar-based KYC before booking.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Right Side - Form */}
      <section className={styles.formSection}>
        <div className={styles.formHeader}>
          <h2>NEW LISTING</h2>
          <p>Submit device details for verification.</p>
        </div>

        {error && <div className={styles.errorMsg}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.listingForm}>
          
          <div className={styles.inputGroup}>
            <label>Title</label>
            <input 
              type="text" 
              name="title" 
              value={formData.title} 
              onChange={handleChange} 
              placeholder="e.g. Sony A7IV - Professional Kit" 
              required 
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.inputGroup}>
              <label>Manufacturer</label>
              <input 
                type="text" 
                name="brand" 
                value={formData.brand} 
                onChange={handleChange} 
                placeholder="e.g. Sony, Apple, DJI" 
                required 
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Classification</label>
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
              <label>Original Value (INR)</label>
              <input 
                type="number" 
                name="actualPrice" 
                value={formData.actualPrice} 
                onChange={handleChange} 
                placeholder="250000" 
                required 
              />
              <span className={styles.inputHint}>Required to suggest affordable rates.</span>
            </div>
            <div className={styles.inputGroup}>
              <label>Rent Per Day (INR)</label>
              <div className={styles.suggestiveInput}>
                <input 
                  type="number" 
                  name="pricePerDay" 
                  value={formData.pricePerDay} 
                  onChange={handleChange} 
                  placeholder="1500" 
                  required 
                />
                {formData.actualPrice > 0 && formData.pricePerDay <= (formData.actualPrice * 0.008) && (
                  <span className={styles.tagStudent}>Student Friendly</span>
                )}
              </div>
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label>Security Deposit (INR)</label>
            <div className={styles.suggestiveInput}>
              <input 
                type="number" 
                name="damageDeposit" 
                value={formData.damageDeposit} 
                onChange={handleChange} 
                placeholder="10000" 
                required 
              />
              {formData.actualPrice > 0 && formData.damageDeposit <= (formData.actualPrice * 0.15) && (
                <span className={styles.tagSafe}>Safe Deposit</span>
              )}
            </div>
            <small style={{ color: '#777' }}>Suggested: 10% of value for student trust.</small>
          </div>

          <div className={styles.inputGroup}>
            <label>Product Images (At least 3)</label>
            <div className={styles.uploadContainer}>
              <input 
                type="file" 
                multiple 
                accept="image/*" 
                onChange={handleFileChange}
                className={styles.fileInput}
                id="file-upload"
              />
              <label htmlFor="file-upload" className={styles.uploadPlaceholder}>
                <Plus size={32} />
                <span>UPLOAD IMAGES FROM DEVICE</span>
                <small>Select at least 3 high-quality photos</small>
              </label>
            </div>

            {previews.length > 0 && (
              <div className={styles.previewGrid}>
                {previews.map((src, idx) => (
                  <div key={idx} className={styles.previewCard}>
                    <img src={src} alt="Preview" />
                    <button type="button" onClick={() => removeFile(idx)} className={styles.removePreview}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label>Technical Specifications</label>
            <input 
              type="text" 
              name="specs" 
              value={formData.specs} 
              onChange={handleChange} 
              placeholder="e.g. RAM: 16GB, Sensor: Full Frame" 
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Condition & Full Description</label>
            <textarea 
              name="description" 
              value={formData.description} 
              onChange={handleChange} 
              rows="5" 
              placeholder="Provide a professional assessment of the device state..."
              required 
            ></textarea>
          </div>

          <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
            {isSubmitting ? 'PROCESSING...' : 'SUBMIT FOR REVIEW'}
          </button>
        </form>
      </section>

      {toast && (
        <div className={styles.toast}>
          <CheckCircle size={24} />
          LISTING SUCCESSFUL
        </div>
      )}
    </div>
  );
}
