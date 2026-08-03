'use client'

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getOrderStats, getOrders, getUsers, getProducts, Order, AppUser } from '@/lib/api';
import { StatCard, SectionHeader, TableCard, Th, Td, StatusBadge } from './ui';

const ROLE_BADGE: Record<string, { bg: string; color: string }> = {
  admin:    { bg: '#FEF2F2', color: '#991B1B' },
  supplier: { bg: '#FFFBEB', color: '#854D0E' },
  customer: { bg: '#EFF6FF', color: '#1D4ED8' },
};

function OperationsPulse() {
  return (
    <section className="operations-pulse" style={{
      marginBottom: '2rem', padding: '20px 22px', borderRadius: 14,
      background: 'linear-gradient(120deg, #0C2450, #155FD7)', color: 'white',
      display: 'grid', gridTemplateColumns: 'minmax(220px, .8fr) minmax(300px, 1.2fr)', gap: 20,
      overflow: 'hidden', position: 'relative',
    }}>
      <div style={{ position: 'relative', zIndex: 1 }}>
        <p style={{ color: '#B7D0FF', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.08em' }}>Operations pulse</p>
        <h2 style={{ fontSize: 22, lineHeight: 1.2, letterSpacing: '-.03em', margin: '8px 0' }}>Procurement activity is moving.</h2>
        <p style={{ fontSize: 13, color: '#D7E5FF', lineHeight: 1.6 }}>Order approvals are up 18% this month, with the strongest momentum in office equipment.</p>
        <Link href="/dashboard/orders" style={{ display: 'inline-flex', gap: 6, alignItems: 'center', marginTop: 16, padding: '8px 12px', borderRadius: 7, background: 'white', color: '#124BAE', fontSize: 12, fontWeight: 700 }}>
          Explore activity <i className="ti ti-arrow-up-right" aria-hidden="true" />
        </Link>
      </div>
      <div style={{ minHeight: 150, position: 'relative', zIndex: 1, alignSelf: 'end' }}>
        <svg viewBox="0 0 342 126" width="100%" height="156" role="img" aria-label="Monthly procurement activity trend">
          {[24, 54, 84, 114].map(y => <line key={y} x1="0" x2="342" y1={y} y2={y} stroke="rgba(255,255,255,.15)" strokeWidth="1" />)}
          <polyline points="0,108 38,98 76,103 114,78 152,85 190,54 228,67 266,35 304,42 342,18" fill="none" stroke="#96CAFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="342" cy="18" r="5" fill="white" /><circle cx="342" cy="18" r="9" fill="rgba(255,255,255,.2)" />
        </svg>
        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#B7D0FF', fontSize: 11, marginTop: -7 }}><span>Jan</span><span>Mar</span><span>May</span><span>Jul</span><span>Today</span></div>
      </div>
      <div style={{ position: 'absolute', width: 240, height: 240, borderRadius: '50%', right: -80, top: -130, background: 'rgba(104,175,255,.17)' }} />
      <style>{`@media (max-width: 720px) { .operations-pulse { grid-template-columns: 1fr !important; } }`}</style>
    </section>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<{ total: number; pending: number; active: number; completed: number; cancelled: number } | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<AppUser[]>([]);
  const [productsCount, setProductsCount] = useState<number | null>(null);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [statsData, ordersData, usersData, productsData] = await Promise.all([
          getOrderStats(),
          getOrders(),
          getUsers(),
          getProducts(),
        ]);

        setStats(statsData);
        setOrders(ordersData.slice(0, 5));
        setUsers(usersData.slice(0, 5));
        setProductsCount(productsData.length);
      } catch (error) {
        console.error('Admin dashboard load error', error);
      }
    }
    loadDashboard();
  }, []);

  const statItems = [
    { label: 'Total orders',   value: stats ? stats.total : '—', icon: 'ti-clipboard-list',  trend: { value: '4%', up: true }, color: '#1A56DB', bg: '#EBF1FD' },
    { label: 'Active orders',  value: stats ? stats.active : '—', icon: 'ti-repeat',        trend: { value: '2%', up: true }, color: '#059669', bg: '#ECFDF5' },
    { label: 'Total users',    value: users.length,                icon: 'ti-users',          trend: { value: '8%', up: true }, color: '#7C3AED', bg: '#F5F3FF' },
    { label: 'Products listed',value: productsCount ?? '—',       icon: 'ti-box',            trend: { value: '5%', up: true }, color: '#D97706', bg: '#FFFBEB' },
  ];

  return (
    <div>
      {/* Greeting */}
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{
          fontSize: 22, fontWeight: 600, color: 'var(--ink)',
          letterSpacing: '-0.02em', marginBottom: 4,
        }}>
          Admin overview
        </h1>
        <p style={{ fontSize: 14, color: 'var(--mist)' }}>
          Here's what's happening across ProcureFlow today.
        </p>
      </div>

      {/* Stat cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 16, marginBottom: '2rem',
      }}>
        {statItems.map(item => <StatCard key={item.label} {...item} />)}
      </div>

      <OperationsPulse />

      {/* Two-column section */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: 20, marginBottom: '2rem',
      }}>

        {/* Recent orders */}
        <div>
          <SectionHeader
            title="Recent orders"
            subtitle="Last 5 orders across all customers"
            action={
              <Link href="/dashboard/orders" style={{
                fontSize: 13, color: 'var(--brand)',
                display: 'flex', alignItems: 'center', gap: 4,
              }}>
                View all <i className="ti ti-arrow-right" style={{ fontSize: 13 }} aria-hidden="true" />
              </Link>
            }
          />
          <TableCard>
            <thead>
              <tr>
                <Th>Order</Th>
                <Th>Product</Th>
                <Th>Amount</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id} style={{ transition: 'background .1s' }}
                  onMouseOver={e => (e.currentTarget.style.background = 'var(--surface)')}
                  onMouseOut={e  => (e.currentTarget.style.background = 'transparent')}>
                  <Td><span style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>{order.id}</span></Td>
                  <Td>{order.product_name}</Td>
                  <Td>KSh {Number(order.total_price ?? 0).toLocaleString()}</Td>
                  <Td><StatusBadge status={order.status_display || order.status} /></Td>
                </tr>
              ))}
            </tbody>
          </TableCard>
        </div>

        {/* Recent users */}
        <div>
          <SectionHeader
            title="New users"
            subtitle="Recently registered accounts"
            action={
              <Link href="/dashboard/users" style={{
                fontSize: 13, color: 'var(--brand)',
                display: 'flex', alignItems: 'center', gap: 4,
              }}>
                View all <i className="ti ti-arrow-right" style={{ fontSize: 13 }} aria-hidden="true" />
              </Link>
            }
          />
          <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
            {users.map((u, i) => {
              const rb = ROLE_BADGE[u.role] || ROLE_BADGE.customer;
              return (
                <div key={u.email} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '12px 16px',
                  borderBottom: i < users.length - 1 ? '1px solid var(--border)' : 'none',
                }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%',
                    background: 'var(--brand-pale)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 13, fontWeight: 600, color: 'var(--brand)', flexShrink: 0,
                  }}>
                    {u.first_name[0]}{u.last_name[0]}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink)', marginBottom: 1 }}>{u.first_name} {u.last_name}</p>
                    <p style={{ fontSize: 12, color: 'var(--mist)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.email}</p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
                    <span style={{
                      padding: '2px 8px', borderRadius: 100, fontSize: 11, fontWeight: 500,
                      background: rb.bg, color: rb.color, textTransform: 'capitalize',
                    }}>{u.role}</span>
                    <span style={{ fontSize: 11, color: 'var(--mist)' }}>{new Date(u.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <SectionHeader title="Quick actions" />
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: 12,
      }}>
        {[
          { href: '/dashboard/products', icon: 'ti-plus',      label: 'Add product',   color: '#1A56DB', bg: '#EBF1FD' },
          { href: '/dashboard/users',    icon: 'ti-user-plus', label: 'Add user',      color: '#7C3AED', bg: '#F5F3FF' },
          { href: '/dashboard/invoices', icon: 'ti-receipt',   label: 'New invoice',   color: '#059669', bg: '#ECFDF5' },
          { href: '/dashboard/suppliers',icon: 'ti-truck',     label: 'Add supplier',  color: '#D97706', bg: '#FFFBEB' },
        ].map(a => (
          <Link key={a.href} href={a.href} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '14px 16px', borderRadius: 10,
            background: 'white', border: '1px solid var(--border)',
            fontSize: 14, fontWeight: 500, color: 'var(--ink)',
            transition: 'all 0.15s',
          }}
            onMouseOver={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = a.color; el.style.background = a.bg; }}
            onMouseOut={e  => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--border)'; el.style.background = 'white'; }}
          >
            <span style={{
              width: 32, height: 32, borderRadius: 8,
              background: a.bg, color: a.color,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <i className={`ti ${a.icon}`} style={{ fontSize: 17 }} aria-hidden="true" />
            </span>
            {a.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
