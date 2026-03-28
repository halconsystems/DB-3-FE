'use client';
import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import CommonEntityForm, { ProfileField, ProfileFormData } from '../../../components/forms/CommonEntityForm';
import { clearTableRow, getTableRow } from '../../../lib/tableRowStorage';


const cpAgentFields: ProfileField[] = [
  { name: 'cpAgentName' as keyof ProfileFormData, label: 'CP/Agent Name', type: 'text', required: true, placeholder: 'CP/Agent Name here' },
  { name: 'idNumber' as keyof ProfileFormData, label: 'No. ID', type: 'text', required: true, placeholder: 'Type here' },
  { name: 'serverIp' as keyof ProfileFormData, label: 'Server IP', type: 'text', required: true, placeholder: 'Server IP here' },
  { name: 'controller' as keyof ProfileFormData, label: 'Controller', type: 'select', required: true, options: [ { value: '', label: 'Select Controller here' } ] },
  { name: 'cpType' as keyof ProfileFormData, label: 'CP Type', type: 'select', required: true, options: [ { value: '', label: 'Select CP Type here' } ] },
  { name: 'zone' as keyof ProfileFormData, label: 'Zone', type: 'select', required: true, options: [ { value: '', label: 'Select Zone here' } ] },
  { name: 'tagLimit' as keyof ProfileFormData, label: 'Tag Limit', type: 'text', required: true, placeholder: 'Enter Tag Limit here' },
  { name: 'tagIdentityFix' as keyof ProfileFormData, label: 'Tag Identity Fix.', type: 'text', required: true, placeholder: 'Enter here' },
  { name: 'addPrinter' as keyof ProfileFormData, label: 'Add Printer', type: 'text', required: true, placeholder: 'Add Printer here' },
  { name: 'printType' as keyof ProfileFormData, label: 'Print Type', type: 'select', required: true, options: [ { value: '', label: 'Select Print Type here' } ] },
  { name: 'interCommId' as keyof ProfileFormData, label: 'Inter Comm ID', type: 'text', required: true, placeholder: 'Enter here' },
  { name: 'interCommPassword' as keyof ProfileFormData, label: 'Inter Comm Password', type: 'text', required: true, placeholder: 'Enter here' },
  { name: 'interCommName' as keyof ProfileFormData, label: 'Inter Comm Name', type: 'text', required: true, placeholder: 'Enter here' },
  { name: 'laneType' as keyof ProfileFormData, label: 'Lane Type', type: 'select', required: true, options: [ { value: '', label: 'Select here' } ] },
  { name: 'type' as keyof ProfileFormData, label: 'Type', type: 'select', required: true, options: [ { value: '', label: 'Select here' } ] },
  { name: 'laneReader' as keyof ProfileFormData, label: 'Lane Reader', type: 'select', required: true, options: [ { value: '', label: 'Select here' } ] },
  { name: 'readerSno' as keyof ProfileFormData, label: 'Reader S.No / IMEI', type: 'text', required: true, placeholder: 'Enter here' },
  { name: 'manufacturer' as keyof ProfileFormData, label: 'Manufacturer', type: 'text', required: true, placeholder: 'Enter here' },
  { name: 'timeOut' as keyof ProfileFormData, label: 'Time Out', type: 'text', required: true, placeholder: 'Enter here' },
];


const mockCpAgentData: ProfileFormData = {
  cpAgentName: 'Main Gate Agent',
  idNumber: 'CP-001',
  serverIp: '192.168.1.10',
  controller: '',
  cpType: '',
  zone: '',
  tagLimit: '100',
  tagIdentityFix: 'Fixed',
  addPrinter: 'HP LaserJet',
  printType: '',
  interCommId: 'IC-123',
  interCommPassword: 'pass123',
  interCommName: 'Main Intercom',
  laneType: '',
  type: '',
  laneReader: '',
  readerSno: '123456789',
  manufacturer: 'XYZ Corp',
  timeOut: '30',
};

export default function EditCpAgent() {
  const [initialValues, setInitialValues] = useState<ProfileFormData | null>(null);

  useEffect(() => {
    const selected = getTableRow<ProfileFormData>('cp-agent');
    setInitialValues({ ...mockCpAgentData, ...(selected ?? {}) });
    clearTableRow('cp-agent');
  }, []);

  const handleUpdate = (data: ProfileFormData) => {
    
    console.log('Updated:', data);
  };

  return (
    <DashboardLayout pageTitle="Edit CP Agent">
      <div style={{ margin: '0 auto' }}>
        {initialValues && (
          <CommonEntityForm
            title="Please update details below!"
            onSave={handleUpdate}
            onCancel={() => window.history.back()}
            saveButtonText='Edit'
            fields={cpAgentFields}
            initialValues={initialValues}
          />
        )}
      </div>
    </DashboardLayout>
  );
}



