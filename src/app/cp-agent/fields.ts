import { ProfileField, ProfileFormData } from '../../components/forms/CommonEntityForm';

export const cpAgentFields: ProfileField[] = [
  { name: 'cpAgentName', label: 'Name', type: 'text', required: true, placeholder: 'Enter name' },
  { name: 'idNumber', label: 'Agent Number', type: 'text', required: true, placeholder: 'Enter agent number' },
  { name: 'zone', label: 'Zone', type: 'select', required: true, options: [] },
  { name: 'cpType', label: 'CP Agent Type', type: 'select', required: true, options: [
    { value: '0', label: 'Type 0' },
    { value: '1', label: 'Type 1' },
    { value: '2', label: 'Type 2' },
  ] },
  { name: 'controller', label: 'Controller', type: 'select', required: true, options: [
    { value: 'controller-1', label: 'Controller 1' },
    { value: 'controller-2', label: 'Controller 2' },
    { value: 'controller-3', label: 'Controller 3' },
  ] },
  { name: 'serverIp', label: 'Server IP', type: 'text', required: true, placeholder: 'Enter server IP' },
  { name: 'tagLimit', label: 'Tag Limit', type: 'text', required: true, placeholder: 'Enter tag limit' },
  // Group tag identity checkboxes visually by using colSpan and larger input size
  { name: 'tagIdentityFix', label: 'Fixed Tag Identity', type: 'toggle', required: true, colSpan: 1, inputWidth: 28, inputHeight: 28 },
  { name: 'type', label: 'Temp Tag Identity', type: 'toggle', required: true, colSpan: 1, inputWidth: 28, inputHeight: 28 },
  { name: 'interCommId', label: 'Inter Comm ID', type: 'text', required: true, placeholder: 'Enter Inter Comm ID' },
  { name: 'interCommPassword', label: 'Inter Comm Password', type: 'text', required: true, placeholder: 'Enter Inter Comm Password' },
  { name: 'interCommName', label: 'Inter Comm Name', type: 'text', required: true, placeholder: 'Enter Inter Comm Name' },
];

export const mockCpAgentData: ProfileFormData = {};
