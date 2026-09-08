import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UploadCloud,
  Camera,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  FileText,
  ArrowRight,
  Sparkles,
  Store,
  RefreshCw,
  Video,
  VideoOff,
  SwitchCamera,
  Cpu,
  ShieldCheck,
  Check,
  Loader2
} from 'lucide-react';
import { useMetrology } from '../context/MetrologyContext';

const samplePresetScans = [
  {
    name: "Refined Sunflower Oil 1L (Legal Pack)",
    brand: "SunPure Gold",
    manufacturer: "SunPure Agro Foods Ltd, Plot 14, Phase II Ind. Area, Bhiwadi, Rajasthan",
    commodity: "Refined Sunflower Oil (1 Litre)",
    declaredNetQty: "1 L / 910 g",
    mrp: "185.00",
    batchNo: "B-260901",
    mfgDate: "08/2026",
    imageUrl: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80",
    location: "Apex Hypermarket, Sector 18, Noida",
    note: "Fully compliant with all Rule 6 statutory declarations."
  },
  {
    name: "Roasted Almonds 500g (Illegal - Dual MRP)",
    brand: "NutriDelight",
    manufacturer: "NutriDry Products LLP, 45 KIADB Industrial Area, Hoskote",
    commodity: "Premium Roasted Almonds (500g)",
    declaredNetQty: "500 g",
    mrp: "590.00 (Overprinted sticker: ₹640.00)",
    batchNo: "ND-ALM-442",
    mfgDate: "07/2026",
    imageUrl: "https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=800&q=80",
    location: "Spices & More Retailers, MG Road, Bengaluru",
    note: "Violates Rule 18(1) & Rule 6(1)(e): Over-stickering of Maximum Retail Price."
  },
  {
    name: "Iodized Salt 1Kg (Illegal - Missing Care Details)",
    brand: "Crystal Minerals",
    manufacturer: "Crystal Minerals Ltd, Gandhidham, Kutch, Gujarat",
    commodity: "Iodized Table Salt (1 Kg)",
    declaredNetQty: "1.0 kg",
    mrp: "28.00",
    batchNo: "CP-SLT-772",
    mfgDate: "08/2026",
    imageUrl: "https://images.unsplash.com/photo-1518110925495-5fe2fda0442c?auto=format&fit=crop&w=800&q=80",
    location: "Modern Daily Needs, Indirapuram",
    note: "Violates Rule 6(1)(n): Mandatory consumer redressal contacts missing."
  },
  {
    name: "Speciality Coffee Beans (Illegal - Missing USP)",
    brand: "Highland Roast",
    manufacturer: "Highland Planters Ltd, Chikmagalur, Karnataka",
    commodity: "Roasted Arabica Coffee Beans (250g)",
    declaredNetQty: "250 gms",
    mrp: "450.00",
    batchNo: "HLR-CF-303",
    mfgDate: "08/2026",
    imageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80",
    location: "Nature's Basket, Bandra West, Mumbai",
    note: "Violates Rule 6(1)(c) non-standard unit 'gms' and Rule 6(11) missing USP."
  }
];

const generateCaseId = () => `CLM-2026-${Math.floor(1000 + Math.random() * 9000)}`;

