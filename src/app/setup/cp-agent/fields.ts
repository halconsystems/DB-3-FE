import { ProfileField, ProfileFormData } from '../../../components/forms/CommonEntityForm';

export const cpAgentFields: ProfileField[] = [
  { name: 'cpAgentName'  as keyof ProfileFormData, label: 'Name', type: 'text', required: true, placeholder: 'Enter name' },
  { name: 'idNumber' as keyof ProfileFormData, label: 'Agent Number', type: 'text', required: true, placeholder: 'Enter agent number' },
  { name: 'zone' as keyof ProfileFormData, label: 'Zone', type: 'select', required: true, options: [] },
  { name: 'cpType' as keyof ProfileFormData, label: 'CP Agent Type', type: 'select', required: true, options: [
    { value: '0', label: 'Type 0' },
    { value: '1', label: 'Type 1' },
    { value: '2', label: 'Type 2' },
  ] },
  { name: 'controller' as keyof ProfileFormData, label: 'Controller ID', type: 'text', required: true, placeholder: 'Enter controller GUID' },
  { name: 'syncAgentId' as keyof ProfileFormData, label: 'Sync Agent ID', type: 'text', required: true, placeholder: 'Enter sync agent GUID' },
  { name: 'serverIp' as keyof ProfileFormData, label: 'Server IP', type: 'text', required: true, placeholder: 'Enter server IP' },
  { name: 'tagLimit' as keyof ProfileFormData, label: 'Tag Limit', type: 'text', required: true, placeholder: 'Enter tag limit' },
  { name: 'tagIdentityFix' as keyof ProfileFormData, label: 'Fixed Tag Identity', type: 'toggle', required: true, colSpan: 1, inputWidth: 28, inputHeight: 28 },
  { name: 'type' as keyof ProfileFormData, label: 'Temp Tag Identity', type: 'toggle', required: true, colSpan: 1, inputWidth: 28, inputHeight: 28 },
  { name: 'interCommId' as keyof ProfileFormData, label: 'Inter Comm ID', type: 'text', required: true, placeholder: 'Enter Inter Comm ID' },
  { name: 'interCommPassword' as keyof ProfileFormData, label: 'Inter Comm Password', type: 'text', required: true, placeholder: 'Enter Inter Comm Password' },
  { name: 'interCommName' as keyof ProfileFormData, label: 'Inter Comm Name', type: 'text', required: true, placeholder: 'Enter Inter Comm Name' },
  { name: 'status' as keyof ProfileFormData, label: 'CP/Agent Status', type: 'statusSwitch', required: false },
];

export const mockCpAgentData: ProfileFormData = {};
