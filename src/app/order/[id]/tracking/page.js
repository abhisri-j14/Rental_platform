"use client";
import { useState, useEffect, use } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Package, CheckCircle2, Truck, Home, MapPin, Phone, 
  ChevronRight, ArrowLeft, ShieldCheck, Clock, Navigation, BadgeCheck, AlertCircle
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
  const paymentStatus = searchParams.get('payment_status'); // 'Credit' on success

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentVerified, setPaymentVerified] = useState(false);
  const [paymentFailed, setPaymentFailed] = useState(false);

  // Verify payment with backend when redirected from Instamojo
  useEffect(() => {
    if (!isPaymentReturn || !paymentRequestId) return;
    fetch(`${API_URL}/api/payments/verify?payment_id=${paymentId || ''}&payment_request_id=${paymentRequestId}&payment_status=${paymentStatus || ''}`)
      .then(res => res.json())
      .then(data => {
        if (data.paymentStatus === 'paid') {
          setPaymentVerified(true);
        } else {
          setPaymentFailed(true);
        }
      })
      .catch(() => setPaymentFailed(true));
  }, [isPaymentReturn, paymentRequestId, paymentId, paymentStatus]);

  useEffect(() => {
    const token = localStorage.getItem('gadgetgo_token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetch(`${API_URL}/api/orders/${orderId}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        setOrder(data.order);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [orderId, router]);

  if (loading) return <div className={styles.loading}>Initializing real-time tracking...</div>;
  if (!order) return <div className={styles.error}>Order not found or access denied.</div>;

  const steps = [
    { label: 'Order Placed', icon: <Package />, key: 'Order Placed' },
    { label: 'Payment Verified', icon: <ShieldCheck />, key: 'Payment Verified' },
    { label: 'In Transit', icon: <Truck />, key: 'In Transit' },
    { label: 'Out for Delivery', icon: <Navigation />, key: 'Out for Delivery' },
    { label: 'Delivered', icon: <Home />, key: 'Delivered' }
  ];

  const currentStepIndex = steps.findIndex(s => s.key === order.trackingStatus) || 0;

  return (
    <div className={styles.container}>

      {/* ── Payment return banners ── */}
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
        <button onClick={() => router.back()} className={styles.backBtn}>
          <ArrowLeft size={20} />
        </button>
        <div className={styles.headerInfo}>
          <h1>Track Your Gizzmo</h1>
          <p>Order ID: <span>#{order._id.slice(-8).toUpperCase()}</span></p>
        </div>
      </header>

      <div className={styles.grid}>
        {/* Left: Map & Real-time Progress */}
        <div className={styles.mainCol}>
          <div className={styles.mapContainer}>
            <div className={styles.mockMap}>
              {/* Pulsing Dot representing courier */}
              <div className={styles.courierDot}>
                <Truck size={24} color="#fff" />
                <div className={styles.pulse}></div>
              </div>
              <div className={styles.destinationMarker}>
                <MapPin size={32} color="#000" />
              </div>
              <div className={styles.mapLabel}>Courier is 4.2 km away from destination</div>
            </div>
          </div>

          <div className={styles.statusBanner}>
            <div className={styles.etaBox}>
              <Clock size={24} />
              <div>
                <p className={styles.etaLabel}>Estimated Arrival</p>
                <h2 className={styles.etaTime}>{order.estimatedDelivery}</h2>
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
                <div 
                  key={step.key} 
                  className={`${styles.timelineStep} ${isPast ? styles.past : ''} ${isCurrent ? styles.current : ''}`}
                >
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

        {/* Right: Order Summary & Lister Contact */}
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

          <div className={styles.listerCard}>
            <div className={styles.listerInfo}>
              <div className={styles.avatar}>
                {order.owner.name.charAt(0)}
              </div>
              <div>
                <p className={styles.listerLabel}>Device Owner</p>
                <h3>{order.owner.name}</h3>
              </div>
            </div>
            <a href={`tel:${order.owner.phone}`} className={styles.callBtn}>
              <Phone size={20} /> Call Lister
            </a>
          </div>

          <div className={styles.returnPolicyCard}>
            <ShieldCheck size={32} />
            <h3>6-Hour Return Policy</h3>
            <p>You can return the device within 6 hours of delivery for a 100% instant cashback if not satisfied.</p>
          </div>

          <Link href="/" className={styles.homeLink}>
            Return to Homepage
          </Link>
        </aside>
      </div>
    </div>
  );
}
