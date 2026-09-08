import React from 'react';
import { Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';

const StatusBadge = ({ status, text }) => {
  const normalized = (status || '').toLowerCase();

  if (normalized.includes('flag')) {
    return (
      <span className="status-badge flagged">
        <AlertTriangle size={13} className="text-red-600" />
        <span>{text || 'Flagged'}</span>
      </span>
    );
  }

  if (normalized.includes('verif') || normalized.includes('discharg')) {
    return (
      <span className="status-badge verified">
        <CheckCircle2 size={13} className="text-emerald-600" />
        <span>{text || 'Verified / Discharged'}</span>
      </span>
    );
  }

  return (
    <span className="status-badge pending">
      <Clock size={13} className="text-amber-600" />
      <span>{text || 'Pending'}</span>
    </span>
  );
};

export default StatusBadge;
