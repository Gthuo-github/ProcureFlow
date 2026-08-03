'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

const NAV_ADMIN = [
  { href: '/dashboard',          icon: 'ti-layout-dashboard', label: 'Overview'   },
  { href: '/dashboard/requisitions', icon: 'ti-file-invoice', label: 'Requisitions' },
  { href: '/dashboard/approvals', icon: 'ti-checklist', label: 'Approvals' },
  { href: '/dashboard/sourcing', icon: 'ti-gavel', label: 'Sourcing' },
  { href: '/dashboard/users',    icon: 'ti-users',            label: 'Users'      },
  { href: '/dashboard/products', icon: 'ti-box',              label: 'Products'   },
  { href: '/dashboard/orders',   icon: 'ti-clipboard-list',   label: 'Orders'     },
  { href: '/dashboard/invoices', icon: 'ti-receipt',          label: 'Invoices'   },
  { href: '/dashboard/suppliers',icon: 'ti-truck',            label: 'Suppliers'  },
];

const NAV_CUSTOMER = [
  { href: '/dashboard',              icon: 'ti-layout-dashboard', label: 'Overview' },
  { href: '/dashboard/requisitions', icon: 'ti-file-invoice',     label: 'Requisitions' },
  { href: '/dashboard/approvals',    icon: 'ti-checklist',        label: 'Approvals' },
  { href: '/dashboard/sourcing',     icon: 'ti-gavel',            label: 'Sourcing' },
  { href: '/dashboard/orders',       icon: 'ti-shopping-cart',    label: 'Purchase orders' },
  { href: '/dashboard/invoices',     icon: 'ti-receipt',          label: 'Invoices' },
  { href: '/dashboard/profile',      icon: 'ti-user',             label: 'Profile' },
];

const NAV_SUPPLIER = [
  { href: '/dashboard',          icon: 'ti-layout-dashboard', label: 'Overview'   },
  { href: '/dashboard/sourcing', icon: 'ti-gavel',            label: 'Bid invites' },
  { href: '/dashboard/orders',   icon: 'ti-clipboard-list',   label: 'Orders'     },
  { href: '/dashboard/products', icon: 'ti-box',              label: 'Products'   },
  { href: '/dashboard/invoices', icon: 'ti-receipt',          label: 'Invoices'   },
  { href: '/dashboard/profile',  icon: 'ti-user',             label: 'Profile'    },
];

