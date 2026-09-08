import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  UploadCloud,
  FileCheck,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileText,
  ShieldCheck,
  Check,
  X,
  AlertCircle,
  Eye,
  Store,
  Tag,
  Building2,
  Calendar,
  Sparkles,
  RefreshCw,
  ArrowRight,
  PlusCircle,
  Image as ImageIcon
} from 'lucide-react';
import { useMetrology } from '../context/MetrologyContext';
import SummaryCard from '../components/SummaryCard';
import StatusBadge from '../components/StatusBadge';

const samplePresetScans = [
  {
    name: "Olive Oil 500ml Bottle",
    brand: "Mediterranean Select",
    manufacturer: "Mediterranean Agro Exports, Port Estate, Gandhidham, Gujarat",
    commodity: "Extra Virgin Olive Oil (500 ml)",
    declaredNetQty: "500 ml",
    mrp: "₹650.00 (Incl. of all taxes)",
    batchNo: "EV-092-26",
    mfgDate: "08/2026",
    imageUrl: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80",
    location: "Spencer's Retail, Mall Road, Kanpur"
  },
  {
    name: "Premium Whole Cashews 250g",
    brand: "Royal Harvest",
    manufacturer: "Royal Dry Fruits Processing Corp, Industrial Estate, Mangalore",
    commodity: "Whole Cashew Nuts Grade W-240 (250g)",
    declaredNetQty: "250 g",
    mrp: "₹340.00 (Incl. of all taxes)",
    batchNo: "RH-CSH-109",
    mfgDate: "07/2026",
    imageUrl: "https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=800&q=80",
    location: "More Megastore, Outer Ring Road, Bengaluru"
  },
  {
    name: "Speciality Coffee Beans 1Kg",
    brand: "Highland Roast",
    manufacturer: "Highland Planters Ltd, Chikmagalur, Karnataka",
    commodity: "Roasted Arabica Coffee Beans (1000g)",
    declaredNetQty: "1000 g (1 kg)",
    mrp: "₹890.00 (Incl. of all taxes)",
    batchNo: "HLR-CF-303",
    mfgDate: "08/2026",
    imageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80",
    location: "Nature's Basket, Bandra West, Mumbai"
  }
];

const generateCaseId = () => `CLM-2026-${Math.floor(1000 + Math.random() * 9000)}`;

