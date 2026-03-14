import { useCreateZone } from '../../../hooks/useCreateZone';
import { CreateZoneRequest } from '../../../services/zone.service';

export const useAddZone = () => {
  const createZoneMutation = useCreateZone();

  const addZone = async (formData: any, token: string) => {
    const zoneData: CreateZoneRequest = {
      name: formData.zoneName || '',
      createdBy: 'me', // Replace with actual user if available
      phaseId: formData.phase || '',
      created: new Date().toISOString(),
      isDeleted: false,
      isActive: formData.isActive !== undefined ? formData.isActive : true,
    };
    return createZoneMutation.mutateAsync({ data: zoneData, token });
  };

  return { ...createZoneMutation, addZone };
};
