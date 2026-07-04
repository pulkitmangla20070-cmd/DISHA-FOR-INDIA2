import React from 'react';
import PropTypes from 'prop-types';

const DashboardCard = ({ icon, label, value, note, color = '#D35400', bg = '#FFF3ED', onClick }) => {
  return (
    <div
      onClick={onClick}
      style={{
        background: 'white',
        borderRadius: 16,
        padding: '1.25rem 1.5rem',
        border: '1px solid #F0EDE8',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.25s',
        boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,0,0,0.08)';
        e.currentTarget.style.transform = 'translateY(-3px)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)';
        e.currentTarget.style.transform = 'none';
      }}
    >
      <div style={{
        width: 44,
        height: 44,
        borderRadius: 12,
        background: bg,
        color: color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: '0.72rem', color: 'var(--color-body)', fontWeight: 600, marginBottom: '0.2rem' }}>
          {label}
        </div>
        <div style={{
          fontSize: '1.6rem',
          fontFamily: 'var(--font-heading)',
          fontWeight: 800,
          color: 'var(--color-heading)',
          lineHeight: 1,
          marginBottom: '0.15rem',
        }}>
          {value}
        </div>
        {note && (
          <div style={{ fontSize: '0.7rem', color: color, fontWeight: 700 }}>
            {note}
          </div>
        )}
      </div>
    </div>
  );
};

DashboardCard.propTypes = {
  icon: PropTypes.node.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  note: PropTypes.string,
  color: PropTypes.string,
  bg: PropTypes.string,
  onClick: PropTypes.func,
};

export default DashboardCard;