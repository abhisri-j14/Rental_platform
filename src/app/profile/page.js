"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Phone, Shield, ShieldCheck, CheckCircle, XCircle, Edit3, Save, LogOut, ChevronRight } from 'lucide-react';
import styles from './profile.module.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Editable fields
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');

  // Fetch user data
  useEffect(() => {
    const token = localStorage.getItem('gadgetgo_token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetch(`${API_URL}/api/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` },
    })
      .then(res => {
        if (!res.ok) throw new Error('Not authenticated');
        return res.json();
      })
      .then(data => {
        setUser(data.user);
        setEditName(data.user.name);
        setEditPhone(data.user.phone?.replace('+91', '') || '');
        setLoading(false);
      })
      .catch(() => {
        localStorage.removeItem('gadgetgo_token');
        router.push('/login');
      });
  }, [router]);

  // Save profile
  const handleSave = async () => {
    setSaving(true);
    setMessage({ type: '', text: '' });
    const token = localStorage.getItem('gadgetgo_token');

    try {
      const res = await fetch(`${API_URL}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: editName,
          phone: `+91${editPhone}`,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setMessage({ type: 'error', text: data.error });
        return;
      }

      setUser(data.user);
      setEditing(false);
      setMessage({ type: 'success', text: 'Profile updated!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch {
      setMessage({ type: 'error', text: 'Failed to update profile' });
    } finally {
      setSaving(false);
    }
  };

  // Send phone OTP
  const handleVerifyPhone = async () => {
    const token = localStorage.getItem('gadgetgo_token');
    try {
      await fetch(`${API_URL}/api/auth/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ phone: user.phone }),
      });
      setMessage({ type: 'success', text: 'OTP sent! Check your server console (dev mode)' });
      setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    } catch {
      setMessage({ type: 'error', text: 'Failed to send OTP' });
    }
  };

  // Resend email verification
  const handleVerifyEmail = async () => {
    const token = localStorage.getItem('gadgetgo_token');
    try {
      const res = await fetch(`${API_URL}/api/auth/resend-verify-email`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();
      setMessage({ type: res.ok ? 'success' : 'error', text: data.message || data.error });
      setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    } catch {
      setMessage({ type: 'error', text: 'Failed to send verification email' });
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('gadgetgo_token');
    router.push('/login');
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingCard}>Loading your profile...</div>
      </div>
    );
  }

  if (!user) return null;

  const memberSince = new Date(user.createdAt).toLocaleDateString('en-IN', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <div className={styles.container}>
      <div className={styles.profileCard}>

        {/* Header */}
        <div className={styles.header}>
          <div className={styles.avatarSection}>
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className={styles.avatar} />
            ) : (
              <div className={styles.avatarPlaceholder}>
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div className={styles.headerInfo}>
              <h1 className={styles.userName}>{user.name}</h1>
              <span className={styles.roleBadge}>{user.role === 'owner' ? '🏪 Store Owner' : '👤 User'}</span>
              <p className={styles.memberSince}>Member since {memberSince}</p>
            </div>
          </div>
          <div className={styles.headerActions}>
            {!editing ? (
              <button className={styles.editBtn} onClick={() => setEditing(true)}>
                <Edit3 size={16} /> Edit Profile
              </button>
            ) : (
              <button className={styles.saveBtn} onClick={handleSave} disabled={saving}>
                <Save size={16} /> {saving ? 'Saving...' : 'Save'}
              </button>
            )}
          </div>
        </div>

        {/* Status messages */}
        {message.text && (
          <div className={message.type === 'error' ? styles.errorMsg : styles.successMsg}>
            {message.text}
          </div>
        )}

        {/* Verification Status */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}><Shield size={18} /> Verification Status</h2>
          <div className={styles.verifyGrid}>
            <div className={`${styles.verifyCard} ${user.isEmailVerified ? styles.verified : styles.unverified}`}>
              <div className={styles.verifyIcon}>
                {user.isEmailVerified ? <CheckCircle size={24} /> : <XCircle size={24} />}
              </div>
              <div className={styles.verifyInfo}>
                <h3>Email</h3>
                <p>{user.isEmailVerified ? 'Verified' : 'Not verified'}</p>
              </div>
              {!user.isEmailVerified && (
                <button className={styles.verifyBtn} onClick={handleVerifyEmail}>
                  Verify Now <ChevronRight size={14} />
                </button>
              )}
            </div>

            <div className={`${styles.verifyCard} ${user.isPhoneVerified ? styles.verified : styles.unverified}`}>
              <div className={styles.verifyIcon}>
                {user.isPhoneVerified ? <CheckCircle size={24} /> : <XCircle size={24} />}
              </div>
              <div className={styles.verifyInfo}>
                <h3>Phone</h3>
                <p>{user.isPhoneVerified ? 'Verified' : 'Not verified'}</p>
              </div>
              {!user.isPhoneVerified && (
                <button className={styles.verifyBtn} onClick={handleVerifyPhone}>
                  Verify Now <ChevronRight size={14} />
                </button>
              )}
            </div>

            <div className={`${styles.verifyCard} ${user.googleId ? styles.verified : styles.unverified}`}>
              <div className={styles.verifyIcon}>
                {user.googleId ? <CheckCircle size={24} /> : <XCircle size={24} />}
              </div>
              <div className={styles.verifyInfo}>
                <h3>Google</h3>
                <p>{user.googleId ? 'Linked' : 'Not linked'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Account Details */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}><User size={18} /> Account Details</h2>
          <div className={styles.detailsGrid}>

            <div className={styles.detailRow}>
              <div className={styles.detailLabel}><User size={16} /> Full Name</div>
              {editing ? (
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className={styles.detailInput}
                />
              ) : (
                <div className={styles.detailValue}>{user.name}</div>
              )}
            </div>

            <div className={styles.detailRow}>
              <div className={styles.detailLabel}><Mail size={16} /> Email</div>
              <div className={styles.detailValue}>
                {user.email}
                {user.isEmailVerified && <CheckCircle size={14} className={styles.inlineCheck} />}
              </div>
            </div>

            <div className={styles.detailRow}>
              <div className={styles.detailLabel}><Phone size={16} /> Phone</div>
              {editing ? (
                <div className={styles.phoneEditRow}>
                  <span className={styles.phonePrefix}>+91</span>
                  <input
                    type="tel"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    className={styles.detailInput}
                    pattern="[0-9]{10}"
                  />
                </div>
              ) : (
                <div className={styles.detailValue}>
                  {user.phone}
                  {user.isPhoneVerified && <CheckCircle size={14} className={styles.inlineCheck} />}
                </div>
              )}
            </div>

            <div className={styles.detailRow}>
              <div className={styles.detailLabel}><ShieldCheck size={16} /> Account Type</div>
              <div className={styles.detailValue}>{user.role === 'owner' ? 'Store Owner' : 'User'}</div>
            </div>

          </div>
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          {editing && (
            <button className={styles.cancelBtn} onClick={() => { setEditing(false); setEditName(user.name); setEditPhone(user.phone?.replace('+91', '') || ''); }}>
              Cancel
            </button>
          )}
          <button className={styles.logoutBtn} onClick={handleLogout}>
            <LogOut size={16} /> Log Out
          </button>
        </div>

      </div>
    </div>
  );
}
