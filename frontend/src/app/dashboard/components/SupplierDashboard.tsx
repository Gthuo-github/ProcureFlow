'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { StatCard, SectionHeader, TableCard, Th, Td, StatusBadge, EmptyState } from './ui';

const ORDERS = [
  { id: 'ORD-002', customer: 'Alice Kamau',  product: 'Ergonomic Chair',  date: '24 Jun 2026', amount: 'KSh 18,500', status: 'Pending'   },
  { id: 'ORD-006', customer: 'David Kiprop', product: 'Standing Desk',    date: '23 Jun 2026', amount: 'KSh 32,000', status: 'Active'    },
  { id: 'ORD-009', customer: 'Eva Wanjiru',  product: 'Filing Cabinet',   date: '20 Jun 2026', amount: 'KSh 12,400', status: 'Completed' },
];

const PRODUCTS = [
  { name: 'Ergonomic Chair',  category: 'Furniture', price: 'KSh 18,500', stock: 12  },
  { name: 'Standing Desk',    category: 'Furniture', price: 'KSh 32,000', stock: 5   },
  { name: 'Filing Cabinet',   category: 'Storage',   price: 'KSh 12,400', stock: 8   },
  { name: 'Monitor 27"',       category: 'Electronics',price:'KSh 28,000', stock: 3  },
];

export default function SupplierDashboard() {
  const { user } = useAuth();

  return (
    <div>
      {/* Greeting */}
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{
          fontSize: 22, fontWeight: 600, color: 'var(--ink)',
          letterSpacing: '-0.02em', marginBottom: 4,
        }}>
          Supplier dashboard
        </h1>
        <p style={{ fontSize: 14, color: 'var(--mist)' }}>
          Welcome, {user?.first_name}. Here's your business at a glance.
        </p>
      </div>

      {/* Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: 14, marginBottom: '2rem',
      }}>
        <StatCard label="Revenue (Jun)"    value="KSh 62,900" icon="ti-currency-dollar" trend={{ value: '9%', up: true }} color="#059669" bg="#ECFDF5" />
        <StatCard label="Active orders"    value={2}          icon="ti-clipboard-list"  color="#1A56DB" bg="#EBF1FD" />
        <StatCard label="Products listed"  value={4}          icon="ti-box"             color="#7C3AED" bg="#F5F3FF" />
        <StatCard label="Pending invoices" value={1}          icon="ti-receipt"         color="#D97706" bg="#FFFBEB" />
      </div>

      {/* Incoming orders */}
      <div style={{ marginBottom: '2rem' }}>
        <SectionHeader
          title="Incoming orders"
          subtitle="Orders placed for your products"
          action={
            <Link href="/dashboard/orders" style={{ fontSize: 13, color: 'var(--brand)', display: 'flex', alignItems: 'center', gap: 4 }}>
              View all <i className="ti ti-arrow-right" style={{ fontSize: 13 }} aria-hidden="true" />
            </Link>
          }
        />
        <TableCard>
          <thead>
            <tr>
              <Th>Order ID</Th>
              <Th>Customer</Th>
              <Th>Product</Th>
              <Th>Date</Th>
              <Th>Amount</Th>
              <Th>Status</Th>
            </tr>
          </thead>
          <tbody>
            {ORDERS.map(o => (
              <tr key={o.id}
                onMouseOver={e => (e.currentTarget.style.background = 'var(--surface)')}
                onMouseOut={e  => (e.currentTarget.style.background = 'transparent')}>
                <Td><span style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>{o.id}</span></Td>
                <Td>{o.customer}</Td>
                <Td>{o.product}</Td>
                <Td muted>{o.date}</Td>
                <Td>{o.amount}</Td>
                <Td><StatusBadge status={o.status} /></Td>
              </tr>
            ))}
          </tbody>
        </TableCard>
      </div>

      {/* My products */}
      <div>
        <SectionHeader
          title="My products"
          subtitle="Products you supply on ProcureFlow"
          action={
            <Link href="/dashboard/products" style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '7px 14px', borderRadius: 8,
              background: 'var(--brand)', color: 'white',
              fontSize: 13, fontWeight: 500,
            }}>
              <i className="ti ti-plus" style={{ fontSize: 14 }} aria-hidden="true" />
              Add product
            </Link>
          }
        />
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 14,
        }}>
          {PRODUCTS.map(p => (
            <div key={p.name} style={{
              background: 'white', border: '1px solid var(--border)',
              borderRadius: 12, padding: '1.1rem',
              transition: 'box-shadow 0.15s',
            }}
              onMouseOver={e => ((e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px rgba(0,0,0,0.07)')}
              onMouseOut={e  => ((e.currentTarget as HTMLElement).style.boxShadow = 'none')}
            >
              <div style={{
                width: 38, height: 38, borderRadius: 9,
                background: 'var(--brand-pale)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 12,
              }}>
                <i className="ti ti-box" style={{ fontSize: 18, color: 'var(--brand)' }} aria-hidden="true" />
              </div>
              <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink)', marginBottom: 4 }}>{p.name}</p>
              <p style={{ fontSize: 12, color: 'var(--mist)', marginBottom: 10 }}>{p.category}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>{p.price}</span>
                <span style={{
                  fontSize: 12,
                  color:    p.stock < 5 ? '#DC2626' : '#059669',
                  background: p.stock < 5 ? '#FEF2F2' : '#ECFDF5',
                  padding:  '2px 8px', borderRadius: 100,
                }}>
                  {p.stock} in stock
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