const UploadScan = () => {
  const navigate = useNavigate();
  const { auditScanApi, currentUser } = useMetrology();

  const [inputMode, setInputMode] = useState('camera'); // 'camera' or 'file'
  const [caseId, setCaseId] = useState(generateCaseId());
  const [commodity, setCommodity] = useState('Fortified Wheat Flour 5Kg');
  const [brand, setBrand] = useState('Amrit Foods');
  const [manufacturer, setManufacturer] = useState('Amrit Consumer Foods Ltd, Plot 14, Phase II, Noida');
  const [declaredNetQty, setDeclaredNetQty] = useState('500 g');
  const [mrp, setMrp] = useState('245.00');
  const [batchNo, setBatchNo] = useState('BATCH-2601');
  const [mfgDate, setMfgDate] = useState('08/2026');
  const [location, setLocation] = useState('Big Bazaar Supercenter, Sector 21');
  const [inspectionNotes, setInspectionNotes] = useState('Packaging evidence captured for statutory compliance audit.');

  // Image states
  const [imageBlob, setImageBlob] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formError, setFormError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState(0);

  // In-Browser Camera state & refs
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [facingMode, setFacingMode] = useState('environment'); // 'environment' (back) or 'user' (front)
  const [mediaStream, setMediaStream] = useState(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  // Initialize camera when camera mode is active
  useEffect(() => {
    if (inputMode === 'camera' && !imagePreview) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [inputMode, facingMode, imagePreview]);

  const startCamera = async () => {
    setCameraError('');
    try {
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      setMediaStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
    } catch (err) {
      console.warn("Camera access warning:", err);
      setCameraError('Camera access denied or unavailable. You can use drag-and-drop or select a sample scan.');
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
      setMediaStream(null);
    }
    setIsCameraActive(false);
  };

  const toggleCameraFacing = () => {
    setFacingMode(prev => (prev === 'environment' ? 'user' : 'environment'));
  };

  // Capture snapshot from in-browser camera
  const captureCameraSnapshot = () => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current || document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    setImagePreview(dataUrl);

    canvas.toBlob((blob) => {
      setImageBlob(blob);
    }, 'image/jpeg', 0.92);

    stopCamera();
  };

  const retakePhoto = () => {
    setImagePreview(null);
    setImageBlob(null);
    if (inputMode === 'camera') {
      startCamera();
    }
  };

  // Handle Drag and Drop
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDraggingOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDraggingOver(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processSelectedFile(files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      processSelectedFile(file);
    }
  };

  const processSelectedFile = (file) => {
    setImageBlob(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Populate from preset sample
  const handleSelectSample = (sample) => {
    setCommodity(sample.commodity);
    setBrand(sample.brand);
    setManufacturer(sample.manufacturer);
    setDeclaredNetQty(sample.declaredNetQty);
    setMrp(sample.mrp);
    setBatchNo(sample.batchNo);
    setMfgDate(sample.mfgDate);
    setLocation(sample.location);
    setImagePreview(sample.imageUrl);
    setInspectionNotes(sample.note);

    // Fetch sample image as Blob
    fetch(sample.imageUrl)
      .then(res => res.blob())
      .then(blob => setImageBlob(blob))
      .catch(() => {
        // Fallback dummy blob
        const dummyBlob = new Blob(["sample"], { type: "image/jpeg" });
        setImageBlob(dummyBlob);
      });
  };

  // Submit scan to Backend -> Python pipeline
  const handleSubmitScan = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!imagePreview && !imageBlob) {
      setFormError('Please capture a photo with your camera or upload an image of the package.');
      return;
    }

    setIsProcessing(true);
    setProcessingStage(1);

    try {
      const formData = new FormData();
      if (imageBlob) {
        formData.append('label_file', imageBlob, `${caseId}.jpg`);
      }
      if (imagePreview && imagePreview.startsWith('data:')) {
        formData.append('image_base64', imagePreview);
      }

      formData.append('caseId', caseId);
      formData.append('commodity', commodity);
      formData.append('brand', brand);
      formData.append('manufacturer', manufacturer);
      formData.append('declaredNetQty', declaredNetQty);
      formData.append('mrp', mrp);
      formData.append('batchNo', batchNo);
      formData.append('mfgDate', mfgDate);
      formData.append('location', location);
      formData.append('userRole', currentUser.role);
      formData.append('userName', currentUser.name);

      // Advance stage indicator
      setTimeout(() => setProcessingStage(2), 700);
      setTimeout(() => setProcessingStage(3), 1500);

      const { auditData, newCase } = await auditScanApi(formData);

      setProcessingStage(4);
      setTimeout(() => {
        setIsProcessing(false);
        navigate(`/verify-label?caseId=${newCase.id}`);
      }, 500);

    } catch (err) {
      console.warn("Audit submission error, fallback to client verification:", err);
      setIsProcessing(false);
      navigate(`/verify-label?caseId=${caseId}`);
    }
  };

  return (
    <div className="content-area">
      {/* Page Header */}
      <div className="page-header-container">
        <div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: '#f1f5f9',
            padding: '3px 10px',
            borderRadius: '12px',
            fontSize: '0.75rem',
            fontWeight: 600,
            color: '#334155',
            marginBottom: '0.4rem'
          }}>
            <ShieldCheck size={14} className="text-gov-blue" />
            <span>SIH26034 Automated Optical Inspection</span>
          </div>
          <h1 className="page-title">Capture & Upload Package Scan</h1>
          <p className="page-subtitle">
            Capture live photo via in-browser camera or drag & drop packaged commodity label.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setCaseId(generateCaseId())}
          className="btn btn-outline btn-sm"
          title="Regenerate Case ID"
        >
          <RefreshCw size={14} />
          <span>Case: {caseId}</span>
        </button>
      </div>

      {formError && (
        <div style={{
          background: '#fef2f2',
          border: '1px solid #fca5a5',
          color: '#991b1b',
          padding: '0.85rem 1.25rem',
          borderRadius: '8px',
          marginBottom: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <AlertCircle size={18} />
          <span>{formError}</span>
        </div>
      )}

      {/* Preset Quick-Test Sample Scans */}
      <div style={{
        background: '#f0f9ff',
        border: '1px solid #bae6fd',
        borderRadius: '12px',
        padding: '1rem 1.25rem',
        marginBottom: '1.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={18} className="text-gov-blue" />
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0369a1' }}>
              Quick-Test Presets (Legal & Illegal Cases):
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
                  fontSize: '0.76rem',
                  fontWeight: 600
                }}
              >
                + {sample.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Processing Overlay Modal */}
      {isProcessing && (
        <div className="modal-backdrop" style={{ zIndex: 100 }}>
          <div className="modal-content" style={{ maxWidth: '460px', textAlign: 'center', padding: '2.5rem 2rem' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: '#eff6ff',
              color: '#1d4ed8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem'
            }}>
              <Cpu size={32} className="animate-spin" />
            </div>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#091e3a', marginBottom: '0.5rem' }}>
              Legal Metrology Vision Pipeline
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Executing OpenCV + PaddleOCR + Rule 6 statutory validation...
            </p>

            {/* Pipeline Stage Tracker */}
            <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem' }}>
                {processingStage >= 1 ? <CheckCircle2 size={18} color="#059669" /> : <Loader2 size={18} className="animate-spin" color="#1d4ed8" />}
                <span style={{ fontWeight: processingStage === 1 ? 700 : 500 }}>
                  1. OpenCV Preprocessing & Glare Reduction
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem' }}>
                {processingStage >= 2 ? <CheckCircle2 size={18} color="#059669" /> : <Loader2 size={18} className="animate-spin" color="#94a3b8" />}
                <span style={{ fontWeight: processingStage === 2 ? 700 : 500 }}>
                  2. PaddleOCR Spatial Text & Bounding Boxes
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem' }}>
                {processingStage >= 3 ? <CheckCircle2 size={18} color="#059669" /> : <Loader2 size={18} className="animate-spin" color="#94a3b8" />}
                <span style={{ fontWeight: processingStage === 3 ? 700 : 500 }}>
                  3. NodeJS Legal Metrology Rules 2011 Engine
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem' }}>
                {processingStage >= 4 ? <CheckCircle2 size={18} color="#059669" /> : <Loader2 size={18} className="animate-spin" color="#94a3b8" />}
                <span style={{ fontWeight: processingStage === 4 ? 700 : 500 }}>
                  4. MongoDB Ledger Archival & Legality Flagging
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmitScan}>
        <div className="case-details-grid">
          {/* Left Column: Camera / Drag-and-Drop Uploader */}
          <div>
            <div className="panel-card" style={{ marginBottom: '1.25rem' }}>
              <div className="panel-header" style={{ padding: '0.75rem 1.25rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => setInputMode('camera')}
                    style={{
                      background: inputMode === 'camera' ? '#091e3a' : 'transparent',
                      color: inputMode === 'camera' ? '#ffffff' : '#64748b',
                      border: 'none',
                      padding: '0.45rem 0.85rem',
                      borderRadius: '6px',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      cursor: 'pointer'
                    }}
                  >
                    <Camera size={15} />
                    <span>In-Browser Camera</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setInputMode('file')}
                    style={{
                      background: inputMode === 'file' ? '#091e3a' : 'transparent',
                      color: inputMode === 'file' ? '#ffffff' : '#64748b',
                      border: 'none',
                      padding: '0.45rem 0.85rem',
                      borderRadius: '6px',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      cursor: 'pointer'
                    }}
                  >
                    <UploadCloud size={15} />
                    <span>Drag & Drop File</span>
                  </button>
                </div>

                {inputMode === 'camera' && !imagePreview && (
                  <button
                    type="button"
                    onClick={toggleCameraFacing}
                    className="btn btn-outline btn-sm"
                    title="Flip front/rear camera"
                  >
                    <SwitchCamera size={14} />
                    <span>Flip</span>
                  </button>
                )}
              </div>

              <div style={{ padding: '1.25rem' }}>
                {/* 1. CAMERA STREAM & CAPTURE VIEW */}
                {inputMode === 'camera' && !imagePreview && (
                  <div>
                    {cameraError ? (
                      <div style={{
                        background: '#fef2f2',
                        border: '1px solid #fca5a5',
                        color: '#991b1b',
                        padding: '1rem',
                        borderRadius: '8px',
                        fontSize: '0.85rem',
                        textAlign: 'center'
                      }}>
                        <VideoOff size={32} style={{ margin: '0 auto 0.5rem' }} />
                        <div>{cameraError}</div>
                        <button
                          type="button"
                          onClick={() => setInputMode('file')}
                          className="btn btn-primary btn-sm"
                          style={{ marginTop: '0.75rem' }}
                        >
                          Switch to File Upload
                        </button>
                      </div>
                    ) : (
                      <div>
                        {/* Live Viewfinder */}
                        <div style={{
                          position: 'relative',
                          width: '100%',
                          height: '320px',
                          background: '#091e38',
                          borderRadius: '10px',
                          overflow: 'hidden',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <video
                            ref={videoRef}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover'
                            }}
                            autoPlay
                            playsInline
                            muted
                          />

                          {/* Optical Alignment Reticle */}
                          <div style={{
                            position: 'absolute',
                            top: '25px',
                            bottom: '25px',
                            left: '30px',
                            right: '30px',
                            border: '2px dashed rgba(255, 255, 255, 0.7)',
                            borderRadius: '8px',
                            pointerEvents: 'none',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            padding: '10px'
                          }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#fcd34d', fontSize: '0.72rem', fontWeight: 600 }}>
                              <span>┌ ALIGN PACKAGING LABEL</span>
                              <span>RULE 6 DISPLAY ┐</span>
                            </div>
                            <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.7)', fontSize: '0.72rem' }}>
                              Position MRP, Net Qty & Manufacturer within frame
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#fcd34d', fontSize: '0.72rem', fontWeight: 600 }}>
                              <span>└ LEGAL METROLOGY</span>
                              <span>OPTICAL CAPTURE ┘</span>
                            </div>
                          </div>
                        </div>

                        {/* Camera Shutter Button */}
                        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                          <button
                            type="button"
                            onClick={captureCameraSnapshot}
                            style={{
                              background: '#ef4444',
                              color: '#ffffff',
                              border: '4px solid #fecaca',
                              width: '64px',
                              height: '64px',
                              borderRadius: '50%',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              boxShadow: '0 4px 15px rgba(239, 68, 68, 0.4)'
                            }}
                            title="Take Snapshot"
                          >
                            <Camera size={26} />
                          </button>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                            Click to capture live photo evidence
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 2. DRAG AND DROP FILE INPUT */}
                {inputMode === 'file' && !imagePreview && (
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className="dropzone"
                    style={{
                      borderColor: isDraggingOver ? 'var(--color-gov-blue)' : 'var(--border-dark)',
                      background: isDraggingOver ? '#f0f9ff' : '#f8fafc',
                      transition: 'all 0.2s',
                      cursor: 'pointer'
                    }}
                    onClick={() => document.getElementById('file-upload-input').click()}
                  >
                    <input
                      id="file-upload-input"
                      type="file"
                      accept="image/*"
                      onChange={handleFileInputChange}
                      style={{ display: 'none' }}
                    />
                    <div className="dropzone-icon">
                      <UploadCloud size={44} style={{ margin: '0 auto', color: 'var(--color-gov-blue)' }} />
                    </div>
                    <div className="dropzone-title">Click to upload or drag & drop scan</div>
                    <div className="dropzone-subtitle">PNG, JPG, JPEG, WEBP packaging images (Max 25MB)</div>
                  </div>
                )}

                {/* 3. CAPTURED / UPLOADED PREVIEW */}
                {imagePreview && (
                  <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-muted)' }}>
                      Photo Evidence Ready for Audit:
                    </div>
                    <div className="image-preview-container">
                      <img src={imagePreview} alt="Packaging Preview" />
                      <div className="image-caption">
                        <span>Evidence Photo: <strong>{caseId}</strong></span>
                        <button
                          type="button"
                          onClick={retakePhoto}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#fca5a5',
                            cursor: 'pointer',
                            fontSize: '0.75rem',
                            fontWeight: 600
                          }}
                        >
                          Retake / Remove Photo
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Inspecting Identity Stamp */}
            <div className="panel-card">
              <div className="panel-header">
                <div className="panel-title">
                  <Store size={18} />
                  <span>Logged-in User Stamp</span>
                </div>
              </div>
              <div style={{ padding: '1.25rem', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Auditor:</span>
                  <span style={{ fontWeight: 600 }}>{currentUser.name}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Role / Designation:</span>
                  <span style={{ fontWeight: 600 }}>{currentUser.designation || currentUser.role}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Jurisdiction:</span>
                  <span>{currentUser.jurisdiction || "National Registry"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Commodity Metadata */}
          <div>
            <div className="panel-card">
              <div className="panel-header">
                <div className="panel-title">
                  <FileText size={18} />
                  <span>Packaging Declarations & Retail Coordinates</span>
                </div>
              </div>
              <div style={{ padding: '1.5rem' }}>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Case ID *</label>
                    <input
                      type="text"
                      className="form-input"
                      style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}
                      value={caseId}
                      onChange={(e) => setCaseId(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Commodity / Common Name *</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Fortified Wheat Flour 5Kg"
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
                      placeholder="e.g. Kisan Gold"
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Maximum Retail Price (₹) *</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. 245.00"
                      value={mrp}
                      onChange={(e) => setMrp(e.target.value)}
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
                  <label className="form-label">Manufacturer / Packer Details</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Full registered postal address"
                    value={manufacturer}
                    onChange={(e) => setManufacturer(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Inspection Observations</label>
                  <textarea
                    className="form-textarea"
                    placeholder="Describe packaging condition, font size observations, seal integrity..."
                    value={inspectionNotes}
                    onChange={(e) => setInspectionNotes(e.target.value)}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="btn btn-outline"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="btn btn-primary"
                    style={{ minWidth: '190px' }}
                  >
                    <span>Run Legal Metrology Audit</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UploadScan;
