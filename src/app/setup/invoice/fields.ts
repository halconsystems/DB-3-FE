import { ProfileField, ProfileFormData } from '../../../components/forms/CommonEntityForm';

export const invoiceFields: ProfileField[] = [
  { name: 'invoiceNumber', label: 'Invoice Number', type: 'text', required: true, placeholder: 'Enter Invoice Number' },
  { name: 'tagId', label: 'Tag ID', type: 'text', required: true, placeholder: 'Enter Tag ID' },
  { name: 'entityType', label: 'Entity Type', type: 'text', required: true, placeholder: 'Enter Entity Type' },
  { name: 'entityId', label: 'Entity ID', type: 'text', required: true, placeholder: 'Enter Entity ID' },
  { name: 'amount', label: 'Amount', type: 'text', required: true, placeholder: 'Enter Amount' },
  { name: 'taxAmount', label: 'Tax Amount', type: 'text', required: true, placeholder: 'Enter Tax Amount' },
  { name: 'totalAmount', label: 'Total Amount', type: 'text', required: true, placeholder: 'Enter Total Amount' }
];

export const mockInvoiceData: ProfileFormData = {};
