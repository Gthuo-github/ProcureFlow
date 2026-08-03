'use client';

import { useEffect, useState, FormEvent } from 'react';
import { getInvoices, createInvoice, deleteInvoice, getUsers, getProducts, Invoice, AppUser, Product } from '@/lib/api';
import { SectionHeader, TableCard, Th, Td, EmptyState, StatusBadge } from '../components/ui';
import { Modal, Field, SubmitButton, Toast, ConfirmDialog } from '../components/shared';

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading,   setLoading] = useState(true);
  const [apiAvailable, setApiAvailable] = useState(true);
  const [search, setSearch] = useState('');

  const [modalOpen,  setModalOpen]  = useState(false);
  const [confirmDel, setConfirmDel] = useState<Invoice | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  async function load() {
    setLoading(true);
    try {
      const data = await getInvoices();
      setInvoices(data);
      setApiAvailable(true);
    } catch {
      setApiAvailable(false);
      setToast({ msg: 'Could not load invoices. Confirm the invoices API is set up.', type: 'error' });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const filtered = invoices.filter(inv =>
    !search || inv.invoice_number.toLowerCase().includes(search.toLowerCase())
  );

  const totalOutstanding = invoices
    .filter(i => i.status !== 'paid')
    .reduce((sum, i) => sum + Number(i.invoice_amount), 0);

  async function handleDelete() {
    if (!confirmDel) return;
    try {
      await deleteInvoice(confirmDel.id);
      setToast({ msg: `Invoice ${confirmDel.invoice_number} deleted.`, type: 'success' });
      setConfirmDel(null);
      load();
    } catch {
      setToast({ msg: 'Failed to delete invoice.', type: 'error' });
    }
  }

  return (
    <div>
      <SectionHeader
        title="Invoices"
        subtitle={`${invoices.length} invoice${invoices.length !== 1 ? 's' : ''} · KSh ${totalOutstanding.toLocaleString()} outstanding`}
        action={
          <button onClick={() => setModalOpen(true)} style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '8px 16px', borderRadius: 8,
            background: 'var(--brand)', color: 'white',
            fontSize: 13.5, fontWeight: 500, border: 'none', cursor: 'pointer',
          }}>
            <i className="ti ti-plus" style={{ fontSize: 15 }} aria-hidden="true" />
            New invoice
          </button>
        }
      />

      {!apiAvailable && (
        <div style={{
          padding: '12px 16px', borderRadius: 10, marginBottom: 18,
          background: '#FFFBEB', border: '1px solid #FDE68A', color: '#854D0E',
          fontSize: 13.5, display: 'flex', gap: 10, alignItems: 'flex-start',
        }}>
          <i className="ti ti-alert-triangle" style={{ fontSize: 17, flexShrink: 0, marginTop: 1 }} aria-hidden="true" />
          <span>
            The <code style={{ background: '#FEF3C7', padding: '1px 5px', borderRadius: 4 }}>/api/invoices/</code> endpoint
            isn't responding yet. This page is ready — it will populate once your invoices app's views/urls are live.
          </span>
        </div>
      )}

      <div style={{ position: 'relative', marginBottom: '1.25rem', maxWidth: 320 }}>
        <i className="ti ti-search" style={{
          position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
          fontSize: 15, color: 'var(--mist)',
        }} aria-hidden="true" />
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search invoice number…"
          style={{
            width: '100%', padding: '9px 12px 9px 36px', borderRadius: 8,
            border: '1px solid var(--border)', fontSize: 13.5, background: 'white', outline: 'none',
          }}
        />
      </div>

      {loading ? (
        <div style={{ height: 300, borderRadius: 12, background: 'white', border: '1px solid var(--border)' }} />
      ) : filtered.length === 0 ? (
        <div style={{ background: 'white', borderRadius: 12, border: '1px solid var(--border)' }}>
          <EmptyState icon="ti-receipt-off" message="No invoices yet." />
        </div>
      ) : (
        <TableCard>
          <thead>
            <tr>
              <Th>Invoice</Th>
              <Th>Customer</Th>
              <Th>Amount</Th>
              <Th>Date</Th>
              <Th>Due date</Th>
              <Th>Status</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(inv => (
              <tr key={inv.id}
                onMouseOver={e => (e.currentTarget.style.background = 'var(--surface)')}
                onMouseOut={e  => (e.currentTarget.style.background = 'transparent')}>
                <Td><span style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>{inv.invoice_number}</span></Td>
                <Td>{inv.customer_name || `User #${inv.customer}`}</Td>
                <Td>KSh {Number(inv.invoice_amount).toLocaleString()}</Td>
                <Td muted>{new Date(inv.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</Td>
                <Td muted>{inv.due_date ? new Date(inv.due_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : '—'}</Td>
                <Td><StatusBadge status={inv.status || 'draft'} /></Td>
                <Td>
                  <button onClick={() => setConfirmDel(inv)} style={{
                    width: 28, height: 28, borderRadius: 7,
                    border: '1px solid var(--border)', background: 'white',
                    color: '#DC2626', cursor: 'pointer',
                  }}>
                    <i className="ti ti-trash" style={{ fontSize: 13 }} aria-hidden="true" />
                  </button>
                </Td>
              </tr>
            ))}
          </tbody>
        </TableCard>
      )}

      <InvoiceFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSaved={(msg) => { setToast({ msg, type: 'success' }); setModalOpen(false); load(); }}
        onError={(msg) => setToast({ msg, type: 'error' })}
      />

      <ConfirmDialog
        open={!!confirmDel}
        title="Delete invoice"
        message={`Delete invoice ${confirmDel?.invoice_number}? This cannot be undone.`}
        confirmLabel="Delete" danger
        onConfirm={handleDelete}
        onCancel={() => setConfirmDel(null)}
      />

      {toast && <Toast message={toast.msg} type={toast.type} onDone={() => setToast(null)} />}
    </div>
  );
}

// ── Create invoice modal ─────────────────────────────────────────────────────

interface LineItem { description: string; quantity: string; unit_price: string; }

function InvoiceFormModal({ open, onClose, onSaved, onError }: {
  open: boolean; onClose: () => void;
  onSaved: (msg: string) => void; onError: (msg: string) => void;
}) {
  const [customers, setCustomers] = useState<AppUser[]>([]);
  const [products,  setProducts]  = useState<Product[]>([]);
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [customer,      setCustomer]      = useState('');
  const [dueDate,       setDueDate]       = useState('');
  const [items,         setItems]         = useState<LineItem[]>([{ description: '', quantity: '1', unit_price: '' }]);
  const [loading,       setLoading]       = useState(false);
  const [errors,        setErrors]        = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      setInvoiceNumber(`INV-${Date.now().toString().slice(-6)}`);
      setCustomer(''); setDueDate('');
      setItems([{ description: '', quantity: '1', unit_price: '' }]);
      setErrors({});
      getUsers('customer').then(setCustomers).catch(() => {});
      getProducts().then(setProducts).catch(() => {});
    }
  }, [open]);

  function updateItem(i: number, field: keyof LineItem, value: string) {
    setItems(prev => {
      const next = prev.map((it, idx) => idx === i ? { ...it, [field]: value } : it);
      // Auto-fill unit price when a product is selected
      if (field === 'description') {
        const p = products.find(p => String(p.id) === value);
        if (p) next[i].unit_price = p.price;
      }
      return next;
    });
  }
  function addItem() { setItems(prev => [...prev, { description: '', quantity: '1', unit_price: '' }]); }
  function removeItem(i: number) { setItems(prev => prev.filter((_, idx) => idx !== i)); }

  const total = items.reduce((sum, it) => sum + (Number(it.quantity) || 0) * (Number(it.unit_price) || 0), 0);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!invoiceNumber) errs.invoiceNumber = 'Required';
    if (!customer)      errs.customer      = 'Required';
    if (items.some(it => !it.description || !it.unit_price)) errs.items = 'Complete every line item';
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      await createInvoice({
        invoice_number: invoiceNumber,
        customer: Number(customer),
        due_date: dueDate || null,
        invoice_amount: total.toFixed(2),
        items: items.map(it => ({
          description: Number(it.description),
          quantity: Number(it.quantity),
          unit_price: it.unit_price,
        })),
      });
      onSaved('Invoice created successfully.');
    } catch {
      onError('Failed to create invoice. Confirm the invoices API accepts this payload shape.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="New invoice" width={540}>
      <form onSubmit={handleSubmit} noValidate>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 12px' }}>
          <Field label="Invoice number" id="invoiceNumber" value={invoiceNumber} onChange={setInvoiceNumber} required error={errors.invoiceNumber} />
          <Field label="Due date" id="dueDate" type="date" value={dueDate} onChange={setDueDate} />
        </div>

        <Field label="Customer" id="customer" as="select" value={customer} onChange={setCustomer}
          required error={errors.customer}
          options={customers.map(c => ({ value: String(c.id), label: `${c.first_name} ${c.last_name}` }))} />

        <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--ink)', marginBottom: 8 }}>
          Line items <span style={{ color: '#DC2626' }}>*</span>
        </label>
        {items.map((item, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'flex-start' }}>
            <select
              value={item.description}
              onChange={e => updateItem(i, 'description', e.target.value)}
              style={{
                flex: 2, padding: '9px 12px', borderRadius: 8,
                border: '1px solid var(--border)', fontSize: 13, background: 'var(--surface)',
              }}
            >
              <option value="">Product…</option>
              {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <input
              type="number" min="1" value={item.quantity}
              onChange={e => updateItem(i, 'quantity', e.target.value)}
              placeholder="Qty"
              style={{
                width: 60, padding: '9px 10px', borderRadius: 8,
                border: '1px solid var(--border)', fontSize: 13, background: 'var(--surface)',
              }}
            />
            <input
              type="number" min="0" step="0.01" value={item.unit_price}
              onChange={e => updateItem(i, 'unit_price', e.target.value)}
              placeholder="Price"
              style={{
                width: 90, padding: '9px 10px', borderRadius: 8,
                border: '1px solid var(--border)', fontSize: 13, background: 'var(--surface)',
              }}
            />
            {items.length > 1 && (
              <button type="button" onClick={() => removeItem(i)} style={{
                width: 36, height: 36, borderRadius: 8, border: '1px solid var(--border)',
                background: 'white', color: '#DC2626', cursor: 'pointer', flexShrink: 0,
              }}>
                <i className="ti ti-x" style={{ fontSize: 14 }} aria-hidden="true" />
              </button>
            )}
          </div>
        ))}
        {errors.items && <p role="alert" style={{ fontSize: 12, color: '#DC2626', marginBottom: 8 }}>{errors.items}</p>}

        <button type="button" onClick={addItem} style={{
          display: 'flex', alignItems: 'center', gap: 6,
          fontSize: 13, color: 'var(--brand)', background: 'none', border: 'none',
          cursor: 'pointer', marginBottom: 16, padding: '4px 0',
        }}>
          <i className="ti ti-plus" style={{ fontSize: 14 }} aria-hidden="true" /> Add line item
        </button>

        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '12px 14px', borderRadius: 8, background: 'var(--surface)', marginBottom: 18,
        }}>
          <span style={{ fontSize: 13.5, color: 'var(--slate)' }}>Total</span>
          <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--ink)' }}>
            KSh {total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
        </div>

        <SubmitButton loading={loading}>Create invoice</SubmitButton>
      </form>
    </Modal>
  );
}
