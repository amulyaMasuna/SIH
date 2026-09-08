import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, LogOut, Menu, X, UserCheck, ShieldCheck, RefreshCw } from 'lucide-react';
import { useMetrology } from '../context/MetrologyContext';

const Header = () => {
  const navigate = useNavigate();
  const { currentUser, notifications, markAllNotificationsRead, isMobileSidebarOpen, setIsMobileSidebarOpen, logout } = useMetrology();
  const [showNotif, setShowNotif] = useState(false);
  const notifRef = useRef(null);

  const unreadCount = notifications.filter((n) => n.unread).length;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotif(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out of the Legal Metrology Portal?")) {
      logout();
    }
  };

  const isMetrologyOfficer = currentUser.role === 'metrologyOfficer';
  const isConsumer = currentUser.role === 'consumer';

  return (
    <header className="portal-header">
      <div className="portal-brand">
        <button
          type="button"
          className="mobile-menu-btn"
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          aria-label="Toggle Navigation Menu"
        >
          {isMobileSidebarOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <div className="portal-emblem">
          ⚖️
        </div>
        <div className="brand-text">
          <h1>NATIONAL LEGAL METROLOGY PORTAL</h1>
          <p>Ministry of Consumer Affairs • Legal Metrology (Packaged Commodities) Rules, 2011</p>
        </div>
      </div>

      <div className="header-right">
        {/* Switch Role / Login Quick Link */}
        <button
          onClick={() => navigate('/login')}
          className="btn btn-outline btn-sm"
          style={{
            borderColor: 'rgba(255,255,255,0.3)',
            color: '#f8fafc',
            fontSize: '0.75rem',
            padding: '0.3rem 0.65rem'
          }}
          title="Switch Role or Login with another account"
        >
          <RefreshCw size={13} />
          <span>Switch Role</span>
        </button>

        {/* Notifications Dropdown */}
        <div style={{ position: 'relative' }} ref={notifRef}>
          <button
            className="header-action-btn"
            onClick={() => setShowNotif(!showNotif)}
            title="Notifications"
            aria-label="Notifications"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="notif-badge-pill">{unreadCount}</span>
            )}
          </button>

          {showNotif && (
            <div className="notif-dropdown">
              <div className="notif-header">
                <span>Official Notifications ({notifications.length})</span>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--color-gov-blue)',
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                      fontWeight: 600
                    }}
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div className="notif-list">
                {notifications.map((notif) => (
                  <div key={notif.id} className={`notif-item ${notif.unread ? 'unread' : ''}`}>
                    <div className="notif-item-title">{notif.title}</div>
                    <div>{notif.message}</div>
                    <div className="notif-item-time">{notif.time}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Information Badge */}
        <div className="officer-badge">
          <img
            src={currentUser.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"}
            alt={currentUser.name}
            className="officer-avatar"
          />
          <div className="officer-info">
            <div className="officer-name">{currentUser.name}</div>
            <div className="officer-role-tag" style={{
              background: isConsumer ? 'rgba(56, 189, 248, 0.25)' : 'rgba(194, 136, 41, 0.25)',
              color: isConsumer ? '#7dd3fc' : '#fcd34d'
            }}>
              {isConsumer
                ? 'Citizen Consumer'
                : (isMetrologyOfficer ? 'Metrology Officer' : 'Field Officer')} • {currentUser.badgeId}
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="logout-btn"
          title="Sign out of Metrology Portal"
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
