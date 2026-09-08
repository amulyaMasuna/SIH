import React, { useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Clock,
  AlertTriangle,
  CheckCircle2,
  FileSpreadsheet,
  Search,
  ArrowRight,
  ExternalLink,
  Filter,
  Eye,
  Building2,
  Calendar,
  UserCheck
} from 'lucide-react';
import { useMetrology } from '../context/MetrologyContext';
import SummaryCard from '../components/SummaryCard';
import StatusBadge from '../components/StatusBadge';

const MetrologyDashboard = () => {
  const { cases, currentUser } = useMetrology();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const currentFilter = searchParams.get('status') || 'All';
  const [searchQuery, setSearchQuery] = useState('');

  // Calculate stats
  const pendingCount = cases.filter((c) => c.status === 'Pending').length;
  const flaggedCount = cases.filter((c) => c.status === 'Flagged').length;
  const verifiedCount = cases.filter((c) => c.status === 'Verified').length;
  const totalCount = cases.length;

  // Filter cases based on status and search query
  const filteredCases = useMemo(() => {
    return cases.filter((item) => {
      // Status filter
      let matchesStatus = true;
      if (currentFilter === 'Pending') matchesStatus = item.status === 'Pending';
      else if (currentFilter === 'Flagged') matchesStatus = item.status === 'Flagged';
      else if (currentFilter === 'Verified') matchesStatus = item.status === 'Verified';

      // Search query filter (Case ID, Officer, Location, Commodity)
      let matchesSearch = true;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        matchesSearch =
          item.id.toLowerCase().includes(query) ||
          item.fieldOfficer.toLowerCase().includes(query) ||
          item.location.toLowerCase().includes(query) ||
          (item.commodity && item.commodity.toLowerCase().includes(query)) ||
          (item.brand && item.brand.toLowerCase().includes(query));
      }

      return matchesStatus && matchesSearch;
    });
  }, [cases, currentFilter, searchQuery]);

  const handleFilterChange = (status) => {
    if (status === 'All') {
      searchParams.delete('status');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ status });
    }
  };

  return (
    <div className="content-area">
      {/* Page Header */}
      <div className="page-header-container">
        <div>
          <h1 className="page-title">Metrology Officer Dashboard</h1>
          <p className="page-subtitle">
            Welcome, <strong>{currentUser.name}</strong> • Legal Metrology Enforcement & Verification Wing
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            className="btn btn-outline"
            onClick={() => window.print()}
            title="Export Inspection Summary"
          >
            <FileSpreadsheet size={16} />
            <span>Export Registry</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="summary-grid">
        <SummaryCard
          title="Pending Cases"
          count={pendingCount}
          trend="Awaiting clearance / inspection sign-off"
          icon={Clock}
          type="pending"
          onClick={() => handleFilterChange('Pending')}
          active={currentFilter === 'Pending'}
        />
        <SummaryCard
          title="Flagged Cases"
          count={flaggedCount}
          trend="Legal violations & packaging non-compliance"
          icon={AlertTriangle}
          type="flagged"
          onClick={() => handleFilterChange('Flagged')}
          active={currentFilter === 'Flagged'}
        />
        <SummaryCard
          title="Discharged/Verified Cases"
          count={verifiedCount}
          trend="Certified compliant under 2009 Act"
          icon={CheckCircle2}
          type="verified"
          onClick={() => handleFilterChange('Verified')}
          active={currentFilter === 'Verified'}
        />
        <SummaryCard
          title="Total Cases"
          count={totalCount}
          trend="All registered inspection audits"
          icon={FileSpreadsheet}
          type="total"
          onClick={() => handleFilterChange('All')}
          active={currentFilter === 'All'}
        />
      </div>

      {/* Main Panel with Filter & Search */}
      <div className="panel-card">
        <div className="panel-header">
          <div className="panel-title">
            <Filter size={18} className="text-gov-navy" />
            <span>Case Inspection Registry</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500, marginLeft: '0.25rem' }}>
              ({filteredCases.length} {filteredCases.length === 1 ? 'case' : 'cases'} displayed)
            </span>
          </div>

          <div className="filter-search-bar">
            {/* Search Bar for Case ID, officer or location */}
            <div className="search-input-wrapper">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                placeholder="Search Case ID, officer, location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Status Filters: All, Pending, Flagged, Discharged/Verified */}
            <div className="filter-pills">
              <button
                className={`filter-pill ${currentFilter === 'All' ? 'active' : ''}`}
                onClick={() => handleFilterChange('All')}
              >
                All ({totalCount})
              </button>
              <button
                className={`filter-pill ${currentFilter === 'Pending' ? 'active' : ''}`}
                onClick={() => handleFilterChange('Pending')}
              >
                Pending ({pendingCount})
              </button>
              <button
                className={`filter-pill ${currentFilter === 'Flagged' ? 'active' : ''}`}
                onClick={() => handleFilterChange('Flagged')}
              >
                Flagged ({flaggedCount})
              </button>
              <button
                className={`filter-pill ${currentFilter === 'Verified' ? 'active' : ''}`}
                onClick={() => handleFilterChange('Verified')}
              >
                Discharged/Verified ({verifiedCount})
              </button>
            </div>
          </div>
        </div>

        {/* Recent Cases Table */}
        <div className="table-responsive">
          <table className="portal-table">
            <thead>
              <tr>
                <th>Case ID</th>
                <th>Commodity / Brand</th>
                <th>Field Officer</th>
                <th>Location</th>
                <th>Date</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredCases.length > 0 ? (
                filteredCases.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <span className="case-id-badge">{item.id}</span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                        {item.commodity}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {item.brand} • Batch: {item.batchNo}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                        <UserCheck size={14} className="text-muted" />
                        <span style={{ fontWeight: 500 }}>{item.fieldOfficer}</span>
                      </div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginLeft: '1.25rem' }}>
                        {item.fieldOfficerId}
                      </span>
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
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                        <Calendar size={13} />
                        <span>{item.date}</span>
                      </div>
                    </td>
                    <td>
                      <StatusBadge status={item.status} text={item.statusText} />
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        onClick={() => navigate(`/cases/${item.id}`)}
                        className="btn btn-outline btn-sm"
                        title="Open Case Details"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                      >
                        <Eye size={14} />
                        <span>View Details</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '3rem 1.5rem', color: 'var(--text-muted)' }}>
                    <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🔍</div>
                    <div style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--text-main)' }}>
                      No Inspection Cases Found
                    </div>
                    <div style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>
                      Try adjusting your status filter or search query.
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MetrologyDashboard;
