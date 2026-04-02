import { useQuery } from '@tanstack/react-query';
import { getAllDevices } from '../../services/device.service';
import type { GetAllDevicesResponse } from '../../services/device.service';

export const useDevices = () => {
  return useQuery<GetAllDevicesResponse>({
    queryKey: ['devices'],
    queryFn: getAllDevices,
    staleTime: 5 * 60 * 1000,
  });
};