function getNav(role?: string) {
  if (role === 'admin')    return NAV_ADMIN;
  if (role === 'supplier') return NAV_SUPPLIER;
  return NAV_CUSTOMER;
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const pathname = usePathname();
  const router   = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.replace('/login');
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
      }}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
          stroke="var(--brand)" strokeWidth="2"
          style={{ animation: 'spin 1s linear infinite' }} aria-label="Loading">
          <circle cx="12" cy="12" r="10" strokeOpacity=".2"/>
          <path d="M12 2a10 10 0 0110 10" strokeLinecap="round"/>
        </svg>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const nav = getNav(user.role);

  const roleBadge: Record<string, { bg: string; color: string }> = {
    admin:    { bg: '#FEF2F2', color: '#991B1B' },
    supplier: { bg: '#FFFBEB', color: '#854D0E' },
    customer: { bg: '#EFF6FF', color: '#1D4ED8' },
  };
  const badge = roleBadge[user.role] || roleBadge.customer;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--surface)' }}>

      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 40,
            background: 'rgba(0,0,0,0.35)',
          }}
        />
      )}

      <aside style={{
        width:      240,
        flexShrink: 0,
        background: 'linear-gradient(180deg, var(--navy) 0%, #071833 100%)',
        borderRight:'1px solid rgba(255,255,255,.08)',
        display:    'flex',
        flexDirection: 'column',
        position:   'fixed',
        top:        0,
        bottom:     0,
        left:       0,
        zIndex:     50,
        transform:  sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.25s cubic-bezier(.4,0,.2,1)',
      }} className="sidebar">
        <div style={{
          padding:    '1.25rem 1.25rem 1rem',
          borderBottom: '1px solid rgba(255,255,255,.09)',
          display:    'flex', alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{
              width: 30, height: 30, borderRadius: 7,
              background: 'linear-gradient(135deg, #3185FF, #1757D5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="15" height="15" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <rect x="2"  y="2"  width="6" height="6" rx="1.5" fill="white"/>
                <rect x="10" y="2"  width="6" height="6" rx="1.5" fill="white" opacity=".6"/>
                <rect x="2"  y="10" width="6" height="6" rx="1.5" fill="white" opacity=".6"/>
                <rect x="10" y="10" width="6" height="6" rx="1.5" fill="white"/>
              </svg>
            </span>
            <span style={{
              fontFamily: 'var(--font-display)', fontWeight: 700,
              fontSize: 15, letterSpacing: '-0.02em', color: 'white',
            }}>ProcureFlow</span>
          </Link>
          <button
            className="close-sidebar"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
            style={{ background: 'none', border: 'none', padding: 4, color: '#B9C9E8' }}
          >
            <i className="ti ti-x" style={{ fontSize: 18 }} aria-hidden="true" />
          </button>
        </div>

        <div style={{
          padding: '1rem 1.25rem',
          borderBottom: '1px solid rgba(255,255,255,.09)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'rgba(72, 145, 255, .18)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 600, color: '#EAF2FF', flexShrink: 0,
            }}>
              {user.first_name[0]}{user.last_name[0]}
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={{
                fontSize: 13, fontWeight: 500, color: 'white',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>
                {user.first_name} {user.last_name}
              </p>
              <p style={{
                fontSize: 11, color: '#AFC3E8',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>
                {user.email}
              </p>
            </div>
          </div>
          <span style={{
            display: 'inline-block',
            marginTop: 10,
            padding: '3px 10px',
            borderRadius: 100,
            fontSize: 11,
            fontWeight: 500,
            background: 'rgba(255,255,255,.11)',
            color: '#C9DAFA',
            textTransform: 'capitalize',
          }}>
            {user.role}
          </span>
        </div>

        <nav style={{ flex: 1, padding: '0.75rem 0.75rem', overflowY: 'auto' }} aria-label="Dashboard navigation">
          {nav.map(({ href, icon, label }) => {
            const active = pathname === href;
            return (
              <Link key={href} href={href} onClick={() => setSidebarOpen(false)} style={{
                display:    'flex',
                alignItems: 'center',
                gap:        10,
                padding:    '9px 12px',
                borderRadius: 8,
                marginBottom: 2,
                fontSize:   14,
                fontWeight: active ? 600 : 400,
                color:      active ? 'white' : '#AFC3E8',
                background: active ? 'linear-gradient(90deg, #1767E8, #1559D0)' : 'transparent',
                transition: 'all 0.15s',
              }} className="nav-item">
                <i className={`ti ${icon}`} style={{ fontSize: 17, flexShrink: 0 }} aria-hidden="true" />
                {label}
              </Link>
            );
          })}
        </nav>

        <div style={{ padding: '0.75rem', borderTop: '1px solid rgba(255,255,255,.09)' }}>
          <button
            onClick={async () => { await logout(); router.push('/'); }}
            style={{
              width: '100%', padding: '9px 12px',
              display: 'flex', alignItems: 'center', gap: 10,
              borderRadius: 8, border: 'none', background: 'none',
              fontSize: 14, color: '#C1D0EB',
              cursor: 'pointer', transition: 'all 0.15s',
            }}
            onMouseOver={e => (e.currentTarget.style.background = 'rgba(255,255,255,.08)')}
            onMouseOut={e  => (e.currentTarget.style.background = 'none')}
          >
            <i className="ti ti-logout" style={{ fontSize: 17 }} aria-hidden="true" />
            Sign out
          </button>
        </div>
      </aside>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }} className="main-content">

        <header style={{
          height:       60,
          background:   'white',
          borderBottom: '1px solid var(--border)',
          display:      'flex',
          alignItems:   'center',
          padding:      '0 1.5rem',
          gap:          12,
          position:     'sticky',
          top:          0,
          zIndex:       30,
        }}>
          <button
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
            style={{
              background: 'none', border: 'none', padding: 6,
              color: 'var(--slate)', cursor: 'pointer', lineHeight: 0,
            }}
          >
            <i className="ti ti-menu-2" style={{ fontSize: 20 }} aria-hidden="true" />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 13, color: 'var(--mist)' }}>Dashboard</span>
            {pathname && pathname !== '/dashboard' && (
              <>
                <i className="ti ti-chevron-right" style={{ fontSize: 13, color: 'var(--mist)' }} aria-hidden="true" />
                <span style={{ fontSize: 13, color: 'var(--ink)', fontWeight: 500, textTransform: 'capitalize' }}>
                  {pathname.split('/').pop()}
                </span>
              </>
            )}
          </div>

          <div className="topbar-search" style={{
            display: 'flex', alignItems: 'center', gap: 7, marginLeft: 14,
            width: 'min(270px, 28vw)', padding: '7px 10px', borderRadius: 8,
            border: '1px solid var(--border)', color: 'var(--mist)', transition: 'all .15s',
          }}>
            <i className="ti ti-search" style={{ fontSize: 15 }} aria-hidden="true" />
            <input aria-label="Search workspace" placeholder="Search anything…" style={{
              minWidth: 0, width: '100%', border: 'none', outline: 'none', background: 'transparent',
              fontSize: 12, color: 'var(--ink)', fontFamily: 'inherit',
            }} />
          </div>

          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
            <button style={{
              background: 'none', border: 'none', padding: 6,
              color: 'var(--mist)', cursor: 'pointer', position: 'relative',
            }} aria-label="Notifications">
              <i className="ti ti-bell" style={{ fontSize: 19 }} aria-hidden="true" />
              <span style={{
                position: 'absolute', top: 4, right: 4,
                width: 7, height: 7, borderRadius: '50%',
                background: 'var(--brand)', border: '1.5px solid white',
              }} />
            </button>

            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'var(--brand-pale)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 600, color: 'var(--brand)',
            }}>
              {user.first_name[0]}{user.last_name[0]}
            </div>
          </div>
        </header>

        <main style={{ flex: 1, padding: 'clamp(1.25rem, 3vw, 2rem)' }}>
          <div className="page-enter">{children}</div>
        </main>
      </div>

      <style>{`
        @media (min-width: 769px) {
          .sidebar {
            transform: translateX(0) !important;
            position: sticky !important;
            top: 0 !important;
            height: 100vh !important;
          }
          .close-sidebar { display: none !important; }
          .main-content { margin-left: 0; }
        }
        @media (max-width: 560px) {
          .topbar-search { display: none !important; }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
