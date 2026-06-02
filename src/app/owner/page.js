"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Truck, CheckCircle, Package, Plus, Trash2, Store } from 'lucide-react';
import dynamic from 'next/dynamic';
const Spline = dynamic(() => import('@splinetool/react-spline'), { ssr: false });
import styles from './owner.module.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function OwnerPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [renewLoading, setRenewLoading] = useState(false);
  const [simulatedExpired, setSimulatedExpired] = useState(false);
  const [showRenewPaymentOptions, setShowRenewPaymentOptions] = useState(false);

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
    isShopOwner: false,
    shopName: '',
    shopOpenedYear: '',
    shopLicenseNo: '',
    isShopRegistered: false,
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);

  const handlePayListingFee = async () => {
    setRenewLoading(true);
    setError('');
    const token = localStorage.getItem('gadgetgo_token');
    try {
      const res = await fetch(`${API_URL}/api/auth/pay-listing-fee`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setSimulatedExpired(false);
        setShowRenewPaymentOptions(false);
        setToast(true);
        setTimeout(() => setToast(false), 3000);
      } else {
        const result = await res.json();
        setError(result.error || 'Failed to renew subscription');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setRenewLoading(false);
    }
  };

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
        // Suggest rent at ~0.5% of device value per day (student-friendly rate)
        next.pricePerDay = Math.round(value * 0.005);

        // Use Gizzmo's finalized flat deposit tiers (NOT a percentage)
        // This keeps deposits affordable for students while still being meaningful
        const mrp = Number(value);
        if (mrp >= 150000)     next.damageDeposit = 2499;
        else if (mrp >= 90000) next.damageDeposit = 1799;
        else if (mrp >= 50000) next.damageDeposit = 1199;
        else if (mrp >= 25000) next.damageDeposit = 799;
        else                   next.damageDeposit = 499;
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
    data.append('isShopOwner', formData.isShopOwner);
    data.append('shopName', formData.shopName);
    data.append('shopOpenedYear', formData.shopOpenedYear);
    data.append('shopLicenseNo', formData.shopLicenseNo);
    data.append('isShopRegistered', formData.isShopRegistered);
    
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
          description: '', specs: '',
          isShopOwner: false,
          shopName: '',
          shopOpenedYear: '',
          shopLicenseNo: '',
          isShopRegistered: false,
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
          <p>Your account is currently set to <strong>Renter</strong>. Renter accounts cannot list devices on Gizzmo. To list your gear and start earning, please register a new account as a <strong>Store Owner</strong>.</p>
          <div className={styles.promoteActions}>
            <Link href="/profile" className={styles.backBtn}>Go to Profile</Link>
          </div>
        </div>
      </div>
    );
  }

  // Support testing expired state via React state or URL param (e.g. /owner?expired=true)
  const isSubscriptionExpired = simulatedExpired || (typeof window !== 'undefined' && window.location.search.includes('expired=true'))
    ? true
    : (user?.listingFeeExpiresAt ? new Date(user.listingFeeExpiresAt) < new Date() : false);

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
        {/* Developer simulation banner */}
        <div style={{
          background: '#fff3cd',
          border: '1px solid #ffeeba',
          padding: '0.75rem 1rem',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.8rem',
          fontWeight: '700',
          color: '#856404',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}>
          <span>🛠️ TESTING SIMULATOR:</span>
          <button
            type="button"
            onClick={() => setSimulatedExpired(!simulatedExpired)}
            style={{
              background: simulatedExpired ? '#856404' : '#fff',
              color: simulatedExpired ? '#fff' : '#856404',
              border: '1px solid #856404',
              padding: '0.35rem 0.75rem',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.75rem',
              fontWeight: '700',
              transition: 'all 0.15s ease'
            }}
          >
            {simulatedExpired ? '⚡ Switch to Active (Trial)' : '⚡ Switch to Expired'}
          </button>
        </div>

        <div className={styles.formHeader}>
          <h2>NEW LISTING</h2>
          <p>Submit device details for verification.</p>
          
          {user?.listingFeeExpiresAt && (
            <div className={isSubscriptionExpired ? styles.expiredStatusCard : styles.activeStatusCard}>
              {isSubscriptionExpired ? (
                <div>
                  <h4>⚠️ SUBSCRIPTION EXPIRED</h4>
                  <p>Your store subscription has expired. Renew below to unlock listing privileges.</p>
                </div>
              ) : (
                <div>
                  <h4>✓ ACTIVE SUBSCRIPTION</h4>
                  <p>Subscription active until {new Date(user.listingFeeExpiresAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {error && <div className={styles.errorMsg}>{error}</div>}

        {isSubscriptionExpired && (
          <div className={styles.renewFormSection}>
            {!showRenewPaymentOptions ? (
              <button 
                type="button" 
                onClick={() => setShowRenewPaymentOptions(true)} 
                className={styles.renewActionBtn}
              >
                RENEW SUBSCRIPTION — ₹399 / MONTH
              </button>
            ) : (
              <div style={{
                background: '#f9fafb',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                padding: '1.25rem',
                marginBottom: '1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
              }}>
                <p style={{
                  fontSize: '0.85rem',
                  fontWeight: '800',
                  color: '#374151',
                  margin: 0,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  textAlign: 'left'
                }}>
                  Select Payment Method:
                </p>
                
                <div style={{
                  background: '#fff',
                  border: '2px solid #db2777', // pink active border
                  borderRadius: '10px',
                  padding: '0.75rem 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '700',
                  color: '#db2777',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
                }}>
                  <span style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    background: '#db2777',
                    display: 'inline-block'
                  }}></span>
                  💳 Pay Online (Razorpay / Card / UPI / NetBanking)
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button 
                    type="button" 
                    onClick={handlePayListingFee} 
                    className={styles.renewActionBtn}
                    disabled={renewLoading}
                    style={{ flex: 1, margin: 0 }}
                  >
                    {renewLoading ? 'PROCESSING...' : 'PROCEED TO PAY ₹399'}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setShowRenewPaymentOptions(false)}
                    style={{
                      background: '#f3f4f6',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      padding: '0.75rem 1.25rem',
                      fontSize: '0.85rem',
                      fontWeight: '700',
                      color: '#4b5563',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className={`${styles.listingForm} ${isSubscriptionExpired ? styles.formDisabled : ''}`}>
          
          {/* Lister Shop Verification Section */}
          <div style={{
            border: '2px solid #333',
            background: '#0a0a0a',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
            marginBottom: '1rem'
          }}>
            <h3 style={{ color: '#fff', fontSize: '1rem', fontWeight: 900, margin: 0, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              👤 Lister Verification
            </h3>
            
            <div className={styles.inputGroup}>
              <label>Are you a Shop Owner?</label>
              <select 
                name="isShopOwner" 
                value={formData.isShopOwner ? 'true' : 'false'} 
                onChange={(e) => setFormData(prev => ({ ...prev, isShopOwner: e.target.value === 'true' }))}
                disabled={isSubscriptionExpired}
              >
                <option value="false">No, I am an individual seller</option>
                <option value="true">Yes, I am a Shop Owner</option>
              </select>
            </div>

            {formData.isShopOwner && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', borderTop: '1px solid #222', paddingTop: '1.25rem' }}>
                <div className={styles.inputGroup}>
                  <label>Shop Name</label>
                  <input 
                    type="text" 
                    name="shopName" 
                    value={formData.shopName} 
                    onChange={handleChange} 
                    placeholder="e.g. Gizmo Electronics" 
                    required={formData.isShopOwner}
                    disabled={isSubscriptionExpired}
                  />
                </div>
                
                <div className={styles.formRow}>
                  <div className={styles.inputGroup} style={{ flex: 1 }}>
                    <label>Year Opened</label>
                    <input 
                      type="number" 
                      name="shopOpenedYear" 
                      value={formData.shopOpenedYear} 
                      onChange={handleChange} 
                      placeholder="e.g. 2018" 
                      required={formData.isShopOwner}
                      disabled={isSubscriptionExpired}
                    />
                  </div>
                  <div className={styles.inputGroup} style={{ flex: 1 }}>
                    <label>Shop License Number</label>
                    <input 
                      type="text" 
                      name="shopLicenseNo" 
                      value={formData.shopLicenseNo} 
                      onChange={handleChange} 
                      placeholder="e.g. LIC-4589201" 
                      required={formData.isShopOwner}
                      disabled={isSubscriptionExpired}
                    />
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <label>Official Registration Status</label>
                  <select 
                    name="isShopRegistered" 
                    value={formData.isShopRegistered ? 'true' : 'false'} 
                    onChange={(e) => setFormData(prev => ({ ...prev, isShopRegistered: e.target.value === 'true' }))}
                    disabled={isSubscriptionExpired}
                  >
                    <option value="false">No, Registration Pending / Unregistered</option>
                    <option value="true">Yes, Officially Registered Business</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label>Title</label>
            <input 
              type="text" 
              name="title" 
              value={formData.title} 
              onChange={handleChange} 
              placeholder="e.g. Sony A7IV - Professional Kit" 
              required 
              disabled={isSubscriptionExpired}
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
                disabled={isSubscriptionExpired}
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Classification</label>
              <select name="category" value={formData.category} onChange={handleChange} disabled={isSubscriptionExpired}>
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
                disabled={isSubscriptionExpired}
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
                  disabled={isSubscriptionExpired}
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
                disabled={isSubscriptionExpired}
              />
              {formData.actualPrice > 0 && formData.damageDeposit <= (formData.actualPrice * 0.15) && (
                <span className={styles.tagSafe}>Safe Deposit</span>
              )}
            </div>
            <small style={{ color: '#777' }}>Auto-suggested based on device MRP (flat tier: ₹499–₹2,499). Student-friendly & platform-approved.</small>
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
                disabled={isSubscriptionExpired}
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
                    <button type="button" onClick={() => removeFile(idx)} className={styles.removePreview} disabled={isSubscriptionExpired}>
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
              disabled={isSubscriptionExpired}
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
              disabled={isSubscriptionExpired}
            ></textarea>
          </div>

          <button type="submit" className={styles.submitBtn} disabled={isSubmitting || isSubscriptionExpired}>
            {isSubmitting ? 'PROCESSING...' : 'SUBMIT FOR REVIEW'}
          </button>
        </form>
      </section>

      {toast && (
        <div className={styles.toast}>
          <CheckCircle size={24} />
          {isSubscriptionExpired ? 'SUBSCRIPTION RENEWED' : 'LISTING SUCCESSFUL'}
        </div>
      )}
    </div>
  );
}
