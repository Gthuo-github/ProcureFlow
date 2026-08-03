'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar'

export default function ConditionalNavbar() {
  const pathname = usePathname();

  // Hide the main navbar on all dashboard routes
  if (pathname?.startsWith('/dashboard')) return null;

  return <Navbar />;
}
