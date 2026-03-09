import React from 'react';

interface HostDetailsModalProps {
  open: boolean;
  onClose: () => void;
  host: {
    id: string;
    name: string;
    phone: string;
    address: string;
    imageUrl?: string;
  };
}

const HostDetailsModal: React.FC<HostDetailsModalProps> = ({ open, onClose, host }) => {
  if (!open) return null;
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0,0,0,0.15)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 16,
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
        width: 363,
        height: 415,
        maxWidth: '90vw',
        padding: 32,
        position: 'relative',
        textAlign: 'center',
        boxSizing: 'border-box',
        overflow: 'hidden'
      }}>
        <button onClick={onClose} style={{
          position: 'absolute',
          top: 16,
          right: 16,
          background: '#F3F6F9',
          border: 'none',
          borderRadius: '50%',
          width: 32,
          height: 32,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
        }}>
          <span style={{ color: '#27AE60', fontSize: 24, fontWeight: 'bold' }}>×</span>
        </button>
        <h2 style={{ fontWeight: 700, fontSize: 24, marginBottom: 24 }}>Host Details</h2>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 16 }}>
          <div style={{
            width: 100,
            height: 100,
            borderRadius: '50%',
            background: 'linear-gradient(180deg, #F3F6F9 0%, #fff 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            marginBottom: 12
          }}>
            <img
              src={'/icons/host.png'}
              alt="Host"
              style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover' }}
            />
          </div>
        </div>
        <hr style={{ border: 'none', borderTop: '1px solid #E5E7EB', margin: '0 0 18px 0' }} />
        <div style={{ textAlign: 'left', margin: '0 auto', maxWidth: 300 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ color: '#888', fontWeight: 400, fontSize: 15 }}>ID</span>
            <span style={{ fontWeight: 500, fontSize: 15 }}>{host.id}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ color: '#888', fontWeight: 400, fontSize: 15 }}>Name</span>
            <span style={{ fontWeight: 700, fontSize: 15 }}>{host.name}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ color: '#888', fontWeight: 400, fontSize: 15 }}>Phone Number</span>
            <span style={{ fontWeight: 500, fontSize: 15 }}>{host.phone}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 18 }}>
            <span style={{ color: '#888', fontWeight: 400, fontSize: 15 }}>Address</span>
            <span style={{ fontWeight: 500, fontSize: 15 }}>{host.address}</span>
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            marginTop: 16,
            width: 215,
            height: 35,
            background: '#30B33D',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            fontWeight: 600,
            fontSize: 16,
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(48,179,61,0.08)',
            display: 'block',
            marginLeft: 'auto',
            marginRight: 'auto',
            padding: 0
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default HostDetailsModal;
