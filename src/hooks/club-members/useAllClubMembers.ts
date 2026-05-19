// hooks/club-members/useAllClubMembers.ts

import { useQuery } from '@tanstack/react-query';
import { getAllClubMembers } from '@/services/clubmember.service';

export const useAllClubMembers = () => {
  return useQuery({
    queryKey: ['all-club-members'],
    queryFn: getAllClubMembers,
  });
};