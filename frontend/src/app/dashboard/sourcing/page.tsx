import Link from 'next/link';
import { sourcingEvents } from '@/lib/procurement';
import { SectionHeader, StatusBadge } from '../components/ui';

export default function SourcingPage() {
  return <div style={{ maxWidth: 1100, margin: '0 auto' }}>
    <SectionHeader title="Sourcing events" subtitle="Invite qualified suppliers, compare proposals, and document every award decision." action={<Link href="/dashboard/requisitions" style={{ padding: '9px 14px', borderRadius: 8, background: 'var(--brand)', color: 'white', fontSize: 13.5, fontWeight: 600 }}>Start from requisition</Link>} />
    <div style={{ display: 'grid', gap: 14 }}>{sourcingEvents.map(event => <article key={event.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 18, padding: 20, flexWrap: 'wrap', border: '1px solid var(--border)', borderRadius: 12, background: 'white' }}><div><p style={{ fontSize: 12, color: 'var(--mist)', fontWeight: 650 }}>{event.id}</p><h2 style={{ fontSize: 16, marginTop: 4, fontWeight: 650 }}>{event.title}</h2><p style={{ marginTop: 7, color: 'var(--slate)', fontSize: 13 }}>{event.responses} responses from {event.suppliers} invited suppliers</p></div><div style={{ display: 'flex', alignItems: 'center', gap: 16 }}><StatusBadge status={event.closes === 'Ready to award' ? 'approved' : 'sourcing'} /><button style={{ border: '1px solid var(--border)', background: 'white', color: 'var(--brand)', padding: '8px 12px', borderRadius: 7, fontWeight: 600, fontSize: 13 }}>Compare bids</button></div></article>)}</div>
    <div style={{ marginTop: 20, padding: 16, borderRadius: 10, background: 'var(--brand-pale)', color: '#1E429F', fontSize: 13 }}><i className="ti ti-info-circle" /> Supplier invitations, bid submission, and award actions will become API-backed when the sourcing domain is added to Django.</div>
  </div>;
}
