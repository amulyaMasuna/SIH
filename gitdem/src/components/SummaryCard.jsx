import React from 'react';

const SummaryCard = ({ title, count, trend, icon: Icon, type, onClick, active }) => {
  return (
    <div
      className={`summary-card ${active ? 'summary-card-active' : ''}`}
      onClick={onClick}
      style={{
        outline: active ? '2px solid var(--color-gov-blue)' : 'none',
        cursor: onClick ? 'pointer' : 'default'
      }}
    >
      <div className={`summary-icon-box ${type}`}>
        <Icon size={24} />
      </div>
      <div className="summary-details">
        <h3>{title}</h3>
        <div className="summary-value">{count}</div>
        {trend && <div className="summary-trend">{trend}</div>}
      </div>
    </div>
  );
};

export default SummaryCard;
