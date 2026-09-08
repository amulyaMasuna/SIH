import React from 'react';
import { FileBarChart, Download, Printer, ShieldCheck, AlertTriangle, TrendingUp } from 'lucide-react';
import { useMetrology } from '../context/MetrologyContext';

const ReportsPage = () => {
  const { cases, currentUser } = useMetrology();

  const total = cases.length;
  const verified = cases.filter((c) => c.status === 'Verified').length;
  const flagged = cases.filter((c) => c.status === 'Flagged').length;
  const pending = cases.filter((c) => c.status === 'Pending').length;

  const complianceRate = total > 0 ? Math.round((verified / total) * 100) : 0;

  return (
    <div className="content-area">
      <div className="page-header-container">
        <div>
          <h1 className="page-title">Metrology Inspection & Compliance Reports</h1>
          <p className="page-subtitle">
            Directorate of Legal Metrology • Statutory Audit & Enforcement Intelligence
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={() => window.print()} className="btn btn-outline btn-sm">
            <Printer size={15} />
            <span>Print Report</span>
          </button>
          <button onClick={() => alert("Quarterly compliance audit report compiled and exported.")} className="btn btn-primary btn-sm">
            <Download size={15} />
            <span>Export PDF Digest</span>
          </button>
        </div>
      </div>

      {/* Analytics High Level Cards */}
      <div className="summary-grid">
        <div className="summary-card">
          <div className="summary-icon-box total">
            <FileBarChart size={24} />
          </div>
          <div className="summary-details">
            <h3>Total Inspections</h3>
            <div className="summary-value">{total}</div>
            <div className="summary-trend">All filed spot verifications</div>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon-box verified">
            <ShieldCheck size={24} />
          </div>
          <div className="summary-details">
            <h3>Compliance Rate</h3>
            <div className="summary-value">{complianceRate}%</div>
            <div className="summary-trend">{verified} certified compliant</div>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon-box flagged">
            <AlertTriangle size={24} />
          </div>
          <div className="summary-details">
            <h3>Violation Notices</h3>
            <div className="summary-value">{flagged}</div>
            <div className="summary-trend">Actionable legal metrology cases</div>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon-box pending">
            <TrendingUp size={24} />
          </div>
          <div className="summary-details">
            <h3>Active Reviews</h3>
            <div className="summary-value">{pending}</div>
            <div className="summary-trend">Under controller examination</div>
          </div>
        </div>
      </div>

      {/* Statutory Breakdown Table */}
      <div className="panel-card">
        <div className="panel-header">
          <div className="panel-title">
            <FileBarChart size={18} />
            <span>Statutory Compliance Breakdown (Rule 6 Standards)</span>
          </div>
        </div>
        <div className="table-responsive">
          <table className="portal-table">
            <thead>
              <tr>
                <th>Mandatory Rule</th>
                <th>Statutory Requirement</th>
                <th>Standard Verification Method</th>
                <th>Risk Profile</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Rule 6(1)(a)</strong></td>
                <td>Manufacturer / Packer / Importer Identity</td>
                <td>Physical verification against registration certificate</td>
                <td><span className="status-badge verified">High Compliance</span></td>
              </tr>
              <tr>
                <td><strong>Rule 6(1)(b)</strong></td>
                <td>Common or Generic Commodity Name</td>
                <td>Visual check on primary display panel</td>
                <td><span className="status-badge verified">High Compliance</span></td>
              </tr>
              <tr>
                <td><strong>Rule 6(1)(c)</strong></td>
                <td>Net Quantity in Standard SI Units</td>
                <td>Calibrated optical gauge & digital bench scales</td>
                <td><span className="status-badge pending">Moderate Variations</span></td>
              </tr>
              <tr>
                <td><strong>Rule 6(1)(d)</strong></td>
                <td>Month and Year of Pre-packing</td>
                <td>Inspection of inkjet/laser batch marking</td>
                <td><span className="status-badge verified">High Compliance</span></td>
              </tr>
              <tr>
                <td><strong>Rule 6(1)(e)</strong></td>
                <td>Retail Sale Price (MRP incl. of all taxes)</td>
                <td>Barcode scanner verification & sticker scrutiny</td>
                <td><span className="status-badge flagged">Frequent Infringements</span></td>
              </tr>
              <tr>
                <td><strong>Rule 6(1)(n)</strong></td>
                <td>Consumer Grievance Helpline & Email</td>
                <td>Verification of operational contact credentials</td>
                <td><span className="status-badge pending">Moderate Variations</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
