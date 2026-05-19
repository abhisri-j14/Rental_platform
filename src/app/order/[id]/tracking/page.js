"use client";
import { useState, useEffect, use } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Package, CheckCircle2, Truck, Home, MapPin, Phone, 
  ArrowLeft, ShieldCheck, Clock, Navigation, BadgeCheck, AlertCircle, Camera, Calendar
} from 'lucide-react';
import styles from './tracking.module.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function TrackingPage({ params }) {
  const resolvedParams = use(params);
  const orderId = resolvedParams.id;
  const router = useRouter();
  const searchParams = useSearchParams();
  const isPaymentReturn = searchParams.get('payment_success') === 'true';
  const paymentId = searchParams.get('payment_id');
  const paymentRequestId = searchParams.get('payment_request_id');
  const paymentStatus = searchParams.get('payment_status');

  const [order, setOrder] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentVerified, setPaymentVerified] = useState(false);
  const [paymentFailed, setPaymentFailed] = useState(false);
  
  // Agent Simulator state
  const [showAgentModal, setShowAgentModal] = useState(false);
  const [agentOtp, setAgentOtp] = useState('');
  const [agentPhotos, setAgentPhotos] = useState(null);
  const [agentSubmitting, setAgentSubmitting] = useState(false);
  
  // Return Scheduling state
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('Morning (9 AM - 12 PM)');
  const [scheduleSubmitting, setScheduleSubmitting] = useState(false);

  useEffect(() => {
    if (!isPaymentReturn || !paymentRequestId) return;
    fetch(`${API_URL}/api/payments/verify?payment_id=${paymentId || ''}&payment_request_id=${paymentRequestId}&payment_status=${paymentStatus || ''}`)
      .then(res => res.json())
      .then(data => {
        if (data.paymentStatus === 'paid') setPaymentVerified(true);
        else setPaymentFailed(true);
      })
      .catch(() => setPaymentFailed(true));
  }, [isPaymentReturn, paymentRequestId, paymentId, paymentStatus]);

  const fetchOrder = () => {
    const token = localStorage.getItem('gadgetgo_token');
    fetch(`${API_URL}/api/orders/${orderId}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        setOrder(data.order);
        
        // Also fetch current user to know role
        fetch(`${API_URL}/api/auth/me`, { headers: { 'Authorization': `Bearer ${token}` } })
          .then(r => r.json())
          .then(d => {
            setCurrentUser(d.user);
            setLoading(false);
          });
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    const token = localStorage.getItem('gadgetgo_token');
    if (!token) { router.push('/login'); return; }
    fetchOrder();
  }, [orderId, router]);

  const handleAgentSubmit = async (e) => {
    e.preventDefault();
    setAgentSubmitting(true);
    const token = localStorage.getItem('gadgetgo_token');
    const formData = new FormData();
    formData.append('otp', agentOtp);
    if (agentPhotos) {
      for (let i = 0; i < agentPhotos.length; i++) {
        formData.append('photos', agentPhotos[i]);
      }
    }
    
    const endpoint = order.trackingStatus === 'Out for Delivery' ? 'verify-delivery' : 'verify-return';
    
    try {
      const res = await fetch(`${API_URL}/api/orders/${orderId}/${endpoint}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      if (res.ok) {
        setShowAgentModal(false);
        setAgentOtp('');
        fetchOrder();
      } else {
        const err = await res.json();
        alert(err.error || 'Verification failed');
      }
    } catch (err) {
      alert('Network error');
    }
    setAgentSubmitting(false);
  };

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    setScheduleSubmitting(true);
    const token = localStorage.getItem('gadgetgo_token');
    
    try {
      const res = await fetch(`${API_URL}/api/orders/${orderId}/schedule-return`, {
        method: 'PATCH',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ pickupSlot: `${pickupDate} - ${pickupTime}` })
      });
      if (res.ok) {
        setShowScheduleModal(false);
        fetchOrder();
      } else {
        alert('Failed to schedule return');
      }
    } catch (err) {
      alert('Network error');
    }
    setScheduleSubmitting(false);
  };

  if (loading) return <div className={styles.loading}>Initializing real-time tracking...</div>;
  if (!order || !currentUser) return <div className={styles.error}>Order not found or access denied.</div>;

  const isOwner = currentUser._id === order.owner._id || currentUser._id === order.owner;
  const isRenter = currentUser._id === order.renter._id || currentUser._id === order.renter;

  // Extend steps for return flow if applicable
  let steps = [
    { label: 'Order Placed', icon: <Package />, key: 'Order Placed' },
    { label: 'Payment Verified', icon: <ShieldCheck />, key: 'Payment Verified' },
    { label: 'In Transit', icon: <Truck />, key: 'In Transit' },
    { label: 'Out for Delivery', icon: <Navigation />, key: 'Out for Delivery' },
    { label: 'Delivered', icon: <Home />, key: 'Delivered' }
  ];

  if (['Scheduled Return', 'Out for Pickup', 'Returned'].includes(order.trackingStatus)) {
    steps.push({ label: 'Scheduled Return', icon: <Calendar />, key: 'Scheduled Return' });
    steps.push({ label: 'Out for Pickup', icon: <Truck />, key: 'Out for Pickup' });
    steps.push({ label: 'Returned', icon: <CheckCircle2 />, key: 'Returned' });
  }

  const currentStepIndex = steps.findIndex(s => s.key === order.trackingStatus) || 0;

  return (
    <div className={styles.container}>
      {paymentVerified && (
        <div className={styles.paymentSuccessBanner}>
          <BadgeCheck size={22} />
          <span>Payment confirmed! Your order is now being processed.</span>
        </div>
      )}
      {paymentFailed && (
        <div className={styles.paymentFailBanner}>
          <AlertCircle size={22} />
          <span>Payment could not be verified automatically. Contact support with Order ID #{order._id.slice(-8).toUpperCase()}.</span>
        </div>
      )}

      <header className={styles.header}>
        <button onClick={() => router.back()} className={styles.backBtn}><ArrowLeft size={20} /></button>
        <div className={styles.headerInfo}>
          <h1>Track Your Gizzmo</h1>
          <p>Order ID: <span>#{order._id.slice(-8).toUpperCase()}</span></p>
        </div>
      </header>

      <div className={styles.grid}>
        <div className={styles.mainCol}>
          {/* ── Delivery OTP / Scheduling Banners ── */}
          {isRenter && order.trackingStatus === 'Out for Delivery' && order.deliveryOtp && (
            <div className={styles.otpBanner}>
              <div className={styles.otpIcon}><ShieldCheck size={28} /></div>
              <div>
                <p>Provide this Delivery OTP to the agent to receive your device:</p>
                <h2>{order.deliveryOtp}</h2>
              </div>
            </div>
          )}

          {isRenter && order.trackingStatus === 'Out for Pickup' && order.returnOtp && (
            <div className={styles.otpBanner}>
              <div className={styles.otpIcon}><ShieldCheck size={28} /></div>
              <div>
                <p>Provide this Return OTP to the agent when handing over the device:</p>
                <h2>{order.returnOtp}</h2>
              </div>
            </div>
          )}

          {isOwner && (order.trackingStatus === 'Out for Delivery' || order.trackingStatus === 'Out for Pickup') && (
            <div className={styles.agentPortalBanner}>
              <p><strong>[Owner / Agent Portal]</strong> You have an active handover.</p>
              <button onClick={() => setShowAgentModal(true)} className={styles.primaryBtn}>
                Simulate Agent Verify Handover
              </button>
            </div>
          )}

          {isRenter && order.trackingStatus === 'Delivered' && (
            <div className={styles.scheduleBanner}>
              <div className={styles.scheduleInfo}>
                <h3>Ready to Return?</h3>
                <p>Schedule a pickup slot to initiate the return process and get your deposit refunded.</p>
              </div>
              <button onClick={() => setShowScheduleModal(true)} className={styles.primaryBtn}>
                Schedule Return Pickup
              </button>
            </div>
          )}

          <div className={styles.mapContainer}>
            <div className={styles.mockMap}>
              <div className={styles.courierDot}>
                <Truck size={24} color="#fff" />
                <div className={styles.pulse}></div>
              </div>
              <div className={styles.destinationMarker}>
                <MapPin size={32} color="#000" />
              </div>
              <div className={styles.mapLabel}>
                {order.trackingStatus === 'Delivered' || order.trackingStatus === 'Returned' 
                  ? 'Handover Completed'
                  : 'Courier is tracking towards destination...'}
              </div>
            </div>
          </div>

          <div className={styles.statusBanner}>
            <div className={styles.etaBox}>
              <Clock size={24} />
              <div>
                <p className={styles.etaLabel}>{order.returnPickupSlot ? 'Pickup Slot' : 'Estimated Arrival'}</p>
                <h2 className={styles.etaTime}>{order.returnPickupSlot || order.estimatedDelivery}</h2>
              </div>
            </div>
            <div className={styles.divider}></div>
            <div className={styles.currentStatusBox}>
              <p className={styles.statusLabel}>Current Status</p>
              <h2 className={styles.statusText}>{order.trackingStatus}</h2>
            </div>
          </div>

          <div className={styles.timeline}>
            {steps.map((step, index) => {
              const isPast = index < currentStepIndex;
              const isCurrent = index === currentStepIndex;
              return (
                <div key={step.key} className={`${styles.timelineStep} ${isPast ? styles.past : ''} ${isCurrent ? styles.current : ''}`}>
                  <div className={styles.stepIcon}>{step.icon}</div>
                  <div className={styles.stepInfo}>
                    <h3>{step.label}</h3>
                    <p>{isPast ? 'Completed' : isCurrent ? 'In Progress' : 'Pending'}</p>
                  </div>
                  {index < steps.length - 1 && <div className={styles.stepConnector}></div>}
                </div>
              );
            })}
          </div>
        </div>

        <aside className={styles.sideCol}>
          <div className={styles.productCard}>
            <img src={order.product.images?.[0]} alt={order.product.title} />
            <div className={styles.productDetails}>
              <h3>{order.product.title}</h3>
              <p>{order.product.brand}</p>
              <div className={styles.orderMeta}>
                <span>{order.days} Days Rental</span>
                <span>₹{order.totalAmount.toLocaleString()} Total</span>
              </div>
            </div>
          </div>

          {order.deliveryPhotos && order.deliveryPhotos.length > 0 && (
            <div className={styles.photoProofCard}>
              <h3><Camera size={18} /> Delivery Condition Proof</h3>
              <div className={styles.photoGrid}>
                {order.deliveryPhotos.map((p, i) => (
                  <img key={i} src={`${API_URL}${p}`} alt={`Delivery Photo ${i}`} className={styles.proofImg} />
                ))}
              </div>
            </div>
          )}
          
          {order.returnPhotos && order.returnPhotos.length > 0 && (
            <div className={styles.photoProofCard}>
              <h3><Camera size={18} /> Return Condition Proof</h3>
              <div className={styles.photoGrid}>
                {order.returnPhotos.map((p, i) => (
                  <img key={i} src={`${API_URL}${p}`} alt={`Return Photo ${i}`} className={styles.proofImg} />
                ))}
              </div>
            </div>
          )}

          <div className={styles.listerCard}>
            <div className={styles.listerInfo}>
              <div className={styles.avatar}>{isRenter ? order.owner.name.charAt(0) : order.renter.name.charAt(0)}</div>
              <div>
                <p className={styles.listerLabel}>{isRenter ? 'Device Owner' : 'Renter'}</p>
                <h3>{isRenter ? order.owner.name : order.renter.name}</h3>
              </div>
            </div>
            <a href={`tel:${isRenter ? order.owner.phone : order.renter.phone}`} className={styles.callBtn}>
              <Phone size={20} /> Call {isRenter ? 'Owner' : 'Renter'}
            </a>
          </div>

          <Link href="/" className={styles.homeLink}>Return to Homepage</Link>
        </aside>
      </div>

      {/* ── Modals ── */}
      {showAgentModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>Agent Simulator: Verify Handover</h2>
            <p>Ask the renter for the {order.trackingStatus === 'Out for Delivery' ? 'Delivery' : 'Return'} OTP and snap condition photos.</p>
            <form onSubmit={handleAgentSubmit}>
              <div className={styles.inputGroup}>
                <label>Enter 4-Digit OTP</label>
                <input type="text" value={agentOtp} onChange={(e) => setAgentOtp(e.target.value)} required maxLength="4" placeholder="e.g. 4821" />
              </div>
              <div className={styles.inputGroup}>
                <label>Upload Condition Photos (Required)</label>
                <input type="file" multiple accept="image/*" onChange={(e) => setAgentPhotos(e.target.files)} required />
              </div>
              <div className={styles.modalActions}>
                <button type="button" onClick={() => setShowAgentModal(false)} className={styles.secondaryBtn}>Cancel</button>
                <button type="submit" disabled={agentSubmitting} className={styles.primaryBtn}>{agentSubmitting ? 'Verifying...' : 'Verify & Complete Handover'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showScheduleModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>Schedule Return Pickup</h2>
            <p>Select a date and time slot for the delivery agent to pick up the device.</p>
            <form onSubmit={handleScheduleSubmit}>
              <div className={styles.inputGroup}>
                <label>Pickup Date</label>
                <input type="date" value={pickupDate} onChange={(e) => setPickupDate(e.target.value)} required />
              </div>
              <div className={styles.inputGroup}>
                <label>Pickup Time Slot</label>
                <select value={pickupTime} onChange={(e) => setPickupTime(e.target.value)} required>
                  <option>Morning (9 AM - 12 PM)</option>
                  <option>Afternoon (12 PM - 4 PM)</option>
                  <option>Evening (4 PM - 8 PM)</option>
                </select>
              </div>
              <div className={styles.modalActions}>
                <button type="button" onClick={() => setShowScheduleModal(false)} className={styles.secondaryBtn}>Cancel</button>
                <button type="submit" disabled={scheduleSubmitting} className={styles.primaryBtn}>{scheduleSubmitting ? 'Scheduling...' : 'Confirm Schedule'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
