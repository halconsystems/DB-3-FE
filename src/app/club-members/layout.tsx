import { ReactNode } from 'react';
import { ClubMembersProvider } from './ClubMembersContext';

export default function ClubMembersLayout({ children }: { children: ReactNode }) {
  return <ClubMembersProvider>{children}</ClubMembersProvider>;
}
