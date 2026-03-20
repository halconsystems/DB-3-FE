'use client';

interface AddNewButtonProps {
  onClick: () => void;
  label?: string;
}
export const AddNewButton = ({ onClick, label = 'Add New' }: AddNewButtonProps) => (
  <button
    onClick={onClick}
    style={{
      background: '#30B33D',
      color: 'white',
      border: 'none',
      width: '147px',
      height: '35px',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: 500,
      cursor: 'pointer',
      boxShadow: "4px 4px 12px 0px #BBC3CE9, -4px -4px 12px 0px #FDFFFFCC"
    }}
    onMouseEnter={(e) => (e.currentTarget.style.background = '#00df1a')}
    onMouseLeave={(e) => (e.currentTarget.style.background = '#30B33D')}
  >
    {label}
  </button>
);