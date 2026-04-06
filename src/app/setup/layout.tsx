import { ReactNode } from 'react';
import { SetupProvider } from './SetupContext';

export default function SetupLayout({ children }: { children: ReactNode }) {
  return <SetupProvider>{children}</SetupProvider>;
}
