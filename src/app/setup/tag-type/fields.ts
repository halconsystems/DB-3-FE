import { ProfileField } from '../../../components/forms/CommonEntityForm';

export const tagTypeFields: ProfileField[] = [
  {
    name: 'tagTypeName',
    label: 'Tag Type Name',
    type: 'text',
    required: true,
    placeholder: 'e.g., Residential',
    readOnly: false,
  },
  {
    name: 'description',
    label: 'Description',
    type: 'text',
    required: false,
    placeholder: 'Enter description',
    readOnly: false,
  },
  {
    name: 'status',
    label: 'Status',
    type: 'statusSwitch',
    required: false,
    readOnly: false,
  },
];

export const mockTagTypeData = {
  id: '',
  tagTypeName: '',
  description: '',
  status: 'Active',
};
