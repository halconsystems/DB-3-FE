import { ProfileField } from '../../../../types';

export const tagTypeFields: ProfileField[] = [
  {
    name: 'tagTypeName',
    label: 'Tag Type Name',
    type: 'text',
    required: true,
    placeholder: 'e.g., Residential',
    disabled: false,
    readOnly: false,
  },
  {
    name: 'description',
    label: 'Description',
    type: 'textarea',
    required: false,
    placeholder: 'Enter description',
    disabled: false,
    readOnly: false,
  },
  {
    name: 'status',
    label: 'Status',
    type: 'select',
    required: true,
    options: [
      { value: 'Active', label: 'Active' },
      { value: 'Inactive', label: 'Inactive' },
    ],
    placeholder: 'Select status',
    disabled: false,
    readOnly: false,
  },
];

export const mockTagTypeData = {
  id: '',
  tagTypeName: '',
  description: '',
  status: 'Active',
};