const FieldOfficerDashboard = () => {
  const { cases, addCase, updateCaseStatus, currentUser } = useMetrology();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Active Tab state: 'upload' | 'verify' | 'recent'
  const tabFromQuery = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(tabFromQuery || 'upload');

  // Sync tab with search params
  useEffect(() => {
    if (tabFromQuery) {
      setActiveTab(tabFromQuery);
    }
  }, [tabFromQuery]);

  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
    const newParams = new URLSearchParams(searchParams);
    newParams.set('tab', newTab);
    setSearchParams(newParams);
  };

  // Summary Metrics for Field Officer
  const totalUploaded = cases.length;
  const pendingVerification = cases.filter((c) => c.status === 'Pending').length;
  const verifiedCount = cases.filter((c) => c.status === 'Verified').length;
  const flaggedCount = cases.filter((c) => c.status === 'Flagged').length;

  // -------------------------------------------------------------
  // Section 1: UPLOAD SCAN STATE
  // -------------------------------------------------------------
  const [uploadCaseId, setUploadCaseId] = useState(generateCaseId());
  const [commodity, setCommodity] = useState('Fortified Wheat Flour 5Kg');
  const [brand, setBrand] = useState('Kisan Gold');
  const [manufacturer, setManufacturer] = useState('Kisan Roller Flour Mills Pvt Ltd, Industrial Area, Aligarh');
  const [declaredNetQty, setDeclaredNetQty] = useState('5.000 kg');
  const [mrp, setMrp] = useState('₹245.00 (Incl. of all taxes)');
  const [batchNo, setBatchNo] = useState('KF-WHT-261');
  const [mfgDate, setMfgDate] = useState('08/2026');
  const [location, setLocation] = useState('Spencer\'s Hypermarket, Civil Lines');
  const [inspectionNotes, setInspectionNotes] = useState('Package sealed in tamper-evident multilayer poly pouch. Net weight verified on certified bench scale.');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80');
  const [imagePreview, setImagePreview] = useState('https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80');
  const [formError, setFormError] = useState('');
  const [uploadSuccessAlert, setUploadSuccessAlert] = useState('');

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectSample = (sample) => {
    setCommodity(sample.commodity);
    setBrand(sample.brand);
    setManufacturer(sample.manufacturer);
    setDeclaredNetQty(sample.declaredNetQty);
    setMrp(sample.mrp);
    setBatchNo(sample.batchNo);
    setMfgDate(sample.mfgDate);
    setLocation(sample.location);
    setImageUrl(sample.imageUrl);
    setImagePreview(sample.imageUrl);
    setInspectionNotes(`On-shelf inspection at ${sample.location}. Primary packaging verified for mandatory declarations under Rule 6.`);
  };

  const handleSubmitScan = (e) => {
    e.preventDefault();
    if (!uploadCaseId.trim()) {
      setFormError('Case ID is required.');
      return;
    }
    if (!commodity.trim()) {
      setFormError('Please specify the commodity name.');
      return;
    }
    if (!location.trim()) {
      setFormError('Please enter the inspection location/retailer.');
      return;
    }

    setFormError('');

    const newCase = addCase({
      id: uploadCaseId,
      commodity,
      brand: brand || 'Generic / Unbranded',
      manufacturer: manufacturer || 'Manufacturer details recorded',
      declaredNetQty: declaredNetQty || '1 Unit',
      mrp: mrp || '₹0.00',
      batchNo: batchNo || 'BATCH-' + Date.now().toString().slice(-4),
      mfgDate: mfgDate || '08/2026',
      location,
      inspectionNotes: inspectionNotes || 'Inspection scan captured and registered.',
      imageUrl: imagePreview || imageUrl || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80",
      status: 'Pending',
      remark: `Scan captured and registered by Field Officer ${currentUser.name} (${currentUser.badgeId}).`
    });

    setUploadSuccessAlert(`Scan for ${newCase.id} uploaded successfully! Opening verification section...`);
    setTimeout(() => setUploadSuccessAlert(''), 4000);

    // Refresh new case ID for next potential upload
    setUploadCaseId(generateCaseId());

    // Switch to Verify Label tab for this newly created case
    setActiveVerifyCaseId(newCase.id);
    const newParams = new URLSearchParams(searchParams);
    newParams.set('tab', 'verify');
    newParams.set('caseId', newCase.id);
    setSearchParams(newParams);
    setActiveTab('verify');
  };

  // -------------------------------------------------------------
  // Section 2: VERIFY LABEL STATE
  // -------------------------------------------------------------
  const queryCaseId = searchParams.get('caseId');
  const [activeVerifyCaseId, setActiveVerifyCaseId] = useState(queryCaseId || '');

  // Resolve case to verify
  const activeCase =
    cases.find((c) => c.id === activeVerifyCaseId) ||
    cases.find((c) => c.id === queryCaseId) ||
    cases.find((c) => c.status === 'Pending') ||
    cases[0];

  const [verifyChecklist, setVerifyChecklist] = useState([]);
  const [verifyRemarksInput, setVerifyRemarksInput] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);

  useEffect(() => {
    if (activeCase) {
      setActiveVerifyCaseId(activeCase.id);
      setVerifyChecklist(
        activeCase.checklist || [
          { id: "c1", label: "Name & complete address of Manufacturer/Packer", verified: true, rule: "Rule 6(1)(a)" },
          { id: "c2", label: "Generic / Common name of the commodity", verified: true, rule: "Rule 6(1)(b)" },
          { id: "c3", label: "Net Quantity declaration in standard units (L/ml/g/kg)", verified: true, rule: "Rule 6(1)(c)" },
          { id: "c4", label: "Month and Year of manufacture/packing", verified: true, rule: "Rule 6(1)(d)" },
          { id: "c5", label: "Retail Sale Price (MRP inclusive of all taxes)", verified: true, rule: "Rule 6(1)(e)" },
          { id: "c6", label: "Consumer Care helpline number & email address", verified: true, rule: "Rule 6(1)(n)" }
        ]
      );
      setVerificationResult(null);
    }
  }, [activeCase?.id]);

  const toggleChecklistItem = (id) => {
    setVerifyChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, verified: !item.verified } : item))
    );
  };

  const allChecksPassed = verifyChecklist.length > 0 && verifyChecklist.every((item) => item.verified);

  const handleVerifyLabelSubmit = () => {
    if (!activeCase) return;

    const remark =
      verifyRemarksInput.trim() ||
      `Field verification completed by ${currentUser.name}. Mandatory declarations verified against physical packaging.`;

    if (allChecksPassed) {
      updateCaseStatus(activeCase.id, 'Verified', remark);
      setVerificationResult({
        status: 'Verified',
        message: `Label verified compliant under Rule 6! Case ${activeCase.id} certified compliant.`
      });
    } else {
      const failedCount = verifyChecklist.filter((i) => !i.verified).length;
      updateCaseStatus(
        activeCase.id,
        'Flagged',
        `Field inspection revealed ${failedCount} declaration non-compliances: ${remark}`,
        `Packaged Commodities Rule 6 non-compliance (${failedCount} deficient declarations)`
      );
      setVerificationResult({
        status: 'Flagged',
        message: `Case ${activeCase.id} flagged with ${failedCount} non-compliant declarations.`
      });
    }
    setVerifyRemarksInput('');
  };

  const openVerifyForCase = (cId) => {
    setActiveVerifyCaseId(cId);
    const newParams = new URLSearchParams(searchParams);
    newParams.set('tab', 'verify');
    newParams.set('caseId', cId);
    setSearchParams(newParams);
    setActiveTab('verify');
  };

  return (
    <div className="content-area">
      {/* Page Header */}
      <div className="page-header-container">
        <div>
          <h1 className="page-title">Field Officer Dashboard</h1>
          <p className="page-subtitle">
            Officer <strong>{currentUser.name}</strong> • {currentUser.jurisdiction} ({currentUser.badgeId})
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button
            onClick={() => handleTabChange('upload')}
            className={`btn ${activeTab === 'upload' ? 'btn-primary' : 'btn-outline'}`}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}
          >
            <UploadCloud size={16} />
            <span>Upload Scan</span>
          </button>

          <button
            onClick={() => handleTabChange('verify')}
            className={`btn ${activeTab === 'verify' ? 'btn-primary' : 'btn-outline'}`}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}
          >
            <FileCheck size={16} />
            <span>Verify Label ({pendingVerification})</span>
          </button>
        </div>
      </div>

      {/* Field Officer Summary Cards:
          - Scans Uploaded
          - Pending Verification
          - Verified
          - Flagged/Requires Attention
      */}
      <div className="summary-grid">
        <SummaryCard
          title="Scans Uploaded"
          count={totalUploaded}
          trend="Total inspection scans recorded"
          icon={UploadCloud}
          type="total"
          onClick={() => handleTabChange('recent')}
          active={activeTab === 'recent'}
        />
        <SummaryCard
          title="Pending Verification"
          count={pendingVerification}
          trend="Awaiting compliance checks"
          icon={Clock}
          type="pending"
          onClick={() => handleTabChange('verify')}
          active={activeTab === 'verify'}
        />
        <SummaryCard
          title="Verified"
          count={verifiedCount}
          trend="Cleared & verified compliant"
          icon={CheckCircle2}
          type="verified"
          onClick={() => handleTabChange('recent')}
        />
        <SummaryCard
          title="Flagged / Requires Attention"
          count={flaggedCount}
          trend="Violations requiring follow-up"
          icon={AlertTriangle}
          type="flagged"
          onClick={() => handleTabChange('recent')}
        />
      </div>

      {/* Interactive Workflow Navigation Tabs */}
      <div className="tabs-nav">
        <button
          className={`tab-btn ${activeTab === 'upload' ? 'active' : ''}`}
          onClick={() => handleTabChange('upload')}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}>
            <UploadCloud size={17} />
            <span>1. Upload Scan</span>
          </span>
        </button>

        <button
          className={`tab-btn ${activeTab === 'verify' ? 'active' : ''}`}
          onClick={() => handleTabChange('verify')}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}>
            <FileCheck size={17} />
            <span>2. Verify Label</span>
            {pendingVerification > 0 && (
              <span className="nav-count-badge badge-pending" style={{ marginLeft: '0.35rem' }}>
                {pendingVerification}
              </span>
            )}
          </span>
        </button>

        <button
          className={`tab-btn ${activeTab === 'recent' ? 'active' : ''}`}
          onClick={() => handleTabChange('recent')}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}>
            <Clock size={17} />
            <span>3. Recent Uploads ({cases.length})</span>
          </span>
        </button>
      </div>

      {/* Global Action Notifications */}
      {uploadSuccessAlert && (
        <div
          style={{
            background: '#ecfdf5',
            border: '1px solid #6ee7b7',
            color: '#065f46',
            padding: '0.85rem 1.25rem',
            borderRadius: '8px',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontWeight: 500
          }}
        >
          <CheckCircle2 size={18} />
          <span>{uploadSuccessAlert}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 1: UPLOAD SCAN SECTION                                                */}
      {/* ========================================================================= */}
      {activeTab === 'upload' && (
        <div>
          {formError && (
            <div
              style={{
                background: '#fef2f2',
                border: '1px solid #fca5a5',
                color: '#991b1b',
                padding: '0.85rem 1.25rem',
                borderRadius: '8px',
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <AlertCircle size={18} />
              <span>{formError}</span>
            </div>
          )}

          {/* Preset Quick Fill Samples */}
          <div
            style={{
              background: '#f0f9ff',
              border: '1px solid #bae6fd',
              borderRadius: '10px',
              padding: '0.85rem 1.25rem',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.75rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={18} className="text-gov-blue" />
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0369a1' }}>
                Quick Test Samples:
              </span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {samplePresetScans.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectSample(sample)}
                  className="btn btn-sm"
                  style={{
                    background: '#ffffff',
                    border: '1px solid #7dd3fc',
                    color: '#0369a1',
                    fontSize: '0.78rem'
                  }}
                >
                  + {sample.name}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmitScan}>
            <div className="case-details-grid">
              {/* Left Column: Upload Area & Preview */}
              <div>
                <div className="panel-card">
                  <div className="panel-header">
                    <div className="panel-title">
                      <UploadCloud size={18} />
                      <span>Upload Label / Inspection Scan</span>
                    </div>
                  </div>
                  <div style={{ padding: '1.25rem' }}>
                    <label className="dropzone" style={{ display: 'block' }}>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        style={{ display: 'none' }}
                      />
                      <div className="dropzone-icon">
                        <ImageIcon size={44} style={{ margin: '0 auto' }} />
                      </div>
                      <div className="dropzone-title">Click to upload or drag & drop scan</div>
                      <div className="dropzone-subtitle">PNG, JPG, WEBP packaging scans (Max 15MB)</div>
                    </label>

                    {/* Preview Uploaded Image */}
                    {imagePreview ? (
                      <div style={{ marginTop: '1.25rem' }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem', color: 'var(--text-muted)' }}>
                          Scan Preview:
                        </div>
                        <div className="image-preview-container">
                          <img src={imagePreview} alt="Label Preview" />
                          <div className="image-caption">
                            <span>Ready for inspection record</span>
                            <button
                              type="button"
                              onClick={() => { setImagePreview(null); setImageUrl(''); }}
                              style={{ background: 'transparent', border: 'none', color: '#fca5a5', cursor: 'pointer', fontSize: '0.75rem' }}
                            >
                              Remove Photo
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div style={{ marginTop: '1rem' }}>
                        <label className="form-label" style={{ fontSize: '0.78rem' }}>
                          Or Provide Image URL:
                        </label>
                        <input
                          type="url"
                          className="form-input"
                          placeholder="https://example.com/scan-image.jpg"
                          value={imageUrl}
                          onChange={(e) => {
                            setImageUrl(e.target.value);
                            setImagePreview(e.target.value);
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Inspecting Officer Meta */}
                <div className="panel-card">
                  <div className="panel-header">
                    <div className="panel-title">
                      <Store size={18} />
                      <span>Inspecting Officer Identity</span>
                    </div>
                  </div>
                  <div style={{ padding: '1.25rem', fontSize: '0.85rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Officer Name:</span>
                      <span style={{ fontWeight: 600 }}>{currentUser.name}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Badge ID:</span>
                      <span style={{ fontWeight: 600, fontFamily: 'var(--font-mono)' }}>{currentUser.badgeId}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Jurisdiction:</span>
                      <span>{currentUser.jurisdiction}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Required Inspection Details */}
              <div>
                <div className="panel-card">
                  <div className="panel-header">
                    <div className="panel-title">
                      <FileText size={18} />
                      <span>Enter Required Inspection Details</span>
                    </div>
                  </div>
                  <div style={{ padding: '1.5rem' }}>
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Case ID *</label>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <input
                            type="text"
                            className="form-input"
                            style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}
                            value={uploadCaseId}
                            onChange={(e) => setUploadCaseId(e.target.value)}
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setUploadCaseId(generateCaseId())}
                            className="btn btn-outline btn-sm"
                            title="Generate New ID"
                          >
                            <RefreshCw size={14} />
                          </button>
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Commodity Name *</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="e.g. Pure Desi Ghee 1L"
                          value={commodity}
                          onChange={(e) => setCommodity(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Brand Name</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="e.g. Amrit Farms"
                          value={brand}
                          onChange={(e) => setBrand(e.target.value)}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Retail Sale Price (MRP) *</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="e.g. ₹285.00 (Incl. of taxes)"
                          value={mrp}
                          onChange={(e) => setMrp(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Declared Net Quantity *</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="e.g. 500 g or 1 Litre"
                          value={declaredNetQty}
                          onChange={(e) => setDeclaredNetQty(e.target.value)}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Batch / Lot Number</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="e.g. B-99401"
                          value={batchNo}
                          onChange={(e) => setBatchNo(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Date of Manufacture / Packing</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="MM/YYYY (e.g. 08/2026)"
                          value={mfgDate}
                          onChange={(e) => setMfgDate(e.target.value)}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Inspection Retail Location *</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="Store Name, Street, City"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Manufacturer / Packer / Importer Details</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Full registered entity name and postal address"
                        value={manufacturer}
                        onChange={(e) => setManufacturer(e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Initial Field Inspection Notes</label>
                      <textarea
                        className="form-textarea"
                        placeholder="Describe condition of package, standard weights check, optical scan notes..."
                        value={inspectionNotes}
                        onChange={(e) => setInspectionNotes(e.target.value)}
                      />
                    </div>

                    {/* Submit the scan */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                      <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ minWidth: '180px' }}
                      >
                        <UploadCloud size={16} />
                        <span>Submit Scan & Verify</span>
                        <ArrowRight size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: VERIFY LABEL SECTION                                               */}
      {/* ========================================================================= */}
      {activeTab === 'verify' && (
        <div>
          {/* Active Case Selector Bar */}
          <div
            style={{
              background: '#ffffff',
              border: '1px solid var(--border-color)',
              borderRadius: '10px',
              padding: '0.85rem 1.25rem',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.75rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-gov-navy)' }}>
                Target Inspection Case:
              </span>
              <select
                className="form-select"
                style={{ width: 'auto', fontWeight: 700, padding: '0.35rem 0.75rem' }}
                value={activeCase ? activeCase.id : ''}
                onChange={(e) => {
                  setActiveVerifyCaseId(e.target.value);
                  const newParams = new URLSearchParams(searchParams);
                  newParams.set('caseId', e.target.value);
                  setSearchParams(newParams);
                }}
              >
                {cases.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.id} — {c.commodity} ({c.status})
                  </option>
                ))}
              </select>
            </div>

            {activeCase && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  Inspected at: <strong>{activeCase.location}</strong>
                </span>
                <StatusBadge status={activeCase.status} text={activeCase.statusText} />
              </div>
            )}
          </div>

          {/* Verification Result Banner */}
          {verificationResult && (
            <div
              style={{
                background: verificationResult.status === 'Verified' ? '#ecfdf5' : '#fef2f2',
                border: `1px solid ${verificationResult.status === 'Verified' ? '#6ee7b7' : '#fca5a5'}`,
                color: verificationResult.status === 'Verified' ? '#065f46' : '#991b1b',
                padding: '1.25rem',
                borderRadius: '10px',
                marginBottom: '1.5rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {verificationResult.status === 'Verified' ? (
                  <CheckCircle2 size={26} color="#059669" />
                ) : (
                  <AlertTriangle size={26} color="#dc2626" />
                )}
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1rem' }}>
                    Verification Status: {verificationResult.status}
                  </div>
                  <div style={{ fontSize: '0.875rem' }}>{verificationResult.message}</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => navigate(`/cases/${activeCase.id}`)}
                  className="btn btn-outline btn-sm"
                >
                  <Eye size={14} />
                  <span>View Case File</span>
                </button>
                <button
                  onClick={() => handleTabChange('recent')}
                  className="btn btn-primary btn-sm"
                >
                  <span>View Recent Uploads</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}

          {activeCase ? (
            <div className="case-details-grid">
              {/* Left Column: Display Uploaded Scan Clearly */}
              <div>
                <div className="panel-card">
                  <div className="panel-header">
                    <div className="panel-title">
                      <FileText size={18} />
                      <span>Uploaded Scan Evidence</span>
                    </div>
                    <span className="case-id-badge">{activeCase.id}</span>
                  </div>
                  <div style={{ padding: '1rem' }}>
                    <div className="image-preview-container">
                      <img
                        src={activeCase.imageUrl}
                        alt={activeCase.commodity}
                        onError={(e) => {
                          e.target.src = "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80";
                        }}
                      />
                      <div className="image-caption">
                        <span>Case {activeCase.id}</span>
                        <span>{activeCase.location}</span>
                      </div>
                    </div>

                    {/* Verification Section showing label details */}
                    <div
                      style={{
                        marginTop: '1.25rem',
                        background: '#f8fafc',
                        border: '1px solid var(--border-color)',
                        borderRadius: '8px',
                        padding: '1rem'
                      }}
                    >
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.75rem', color: 'var(--color-gov-navy)' }}>
                        Registered Label Information
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
                          <span style={{ color: 'var(--text-muted)' }}>MRP:</span>
                          <div style={{ fontWeight: 700, color: '#047857' }}>{activeCase.mrp}</div>
                        </div>
                        <div>
                          <span style={{ color: 'var(--text-muted)' }}>Batch No:</span>
                          <div style={{ fontFamily: 'var(--font-mono)' }}>{activeCase.batchNo}</div>
                        </div>
                        <div>
                          <span style={{ color: 'var(--text-muted)' }}>Mfg Date:</span>
                          <div>{activeCase.mfgDate}</div>
                        </div>
                      </div>

                      <div style={{ marginTop: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid #e2e8f0', fontSize: '0.82rem' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Manufacturer:</span>
                        <div>{activeCase.manufacturer}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Allow Field Officer to verify/check required information */}
              <div>
                <div className="panel-card">
                  <div className="panel-header">
                    <div className="panel-title">
                      <ShieldCheck size={18} />
                      <span>Statutory Declarations Verification</span>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Click item to toggle compliance
                    </span>
                  </div>
                  <div style={{ padding: '1.25rem' }}>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                      Verify that each mandatory declaration meets font size, location, and statutory requirements under Legal Metrology Packaged Commodities Rules:
                    </p>

                    {/* Interactive Checklist */}
                    <div className="checklist-container">
                      {verifyChecklist.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => toggleChecklistItem(item.id)}
                          className={`checklist-item ${item.verified ? 'passed' : 'failed'}`}
                          style={{ cursor: 'pointer', transition: 'all 0.15s' }}
                        >
                          <div className="checklist-icon">
                            {item.verified ? (
                              <div
                                style={{
                                  width: '24px',
                                  height: '24px',
                                  borderRadius: '50%',
                                  background: '#10b981',
                                  color: '#ffffff',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}
                              >
                                <Check size={16} />
                              </div>
                            ) : (
                              <div
                                style={{
                                  width: '24px',
                                  height: '24px',
                                  borderRadius: '50%',
                                  background: '#ef4444',
                                  color: '#ffffff',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}
                              >
                                <X size={16} />
                              </div>
                            )}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div className="checklist-text">{item.label}</div>
                            <div className="checklist-rule">
                              Provision: {item.rule} •{' '}
                              <strong style={{ color: item.verified ? '#047857' : '#b91c1c' }}>
                                {item.verified ? 'VERIFIED COMPLIANT' : 'NON-COMPLIANT / DEFICIENT'}
                              </strong>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Verification Status Summary Indicator */}
                    <div
                      style={{
                        marginTop: '1.25rem',
                        padding: '1rem',
                        borderRadius: '8px',
                        background: allChecksPassed ? '#f0fdf4' : '#fffbeb',
                        border: `1px solid ${allChecksPassed ? '#bbf7d0' : '#fde68a'}`,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem'
                      }}
                    >
                      {allChecksPassed ? (
                        <CheckCircle2 size={20} color="#059669" />
                      ) : (
                        <AlertCircle size={20} color="#d97706" />
                      )}
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.88rem', color: allChecksPassed ? '#065f46' : '#92400e' }}>
                          {allChecksPassed
                            ? 'All Statutory Declarations Passed'
                            : `Deficiencies Observed (${verifyChecklist.filter((i) => !i.verified).length} items non-compliant)`}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          {allChecksPassed
                            ? 'Ready for sign-off as verified.'
                            : 'Will be flagged for follow-up by Metrology Officer.'}
                        </div>
                      </div>
                    </div>

                    {/* Remarks Before Submission */}
                    <div style={{ marginTop: '1.25rem' }}>
                      <label className="form-label" htmlFor="verificationRemarksField">
                        Field Officer Remarks Before Submission:
                      </label>
                      <textarea
                        id="verificationRemarksField"
                        className="form-textarea"
                        placeholder="Enter observation notes, verified font height, calibration ID, or violation specifics..."
                        value={verifyRemarksInput}
                        onChange={(e) => setVerifyRemarksInput(e.target.value)}
                      />
                    </div>

                    {/* Clear "Verify Label" Button & Submission */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
                      <button
                        type="button"
                        onClick={handleVerifyLabelSubmit}
                        className={`btn ${allChecksPassed ? 'btn-success' : 'btn-danger'}`}
                        style={{ minWidth: '180px' }}
                      >
                        {allChecksPassed ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
                        <span>{allChecksPassed ? 'Verify Label' : 'Flag Non-Compliance'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ padding: '3rem', textAlign: 'center', background: '#fff', borderRadius: '12px' }}>
              <h2>No Uploaded Scans Available</h2>
              <button
                onClick={() => handleTabChange('upload')}
                className="btn btn-primary"
                style={{ marginTop: '1rem' }}
              >
                Upload a Scan Now
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: RECENT UPLOADS TABLE                                              */}
      {/* ========================================================================= */}
      {activeTab === 'recent' && (
        <div className="panel-card">
          <div className="panel-header">
            <div className="panel-title">
              <Clock size={18} />
              <span>Recent Uploads & Field Inspections</span>
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Showing {cases.length} entries
            </span>
          </div>

          <div className="table-responsive">
            <table className="portal-table">
              <thead>
                <tr>
                  <th>Case ID</th>
                  <th>Commodity / Product</th>
                  <th>Upload Date</th>
                  <th>Inspection Location</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {cases.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <span className="case-id-badge">{item.id}</span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                        {item.commodity}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        MRP: {item.mrp} • Declared Qty: {item.declaredNetQty}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                        <Calendar size={13} />
                        <span>{item.date}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Building2 size={14} className="text-muted" />
                        <span style={{ maxWidth: '240px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'inline-block' }}>
                          {item.location}
                        </span>
                      </div>
                    </td>
                    <td>
                      <StatusBadge status={item.status} text={item.statusText} />
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                        {item.status === 'Pending' ? (
                          <button
                            onClick={() => openVerifyForCase(item.id)}
                            className="btn btn-success btn-sm"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                          >
                            <FileCheck size={14} />
                            <span>Verify Label</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => navigate(`/cases/${item.id}`)}
                            className="btn btn-outline btn-sm"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                          >
                            <Eye size={14} />
                            <span>View Details</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default FieldOfficerDashboard;
