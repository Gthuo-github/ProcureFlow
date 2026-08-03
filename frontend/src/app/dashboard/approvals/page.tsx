'use client';

import { useState } from 'react';
import { formatKES, pendingApprovals } from '@/lib/procurement';
import { SectionHeader, StatusBadge } from '../components/ui';
import { Toast } from '../components/shared';

export default function ApprovalsPage() {
  const [items, setItems] = useState(pendingApprovals);
  const [toast, setToast] = useState<string | null>(null);
  function decide(id: string, decision: 'approved' | 'rejected') { setItems(current => current.filter(item => item.id !== id)); setToast(`${id} ${decision}. The decision has been recorded.`); }
  return <div style={{ maxWidth: 1000, margin: '0 auto' }}>
    <SectionHeader title="Your approvals" subtitle={`${items.length} decisions are waiting for you. Approval actions will be connected to the workflow API next.`} />
    <div style={{ display: 'grid', gap: 14 }}>{items.map(item => <article key={item.id} style={{ padding: 20, borderRadius: 12, border: '1px solid var(--border)', background: 'white' }}><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}><div><div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}><span style={{ fontSize: 12, color: 'var(--mist)', fontWeight: 650 }}>{item.id}</span><StatusBadge status={item.id.startsWith('INV') ? 'exception' : 'pending approval'} /></div><h2 style={{ fontSize: 16, fontWeight: 650 }}>{item.title}</h2><p style={{ color: 'var(--slate)', fontSize: 13, marginTop: 7 }}>{item.requester} · {item.department} · Submitted {item.submittedAt}</p></div><p style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-.03em' }}>{formatKES(item.amount)}</p></div><div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border)', display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}><span style={{ flex: 1, minWidth: 190, fontSize: 12.5, color: 'var(--mist)' }}><i className="ti ti-shield-check" /> {item.policy}</span><button onClick={() => decide(item.id, 'rejected')} style={{ padding: '8px 12px', borderRadius: 7, background: 'white', color: '#B91C1C', border: '1px solid #FECACA', fontWeight: 600, fontSize: 13 }}>Send back</button><button onClick={() => decide(item.id, 'approved')} style={{ padding: '8px 12px', borderRadius: 7, background: 'var(--brand)', color: 'white', border: 0, fontWeight: 600, fontSize: 13 }}>Approve</button></div></article>)}</div>
    {items.length === 0 && <div style={{ textAlign: 'center', padding: 52, background: 'white', border: '1px solid var(--border)', borderRadius: 12, color: 'var(--mist)' }}><i className="ti ti-circle-check" style={{ fontSize: 32 }} /><p style={{ marginTop: 8 }}>You are all caught up.</p></div>}
    {toast && <Toast message={toast} type="success" onDone={() => setToast(null)} />}
  </div>;
}
