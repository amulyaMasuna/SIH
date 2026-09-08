import React from 'react';
import { User, Shield, Award, MapPin, Mail, Hash, CheckCircle2 } from 'lucide-react';
import { useMetrology } from '../context/MetrologyContext';

const ProfilePage = () => {
  const { currentUser } = useMetrology();
  const isMetrologyOfficer = currentUser.role === 'metrologyOfficer';

  return (
    <div className="content-area">
      <div className="page-header-container">
        <div>
          <h1 className="page-title">Officer Credentials & Profile</h1>
          <p className="page-subtitle">
            Official Enforcement Accreditation under the Legal Metrology Act, 2009
          </p>
        </div>
      </div>

      <div className="case-details-grid">
        {/* Left Column: Officer Card */}
        <div className="panel-card">
          <div style={{ padding: '2rem', textAlign: 'center', borderBottom: '1px solid var(--border-color)' }}>
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              style={{
                width: '104px',
                height: '104px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '3px solid var(--color-gov-gold)',
                margin: '0 auto 1rem',
                boxShadow: 'var(--shadow-md)'
              }}
            />
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--color-gov-navy)' }}>
              {currentUser.name}
            </h2>
            <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              {currentUser.designation}
            </div>
            <div style={{ marginTop: '0.75rem' }}>
              <span className="status-badge verified">
                <CheckCircle2 size={14} />
                <span>Active Gazetted Enforcement Officer</span>
              </span>
            </div>
          </div>

          <div style={{ padding: '1.5rem', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.85rem' }}>
              <Hash size={16} className="text-gov-blue" />
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Official Warrant / Badge ID:</span>
                <div style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{currentUser.badgeId}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.85rem' }}>
              <MapPin size={16} className="text-gov-blue" />
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Assigned Jurisdiction:</span>
                <div style={{ fontWeight: 600 }}>{currentUser.jurisdiction}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Mail size={16} className="text-gov-blue" />
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Government Email:</span>
                <div style={{ fontWeight: 600 }}>{currentUser.email}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Delegated Legal Powers */}
        <div className="panel-card">
          <div className="panel-header">
            <div className="panel-title">
              <Shield size={18} />
              <span>Delegated Statutory Powers & Jurisdiction</span>
            </div>
          </div>
          <div style={{ padding: '1.5rem' }}>
            <p style={{ fontSize: '0.875rem', color: '#334155', lineHeight: '1.6', marginBottom: '1.25rem' }}>
              The holder of this portal credential is authorized under <strong>Section 15 & Section 18 of the Legal Metrology Act, 2009 (Act 1 of 2010)</strong> to inspect manufacturing, packing, wholesale, and retail premises for verification of weights, measures, and packaged commodity declarations.
            </p>

            <div className="checklist-container">
              <div className="checklist-item passed">
                <Award size={18} className="text-emerald-600" style={{ marginTop: '2px' }} />
                <div>
                  <div className="checklist-text">Power of Search & Seizure (Section 15)</div>
                  <div className="checklist-rule">Inspection of weights, measures, and pre-packaged commodities on site.</div>
                </div>
              </div>

              <div className="checklist-item passed">
                <Award size={18} className="text-emerald-600" style={{ marginTop: '2px' }} />
                <div>
                  <div className="checklist-text">Issuance of Notice of Seizure / Show-Cause</div>
                  <div className="checklist-rule">Authority to flag violations and initiate Section 36 compounding proceedings.</div>
                </div>
              </div>

              <div className="checklist-item passed">
                <Award size={18} className="text-emerald-600" style={{ marginTop: '2px' }} />
                <div>
                  <div className="checklist-text">Digital Verification Sign-off & Case Discharge</div>
                  <div className="checklist-rule">Granting statutory compliance certification for inspected goods.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
