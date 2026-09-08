import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  MessageSquare,
  ShieldCheck,
  Building,
  User,
  Calendar,
  Tag,
  Package,
  FileText,
  MapPin,
  ExternalLink,
  Check,
  XCircle,
  Clock
} from 'lucide-react';
import { useMetrology } from '../context/MetrologyContext';
import StatusBadge from '../components/StatusBadge';

const CaseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cases, updateCaseStatus, currentUser } = useMetrology();

  const caseData = cases.find((c) => c.id === id);

  const [remarkInput, setRemarkInput] = useState('');
  const [flagReasonInput, setFlagReasonInput] = useState('');
  const [showFlagModal, setShowFlagModal] = useState(false);
  const [actionSuccessMessage, setActionSuccessMessage] = useState('');

  if (!caseData) {
    return (
      <div className="content-area">
        <div style={{ padding: '3rem', textAlign: 'center', background: '#fff', borderRadius: '12px' }}>
          <AlertTriangle size={48} className="text-amber-600" style={{ margin: '0 auto 1rem' }} />
          <h2>Case Record Not Found</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            The requested inspection case ID <code>{id}</code> does not exist or has been removed.
          </p>
          <button
            onClick={() => navigate('/metrology-dashboard')}
            className="btn btn-primary"
            style={{ marginTop: '1.25rem' }}
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const isMetrologyOfficer = currentUser.role === 'metrologyOfficer';

  const handleMarkVerified = () => {
    const remark = remarkInput.trim() || "Inspection verified and found fully compliant with Legal Metrology (Packaged Commodities) Rules, 2011. Case discharged.";
    updateCaseStatus(caseData.id, 'Verified', remark);
    setRemarkInput('');
    setActionSuccessMessage('Case successfully marked as Verified / Discharged.');
    setTimeout(() => setActionSuccessMessage(''), 4000);
  };

  const handleFlagCase = () => {
    if (!flagReasonInput.trim()) {
      alert("Please provide a reason for flagging this case.");
      return;
    }
    const remark = `FLAGGED VIOLATION: ${flagReasonInput.trim()}` + (remarkInput.trim() ? ` — Remarks: ${remarkInput.trim()}` : '');
    updateCaseStatus(caseData.id, 'Flagged', remark, flagReasonInput.trim());
    setFlagReasonInput('');
    setRemarkInput('');
    setShowFlagModal(false);
    setActionSuccessMessage('Case successfully flagged for legal non-compliance.');
    setTimeout(() => setActionSuccessMessage(''), 4000);
  };

  const handleAddRemarkOnly = () => {
    if (!remarkInput.trim()) return;
    updateCaseStatus(caseData.id, caseData.status, remarkInput.trim());
    setRemarkInput('');
    setActionSuccessMessage('Official remark appended to case registry.');
    setTimeout(() => setActionSuccessMessage(''), 4000);
  };

  return (
    <div className="content-area">
      {/* Back button and Header */}
      <div style={{ marginBottom: '1.25rem' }}>
        <button
          onClick={() => navigate(-1)}
          className="btn btn-outline btn-sm"
          style={{ marginBottom: '0.75rem' }}
        >
          <ArrowLeft size={15} />
          <span>Back</span>
        </button>

        <div className="page-header-container" style={{ marginBottom: '0' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <span className="case-id-badge" style={{ fontSize: '1.1rem', padding: '0.3rem 0.75rem' }}>
                {caseData.id}
              </span>
              <StatusBadge status={caseData.status} text={caseData.statusText} />
            </div>
            <h1 className="page-title" style={{ marginTop: '0.5rem', fontSize: '1.4rem' }}>
              {caseData.commodity}
            </h1>
          </div>

          {/* Top Quick Actions for Metrology Officer */}
          {isMetrologyOfficer && (
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {caseData.status !== 'Verified' && (
                <button onClick={handleMarkVerified} className="btn btn-success">
                  <CheckCircle2 size={16} />
                  <span>Mark as Verified / Discharged</span>
                </button>
              )}

              {caseData.status !== 'Flagged' && (
                <button onClick={() => setShowFlagModal(true)} className="btn btn-danger">
                  <AlertTriangle size={16} />
                  <span>Flag Case</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Success Notification Alert */}
      {actionSuccessMessage && (
        <div
          style={{
            background: '#ecfdf5',
            border: '1px solid #6ee7b7',
            color: '#065f46',
            padding: '0.85rem 1.25rem',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontWeight: 500
          }}
        >
          <CheckCircle2 size={18} />
          <span>{actionSuccessMessage}</span>
        </div>
      )}

      {/* Flag reason alert if case is flagged */}
      {caseData.status === 'Flagged' && caseData.flagReason && (
        <div
          style={{
            background: '#fef2f2',
            border: '1px solid #fca5a5',
            color: '#991b1b',
            padding: '1rem 1.25rem',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.75rem'
          }}
        >
          <AlertTriangle size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Compliance Violation Flagged</div>
            <div style={{ fontSize: '0.875rem', marginTop: '0.2rem' }}>{caseData.flagReason}</div>
          </div>
        </div>
      )}

      {/* Main Grid: Left side Image Scan / Right side Verification Details */}
      <div className="case-details-grid">
        {/* Left Column: Uploaded Scan/Label */}
        <div>
          <div className="panel-card" style={{ marginBottom: '1.25rem' }}>
            <div className="panel-header">
              <div className="panel-title">
                <FileText size={18} />
                <span>Uploaded Label / Product Scan</span>
              </div>
            </div>
            <div style={{ padding: '1rem' }}>
              <div className="image-preview-container">
                <img
                  src={caseData.imageUrl}
                  alt={caseData.commodity}
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80";
                  }}
                />
                <div className="image-caption">
                  <span>Official Evidence Photo • Case {caseData.id}</span>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Verified Stamp Embedded</span>
                </div>
              </div>

              {/* Inspection Location & Officer Details */}
              <div
                style={{
                  marginTop: '1rem',
                  background: '#f8fafc',
                  padding: '1rem',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  fontSize: '0.85rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <MapPin size={16} className="text-gov-blue" />
                  <strong>Inspection Location:</strong>
                  <span>{caseData.location}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <User size={16} className="text-gov-blue" />
                  <strong>Reporting Field Officer:</strong>
                  <span>{caseData.fieldOfficer} ({caseData.fieldOfficerId})</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Calendar size={16} className="text-gov-blue" />
                  <strong>Inspection Date:</strong>
                  <span>{caseData.date}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Field Officer Inspection Notes */}
          <div className="panel-card">
            <div className="panel-header">
              <div className="panel-title">
                <FileText size={18} />
                <span>Field Officer's Inspection Notes</span>
              </div>
            </div>
            <div style={{ padding: '1.25rem', fontSize: '0.875rem', color: '#334155', lineHeight: '1.6' }}>
              {caseData.inspectionNotes}
            </div>
          </div>
        </div>

        {/* Right Column: Verification Details & Mandatory Declarations */}
        <div>
          {/* Label Metadata Specifications */}
          <div className="panel-card" style={{ marginBottom: '1.25rem' }}>
            <div className="panel-header">
              <div className="panel-title">
                <Tag size={18} />
                <span>Product & Package Declarations</span>
              </div>
            </div>
            <div style={{ padding: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                    Commodity
                  </div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-main)', marginTop: '2px' }}>
                    {caseData.commodity}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                    Brand Name
                  </div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-main)', marginTop: '2px' }}>
                    {caseData.brand}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                    Declared Net Qty
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-gov-blue)', marginTop: '2px' }}>
                    {caseData.declaredNetQty}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                    Retail Sale Price (MRP)
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#047857', marginTop: '2px' }}>
                    {caseData.mrp}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                    Batch / Lot Number
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--text-main)', marginTop: '2px' }}>
                    {caseData.batchNo}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                    Date of Mfg / Packing
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', marginTop: '2px' }}>
                    {caseData.mfgDate}
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                  Manufacturer / Packer / Importer
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-main)', marginTop: '3px' }}>
                  {caseData.manufacturer}
                </div>
              </div>
            </div>
          </div>

          {/* Legal Metrology Mandatory Checklist */}
          <div className="panel-card" style={{ marginBottom: '1.25rem' }}>
            <div className="panel-header">
              <div className="panel-title">
                <ShieldCheck size={18} />
                <span>Legal Metrology Compliance Checklist</span>
              </div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Packaged Commodities Rules, 2011
              </span>
            </div>
            <div style={{ padding: '1.25rem' }}>
              <div className="checklist-container">
                {caseData.checklist && caseData.checklist.map((item) => (
                  <div
                    key={item.id}
                    className={`checklist-item ${item.verified ? 'passed' : 'failed'}`}
                  >
                    <div className="checklist-icon">
                      {item.verified ? (
                        <Check size={18} className="text-emerald-600" />
                      ) : (
                        <XCircle size={18} className="text-red-600" />
                      )}
                    </div>
                    <div>
                      <div className="checklist-text">{item.label}</div>
                      <div className="checklist-rule">
                        Statutory Provision: {item.rule} • {item.verified ? 'Compliant' : 'Non-Compliant / Missing'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Remarks History and Official Action Panel */}
          <div className="panel-card">
            <div className="panel-header">
              <div className="panel-title">
                <MessageSquare size={18} />
                <span>Remarks & Enforcement Trail ({caseData.remarks.length})</span>
              </div>
            </div>
            <div style={{ padding: '1.25rem' }}>
              {/* Existing Remarks List */}
              <div className="remarks-timeline">
                {caseData.remarks.map((rem, idx) => (
                  <div key={idx} className="remark-card">
                    <div className="remark-header">
                      <span className="remark-author">
                        {rem.by} ({rem.role === 'metrologyOfficer' ? 'Metrology Officer' : 'Field Officer'})
                      </span>
                      <span className="remark-date">{rem.date}</span>
                    </div>
                    <div className="remark-text">{rem.text}</div>
                  </div>
                ))}
              </div>

              {/* Officer Add Remark Section */}
              <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-color)' }}>
                <label className="form-label" htmlFor="remarkInput">
                  Add Official Remark / Directives:
                </label>
                <textarea
                  id="remarkInput"
                  className="form-textarea"
                  placeholder="Enter official observation, directive or compliance review note..."
                  value={remarkInput}
                  onChange={(e) => setRemarkInput(e.target.value)}
                />

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.75rem' }}>
                  <button
                    onClick={handleAddRemarkOnly}
                    disabled={!remarkInput.trim()}
                    className="btn btn-primary btn-sm"
                  >
                    <MessageSquare size={14} />
                    <span>Log Remark</span>
                  </button>

                  {isMetrologyOfficer && caseData.status !== 'Verified' && (
                    <button
                      onClick={handleMarkVerified}
                      className="btn btn-success btn-sm"
                    >
                      <CheckCircle2 size={14} />
                      <span>Verify & Discharge</span>
                    </button>
                  )}

                  {isMetrologyOfficer && caseData.status !== 'Flagged' && (
                    <button
                      onClick={() => setShowFlagModal(true)}
                      className="btn btn-danger btn-sm"
                    >
                      <AlertTriangle size={14} />
                      <span>Flag Case</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Flag Case Modal */}
      {showFlagModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#b91c1c', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertTriangle size={20} />
                <span>Flag Case for Statutory Violation</span>
              </h3>
              <button
                onClick={() => setShowFlagModal(false)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.25rem' }}
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                Flagging Case <strong>{caseData.id}</strong> initiates formal legal metrology notice procedures under the Legal Metrology Act, 2009.
              </p>
              <div className="form-group">
                <label className="form-label">Specific Violation Reason *</label>
                <select
                  className="form-select"
                  value={flagReasonInput}
                  onChange={(e) => setFlagReasonInput(e.target.value)}
                >
                  <option value="">-- Select statutory violation --</option>
                  <option value="Dual MRP sticker / Overcharging above Maximum Retail Price">
                    Dual MRP sticker / Overcharging above Maximum Retail Price
                  </option>
                  <option value="Net quantity font height is below statutory minimum threshold">
                    Net quantity font height is below statutory minimum threshold
                  </option>
                  <option value="Mandatory consumer grievance / care contacts missing">
                    Mandatory consumer grievance / care contacts missing
                  </option>
                  <option value="Absence of Month and Year of Manufacture / Packing">
                    Absence of Month and Year of Manufacture / Packing
                  </option>
                  <option value="Manufacturer / Packer address incomplete or ambiguous">
                    Manufacturer / Packer address incomplete or ambiguous
                  </option>
                  <option value="Weight / Measure deficiency beyond Maximum Permissible Error (MPE)">
                    Weight / Measure deficiency beyond Maximum Permissible Error (MPE)
                  </option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Or Custom Violation Details:</label>
                <textarea
                  className="form-textarea"
                  placeholder="Specify violation details, section references, or seizure notes..."
                  value={flagReasonInput}
                  onChange={(e) => setFlagReasonInput(e.target.value)}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setShowFlagModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleFlagCase}
                disabled={!flagReasonInput.trim()}
              >
                Confirm & Flag Violation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CaseDetails;
