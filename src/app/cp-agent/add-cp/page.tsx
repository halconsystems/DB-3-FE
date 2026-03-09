
'use client';
import React from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import ProfileForm, { ProfileField, ProfileFormData } from '../../../components/forms/ProfileForm';

// Fields for Add New CP/Agent matching the screenshot order
const cpAgentFields: ProfileField[] = [
  { name: 'cpAgentName', label: 'CP/Agent Name', type: 'text', required: true, placeholder: 'CP/Agent Name here' },
  { name: 'idNumber', label: 'No. ID', type: 'text', required: true, placeholder: 'Type here' },
  { name: 'serverIp', label: 'Server IP', type: 'text', required: true, placeholder: 'Server IP here' },
  { name: 'controller', label: 'Controller', type: 'select', required: true, options: [ { value: '', label: 'Select Controller here' } ] },
  { name: 'cpType', label: 'CP Type', type: 'select', required: true, options: [ { value: '', label: 'Select CP Type here' } ] },
  { name: 'zone', label: 'Zone', type: 'select', required: true, options: [ { value: '', label: 'Select Zone here' } ] },
  { name: 'tagLimit', label: 'Tag Limit', type: 'text', required: true, placeholder: 'Enter Tag Limit here' },
  { name: 'tagIdentityFix', label: 'Tag Identity Fix.', type: 'text', required: true, placeholder: 'Enter here' },
  { name: 'addPrinter', label: 'Add Printer', type: 'text', required: true, placeholder: 'Add Printer here' },
  { name: 'printType', label: 'Print Type', type: 'select', required: true, options: [ { value: '', label: 'Select Print Type here' } ] },
  { name: 'interCommId', label: 'Inter Comm ID', type: 'text', required: true, placeholder: 'Enter here' },
  { name: 'interCommPassword', label: 'Inter Comm Password', type: 'text', required: true, placeholder: 'Enter here' },
  { name: 'interCommName', label: 'Inter Comm Name', type: 'text', required: true, placeholder: 'Enter here' },
  { name: 'laneType', label: 'Lane Type', type: 'select', required: true, options: [ { value: '', label: 'Select here' } ] },
  { name: 'type', label: 'Type', type: 'select', required: true, options: [ { value: '', label: 'Select here' } ] },
  { name: 'laneReader', label: 'Lane Reader', type: 'select', required: true, options: [ { value: '', label: 'Select here' } ] },
  { name: 'readerSno', label: 'Reader S.No / IMEI', type: 'text', required: true, placeholder: 'Enter here' },
  { name: 'manufacturer', label: 'Manufacturer', type: 'text', required: true, placeholder: 'Enter here' },
  { name: 'timeOut', label: 'Time Out', type: 'text', required: true, placeholder: 'Enter here' },
];



export default function AddNewCpAgent() {
  const handleSave = (data: ProfileFormData) => {
    
    console.log('Saved:', data);
  };

  return (
    <DashboardLayout pageTitle="Add New CP Agent">
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        {}
        <ProfileForm
          title="Please provide details below!"
          onSave={handleSave}
          onCancel={() => window.history.back()}
          fields={cpAgentFields}
        />
      </div>
    </DashboardLayout>
  );
}
