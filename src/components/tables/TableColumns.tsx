import React from 'react';
import { StatusBadge } from './DataTable';
import { ActionIcon } from '../ui/ActionButton';


export const statusColumn = {
  key: 'status',
  header: 'Status',
  render: (value: 'Active' | 'Inactive' | 'Pending') => <StatusBadge status={value} />,
};


export const actionColumn = (onEdit?: (row: any) => void, onDelete?: (row: any) => void) => ({
  key: 'action',
  header: 'Action',
  render: (_: any, row: any) => (
    <div style={{ display: 'flex', gap: '4px' }}>
      {onEdit && <ActionIcon onClick={() => onEdit(row)} />}
      {onDelete && (
        <button
          onClick={() => onDelete(row)}
          style={{
            width: 32,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
          }}
        >
          <img src="/icons/delete Button.png" alt="Delete" style={{ width: 18, height: 18, objectFit: 'contain' }} />
        </button>
      )}
    </div>
  ),
});
