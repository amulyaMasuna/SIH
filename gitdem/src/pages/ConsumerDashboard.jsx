import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Camera,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  FileText,
  Search,
  ArrowRight,
  Sparkles,
  PhoneCall,
  Scale,
  ExternalLink,
  HelpCircle
} from 'lucide-react';
import { useMetrology } from '../context/MetrologyContext';
import StatusBadge from '../components/StatusBadge';

const ConsumerDashboard = () => {
  const navigate = useNavigate();
  const { currentUser, cases } = useMetrology();

  const [searchQuery, setSearchQuery] = useState('');
  const [showNCHModal, setShowNCHModal] = useState(false);
  const [selectedCaseForComplaint, setSelectedCaseForComplaint] = useState(null);

  const consumerScans = cases.filter(c =>
    c.fieldOfficer?.includes('Citizen') ||
    c.fieldOfficer?.includes('Aarav') ||
    c.remarks?.[0]?.role === 'consumer' ||
    true // show all recent product scans for consumer awareness
  );

  const filteredScans = consumerScans.filter(c =>
    c.commodity?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const illegalCount = consumerScans.filter(c => c.status === 'Flagged').length;
  const legalCount = consumerScans.filter(c => c.status === 'Verified').length;

  const handleOpenComplaint = (scanCase) => {
    setSelectedCaseForComplaint(scanCase);
    setShowNCHModal(true);
  };

  return (
    <div className="content-area">
      {/* Consumer Hero Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #091e3a 0%, #1d4ed8 100%)',
        color: '#ffffff',
        borderRadius: '16px',
        padding: '2rem 2.25rem',
        marginBottom: '2rem',
        boxShadow: '0 8px 24px rgba(29, 78, 216, 0.2)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: 'rgba(255, 255, 255, 0.15)',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '0.78rem',
            fontWeight: 600,
            marginBottom: '0.75rem',
            border: '1px solid rgba(255, 255, 255, 0.25)'
          }}>
            <ShieldCheck size={14} />
            <span>Ministry of Consumer Affairs • Legal Metrology Protection</span>
          </div>

          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 0.5rem 0', letterSpacing: '-0.01em' }}>
            Welcome, {currentUser.name}
          </h1>
          <p style={{ fontSize: '0.95rem', color: '#e2e8f0', maxWidth: '650px', lineHeight: '1.5', margin: '0 0 1.5rem 0' }}>
            Verify any packaged commodity before or after purchase. Upload or snap a photo of the product label to instantly check statutory declarations under Legal Metrology Rules, 2011.
          </p>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => navigate('/upload-scan')}
              style={{
                background: '#ffffff',
                color: '#091e3a',
                border: 'none',
                padding: '0.75rem 1.4rem',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
              }}
            >
              <Camera size={18} />
              <span>Scan Product Package Now</span>
              <ArrowRight size={16} />
            </button>

            <button
              type="button"
              onClick={() => setShowNCHModal(true)}
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.35)',
                padding: '0.75rem 1.25rem',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer'
              }}
            >
              <PhoneCall size={16} />
              <span>National Consumer Helpline (1915)</span>
            </button>
          </div>
        </div>

        {/* Decorative background circle */}
        <div style={{
          position: 'absolute',
          right: '-50px',
          bottom: '-50px',
          width: '280px',
          height: '280px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
          pointerEvents: 'none'
        }} />
      </div>

      {/* Consumer Rights Checklist Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '1.25rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          background: '#ffffff',
          borderRadius: '12px',
          padding: '1.25rem',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Scale size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>Check Net Quantity</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Rule 6(1)(c) Compliance</div>
            </div>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
            Ensure units are standard metric symbols (<strong>g, kg, ml, l</strong>). Prohibited symbols like <em>gms, kgs, ltr</em> are illegal.
          </p>
        </div>

        <div style={{
          background: '#ffffff',
          borderRadius: '12px',
          padding: '1.25rem',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: '#fee2e2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AlertTriangle size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>No Dual Pricing / Over-stickers</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Rule 18(1) Section 36</div>
            </div>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
            Retailers cannot affix higher price stickers over the original MRP or charge more than the printed Maximum Retail Price.
          </p>
        </div>

        <div style={{
          background: '#ffffff',
          borderRadius: '12px',
          padding: '1.25rem',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: '#f0f9ff', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>Look for Unit Sale Price (USP)</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Rule 6(11) 2022 Amendment</div>
            </div>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
            Packages must declare price per gram (₹/g) or per ml (₹/ml) so consumers can easily compare true value across brands.
          </p>
        </div>
      </div>

      {/* Scanned Products Table / List */}
      <div className="panel-card">
        <div className="panel-header" style={{ flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <div className="panel-title">
              <FileText size={18} />
              <span>Consumer Package Verification History</span>
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Verified Parcels: <strong style={{ color: '#059669' }}>{legalCount} Legal</strong> • Flagged Parcels: <strong style={{ color: '#dc2626' }}>{illegalCount} Non-Compliant</strong>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <Search size={14} style={{ position: 'absolute', left: '10px', top: '10px', color: '#94a3b8' }} />
              <input
                type="text"
                className="form-input"
                placeholder="Search products..."
                style={{ paddingLeft: '2rem', height: '34px', fontSize: '0.82rem' }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <button
              onClick={() => navigate('/upload-scan')}
              className="btn btn-primary btn-sm"
            >
              <Camera size={14} />
              <span>New Scan</span>
            </button>
          </div>
        </div>

        <div style={{ padding: '0' }}>
          <div className="table-responsive">
            <table className="portal-table">
              <thead>
                <tr>
                  <th>Case ID</th>
                  <th>Product / Commodity</th>
                  <th>Brand</th>
                  <th>Declared MRP</th>
                  <th>Net Quantity</th>
                  <th>Legality Status</th>
                  <th>Consumer Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredScans.map((scan) => {
                  const isLegal = scan.status === 'Verified';
                  return (
                    <tr key={scan.id}>
                      <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.82rem' }}>
                        {scan.id}
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{scan.commodity}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{scan.location}</div>
                      </td>
                      <td>{scan.brand}</td>
                      <td style={{ fontWeight: 600, color: '#047857' }}>{scan.mrp}</td>
                      <td style={{ fontWeight: 600 }}>{scan.declaredNetQty}</td>
                      <td>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          padding: '0.25rem 0.65rem',
                          borderRadius: '12px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          background: isLegal ? '#ecfdf5' : '#fef2f2',
                          color: isLegal ? '#065f46' : '#991b1b',
                          border: `1px solid ${isLegal ? '#6ee7b7' : '#fca5a5'}`
                        }}>
                          {isLegal ? <CheckCircle2 size={12} /> : <AlertTriangle size={12} />}
                          <span>{isLegal ? 'LEGAL PARCEL' : 'ILLEGAL / DEFICIENT'}</span>
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <button
                            onClick={() => navigate(`/verify-label?caseId=${scan.id}`)}
                            className="btn btn-outline btn-sm"
                            style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                            title="View Split-Screen Inspection"
                          >
                            <span>Inspect</span>
                            <ArrowRight size={12} />
                          </button>

                          {!isLegal && (
                            <button
                              onClick={() => handleOpenComplaint(scan)}
                              className="btn btn-danger btn-sm"
                              style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                              title="Report Violation to National Consumer Helpline"
                            >
                              <span>Report</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* National Consumer Helpline Modal */}
      {showNCHModal && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '550px' }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#091e3a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <PhoneCall size={20} className="text-gov-blue" />
                <span>National Consumer Helpline (NCH) Portal</span>
              </h3>
              <button
                onClick={() => setShowNCHModal(false)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.25rem' }}
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div style={{
                background: '#f0f9ff',
                border: '1px solid #bae6fd',
                padding: '1rem',
                borderRadius: '8px',
                marginBottom: '1rem',
                fontSize: '0.85rem',
                color: '#0369a1'
              }}>
                <strong>Department of Consumer Affairs Helpline:</strong>
                <div>Toll Free: <strong>1915</strong> or <strong>1800-11-4000</strong></div>
                <div>SMS Support: 8800001915 • Web: consumerhelpline.gov.in</div>
              </div>

              {selectedCaseForComplaint && (
                <div style={{ marginBottom: '1rem', fontSize: '0.85rem' }}>
                  <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Complaint Draft for Case {selectedCaseForComplaint.id}:</div>
                  <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '6px', border: '1px solid #e2e8f0', color: '#334155' }}>
                    <div><strong>Commodity:</strong> {selectedCaseForComplaint.commodity} ({selectedCaseForComplaint.brand})</div>
                    <div><strong>Reported Violation:</strong> {selectedCaseForComplaint.flagReason || "Packaged Commodities Rule 6 Non-compliance"}</div>
                    <div><strong>Location:</strong> {selectedCaseForComplaint.location}</div>
                  </div>
                </div>
              )}

              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Your grievance will be forwarded directly to the Legal Metrology Enforcement Officer of your district for formal packaging inspection under Section 18/36.
              </p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setShowNCHModal(false)}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  alert("Grievance lodged successfully with National Consumer Helpline Docket ID: NCH-2026-" + Math.floor(10000 + Math.random() * 90000));
                  setShowNCHModal(false);
                }}
              >
                Submit Official Consumer Complaint
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsumerDashboard;
