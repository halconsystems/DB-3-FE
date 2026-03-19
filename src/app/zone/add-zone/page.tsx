
'use client';
import React, { useState } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import CommonEntityForm, { ProfileFormData } from '../../../components/forms/CommonEntityForm';
import { zoneFields } from '../fields';
import { usePhaseOptions } from '../../../hooks/phase/usePhaseOptions';
import { useCreateZone } from '../../../hooks/zone/useCreateZone';


export default function AddNewZone() {
  const { mutateAsync: createZone, isPending } = useCreateZone();
  const [formError, setFormError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const { options: phaseOptions, isLoading: phasesLoading } = usePhaseOptions();

  // Set initial phase to first phase id if available
  const initialPhase = phaseOptions && phaseOptions.length > 0 && phaseOptions[0].value !== ''
    ? phaseOptions[0].value
    : '';

  // Clone and inject dynamic options into zoneFields
  const dynamicZoneFields = zoneFields.map((field) =>
    field.name === 'phase'
      ? { ...field, options: phaseOptions }
      : field
  );

  // Pass initialValues to CommonEntityForm
  const handleSave = async (formData: ProfileFormData) => {
    setFormError("");
    setSuccessMsg("");

    let fullName = '';
    if (typeof window !== 'undefined') {
      try {
        const userData = localStorage.getItem('user');
        const storedFullName = localStorage.getItem('fullName');
        if (userData) {
          const user = JSON.parse(userData);
          fullName = user?.fullName || user?.name || '';
        } else if (storedFullName) {
          fullName = storedFullName;
        }
      } catch {
        const storedFullName = localStorage.getItem('fullName');
        if (storedFullName) {
          fullName = storedFullName;
        }
      }
    }

    if (!fullName) {
      setFormError('User fullName not found. Please sign in again.');
      return;
    }

    const isActive = formData.isActive !== undefined ? formData.isActive : true;
    const phaseId =
      formData.phase && typeof formData.phase === 'object' && 'value' in formData.phase
        ? String((formData.phase as any).value || '')
        : typeof formData.phase === 'string'
          ? formData.phase
          : '';

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';
      if (!token) {
        setFormError("No auth token found. Please sign in.");
        return;
      }
      await createZone({
        name: formData.zoneName || '',
        createdBy: fullName,
        phaseId,
        created: new Date().toISOString(),
        isDeleted: !isActive,
        isActive,
      });
      setSuccessMsg("Zone created successfully!");
    } catch (err: any) {
      setFormError(err?.response?.data?.errorMessage || err?.message || "Failed to create zone");
    }
  };

  return (
    <DashboardLayout pageTitle="Add New Zone">
      <div style={{ margin: '0 auto' }}>
        {formError && <div style={{ color: 'red', marginBottom: 12 }}>{formError}</div>}
        {successMsg && <div style={{ color: 'green', marginBottom: 12 }}>{successMsg}</div>}
        <CommonEntityForm
          title="Please provide details below!"
          onSave={handleSave}
          onCancel={() => window.history.back()}
          fields={dynamicZoneFields}
          loading={isPending || phasesLoading}
          saveButtonText={isPending ? 'Saving...' : 'Add'}
          initialValues={{ phase: initialPhase }}
        />
      </div>
    </DashboardLayout>
  );
}


