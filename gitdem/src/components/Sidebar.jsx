import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Clock,
  AlertTriangle,
  CheckCircle2,
  FileBarChart,
  User,
  UploadCloud,
  FileCheck,
  ShieldCheck,
  Camera,
  Scale
} from 'lucide-react';
import { useMetrology } from '../context/MetrologyContext';

const Sidebar = () => {
  const { currentUser, cases, isMobileSidebarOpen, setIsMobileSidebarOpen } = useMetrology();
  const location = useLocation();
  const navigate = useNavigate();

  const isMetrologyOfficer = currentUser.role === 'metrologyOfficer' || currentUser.role === 'officer';
  const isConsumer = currentUser.role === 'consumer';

  // Live dynamic counts
  const pendingCount = cases.filter((c) => c.status === 'Pending').length;
  const flaggedCount = cases.filter((c) => c.status === 'Flagged').length;
  const verifiedCount = cases.filter((c) => c.status === 'Verified').length;

  const handleNavClick = (path) => {
    setIsMobileSidebarOpen(false);
    if (path) navigate(path);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileSidebarOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setIsMobileSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside className={`portal-sidebar ${isMobileSidebarOpen ? 'mobile-open' : ''}`}>
        <nav className="sidebar-nav">
          <div className="nav-section-label">
            {isConsumer
              ? 'Citizen Consumer Wing'
              : (isMetrologyOfficer ? 'Metrology Directorate' : 'Field Inspection Wing')}
          </div>

          {isConsumer ? (
            /* ==================================================== */
            /* CONSUMER / CITIZEN NAVIGATION */
            /* ==================================================== */
            <>
              <NavLink
                to="/consumer-dashboard"
                end
                onClick={() => setIsMobileSidebarOpen(false)}
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              >
                <LayoutDashboard size={18} />
                <span>Consumer Hub</span>
              </NavLink>

              <NavLink
                to="/upload-scan"
                onClick={() => setIsMobileSidebarOpen(false)}
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              >
                <Camera size={18} />
                <span>Scan Product</span>
              </NavLink>

              <NavLink
                to="/verify-label"
                onClick={() => setIsMobileSidebarOpen(false)}
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              >
                <FileCheck size={18} />
                <span>Verify Legality</span>
              </NavLink>

              <div className="nav-section-label" style={{ marginTop: '0.75rem' }}>
                Consumer Protection
              </div>

              <NavLink
                to="/reports"
                onClick={() => setIsMobileSidebarOpen(false)}
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              >
                <FileBarChart size={18} />
                <span>Rule 6 Standards</span>
              </NavLink>

              <NavLink
                to="/profile"
                onClick={() => setIsMobileSidebarOpen(false)}
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              >
                <User size={18} />
                <span>Citizen Profile</span>
              </NavLink>
            </>
          ) : isMetrologyOfficer ? (
            /* ==================================================== */
            /* METROLOGY OFFICER NAVIGATION */
            /* ==================================================== */
            <>
              <NavLink
                to="/metrology-dashboard"
                end
                onClick={() => setIsMobileSidebarOpen(false)}
                className={({ isActive }) =>
                  `nav-item ${isActive && !location.search ? 'active' : ''}`
                }
              >
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
              </NavLink>

              <button
                type="button"
                onClick={() => handleNavClick('/metrology-dashboard?status=Pending')}
                className={`nav-item ${location.search.includes('status=Pending') ? 'active' : ''}`}
                style={{ width: '100%', textAlign: 'left', border: 'none', background: 'transparent' }}
              >
                <Clock size={18} />
                <span>Pending Cases</span>
                <span className="nav-count-badge badge-pending">{pendingCount}</span>
              </button>

              <button
                type="button"
                onClick={() => handleNavClick('/metrology-dashboard?status=Flagged')}
                className={`nav-item ${location.search.includes('status=Flagged') ? 'active' : ''}`}
                style={{ width: '100%', textAlign: 'left', border: 'none', background: 'transparent' }}
              >
                <AlertTriangle size={18} />
                <span>Flagged Violations</span>
                <span className="nav-count-badge badge-flagged">{flaggedCount}</span>
              </button>

              <button
                type="button"
                onClick={() => handleNavClick('/metrology-dashboard?status=Verified')}
                className={`nav-item ${location.search.includes('status=Verified') ? 'active' : ''}`}
                style={{ width: '100%', textAlign: 'left', border: 'none', background: 'transparent' }}
              >
                <CheckCircle2 size={18} />
                <span>Discharged/Verified</span>
                <span className="nav-count-badge badge-verified">{verifiedCount}</span>
              </button>

              <div className="nav-section-label" style={{ marginTop: '0.75rem' }}>
                Field Operations
              </div>

              <NavLink
                to="/upload-scan"
                onClick={() => setIsMobileSidebarOpen(false)}
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              >
                <UploadCloud size={18} />
                <span>Upload Scan</span>
              </NavLink>

              <NavLink
                to="/verify-label"
                onClick={() => setIsMobileSidebarOpen(false)}
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              >
                <FileCheck size={18} />
                <span>Verify Label</span>
              </NavLink>

              <div className="nav-section-label" style={{ marginTop: '0.75rem' }}>
                Administration
              </div>

              <NavLink
                to="/reports"
                onClick={() => setIsMobileSidebarOpen(false)}
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              >
                <FileBarChart size={18} />
                <span>Enforcement Reports</span>
              </NavLink>

              <NavLink
                to="/profile"
                onClick={() => setIsMobileSidebarOpen(false)}
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              >
                <User size={18} />
                <span>Officer Profile</span>
              </NavLink>
            </>
          ) : (
            /* ==================================================== */
            /* FIELD OFFICER NAVIGATION */
            /* ==================================================== */
            <>
              <NavLink
                to="/field-dashboard"
                end
                onClick={() => setIsMobileSidebarOpen(false)}
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              >
                <LayoutDashboard size={18} />
                <span>Field Dashboard</span>
              </NavLink>

              <NavLink
                to="/upload-scan"
                onClick={() => setIsMobileSidebarOpen(false)}
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              >
                <UploadCloud size={18} />
                <span>Upload Scan</span>
              </NavLink>

              <NavLink
                to="/verify-label"
                onClick={() => setIsMobileSidebarOpen(false)}
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              >
                <FileCheck size={18} />
                <span>Verify Label</span>
                {pendingCount > 0 && (
                  <span className="nav-count-badge badge-pending">{pendingCount}</span>
                )}
              </NavLink>

              <div className="nav-section-label" style={{ marginTop: '0.75rem' }}>
                Administration
              </div>

              <NavLink
                to="/reports"
                onClick={() => setIsMobileSidebarOpen(false)}
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              >
                <FileBarChart size={18} />
                <span>Inspection Reports</span>
              </NavLink>

              <NavLink
                to="/profile"
                onClick={() => setIsMobileSidebarOpen(false)}
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              >
                <User size={18} />
                <span>Officer Profile</span>
              </NavLink>
            </>
          )}
        </nav>

        <div className="sidebar-footer">
          <div><strong>Govt. of India / Legal Metrology</strong></div>
          <div style={{ marginTop: '3px', opacity: 0.8 }}>Legal Metrology Act, 2009</div>
          <div style={{ opacity: 0.6, fontSize: '0.68rem', marginTop: '2px' }}>SIH26034 Enforcement Portal</div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
