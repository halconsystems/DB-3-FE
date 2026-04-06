import { ProfileField } from '../../../components/forms/CommonEntityForm';

export const tagApprovalFields: ProfileField[] = [
  {
    name: 'tagNumber',
    label: 'Tag Number',
    type: 'text',
    required: true,
    placeholder: 'e.g., TAG-001',
    readOnly: false,
  },
  {
    name: 'requestedBy',
    label: 'Requested By',
    type: 'text',
    required: true,
    placeholder: 'Enter name',
    readOnly: false,
  },
  {
    name: 'requestDate',
    label: 'Request Date',
    type: 'date',
    required: true,
    placeholder: 'Select date',
    readOnly: false,
  },
  {
    name: 'status',
    label: 'Approval Status',
    type: 'select',
    required: true,
    options: [
      { value: 'Pending', label: 'Pending' },
      { value: 'Approved', label: 'Approved' },
      { value: 'Rejected', label: 'Rejected' },
    ],
    placeholder: 'Select status',
    readOnly: false,
  },
];

export const mockTagApprovalData = {
  id: '',
  tagNumber: '',
  requestedBy: '',
  requestDate: new Date().toISOString().split('T')[0],
  status: 'Pending',
};
