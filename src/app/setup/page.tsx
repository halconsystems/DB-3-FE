'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SetupPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the default zone tab
    const activeTab = localStorage.getItem('activeTab') || 'zone';
    router.push(`/setup/${activeTab}`);
  }, [router]);

  return null;
}