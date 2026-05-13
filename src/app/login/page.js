"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowRight, Eye, EyeOff, Mail, Phone, Lock, User, ShoppingBag, Store, ChevronLeft } from 'lucide-react';
import styles from './login.module.css';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function LoginPage() {
  const { login } = useAuth();
  const searchParams = useSearchParams();
  const { refreshCart } = useCart();
  const [tab, setTab] = useState('login'); // 'login' or 'signup'
  const [step, setStep] = useState('form'); // 'form', 'role', 'otp', 'success'
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [role, setRole] = useState(''); // 'user' or 'owner'

  // Handle Google OAuth callback & email verification
  useEffect(() => {
    const handleAuth = async () => {
    const token = searchParams.get('token');
    const emailVerified = searchParams.get('emailVerified');

    if (token) {
      login(token);
      await refreshCart();
      setSuccess('Logged in with Google!');
      setTimeout(() => { window.location.href = '/'; }, 1500);
    }
    if (emailVerified) {
      setSuccess('Email verified successfully! You can now log in.');
    }
    };
    handleAuth();
  }, [searchParams, refreshCart]);

  // Switch to signup and show role picker first
  const goToSignup = () => {
    setTab('signup');
    setStep('role');
    setError('');
    setRole('');
  };

  const goToLogin = () => {
    setTab('login');
    setStep('form');
    setError('');
  };

  const selectRole = (selectedRole) => {
    setRole(selectedRole);
    setStep('form');
  };

  // ─── Signup ───────────────────────────────────────────────
  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, phone: `+91${phone}`, role }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Signup failed');
        return;
      }

      login(data.token);
      setSuccess('Account created! Sending OTP to verify your phone...');

      // Auto-send OTP for phone verification
      await fetch(`${API_URL}/api/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: `+91${phone}` }),
      });

      setStep('otp');
    } catch {
      setError('Network error. Is the server running?');
    } finally {
      setLoading(false);
    }
  };

  // ─── Login ────────────────────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Login failed');
        return;
      }

      login(data.token);
      await refreshCart();
      setSuccess('Login successful! Redirecting...');
      setTimeout(() => { window.location.href = '/'; }, 1000);
    } catch {
      setError('Network error. Is the server running?');
    } finally {
      setLoading(false);
    }
  };

  // ─── Verify OTP ───────────────────────────────────────────
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: `+91${phone}`, code: otp }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Verification failed');
        return;
      }

      login(data.token);
      await refreshCart();
      setSuccess('Phone verified! Check your email for email verification. Redirecting...');
      setTimeout(() => { window.location.href = '/'; }, 2000);
    } catch {
      setError('Network error. Is the server running?');
    } finally {
      setLoading(false);
    }
  };

  // ─── Resend OTP ───────────────────────────────────────────
  const handleResendOtp = async () => {
    setError('');
    try {
      await fetch(`${API_URL}/api/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: `+91${phone}` }),
      });
      setSuccess('OTP resent!');
      setTimeout(() => setSuccess(''), 3000);
    } catch {
      setError('Failed to resend OTP');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.authCard}>
        <div className={styles.brand}>Gizzmo</div>

        {/* Status messages */}
        {error && <div className={styles.errorMsg}>{error}</div>}
        {success && <div className={styles.successMsg}>{success}</div>}

        {/* ─── ROLE PICKER ──────────────────────────────────── */}
        {step === 'role' && (
          <>
            <h1 className={styles.title}>Join Gizzmo 🚀</h1>
            <p className={styles.subtitle}>How would you like to use Gizzmo?</p>

            <div className={styles.roleGrid}>
              {/* Renter Card */}
              <button
                id="role-renter"
                className={`${styles.roleCard} ${role === 'user' ? styles.roleCardActive : ''}`}
                onClick={() => selectRole('user')}
              >
                <div className={styles.roleIconWrap} data-type="user">
                  <ShoppingBag size={36} />
                </div>
                <div className={styles.roleTitle}>I&apos;m a Renter</div>
                <div className={styles.roleDesc}>
                  Browse and rent the latest electronics — laptops, cameras, consoles & more.
                </div>
                <div className={styles.roleTag}>Customer</div>
              </button>

              {/* Store Owner Card */}
              <button
                id="role-owner"
                className={`${styles.roleCard} ${role === 'owner' ? styles.roleCardActive : ''}`}
                onClick={() => selectRole('owner')}
              >
                <div className={styles.roleIconWrap} data-type="owner">
                  <Store size={36} />
                </div>
                <div className={styles.roleTitle}>I&apos;m a Store Owner</div>
                <div className={styles.roleDesc}>
                  List your devices and earn by renting them out to customers near you.
                </div>
                <div className={styles.roleTag} data-owner>Store</div>
              </button>
            </div>

            <button
              type="button"
              className={styles.linkBtn}
              onClick={goToLogin}
            >
              Already have an account? Sign In
            </button>
          </>
        )}

        {/* ─── FORM STEP ────────────────────────────────────── */}
        {step === 'form' && (
          <>
            {/* Tab switcher */}
            <div className={styles.tabs}>
              <button
                className={`${styles.tab} ${tab === 'login' ? styles.activeTab : ''}`}
                onClick={goToLogin}
              >
                Sign In
              </button>
              <button
                className={`${styles.tab} ${tab === 'signup' ? styles.activeTab : ''}`}
                onClick={goToSignup}
              >
                Create Account
              </button>
            </div>

            {tab === 'signup' ? (
              /* ─── SIGNUP FORM ──────────────────────────── */
              <>
                {/* Role badge */}
                <div className={styles.roleBadgeRow}>
                  <button
                    type="button"
                    className={styles.roleBadgeBack}
                    onClick={() => setStep('role')}
                    title="Change account type"
                  >
                    <ChevronLeft size={15} />
                    Change
                  </button>
                  <span className={`${styles.roleBadge} ${role === 'owner' ? styles.roleBadgeOwner : ''}`}>
                    {role === 'owner' ? <><Store size={14} /> Store Owner</> : <><ShoppingBag size={14} /> Renter</>}
                  </span>
                </div>

                <form onSubmit={handleSignup} className={styles.form}>
                  <div className={styles.inputGroup}>
                    <label><User size={14} /> Full Name</label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label><Mail size={14} /> Email</label>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label><Lock size={14} /> Password</label>
                    <div className={styles.passwordContainer}>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Min 6 characters"
                        required
                        minLength={6}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={styles.input}
                      />
                      <button
                        type="button"
                        className={styles.eyeBtn}
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div className={styles.inputGroup}>
                    <label><Phone size={14} /> Phone Number</label>
                    <div className={styles.phoneInputContainer}>
                      <span className={styles.countryCode}>+91</span>
                      <input
                        type="tel"
                        placeholder="Enter 10-digit number"
                        required
                        pattern="[0-9]{10}"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        className={styles.input}
                      />
                    </div>
                  </div>

                  <button type="submit" className={styles.primaryBtn} disabled={loading}>
                    {loading ? 'Creating Account...' : 'Create Account'} <ArrowRight size={20} />
                  </button>
                </form>
              </>
            ) : (
              /* ─── LOGIN FORM ───────────────────────────── */
              <form onSubmit={handleLogin} className={styles.form}>
                <div className={styles.inputGroup}>
                  <label><Mail size={14} /> Email</label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={styles.input}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label><Lock size={14} /> Password</label>
                  <div className={styles.passwordContainer}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={styles.input}
                    />
                    <button
                      type="button"
                      className={styles.eyeBtn}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <button type="submit" className={styles.primaryBtn} disabled={loading}>
                  {loading ? 'Signing In...' : 'Sign In'} <ArrowRight size={20} />
                </button>
              </form>
            )}

            {/* Google OAuth */}
            <div className={styles.divider}>
              <span>or</span>
            </div>
            <a href={`${API_URL}/api/auth/google`} className={styles.googleBtn}>
              <svg width="20" height="20" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
              Continue with Google
            </a>
          </>
        )}

        {/* ─── OTP VERIFICATION ──────────────────────────── */}
        {step === 'otp' && (
          <>
            <h1 className={styles.title}>Verify Your Phone 📱</h1>
            <p className={styles.subtitle}>We&apos;ve sent a 6-digit OTP to +91 {phone}</p>

            <form onSubmit={handleVerifyOtp} className={styles.form}>
              <div className={styles.inputGroup}>
                <label>One Time Password</label>
                <input
                  type="text"
                  placeholder="000000"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className={`${styles.input} ${styles.otpInput}`}
                  maxLength={6}
                />
              </div>
              <button type="submit" className={styles.primaryBtn} disabled={loading}>
                {loading ? 'Verifying...' : 'Verify & Continue'}
              </button>
              <div className={styles.otpActions}>
                <button type="button" onClick={handleResendOtp} className={styles.linkBtn}>
                  Resend OTP
                </button>
                <button type="button" onClick={() => setStep('form')} className={styles.linkBtn}>
                  Go Back
                </button>
              </div>
            </form>
          </>
        )}

        <div className={styles.footer}>
          <p>By continuing, you agree to our <Link href="#">Terms of Service</Link> and <Link href="#">Privacy Policy</Link>.</p>
          <p className={styles.aadharNote}>Aadhar Verification will be required for your first rental.</p>
        </div>
      </div>
    </div>
  );
}
