'use client';
import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import CommonEntityForm, { ProfileField, ProfileFormData } from '../../../components/forms/CommonEntityForm';
import { clearTableRow, getTableRow } from '../../../lib/tableRowStorage';
import { cpAgentFields } from '../fields';
import { useZones } from '../../../hooks/zone/useZones';
import { useGetAllControllers } from '../../../hooks/controller/useGetAllControllers';
import { useGetAllSyncAgents } from '../../../hooks/agent/useGetAllSyncAgents';

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
  const { data: zonesData } = useZones();
  const { data: controllersData } = useGetAllControllers();
  const { data: syncAgentsData } = useGetAllSyncAgents();

  const fields = React.useMemo(() => {
    const zoneOptions = (zonesData?.data || []).map((zone) => ({ value: zone.id, label: zone.name }));
    const controllerOptions = (controllersData?.data || []).map((controller: any) => ({ value: controller.id, label: controller.name || controller.id }));
    const syncAgentOptions = (syncAgentsData?.data || []).map((agent: any) => ({ value: agent.id, label: agent.name || agent.id }));
    return cpAgentFields.map(f => {
      if (String(f.name) === 'zone') return { ...f, options: zoneOptions };
      if (String(f.name) === 'controller') return { ...f, type: 'select' as const, options: controllerOptions };
      if (String(f.name) === 'syncAgentId') return { ...f, type: 'select' as const, options: syncAgentOptions };
      return f;
    });
  }, [zonesData, controllersData, syncAgentsData]);

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
            title="Edit CP Agent"
            onSave={handleUpdate}
            onCancel={() => window.history.back()}
            saveButtonText='Edit'
            fields={fields}
            initialValues={initialValues || {}}
          />
        )}
      </div>
    </DashboardLayout>
  );
}



