import { useQuery } from '@tanstack/react-query';
import { getEnumMetadata, EnumMetadata } from '../../services/metadata.service';

export const useEnumMetadata = (enumName?: string) => {
  return useQuery<EnumMetadata | null, Error>({
    queryKey: ['enumMetadata', enumName],
    queryFn: async () => {
      const response = await getEnumMetadata();
      
      // If enumName is provided, return only that specific enum
      if (enumName) {
        return response.data.enums.find((e) => e.name === enumName) || null;
      }
      
      // If no enumName, return null (use useAllEnumMetadata instead for all enums)
      return null;
    },
  });
};

// Hook to get all enums at once
export const useAllEnumMetadata = () => {
  return useQuery<EnumMetadata[], Error>({
    queryKey: ['allEnumMetadata'],
    queryFn: async () => {
      const response = await getEnumMetadata();
      return response.data.enums;
    },
  });
};
