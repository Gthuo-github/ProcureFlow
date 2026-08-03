'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { SectionHeader, StatusBadge } from './ui';
import { formatKES, initialRequisitions, procurementSummary, sourcingEvents } from '@/lib/procurement';

const cards = [
  { label: 'Spend under management', value: formatKES(procurementSummary.spendUnderManagement), detail: 'This financial year', icon: 'ti-wallet', color: '#1A56DB', bg: '#EBF1FD' },
  { label: 'Awaiting your approval', value: procurementSummary.pendingApprovals, detail: '2 due today', icon: 'ti-checklist', color: '#B45309', bg: '#FFFBEB' },
  { label: 'Active sourcing events', value: procurementSummary.activeSourcingEvents, detail: '1 ready to award', icon: 'ti-gavel', color: '#6D28D9', bg: '#F5F3FF' },
  { label: 'Invoice exceptions', value: procurementSummary.invoiceExceptions, detail: 'Needs finance review', icon: 'ti-alert-triangle', color: '#B91C1C', bg: '#FEF2F2' },
];

export default function CustomerDashboard() {
  const { user } = useAuth();

  return (
    <div style={{ maxWidth: 1440, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap', marginBottom: 28 }}>
        <div>
          <p style={{ fontSize: 13, color: 'var(--mist)', marginBottom: 5 }}>Procurement workspace</p>
          <h1 style={{ fontSize: 26, lineHeight: 1.2, letterSpacing: '-0.035em', fontWeight: 650, color: 'var(--ink)' }}>
            Good morning, {user?.first_name || 'there'}
          </h1>
          <p style={{ fontSize: 14, color: 'var(--slate)', marginTop: 7 }}>Here is what needs your attention across procure-to-pay.</p>
        </div>
        <Link href="/dashboard/requisitions" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '10px 16px', borderRadius: 8, background: 'var(--brand)', color: 'white', fontSize: 14, fontWeight: 600, boxShadow: '0 4px 10px rgba(26,86,219,.18)' }}>
          <i className="ti ti-plus" aria-hidden="true" /> New requisition
        </Link>
      </div>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 14, marginBottom: 28 }}>
        {cards.map(card => <div key={card.label} style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 12, padding: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <span style={{ width: 38, height: 38, display: 'grid', placeItems: 'center', borderRadius: 9, background: card.bg, color: card.color }}><i className={`ti ${card.icon}`} style={{ fontSize: 19 }} aria-hidden="true" /></span>
            <i className="ti ti-arrow-up-right" style={{ color: 'var(--mist)' }} aria-hidden="true" />
          </div>
          <p style={{ color: 'var(--mist)', fontSize: 12.5, marginBottom: 5 }}>{card.label}</p>
          <p style={{ fontWeight: 650, color: 'var(--ink)', fontSize: 23, letterSpacing: '-.03em', lineHeight: 1.1 }}>{card.value}</p>
          <p style={{ fontSize: 12, color: card.color, marginTop: 8 }}>{card.detail}</p>
        </div>)}
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.7fr) minmax(280px, .9fr)', gap: 22, alignItems: 'start' }} className="dashboard-grid">
        <section style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
            <div><h2 style={{ fontSize: 16, fontWeight: 650 }}>Recent requisitions</h2><p style={{ fontSize: 12.5, color: 'var(--mist)', marginTop: 3 }}>Track requests from draft through purchase order.</p></div>
            <Link href="/dashboard/requisitions" style={{ fontSize: 13, color: 'var(--brand)', fontWeight: 600 }}>View all</Link>
          </div>
          <div style={{ overflowX: 'auto' }}><table style={{ width: '100%', minWidth: 650, borderCollapse: 'collapse' }}><thead><tr>{['Request', 'Category', 'Amount', 'Stage'].map(label => <th key={label} style={{ textAlign: 'left', padding: '10px 20px', background: 'var(--surface)', borderBottom: '1px solid var(--border)', color: 'var(--mist)', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: '.06em' }}>{label}</th>)}</tr></thead>
            <tbody>{initialRequisitions.map(item => <tr key={item.id}><td style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)' }}><p style={{ fontSize: 13.5, fontWeight: 600 }}>{item.title}</p><p style={{ fontSize: 12, color: 'var(--mist)', marginTop: 2 }}>{item.id} · {item.items} line items</p></td><td style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', color: 'var(--slate)', fontSize: 13 }}>{item.category}</td><td style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', fontWeight: 600, fontSize: 13 }}>{formatKES(item.amount)}</td><td style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)' }}><StatusBadge status={item.status} /></td></tr>)}</tbody>
          </table></div>
        </section>

        <div style={{ display: 'grid', gap: 22 }}>
          <section style={{ background: '#102A5D', borderRadius: 12, padding: 20, color: 'white', overflow: 'hidden', position: 'relative' }}>
            <div style={{ position: 'absolute', width: 180, height: 180, borderRadius: '50%', right: -70, top: -85, background: 'rgba(94,157,255,.16)' }} />
            <p style={{ color: '#AFC6F7', fontSize: 12.5, marginBottom: 8 }}>Need to buy something?</p>
            <h2 style={{ fontSize: 18, lineHeight: 1.3, fontWeight: 650, maxWidth: 245 }}>Start with a structured requisition.</h2>
            <p style={{ fontSize: 12.5, color: '#C8D7F4', lineHeight: 1.6, margin: '10px 0 18px', maxWidth: 290 }}>Route the right details to the right approvers before you invite suppliers.</p>
            <Link href="/dashboard/requisitions" style={{ position: 'relative', display: 'inline-flex', padding: '8px 12px', borderRadius: 7, background: 'white', color: '#102A5D', fontSize: 12.5, fontWeight: 700 }}>Create requisition</Link>
          </section>
          <section style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 12, padding: 18 }}>
            <SectionHeader title="Active sourcing" action={<Link href="/dashboard/sourcing" style={{ fontSize: 13, color: 'var(--brand)', fontWeight: 600 }}>See all</Link>} />
            <div style={{ display: 'grid', gap: 14 }}>{sourcingEvents.slice(0, 2).map(event => <div key={event.id} style={{ paddingBottom: 14, borderBottom: '1px solid var(--border)' }}><div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}><p style={{ fontSize: 13, fontWeight: 600 }}>{event.title}</p><span style={{ fontSize: 11, color: 'var(--brand)', fontWeight: 600 }}>{event.closes}</span></div><p style={{ fontSize: 12, color: 'var(--mist)', marginTop: 4 }}>{event.responses} of {event.suppliers} supplier responses</p></div>)}</div>
          </section>
        </div>
      </div>
      <style>{`@media (max-width: 900px) { .dashboard-grid { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}
