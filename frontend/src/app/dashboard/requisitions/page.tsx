'use client';

import { FormEvent, useMemo, useState } from 'react';
import { formatKES, initialRequisitions, Requisition, RequisitionStatus } from '@/lib/procurement';
import { Modal, Field, SubmitButton, Toast } from '../components/shared';
import { SectionHeader, StatusBadge } from '../components/ui';

const STORAGE_KEY = 'procureflow.requisitions';
const categories = ['IT & equipment', 'Facilities', 'Professional services', 'Travel', 'Software', 'Marketing'];

export default function RequisitionsPage() {
  const [requests, setRequests] = useState<Requisition[]>(() => {
    if (typeof window === 'undefined') return initialRequisitions;
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) as Requisition[] : initialRequisitions;
  });
  const [filter, setFilter] = useState<'all' | RequisitionStatus>('all');
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  function save(next: Requisition[]) { setRequests(next); window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); }
  const visible = useMemo(() => filter === 'all' ? requests : requests.filter(request => request.status === filter), [filter, requests]);

  return <div style={{ maxWidth: 1320, margin: '0 auto' }}>
    <SectionHeader title="Requisitions" subtitle="Create, submit, and track requests before supplier sourcing."
      action={<button onClick={() => setOpen(true)} style={primaryButton}><i className="ti ti-plus" /> New requisition</button>} />

    <div style={{ display: 'flex', gap: 8, marginBottom: 18, flexWrap: 'wrap' }}>
      {(['all', 'draft', 'pending approval', 'approved', 'sourcing', 'purchase order issued'] as const).map(status => <button key={status} onClick={() => setFilter(status)} style={{ padding: '7px 11px', borderRadius: 7, border: `1px solid ${filter === status ? 'var(--brand)' : 'var(--border)'}`, background: filter === status ? 'var(--brand-pale)' : 'white', color: filter === status ? 'var(--brand)' : 'var(--slate)', fontSize: 12.5, fontWeight: 600, textTransform: 'capitalize' }}>{status}</button>)}
    </div>

    <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
      <div style={{ overflowX: 'auto' }}><table style={{ width: '100%', minWidth: 820, borderCollapse: 'collapse' }}><thead><tr>{['Requisition', 'Requester', 'Category', 'Amount', 'Submitted', 'Status', ''].map(label => <th key={label} style={th}>{label}</th>)}</tr></thead>
        <tbody>{visible.map(request => <tr key={request.id}><td style={td}><p style={{ fontWeight: 650, fontSize: 13.5 }}>{request.title}</p><p style={{ marginTop: 3, color: 'var(--mist)', fontSize: 12 }}>{request.id} · {request.items} line items</p></td><td style={td}>{request.requester}</td><td style={td}>{request.category}</td><td style={{ ...td, fontWeight: 650 }}>{formatKES(request.amount)}</td><td style={{ ...td, color: 'var(--mist)' }}>{request.submittedAt}</td><td style={td}><StatusBadge status={request.status} /></td><td style={td}><button aria-label={`View ${request.id}`} style={{ border: 0, color: 'var(--brand)', background: 'transparent', fontSize: 13, fontWeight: 600 }}>View</button></td></tr>)}
          {visible.length === 0 && <tr><td colSpan={7} style={{ ...td, color: 'var(--mist)', textAlign: 'center', padding: 42 }}>No requisitions in this stage.</td></tr>}
        </tbody></table></div>
    </div>
    <p style={{ fontSize: 12, color: 'var(--mist)', marginTop: 12 }}>New requisitions are stored in this browser until the Django requisitions API is connected.</p>
    {open && <RequisitionForm onClose={() => setOpen(false)} onCreated={request => { save([request, ...requests]); setOpen(false); setToast(`${request.id} submitted for approval.`); }} />}
    {toast && <Toast message={toast} type="success" onDone={() => setToast(null)} />}
  </div>;
}

function RequisitionForm({ onClose, onCreated }: { onClose: () => void; onCreated: (request: Requisition) => void }) {
  const [title, setTitle] = useState(''); const [category, setCategory] = useState(categories[0]); const [amount, setAmount] = useState(''); const [items, setItems] = useState('1'); const [saving, setSaving] = useState(false);
  function submit(event: FormEvent) { event.preventDefault(); if (!title.trim() || Number(amount) <= 0) return; setSaving(true); window.setTimeout(() => { onCreated({ id: `REQ-${Math.floor(1000 + Math.random() * 8999)}`, title: title.trim(), category, amount: Number(amount), requester: 'You', submittedAt: 'Just now', status: 'pending approval', items: Number(items) || 1 }); setSaving(false); }, 300); }
  return <Modal open onClose={onClose} title="New requisition" width={560}><form onSubmit={submit}><p style={{ fontSize: 13, color: 'var(--slate)', marginBottom: 18 }}>Capture the business need first. It will route to the right approver before suppliers are invited.</p><Field label="What do you need?" id="title" value={title} onChange={setTitle} placeholder="e.g. Q3 office equipment" required /><Field label="Category" id="category" as="select" value={category} onChange={setCategory} options={categories.map(value => ({ value, label: value }))} /><div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}><Field label="Estimated amount (KES)" id="amount" type="number" value={amount} onChange={setAmount} placeholder="0" required /><Field label="Line items" id="items" type="number" value={items} onChange={setItems} /></div><SubmitButton loading={saving}>Submit for approval</SubmitButton></form></Modal>;
}

const primaryButton = { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 14px', borderRadius: 8, border: 'none', background: 'var(--brand)', color: 'white', fontWeight: 600, fontSize: 13.5 } as const;
const th = { padding: '11px 16px', textAlign: 'left' as const, background: 'var(--surface)', borderBottom: '1px solid var(--border)', color: 'var(--mist)', fontSize: 11, fontWeight: 600, letterSpacing: '.05em', textTransform: 'uppercase' as const };
const td = { padding: '14px 16px', borderBottom: '1px solid var(--border)', color: 'var(--ink)', fontSize: 13 };
