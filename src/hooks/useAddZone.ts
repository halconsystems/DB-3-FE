import { useCreateZone } from './useCreateZone';
import { CreateZoneRequest } from '../services/zone.service';
export const useAddZone = () => {
  const createZoneMutation = useCreateZone();
  const addZone = async (formData: any, token: string) => {
    let fullName = '';
    if (typeof window !== 'undefined') {
      try {
        const userData = localStorage.getItem('user');
        const storedFullName = localStorage.getItem('fullName');
        if (userData) {
          const user = JSON.parse(userData);
          if (user.fullName) {
            fullName = user.fullName;
          } else if (user.name) {
            fullName = user.name;
          }
        } else if (storedFullName) {
          fullName = storedFullName;
        }
      } catch {
        const storedFullName = localStorage.getItem('fullName');
        if (storedFullName) fullName = storedFullName;
      }
    }
    if (!fullName) {
      throw new Error('User fullName not found. Please sign in again.');
    }
    const isActive = formData.isActive !== undefined ? formData.isActive : true;
    let phaseId = '';
    if (formData.phase && typeof formData.phase === 'object' && formData.phase.value) {
      phaseId = formData.phase.value;
    } else if (typeof formData.phase === 'string') {
      phaseId = formData.phase;
    }
    const zoneData: CreateZoneRequest = {
      name: formData.zoneName || '',
      createdBy: fullName,
      phaseId,
      created: new Date().toISOString(),
      isDeleted: !isActive, 
      isActive,
    };
    return createZoneMutation.mutateAsync(zoneData);
  };
  return { ...createZoneMutation, addZone };
}
