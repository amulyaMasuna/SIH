import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  FileText,
  ShieldCheck,
  Check,
  X,
  MessageSquare,
  ArrowRight,
  Eye,
  AlertCircle,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Printer,
  Scale,
  Building,
  Tag,
  PhoneCall,
  Sparkles,
  Layers
} from 'lucide-react';
import { useMetrology } from '../context/MetrologyContext';
import StatusBadge from '../components/StatusBadge';

const VerifyLabel = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { cases, updateCaseStatus, currentUser, lastAuditResult } = useMetrology();

  const caseIdParam = searchParams.get('caseId');

  // Find targeted case or default to first
  const activeCase =
    cases.find((c) => c.id === caseIdParam) ||
    cases.find((c) => c.status === 'Pending') ||
    cases[0];

  // Image zoom and pan controls
  const [zoomLevel, setZoomLevel] = useState(1);
  const [highContrast, setHighContrast] = useState(false);
  const [showBoundingBoxes, setShowBoundingBoxes] = useState(true);
  const [activeTab, setActiveTab] = useState('audit'); // 'audit' or 'raw'
  const [remarksInput, setRemarksInput] = useState('');
  const [actionNotice, setActionNotice] = useState('');

  const isOfficer = currentUser.role === 'officer' || currentUser.role === 'fieldOfficer' || currentUser.role === 'metrologyOfficer';
  const isConsumer = currentUser.role === 'consumer';

  // Determine violations and compliances from activeCase or lastAuditResult
  const isLegal = activeCase?.status === 'Verified' || (activeCase?.violations && activeCase.violations.length === 0);

  // Fallback violations & compliances if case was mock
  const violationsList = activeCase?.violations || (activeCase?.checklist
    ? activeCase.checklist.filter(c => !c.verified).map(c => ({
        rule: c.rule,
        title: `Non-Compliance: ${c.label}`,
        description: `Statutory declaration mandatory under ${c.rule} of Legal Metrology (Packaged Commodities) Rules is missing or deficient.`,
        severity: "HIGH",
        penalty: "Actionable offence under Section 36 of Legal Metrology Act, 2009 (Fine up to ₹25,000 for first offence)."
      }))
    : []);

  const compliancesList = activeCase?.compliances || (activeCase?.checklist
    ? activeCase.checklist.filter(c => c.verified).map(c => ({
        rule: c.rule,
        title: `Compliant: ${c.label}`,
        description: `Statutory requirement satisfied under ${c.rule}.`,
        value: "Verified on Packaging Evidence"
      }))
    : []);

  const complianceScore = activeCase?.complianceScore !== undefined
    ? activeCase.complianceScore
    : (compliancesList.length + violationsList.length > 0
        ? Math.round((compliancesList.length / (compliancesList.length + violationsList.length)) * 100)
        : 85);

  const handlePrintReport = () => {
    window.print();
  };

  const handleIssueNotice = () => {
    updateCaseStatus(
      activeCase.id,
      'Flagged',
      `Formal Notice issued under Section 36 of Legal Metrology Act, 2009 by ${currentUser.name}. Deficiencies: ${violationsList.length} counts.`,
      `Statutory Non-Compliance Notice issued (${violationsList.length} violations)`
    );
    setActionNotice('Formal Legal Metrology Show-Cause Notice generated and registered in enforcement ledger.');
    setTimeout(() => setActionNotice(''), 5000);
  };

  const handleDischargeCase = () => {
    updateCaseStatus(
      activeCase.id,
      'Verified',
      `Packaging verified compliant with Legal Metrology (Packaged Commodities) Rules, 2011 by ${currentUser.name}. Certificate issued.`
    );
    setActionNotice('Inspection record verified and discharged. Digital compliance certificate sealed.');
    setTimeout(() => setActionNotice(''), 5000);
  };

  if (!activeCase) {
    return (
      <div className="content-area">
        <div style={{ padding: '3rem', textAlign: 'center', background: '#fff', borderRadius: '12px' }}>
          <h2>No Uploaded Scans Available</h2>
          <button
            onClick={() => navigate('/upload-scan')}
            className="btn btn-primary"
            style={{ marginTop: '1rem' }}
          >
            Upload New Inspection Scan
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="content-area">
      {/* Top Header & Case Selector */}
      <div className="page-header-container">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <span style={{
              background: '#091e3a',
              color: '#ffffff',
              fontFamily: 'var(--font-mono)',
              fontWeight: 800,
              fontSize: '0.85rem',
              padding: '2px 8px',
              borderRadius: '6px'
            }}>
              {activeCase.id}
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              • {activeCase.location}
            </span>
          </div>
          <h1 className="page-title">Split-Screen Legal Metrology Verification</h1>
          <p className="page-subtitle">
            Cross-examine uploaded packaging artwork against statutory provisions of Packaged Commodities Rules, 2011.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <select
            className="form-select"
            style={{ width: 'auto', fontWeight: 600, fontSize: '0.85rem' }}
            value={activeCase.id}
            onChange={(e) => setSearchParams({ caseId: e.target.value })}
          >
            {cases.map((c) => (
              <option key={c.id} value={c.id}>
                {c.id} — {c.commodity} ({c.status})
              </option>
            ))}
          </select>

          <button
            onClick={handlePrintReport}
            className="btn btn-outline btn-sm"
            title="Print Inspection Report"
          >
            <Printer size={15} />
            <span>Print Report</span>
          </button>

          <button
            onClick={() => navigate('/upload-scan')}
            className="btn btn-primary btn-sm"
          >
            <Eye size={15} />
            <span>New Scan</span>
          </button>
        </div>
      </div>

      {/* Action Notification Alert */}
      {actionNotice && (
        <div style={{
          background: '#ecfdf5',
          border: '1px solid #6ee7b7',
          color: '#065f46',
          padding: '0.85rem 1.25rem',
          borderRadius: '8px',
          marginBottom: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontWeight: 600
        }}>
          <CheckCircle2 size={18} />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* SPLIT-SCREEN MAIN GRID */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(320px, 1fr) minmax(380px, 1.2fr)',
        gap: '1.5rem',
        alignItems: 'start'
      }}>
        {/* ========================================================= */}
        {/* LEFT PANE: UPLOADED IMAGE EVIDENCE + ZOOM & BOUNDING BOXES */}
        {/* ========================================================= */}
        <div>
          <div className="panel-card" style={{ position: 'sticky', top: '80px' }}>
            <div className="panel-header" style={{ padding: '0.75rem 1.25rem' }}>
              <div className="panel-title" style={{ fontSize: '0.95rem' }}>
                <FileText size={18} />
                <span>Uploaded Packaging Evidence</span>
              </div>

              {/* Viewer Tools */}
              <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={() => setShowBoundingBoxes(!showBoundingBoxes)}
                  className="btn btn-outline btn-sm"
                  style={{
                    padding: '0.2rem 0.5rem',
                    fontSize: '0.72rem',
                    background: showBoundingBoxes ? '#f0f9ff' : 'transparent',
                    borderColor: showBoundingBoxes ? '#38bdf8' : 'var(--border-color)'
                  }}
                  title="Toggle Detected Text Bounding Boxes"
                >
                  <Layers size={13} />
                  <span>Boxes</span>
                </button>

                <button
                  type="button"
                  onClick={() => setHighContrast(!highContrast)}
                  className="btn btn-outline btn-sm"
                  style={{
                    padding: '0.2rem 0.5rem',
                    fontSize: '0.72rem',
                    background: highContrast ? '#fef3c7' : 'transparent',
                    borderColor: highContrast ? '#fcd34d' : 'var(--border-color)'
                  }}
                  title="High Contrast Font Inspector"
                >
                  <span>Contrast</span>
                </button>

                <button
                  type="button"
                  onClick={() => setZoomLevel(prev => Math.min(prev + 0.25, 2.5))}
                  className="btn btn-outline btn-sm"
                  style={{ padding: '0.2rem 0.4rem' }}
                  title="Zoom In"
                >
                  <ZoomIn size={14} />
                </button>

                <button
                  type="button"
                  onClick={() => setZoomLevel(prev => Math.max(prev - 0.25, 0.75))}
                  className="btn btn-outline btn-sm"
                  style={{ padding: '0.2rem 0.4rem' }}
                  title="Zoom Out"
                >
                  <ZoomOut size={14} />
                </button>

                <button
                  type="button"
                  onClick={() => { setZoomLevel(1); setHighContrast(false); }}
                  className="btn btn-outline btn-sm"
                  style={{ padding: '0.2rem 0.4rem' }}
                  title="Reset View"
                >
                  <RotateCcw size={14} />
                </button>
              </div>
            </div>

            <div style={{ padding: '1rem', background: '#0a1e38', borderRadius: '0 0 12px 12px' }}>
              {/* Image Viewport */}
              <div style={{
                position: 'relative',
                width: '100%',
                maxHeight: '520px',
                overflow: 'auto',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#040d1a'
              }}>
                <div style={{
                  position: 'relative',
                  transform: `scale(${zoomLevel})`,
                  transformOrigin: 'top center',
                  transition: 'transform 0.15s ease-out'
                }}>
                  <img
                    src={activeCase.imageUrl}
                    alt={activeCase.commodity}
                    style={{
                      maxWidth: '100%',
                      maxHeight: '500px',
                      display: 'block',
                      filter: highContrast ? 'contrast(180%) grayscale(100%) brightness(90%)' : 'none'
                    }}
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80";
                    }}
                  />

                  {/* Bounding Box Highlights Overlay */}
                  {showBoundingBoxes && (
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      pointerEvents: 'none'
                    }}>
                      <div style={{
                        position: 'absolute',
                        top: '15%',
                        left: '10%',
                        width: '45%',
                        height: '10%',
                        border: '2px solid #10b981',
                        background: 'rgba(16, 185, 129, 0.15)',
                        borderRadius: '4px'
                      }}>
                        <span style={{ position: 'absolute', top: '-16px', left: 0, background: '#10b981', color: '#fff', fontSize: '0.62rem', padding: '1px 4px', borderRadius: '2px', fontWeight: 700 }}>
                          Rule 6(1)(c) Net Qty
                        </span>
                      </div>

                      <div style={{
                        position: 'absolute',
                        top: '30%',
                        left: '10%',
                        width: '55%',
                        height: '12%',
                        border: isLegal ? '2px solid #10b981' : '2px solid #ef4444',
                        background: isLegal ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.2)',
                        borderRadius: '4px'
                      }}>
                        <span style={{ position: 'absolute', top: '-16px', left: 0, background: isLegal ? '#10b981' : '#ef4444', color: '#fff', fontSize: '0.62rem', padding: '1px 4px', borderRadius: '2px', fontWeight: 700 }}>
                          Rule 6(1)(e) MRP & Taxes
                        </span>
                      </div>

                      <div style={{
                        position: 'absolute',
                        bottom: '20%',
                        left: '8%',
                        width: '75%',
                        height: '14%',
                        border: '2px solid #10b981',
                        background: 'rgba(16, 185, 129, 0.15)',
                        borderRadius: '4px'
                      }}>
                        <span style={{ position: 'absolute', top: '-16px', left: 0, background: '#10b981', color: '#fff', fontSize: '0.62rem', padding: '1px 4px', borderRadius: '2px', fontWeight: 700 }}>
                          Rule 6(1)(a) Manufacturer
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Evidence Bar Below Image */}
              <div style={{
                marginTop: '0.75rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                color: '#94a3b8',
                fontSize: '0.75rem'
              }}>
                <div>
                  Evidence ID: <strong style={{ color: '#f8fafc' }}>{activeCase.id}</strong>
                </div>
                <div>
                  Inspected By: <strong style={{ color: '#f8fafc' }}>{activeCase.fieldOfficer}</strong>
                </div>
              </div>
            </div>

            {/* Extracted Key Attributes Panel */}
            <div style={{ padding: '1.25rem', background: '#ffffff' }}>
              <div style={{ fontWeight: 700, fontSize: '0.88rem', marginBottom: '0.75rem', color: 'var(--color-gov-navy)' }}>
                Registered Packaging Parameters
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.82rem' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Commodity:</span>
                  <div style={{ fontWeight: 600 }}>{activeCase.commodity}</div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Brand:</span>
                  <div style={{ fontWeight: 600 }}>{activeCase.brand}</div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Declared Net Qty:</span>
                  <div style={{ fontWeight: 700, color: 'var(--color-gov-blue)' }}>{activeCase.declaredNetQty}</div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Maximum Retail Price:</span>
                  <div style={{ fontWeight: 700, color: '#047857' }}>{activeCase.mrp}</div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Batch / Lot:</span>
                  <div style={{ fontFamily: 'var(--font-mono)' }}>{activeCase.batchNo}</div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Mfg / Packing Date:</span>
                  <div>{activeCase.mfgDate}</div>
                </div>
              </div>

              <div style={{ marginTop: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid #e2e8f0', fontSize: '0.82rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Manufacturer / Packer:</span>
                <div style={{ color: '#334155' }}>{activeCase.manufacturer}</div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT PANE: STATUTORY AUDIT, VIOLATIONS (RED), COMPLIANCES (GREEN) */}
        {/* ========================================================= */}
        <div>
          {/* BIG STATUTORY LEGALITY STATUS BANNER */}
          <div style={{
            background: isLegal ? '#ecfdf5' : '#fef2f2',
            border: `2px solid ${isLegal ? '#10b981' : '#ef4444'}`,
            borderRadius: '14px',
            padding: '1.5rem',
            marginBottom: '1.5rem',
            boxShadow: isLegal ? '0 6px 20px rgba(16, 185, 129, 0.15)' : '0 6px 20px rgba(239, 68, 68, 0.15)',
            position: 'relative'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: isLegal ? '#10b981' : '#ef4444',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: isLegal ? '0 4px 12px rgba(16, 185, 129, 0.4)' : '0 4px 12px rgba(239, 68, 68, 0.4)',
                  flexShrink: 0
                }}>
                  {isLegal ? <CheckCircle2 size={32} /> : <AlertTriangle size={32} />}
                </div>

                <div>
                  <div style={{
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: isLegal ? '#065f46' : '#991b1b'
                  }}>
                    LEGAL METROLOGY (PACKAGED COMMODITIES) RULES, 2011
                  </div>
                  <h2 style={{
                    fontSize: '1.4rem',
                    fontWeight: 800,
                    margin: '2px 0',
                    color: isLegal ? '#065f46' : '#991b1b',
                    letterSpacing: '-0.01em'
                  }}>
                    {isLegal ? 'PARCEL STATUS: LEGAL / COMPLIANT' : 'PARCEL STATUS: ILLEGAL / DEFICIENT'}
                  </h2>
                  <p style={{ fontSize: '0.85rem', color: isLegal ? '#047857' : '#b91c1c', margin: 0 }}>
                    {isLegal
                      ? 'All mandatory Rule 6 statutory declarations are verified and present.'
                      : `${violationsList.length} statutory non-compliance violations detected under Rule 6 and Section 36.`}
                  </p>
                </div>
              </div>

              {/* Compliance Score Gauge */}
              <div style={{
                background: '#ffffff',
                padding: '0.5rem 1rem',
                borderRadius: '10px',
                border: `1px solid ${isLegal ? '#6ee7b7' : '#fca5a5'}`,
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                  Compliance
                </div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: isLegal ? '#059669' : '#dc2626' }}>
                  {complianceScore}%
                </div>
              </div>
            </div>
          </div>

          {/* Tab Switcher: Statutory Audit vs Raw OCR Dump */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', borderBottom: '2px solid var(--border-color)', paddingBottom: '0.5rem' }}>
            <button
              type="button"
              onClick={() => setActiveTab('audit')}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === 'audit' ? '#091e3a' : 'transparent',
                color: activeTab === 'audit' ? '#ffffff' : '#64748b',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
            >
              Statutory Declarations Checklist ({violationsList.length} Deficient, {compliancesList.length} Passed)
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('raw')}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === 'raw' ? '#091e3a' : 'transparent',
                color: activeTab === 'raw' ? '#ffffff' : '#64748b',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
            >
              Raw Optical Text Dump
            </button>
          </div>

          {activeTab === 'audit' ? (
            <div>
              {/* =================================================== */}
              {/* VIOLATIONS SECTION (RENDERED IN BOLD RED) */}
              {/* =================================================== */}
              {violationsList.length > 0 && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '0.75rem',
                    color: '#991b1b'
                  }}>
                    <AlertTriangle size={18} />
                    <h3 style={{ fontSize: '1rem', fontWeight: 800, letterSpacing: '-0.01em', margin: 0 }}>
                      Statutory Violations ({violationsList.length}) — Action Required
                    </h3>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {violationsList.map((v, idx) => (
                      <div
                        key={idx}
                        style={{
                          background: '#fef2f2',
                          border: '1.5px solid #fca5a5',
                          borderRadius: '10px',
                          padding: '1rem 1.25rem',
                          boxShadow: '0 2px 6px rgba(239, 68, 68, 0.08)'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.35rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <span style={{
                              background: '#ef4444',
                              color: '#ffffff',
                              fontWeight: 800,
                              fontSize: '0.72rem',
                              padding: '2px 8px',
                              borderRadius: '4px'
                            }}>
                              VIOLATION
                            </span>
                            <strong style={{ color: '#991b1b', fontSize: '0.92rem' }}>
                              {v.rule} — {v.title}
                            </strong>
                          </div>
                        </div>

                        <p style={{ fontSize: '0.84rem', color: '#7f1d1d', margin: '0.35rem 0', lineHeight: '1.45' }}>
                          {v.description}
                        </p>

                        {v.penalty && (
                          <div style={{
                            marginTop: '0.5rem',
                            paddingTop: '0.4rem',
                            borderTop: '1px dashed #fca5a5',
                            fontSize: '0.76rem',
                            color: '#b91c1c',
                            fontWeight: 600
                          }}>
                            ⚖️ Statutory Penalty Clause: {v.penalty}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* =================================================== */}
              {/* NON-VIOLATIONS / COMPLIANCES (RENDERED IN GREEN) */}
              {/* =================================================== */}
              <div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '0.75rem',
                  color: '#065f46'
                }}>
                  <CheckCircle2 size={18} />
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, letterSpacing: '-0.01em', margin: 0 }}>
                    Compliant Declarations ({compliancesList.length}) — Statutory Pass
                  </h3>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {compliancesList.map((c, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: '#f0fdf4',
                        border: '1.5px solid #86efac',
                        borderRadius: '10px',
                        padding: '0.9rem 1.25rem',
                        boxShadow: '0 2px 6px rgba(16, 185, 129, 0.06)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <span style={{
                            background: '#10b981',
                            color: '#ffffff',
                            fontWeight: 800,
                            fontSize: '0.72rem',
                            padding: '2px 8px',
                            borderRadius: '4px'
                          }}>
                            COMPLIANT
                          </span>
                          <strong style={{ color: '#065f46', fontSize: '0.9rem' }}>
                            {c.rule} — {c.title}
                          </strong>
                        </div>
                      </div>

                      <p style={{ fontSize: '0.82rem', color: '#14532d', margin: '0.25rem 0' }}>
                        {c.description}
                      </p>

                      {c.value && (
                        <div style={{
                          marginTop: '0.35rem',
                          fontSize: '0.78rem',
                          color: '#047857',
                          fontWeight: 600,
                          background: 'rgba(255,255,255,0.7)',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          display: 'inline-block'
                        }}>
                          Verified Value: <strong>{c.value}</strong>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Raw Optical OCR Text Dump */
            <div className="panel-card">
              <div style={{ padding: '1.25rem' }}>
                <pre style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '1rem',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.82rem',
                  color: '#334155',
                  maxHeight: '400px',
                  overflowY: 'auto',
                  whiteSpace: 'pre-wrap',
                  lineHeight: '1.6'
                }}>
                  {activeCase.rawText || (activeCase.inspectionNotes + "\n\nCommodity: " + activeCase.commodity + "\nBrand: " + activeCase.brand + "\nMRP: " + activeCase.mrp + "\nNet Qty: " + activeCase.declaredNetQty + "\nManufacturer: " + activeCase.manufacturer)}
                </pre>
              </div>
            </div>
          )}

          {/* Action Bar based on Role */}
          <div style={{
            marginTop: '1.5rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid var(--border-color)',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '0.75rem',
            flexWrap: 'wrap'
          }}>
            {isOfficer && (
              <>
                <button
                  type="button"
                  onClick={handleDischargeCase}
                  className="btn btn-success"
                >
                  <CheckCircle2 size={16} />
                  <span>Verify & Discharge Case</span>
                </button>

                <button
                  type="button"
                  onClick={handleIssueNotice}
                  className="btn btn-danger"
                >
                  <AlertTriangle size={16} />
                  <span>Issue Section 36 Notice</span>
                </button>
              </>
            )}

            {isConsumer && (
              <>
                <button
                  type="button"
                  onClick={() => alert("Grievance lodged directly with National Consumer Helpline Docket ID: NCH-2026-" + Math.floor(10000 + Math.random() * 90000))}
                  className="btn btn-danger"
                >
                  <PhoneCall size={16} />
                  <span>Lodge National Consumer Helpline Grievance</span>
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/upload-scan')}
                  className="btn btn-primary"
                >
                  <Eye size={16} />
                  <span>Scan Another Product</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyLabel;
