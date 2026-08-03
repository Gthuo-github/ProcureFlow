'use client';

import { useAuth } from '@/hooks/useAuth';
import AdminDashboard    from './components/AdminDashboard';
import CustomerDashboard from './components/CustomerDashboard';
import SupplierDashboard from './components/SupplierDashboard';

export default function DashboardPage() {
  const { user } = useAuth();

  if (user?.role === 'admin')    return <AdminDashboard />;
  if (user?.role === 'supplier') return <SupplierDashboard />;
  return <CustomerDashboard />;
}
