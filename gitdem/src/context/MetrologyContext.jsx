import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialCases, officerProfiles } from '../data/mockData';

const MetrologyContext = createContext(null);

const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const resolveCurrentRole = () => {
  if (typeof window === 'undefined') return 'metrologyOfficer';

  const params = new URLSearchParams(window.location.search);
  const queryRole = params.get('role');
  if (queryRole === 'fieldOfficer' || queryRole === 'metrologyOfficer' || queryRole === 'consumer') {
    localStorage.setItem('metrology_user_role', queryRole);
    sessionStorage.setItem('metrology_user_role', queryRole);
    return queryRole;
  }

  const savedRole =
    sessionStorage.getItem('metrology_user_role') ||
    localStorage.getItem('metrology_user_role') ||
    sessionStorage.getItem('role') ||
    localStorage.getItem('role');

  if (savedRole === 'fieldOfficer' || savedRole === 'metrologyOfficer' || savedRole === 'consumer') {
    return savedRole;
  }

  // Default demo role
  localStorage.setItem('metrology_user_role', 'metrologyOfficer');
  return 'metrologyOfficer';
};

export const MetrologyProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(resolveCurrentRole);
  const [authToken, setAuthToken] = useState(() => localStorage.getItem('metrology_auth_token') || '');
  const [authProfile, setAuthProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('metrology_user_profile');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [lastAuditResult, setLastAuditResult] = useState(null);

  // Synchronize role across storage events
  useEffect(() => {
    const handleStorageChange = () => {
      const updatedRole = resolveCurrentRole();
      setUserRole(updatedRole);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('metrology_role_change', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('metrology_role_change', handleStorageChange);
    };
  }, []);

  // Compute active user profile
  const baseProfile = officerProfiles[userRole] || officerProfiles.metrologyOfficer;
  const currentUser = {
    ...baseProfile,
    ...(authProfile || {}),
    role: userRole
  };

  // Initialize cases from localStorage or initial mock data
  const [cases, setCases] = useState(() => {
    const savedCases = localStorage.getItem('metrology_portal_cases');
    if (savedCases) {
      try {
        return JSON.parse(savedCases);
      } catch (e) {
        console.error('Failed to parse saved cases:', e);
      }
    }
    localStorage.setItem('metrology_portal_cases', JSON.stringify(initialCases));
    return initialCases;
  });

  // Notifications state
  const [notifications, setNotifications] = useState([
    {
      id: "n1",
      title: "New Scan Inspection Submitted",
      message: "Inspector Rajesh Sharma submitted Case CLM-2026-0841 from Apex Hypermarket.",
      time: "15m ago",
      unread: true
    },
    {
      id: "n2",
      title: "MRP Discrepancy Flagged",
      message: "Over-stickering flagged on Case CLM-2026-0839 by Officer Ananya Sen.",
      time: "2h ago",
      unread: true
    },
    {
      id: "n3",
      title: "Annual Calibration Standard Due",
      message: "Batch verification certificate renewed for North Zone electronic test rigs.",
      time: "1d ago",
      unread: false
    }
  ]);

  // Sync cases changes to localStorage
  useEffect(() => {
    localStorage.setItem('metrology_portal_cases', JSON.stringify(cases));
  }, [cases]);

  // Fetch scans from backend if available
  useEffect(() => {
    const fetchBackendScans = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/label/scans`);
        if (res.ok) {
          const data = await res.json();
          if (data.scans && data.scans.length > 0) {
            // Merge backend scans with existing cases
            setCases((prev) => {
              const prevIds = new Set(prev.map(c => c.id));
              const newScansFormatted = data.scans
                .filter(s => !prevIds.has(s.caseId))
                .map(s => ({
                  id: s.caseId,
                  fieldOfficer: s.userName || "Field Officer",
                  fieldOfficerId: "LM-FO-4821",
                  location: s.location || "Market Retail Store",
                  date: s.createdAt ? s.createdAt.split('T')[0] : new Date().toISOString().split('T')[0],
                  commodity: s.commodity || "Packaged Commodity",
                  brand: s.brand || "Standard Brand",
                  manufacturer: s.extractedFields?.Manufacturer_Identity || "Manufacturer details recorded",
                  declaredNetQty: s.extractedFields?.Net_Quantity_Raw || "1 Unit",
                  mrp: s.extractedFields?.MRP_Value ? `₹${s.extractedFields.MRP_Value}` : "₹0.00",
                  batchNo: s.extractedFields?.Batch_No || "BATCH-" + s.caseId.slice(-4),
                  mfgDate: s.extractedFields?.Mfg_Date || "08/2026",
                  status: s.status === 'LEGAL' ? 'Verified' : 'Flagged',
                  statusText: s.status === 'LEGAL' ? 'Verified / Discharged' : 'Flagged Violation',
                  imageUrl: s.imageUrl || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80",
                  inspectionNotes: `Legal Metrology Rule 6 statutory audit executed. Status: ${s.status}. Score: ${s.complianceScore}%.`,
                  flagReason: s.status === 'ILLEGAL' ? (s.violations?.[0]?.title || "Rule 6 Non-compliance") : null,
                  violations: s.violations || [],
                  compliances: s.compliances || [],
                  checklist: (s.compliances || []).map((c, i) => ({
                    id: `c-${i}`,
                    label: c.title,
                    verified: true,
                    rule: c.rule
                  })).concat((s.violations || []).map((v, i) => ({
                    id: `v-${i}`,
                    label: v.title,
                    verified: false,
                    rule: v.rule
                  }))),
                  remarks: s.remarks || []
                }));
              return [...newScansFormatted, ...prev];
            });
          }
        }
      } catch (err) {
        console.warn("Backend scans fetch warning:", err.message);
      }
    };
    fetchBackendScans();
  }, []);

  // Set quick demo role for hackathon judges/evaluators
  const setQuickDemoRole = (roleKey, customName, customEmail) => {
    const normalizedRole = (roleKey === 'fieldOfficer' || roleKey === 'metrologyOfficer' || roleKey === 'consumer')
      ? roleKey
      : (roleKey === 'officer' ? 'fieldOfficer' : 'consumer');

    setUserRole(normalizedRole);
    localStorage.setItem('metrology_user_role', normalizedRole);

    if (customName || customEmail) {
      const profile = {
        name: customName || (normalizedRole === 'consumer' ? 'Aarav Mehta' : 'Dr. V. K. Malhotra'),
        email: customEmail || (normalizedRole === 'consumer' ? 'consumer@citizen.in' : 'officer@metrology.gov.in')
      };
      setAuthProfile(profile);
      localStorage.setItem('metrology_user_profile', JSON.stringify(profile));
    }
  };

  // Auth Login handler
  const login = async ({ email, password, roleHint }) => {
    try {
      const res = await fetch(`${BACKEND_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Login failed');
      }

      const data = await res.json();
      if (data.accessToken) {
        setAuthToken(data.accessToken);
        localStorage.setItem('metrology_auth_token', data.accessToken);
      }

      const assignedRole = data.user?.role === 'consumer' ? 'consumer' : (roleHint === 'metrologyOfficer' ? 'metrologyOfficer' : 'fieldOfficer');
      setUserRole(assignedRole);
      localStorage.setItem('metrology_user_role', assignedRole);

      if (data.user) {
        setAuthProfile(data.user);
        localStorage.setItem('metrology_user_profile', JSON.stringify(data.user));
      }

      return data;
    } catch (err) {
      // Fallback
      setQuickDemoRole(roleHint || 'fieldOfficer', null, email);
      return { success: true, offline: true };
    }
  };

  // Auth Register handler
  const register = async ({ name, email, password, role }) => {
    try {
      const res = await fetch(`${BACKEND_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Registration failed');
      }

      const data = await res.json();
      if (data.accessToken) {
        setAuthToken(data.accessToken);
        localStorage.setItem('metrology_auth_token', data.accessToken);
      }

      const assignedRole = role === 'consumer' ? 'consumer' : 'fieldOfficer';
      setUserRole(assignedRole);
      localStorage.setItem('metrology_user_role', assignedRole);

      const profile = { name, email, role: assignedRole };
      setAuthProfile(profile);
      localStorage.setItem('metrology_user_profile', JSON.stringify(profile));

      return data;
    } catch (err) {
      setQuickDemoRole(role || 'consumer', name, email);
      return { success: true, offline: true };
    }
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('metrology_auth_token');
    localStorage.removeItem('metrology_user_profile');
    localStorage.removeItem('metrology_user_role');
    sessionStorage.removeItem('metrology_user_role');
    setAuthToken('');
    setAuthProfile(null);
    window.location.href = '/login';
  };

  // Process label scan via NodeJS -> Python Microservice pipeline
  const auditScanApi = async (formData) => {
    try {
      formData.append('userName', currentUser.name);
      formData.append('userRole', currentUser.role);

      const res = await fetch(`${BACKEND_URL}/label/audit-label`, {
        method: 'POST',
        body: formData
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Audit API failed: ${errorText}`);
      }

      const auditData = await res.json();
      setLastAuditResult(auditData);

      // Construct a new Case record
      const newCase = {
        id: auditData.caseId,
        fieldOfficer: currentUser.name,
        fieldOfficerId: currentUser.badgeId,
        location: auditData.location || "Retail Inspection Location",
        date: new Date().toISOString().split('T')[0],
        commodity: auditData.commodity || "Inspected Commodity",
        brand: auditData.brand || "Inspected Brand",
        manufacturer: auditData.extractedFields?.Manufacturer_Identity || "Manufacturer stamped on packaging",
        declaredNetQty: auditData.extractedFields?.Net_Quantity_Raw || "1 Unit",
        mrp: auditData.extractedFields?.MRP_Value ? `₹${auditData.extractedFields.MRP_Value}` : "₹0.00",
        batchNo: auditData.extractedFields?.Batch_No || "BATCH-" + auditData.caseId.slice(-4),
        mfgDate: auditData.extractedFields?.Mfg_Date || "08/2026",
        status: auditData.status === 'LEGAL' ? 'Verified' : 'Flagged',
        statusText: auditData.status === 'LEGAL' ? 'Verified / Discharged' : 'Flagged Violation',
        imageUrl: auditData.imageUrl || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80",
        inspectionNotes: `Legal Metrology Statutory Audit: ${auditData.status}. Passed ${auditData.compliancesCount} checks. Detected ${auditData.violationsCount} violations.`,
        flagReason: auditData.status === 'ILLEGAL' ? (auditData.violations?.[0]?.title || "Rule 6 Non-compliance") : null,
        violations: auditData.violations || [],
        compliances: auditData.compliances || [],
        extractedFields: auditData.extractedFields || {},
        boxes: auditData.boxes || [],
        rawText: auditData.rawText || "",
        complianceScore: auditData.complianceScore || 0,
        remarks: [
          {
            by: currentUser.name,
            role: currentUser.role,
            date: new Date().toLocaleString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            }),
            text: `Automated vision audit executed. Parcel legality status: ${auditData.status}.`
          }
        ]
      };

      setCases((prev) => [newCase, ...prev]);

      setNotifications((prev) => [
        {
          id: `notif-${Date.now()}`,
          title: `Inspection Audit Complete: ${newCase.id}`,
          message: `${newCase.commodity} flagged as ${newCase.status} (${auditData.violationsCount} violations).`,
          time: "Just now",
          unread: true
        },
        ...prev
      ]);

      return { auditData, newCase };
    } catch (err) {
      console.error("auditScanApi error:", err);
      throw err;
    }
  };

  // Update a case's status & append an official remark
  const updateCaseStatus = (caseId, newStatus, remarkText, flagReason = null) => {
    setCases((prevCases) =>
      prevCases.map((item) => {
        if (item.id === caseId) {
          const statusTextMap = {
            Pending: "Pending Review",
            Verified: "Verified / Discharged",
            Flagged: "Flagged Violation"
          };

          const newRemark = remarkText
            ? {
                by: currentUser.name,
                role: currentUser.role,
                date: new Date().toLocaleString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                }),
                text: remarkText
              }
            : null;

          const updatedRemarks = newRemark ? [...item.remarks, newRemark] : item.remarks;

          return {
            ...item,
            status: newStatus,
            statusText: statusTextMap[newStatus] || newStatus,
            flagReason: flagReason !== null ? flagReason : (newStatus === 'Verified' ? null : item.flagReason),
            remarks: updatedRemarks
          };
        }
        return item;
      })
    );

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: `Case ${caseId} Status Updated`,
        message: `${currentUser.name} marked ${caseId} as ${newStatus}.`,
        time: "Just now",
        unread: true
      },
      ...prev
    ]);
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  return (
    <MetrologyContext.Provider
      value={{
        userRole,
        currentUser,
        cases,
        updateCaseStatus,
        auditScanApi,
        lastAuditResult,
        setLastAuditResult,
        login,
        register,
        logout,
        setQuickDemoRole,
        notifications,
        markAllNotificationsRead,
        isMobileSidebarOpen,
        setIsMobileSidebarOpen
      }}
    >
      {children}
    </MetrologyContext.Provider>
  );
};

export const useMetrology = () => {
  const context = useContext(MetrologyContext);
  if (!context) {
    throw new Error('useMetrology must be used within a MetrologyProvider');
  }
  return context;
};
