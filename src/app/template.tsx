'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Loader from '../components/ui/loader';

export default function AppTemplate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);

    const timer = window.setTimeout(() => {
      setIsLoading(false);
    }, 300);

    return () => {
      window.clearTimeout(timer);
    };
  }, [pathname]);

  if (isLoading) {
    return <Loader />;
  }

  return <>{children}</>;
}
