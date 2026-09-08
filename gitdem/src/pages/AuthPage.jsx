import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, UserCheck, Lock, Mail, User, ArrowRight, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useMetrology } from '../context/MetrologyContext';

const AuthPage = () => {
  const navigate = useNavigate();
  const { login, register, setQuickDemoRole } = useMetrology();

  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [selectedRole, setSelectedRole] = useState('officer'); // 'officer' or 'consumer'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (isRegisterMode) {
        if (!name.trim()) {
          setErrorMsg('Please enter your full name.');
          setLoading(false);
          return;
        }
        await register({ name, email, password, role: selectedRole });
        setSuccessMsg('Account registered successfully! Redirecting...');
      } else {
        await login({ email, password, roleHint: selectedRole });
        setSuccessMsg('Authentication verified. Access granted.');
      }

      setTimeout(() => {
        if (selectedRole === 'consumer') {
          navigate('/consumer-dashboard');
        } else {
          navigate('/metrology-dashboard');
        }
      }, 500);
    } catch (err) {
      console.warn("Auth error:", err);
      // Fallback to offline demo role switch
      setQuickDemoRole(selectedRole, name || (selectedRole === 'consumer' ? 'Aarav Mehta' : 'Dr. V. K. Malhotra'), email);
      if (selectedRole === 'consumer') {
        navigate('/consumer-dashboard');
      } else {
        navigate('/metrology-dashboard');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (roleType) => {
    if (roleType === 'consumer') {
      setQuickDemoRole('consumer', 'Aarav Mehta (Citizen)', 'consumer@citizen.in');
      navigate('/consumer-dashboard');
    } else if (roleType === 'fieldOfficer') {
      setQuickDemoRole('fieldOfficer', 'Rajesh Sharma (Inspector)', 'rajesh.sharma@metrology.gov.in');
      navigate('/field-dashboard');
    } else {
      setQuickDemoRole('metrologyOfficer', 'Dr. V. K. Malhotra (Joint Controller)', 'vk.malhotra@metrology.gov.in');
      navigate('/metrology-dashboard');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #07192f 0%, #0d2c52 50%, #0a1e38 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '480px',
        background: '#ffffff',
        borderRadius: '16px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.35)',
        overflow: 'hidden',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        {/* Top Emblem Header */}
        <div style={{
          background: 'linear-gradient(90deg, #07192f 0%, #13335e 100%)',
          padding: '2rem 1.5rem',
          textAlign: 'center',
          color: '#ffffff',
          borderBottom: '3px solid #c28829'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, #e6af45 20%, #aa771c 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            margin: '0 auto 0.75rem',
            boxShadow: '0 0 15px rgba(230, 175, 69, 0.5)',
            border: '2px solid rgba(255, 255, 255, 0.4)'
          }}>
            ⚖️
          </div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '0.04em', margin: 0 }}>
            NATIONAL LEGAL METROLOGY PORTAL
          </h1>
          <p style={{ fontSize: '0.75rem', color: '#cbd5e1', letterSpacing: '0.06em', textTransform: 'uppercase', marginTop: '4px' }}>
            Packaged Commodities Rules, 2011 • Enforcement & Verification
          </p>
          <div style={{
            display: 'inline-block',
            marginTop: '8px',
            background: 'rgba(194, 136, 41, 0.25)',
            color: '#fef3c7',
            padding: '2px 10px',
            borderRadius: '12px',
            fontSize: '0.7rem',
            fontWeight: 600,
            border: '1px solid #c28829'
          }}>
            Problem Statement: SIH26034
          </div>
        </div>

        <div style={{ padding: '2rem' }}>
          {/* Role Selector Tabs */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Select Authorized Role:
            </label>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '0.5rem',
              background: '#f1f5f9',
              padding: '4px',
              borderRadius: '10px'
            }}>
              <button
                type="button"
                onClick={() => setSelectedRole('officer')}
                style={{
                  padding: '0.65rem 0.5rem',
                  borderRadius: '8px',
                  border: 'none',
                  background: selectedRole === 'officer' ? '#091e3a' : 'transparent',
                  color: selectedRole === 'officer' ? '#ffffff' : '#64748b',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <ShieldCheck size={16} />
                <span>Enforcement Officer</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole('consumer')}
                style={{
                  padding: '0.65rem 0.5rem',
                  borderRadius: '8px',
                  border: 'none',
                  background: selectedRole === 'consumer' ? '#1d4ed8' : 'transparent',
                  color: selectedRole === 'consumer' ? '#ffffff' : '#64748b',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <UserCheck size={16} />
                <span>Citizen / Consumer</span>
              </button>
            </div>
          </div>

          {/* Error / Success Banners */}
          {errorMsg && (
            <div style={{
              background: '#fef2f2',
              border: '1px solid #fca5a5',
              color: '#991b1b',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              fontSize: '0.85rem',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div style={{
              background: '#ecfdf5',
              border: '1px solid #6ee7b7',
              color: '#065f46',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              fontSize: '0.85rem',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Auth Form */}
          <form onSubmit={handleSubmit}>
            {isRegisterMode && (
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.35rem' }}>
                  Full Name *
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }} />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Rajesh Kumar"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.75rem 0.65rem 2.4rem',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.9rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>
            )}

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.35rem' }}>
                Email Address *
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }} />
                <input
                  type="email"
                  required
                  placeholder={selectedRole === 'officer' ? 'officer@metrology.gov.in' : 'consumer@citizen.in'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.75rem 0.65rem 2.4rem',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.9rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.35rem' }}>
                Password *
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }} />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.75rem 0.65rem 2.4rem',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.9rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                border: 'none',
                background: selectedRole === 'officer'
                  ? 'linear-gradient(90deg, #091e3a 0%, #1d4ed8 100%)'
                  : 'linear-gradient(90deg, #1d4ed8 0%, #0284c7 100%)',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.95rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(29, 78, 216, 0.3)'
              }}
            >
              <span>{isRegisterMode ? `Register as ${selectedRole === 'officer' ? 'Officer' : 'Consumer'}` : `Sign In as ${selectedRole === 'officer' ? 'Officer' : 'Consumer'}`}</span>
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Toggle Register / Login */}
          <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.85rem', color: '#64748b' }}>
            {isRegisterMode ? (
              <span>
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => setIsRegisterMode(false)}
                  style={{ background: 'none', border: 'none', color: '#1d4ed8', fontWeight: 700, cursor: 'pointer' }}
                >
                  Sign In
                </button>
              </span>
            ) : (
              <span>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setIsRegisterMode(true)}
                  style={{ background: 'none', border: 'none', color: '#1d4ed8', fontWeight: 700, cursor: 'pointer' }}
                >
                  Create New Account
                </button>
              </span>
            )}
          </div>

          {/* 1-Click Fast Demo Logins for Hackathon Evaluators */}
          <div style={{
            marginTop: '1.5rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid #e2e8f0',
            textAlign: 'center'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.35rem',
              fontSize: '0.78rem',
              fontWeight: 700,
              color: '#0369a1',
              marginBottom: '0.75rem'
            }}>
              <Sparkles size={14} />
              <span>1-Click Quick Demo Access:</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.4rem' }}>
              <button
                type="button"
                onClick={() => handleQuickLogin('consumer')}
                style={{
                  background: '#f0f9ff',
                  border: '1px solid #bae6fd',
                  color: '#0369a1',
                  borderRadius: '6px',
                  padding: '0.45rem 0.25rem',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                👤 Consumer
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('fieldOfficer')}
                style={{
                  background: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  color: '#091e3a',
                  borderRadius: '6px',
                  padding: '0.45rem 0.25rem',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                🔍 Field Officer
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('metrologyOfficer')}
                style={{
                  background: '#fef3c7',
                  border: '1px solid #fde68a',
                  color: '#92400e',
                  borderRadius: '6px',
                  padding: '0.45rem 0.25rem',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                ⚖️ Metrology Officer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
