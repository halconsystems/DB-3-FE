import { Tab } from '@/components/tables/DataTable';

/** Tab row with exact `SubCategory` for `GET /user/GetAllUser?Category=Member&SubCategory=…`. */
export type ClubMembersTab = Tab & { subCategory: string };

export const CLUB_MEMBERS_TABS: ClubMembersTab[] = [
  { key: 'golf-club', label: 'Golf club', subCategory: 'Golf Club' },
  { key: 'creek-club', label: 'Creek club', subCategory: 'Creek Club' },
  { key: 'beach-view-club', label: 'Beach view Club', subCategory: 'Beach View Club' },
  { key: 'marina-club', label: 'Marina club', subCategory: 'Marina Club' },
  { key: 'sunset-club', label: 'Sunset club', subCategory: 'Sunset Club' },
  { key: 'da-club', label: 'DA club', subCategory: 'DA Club' },
  { key: 'zamzama-club', label: 'Zamzama club', subCategory: 'Zamzama Club' },
  { key: 'da-sports-club', label: 'DA sports Club', subCategory: 'DA Sports Club' },
];

export function getClubMembersSubCategory(tabKey: string): string {
  return CLUB_MEMBERS_TABS.find((t) => t.key === tabKey)?.subCategory ?? '';
}
