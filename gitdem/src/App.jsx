import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { MetrologyProvider, useMetrology } from './context/MetrologyContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import AuthPage from './pages/AuthPage';
import MetrologyDashboard from './pages/MetrologyDashboard';
import FieldOfficerDashboard from './pages/FieldOfficerDashboard';
import ConsumerDashboard from './pages/ConsumerDashboard';
import CaseDetails from './pages/CaseDetails';
import UploadScan from './pages/UploadScan';
import VerifyLabel from './pages/VerifyLabel';
import ReportsPage from './pages/ReportsPage';
import ProfilePage from './pages/ProfilePage';

// Main Layout with persistent Header and Role-specific Sidebar
const PortalLayout = () => {
  return (
    <div className="app-container">
      <Header />
      <div className="main-body">
        <Sidebar />
        <main style={{ flex: 1, overflowY: 'auto' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

// Automatic role-based redirect for root "/"
const RoleBasedRedirect = () => {
  const { currentUser } = useMetrology();

  if (currentUser.role === 'consumer') {
    return <Navigate to="/consumer-dashboard" replace />;
  }
  if (currentUser.role === 'fieldOfficer') {
    return <Navigate to="/field-dashboard" replace />;
  }
  return <Navigate to="/metrology-dashboard" replace />;
};

function App() {
  return (
    <MetrologyProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/login" element={<AuthPage />} />
          <Route path="/signup" element={<AuthPage />} />

          {/* Authenticated Portal Routes */}
          <Route element={<PortalLayout />}>
            {/* Automatic root redirection based on logged-in role */}
            <Route path="/" element={<RoleBasedRedirect />} />

            {/* Consumer / Citizen Hub */}
            <Route path="/consumer-dashboard" element={<ConsumerDashboard />} />

            {/* Metrology Officer Dashboard */}
            <Route path="/metrology-dashboard" element={<MetrologyDashboard />} />

            {/* Field Officer Dashboard */}
            <Route path="/field-dashboard" element={<FieldOfficerDashboard />} />

            {/* Upload & Split-Screen Verify (Accessible by both Officer & Consumer) */}
            <Route path="/upload-scan" element={<UploadScan />} />
            <Route path="/verify-label" element={<VerifyLabel />} />

            {/* Operational & Reference Views */}
            <Route path="/cases/:id" element={<CaseDetails />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/profile" element={<ProfilePage />} />

            {/* Catch-all route */}
            <Route path="*" element={<RoleBasedRedirect />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </MetrologyProvider>
  );
}

export default App;
