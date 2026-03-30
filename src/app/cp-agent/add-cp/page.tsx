'use client';
import React from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import CommonEntityForm, { ProfileFormData } from '../../../components/forms/CommonEntityForm';
import { cpAgentFields } from '../fields';
import { useZones } from '../../../hooks/zone/useZones';
import { useCreateCpAgent } from '../../../hooks/cp-agent/useCreateCpAgent';
import { useGetAllControllers } from '../../../hooks/controller/useGetAllControllers';
import { useGetAllSyncAgents } from '../../../hooks/agent/useGetAllSyncAgents';
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const isValidUuid = (value: string) => UUID_REGEX.test(value.trim());

export default function AddNewCpAgent() {
  const { mutateAsync: createCpAgent, isPending } = useCreateCpAgent();
  const [formError, setFormError] = React.useState('');
  const { data: zonesData, isLoading: isZonesLoading } = useZones();
  const { data: controllersData, isLoading: isControllersLoading } = useGetAllControllers();
  const { data: syncAgentsData, isLoading: isSyncAgentsLoading } = useGetAllSyncAgents();

  const fields = React.useMemo(() => {
    const zoneOptions = (zonesData?.data || []).map((zone) => ({ value: zone.id, label: zone.name }));
    const controllerOptions = (controllersData?.data || []).map((controller: any) => ({ value: controller.id, label: controller.name || controller.id }));
    const syncAgentOptions = (syncAgentsData?.data || []).map((agent: any) => ({ value: agent.id, label: agent.name || agent.id }));
    return cpAgentFields.map(f =>
      (String(f.name) === 'zone') ? { ...f, options: zoneOptions } : (String(f.name) === 'controller') ? { ...f, type: 'select' as const, options: controllerOptions } : (String(f.name) === 'syncAgentId') ? { ...f, type: 'select' as const, options: syncAgentOptions } : f
    );
  }, [zonesData, controllersData, syncAgentsData]);

  const handleSave = async (formData: ProfileFormData) => {
    setFormError('');

    const cpTypeValue = Number(formData.cpType ?? 0);
    const tagLimitValue = Number(formData.tagLimit ?? 0);

    if (!formData.cpAgentName || !formData.idNumber || !formData.zone || !formData.controller || !formData.syncAgentId) {
      throw new Error('Please fill all required CP Agent fields.');
    }

    if (Number.isNaN(cpTypeValue) || Number.isNaN(tagLimitValue)) {
      throw new Error('CP Type and Tag Limit must be valid numbers.');
    }

    if (!isValidUuid(formData.zone)) {
      throw new Error('Zone must be a valid GUID.');
    }

    if (!isValidUuid(formData.controller)) {
      throw new Error('Controller ID must be a valid GUID.');
    }

    if (!isValidUuid(formData.syncAgentId)) {
      throw new Error('Sync Agent ID must be a valid GUID.');
    }

    const payload = {
      name: formData.cpAgentName,
      agentNumber: formData.idNumber,
      zoneId: formData.zone,
      cpAgentType: cpTypeValue,
      controllerId: formData.controller,
      syncAgentId: formData.syncAgentId,
      serverIp: formData.serverIp || '',
      tagLimit: tagLimitValue,
      isFixedTagIdentity: !!formData.tagIdentityFix,
      isTempTagIdentity: !!formData.type,
      interCommId: formData.interCommId || '',
      interCommPassword: formData.interCommPassword || '',
      interCommName: formData.interCommName || '',
      isActive: formData.isActive ?? true,
    };
    console.log('CP Agent payload:', payload);
    try {
      await createCpAgent(payload);
    } catch (err: any) {
      const message = err?.response?.data?.errorMessage || err?.message || 'Failed to create CP Agent';
      setFormError(message);
      throw new Error(message);
    }
  };

  return (
    <DashboardLayout pageTitle="Add New CP Agent">
      <div style={{ margin: '0 auto' }}>
        {formError && <div style={{ color: 'red', marginBottom: 12 }}>{formError}</div>}
        <CommonEntityForm
          title="Please provide details below!"
          onSave={handleSave}
          onCancel={() => window.history.back()}
          fields={fields}
          loading={isZonesLoading || isPending || isControllersLoading || isSyncAgentsLoading}
        />
      </div>
    </DashboardLayout>
  );
}


