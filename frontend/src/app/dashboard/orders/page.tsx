'use client';

import { useEffect, useState, FormEvent } from 'react';
import { SectionHeader, TableCard, Th, Td, EmptyState, StatusBadge } from '../components/ui';
import { Modal, Field, SubmitButton, Toast, ConfirmDialog } from '../components/shared';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

function authHeaders() {
  const token = localStorage.getItem('access_token');
  return { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
}

// ── Types ────────────────────────────────────────────────────────────────────

interface Order {
  id:             number;
  product:        number;
  product_name:   string;
  product_image?: string;
  product_price:  string;
  supplier:       number;
  supplier_name:  string;
  supplier_email: string;
  quantity:       number;
  address:        string;
  phone:          string;
  date:           string;
  status:         string;
  status_display: string;
  total_price:    number;
}

interface Product {
  id:            number;
  name:          string;
  price:         string;
  category_name: string;
}

interface Supplier {
  id:           number;
  company_name: string;
  email:        string;
  phone:        string;
}

const STATUS_OPTIONS = ['pending', 'active', 'completed', 'cancelled'];

// ── Page ─────────────────────────────────────────────────────────────────────

export default function OrdersPage() {
  const [orders,      setOrders]      = useState<Order[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [statusFilter,setStatusFilter]= useState('');
  const [modalOpen,   setModalOpen]   = useState(false);
  const [confirmDel,  setConfirmDel]  = useState<Order | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  async function load() {
    setLoading(true);
    try {
      const qs  = statusFilter ? `?status=${statusFilter}` : '';
      const res = await fetch(`${BASE_URL}/orders/${qs}`, { headers: authHeaders() });
      if (!res.ok) throw new Error();
      setOrders(await res.json());
    } catch {
      setToast({ msg: 'Failed to load orders.', type: 'error' });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [statusFilter]);

  async function handleStatusChange(order: Order, newStatus: string) {
    try {
      const res = await fetch(`${BASE_URL}/orders/${order.id}/status/`, {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error();
      setToast({ msg: `Order #${order.id} marked as ${newStatus}.`, type: 'success' });
      load();
    } catch {
      setToast({ msg: 'Failed to update status.', type: 'error' });
    }
  }

  async function handleDelete() {
    if (!confirmDel) return;
    try {
      const res = await fetch(`${BASE_URL}/orders/${confirmDel.id}/delete/`, {
        method: 'DELETE', headers: authHeaders(),
      });
      if (!res.ok) throw new Error();
      setToast({ msg: `Order #${confirmDel.id} deleted.`, type: 'success' });
      setConfirmDel(null);
      load();
    } catch {
      setToast({ msg: 'Failed to delete order.', type: 'error' });
    }
  }

  return (
    <div>
      <SectionHeader
        title="Orders"
        subtitle={`${orders.length} order${orders.length !== 1 ? 's' : ''}`}
        action={
          <button onClick={() => setModalOpen(true)} style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '8px 16px', borderRadius: 8,
            background: 'var(--brand)', color: 'white',
            fontSize: 13.5, fontWeight: 500, border: 'none', cursor: 'pointer',
          }}>
            <i className="ti ti-plus" style={{ fontSize: 15 }} aria-hidden="true" />
            New order
          </button>
        }
      />

      {/* Status filter tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        {['', ...STATUS_OPTIONS].map(s => (
          <button key={s} onClick={() => setStatusFilter(s)} style={{
            padding: '7px 14px', borderRadius: 8, cursor: 'pointer',
            border: `1px solid ${statusFilter === s ? 'var(--brand)' : 'var(--border)'}`,
            background: statusFilter === s ? 'var(--brand-pale)' : 'white',
            color: statusFilter === s ? 'var(--brand)' : 'var(--slate)',
            fontSize: 13, fontWeight: statusFilter === s ? 500 : 400,
            textTransform: 'capitalize',
          }}>
            {s || 'All'}
          </button>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ height: 300, borderRadius: 12, background: 'white', border: '1px solid var(--border)' }} />
      ) : orders.length === 0 ? (
        <div style={{ background: 'white', borderRadius: 12, border: '1px solid var(--border)' }}>
          <EmptyState icon="ti-clipboard-off" message="No orders yet. Create one to get started." />
        </div>
      ) : (
        <TableCard>
          <thead>
            <tr>
              <Th>#</Th>
              <Th>Product</Th>
              <Th>Supplier</Th>
              <Th>Qty</Th>
              <Th>Total</Th>
              <Th>Date</Th>
              <Th>Status</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.id}
                onMouseOver={e => (e.currentTarget.style.background = 'var(--surface)')}
                onMouseOut={e  => (e.currentTarget.style.background = 'transparent')}
              >
                <Td><span style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>#{o.id}</span></Td>
                <Td>
                  <div>
                    <p style={{ fontWeight: 500 }}>{o.product_name}</p>
                    <p style={{ fontSize: 12, color: 'var(--mist)' }}>
                      KSh {Number(o.product_price).toLocaleString()} each
                    </p>
                  </div>
                </Td>
                <Td>
                  <div>
                    <p style={{ fontWeight: 500 }}>{o.supplier_name}</p>
                    <p style={{ fontSize: 12, color: 'var(--mist)' }}>{o.supplier_email}</p>
                  </div>
                </Td>
                <Td>{o.quantity}</Td>
                <Td>KSh {Number(o.total_price).toLocaleString()}</Td>
                <Td muted>
                  {new Date(o.date).toLocaleDateString('en-GB', {
                    day: 'numeric', month: 'short', year: 'numeric',
                  })}
                </Td>
                <Td>
                  <select
                    value={o.status}
                    onChange={e => handleStatusChange(o, e.target.value)}
                    style={{
                      border: 'none', background: 'transparent',
                      fontSize: 13, color: 'var(--ink)', cursor: 'pointer',
                    }}
                  >
                    {STATUS_OPTIONS.map(s => (
                      <option key={s} value={s} style={{ textTransform: 'capitalize' }}>{s}</option>
                    ))}
                  </select>
                </Td>
                <Td>
                  <button
                    onClick={() => setConfirmDel(o)}
                    aria-label={`Delete order #${o.id}`}
                    style={{
                      width: 28, height: 28, borderRadius: 7,
                      border: '1px solid var(--border)', background: 'white',
                      color: '#DC2626', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    <i className="ti ti-trash" style={{ fontSize: 13 }} aria-hidden="true" />
                  </button>
                </Td>
              </tr>
            ))}
          </tbody>
        </TableCard>
      )}

      {/* Modals */}
      <OrderFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSaved={msg => { setToast({ msg, type: 'success' }); setModalOpen(false); load(); }}
        onError={msg => setToast({ msg, type: 'error' })}
      />

      <ConfirmDialog
        open={!!confirmDel}
        title="Delete order"
        message={`Delete order #${confirmDel?.id} for "${confirmDel?.product_name}"? This cannot be undone.`}
        confirmLabel="Delete"
        danger
        onConfirm={handleDelete}
        onCancel={() => setConfirmDel(null)}
      />

      {toast && <Toast message={toast.msg} type={toast.type} onDone={() => setToast(null)} />}
    </div>
  );
}

// ── Create order modal ────────────────────────────────────────────────────────

function OrderFormModal({ open, onClose, onSaved, onError }: {
  open: boolean;
  onClose: () => void;
  onSaved: (msg: string) => void;
  onError: (msg: string) => void;
}) {
  const [products,  setProducts]  = useState<Product[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  // Form fields — match backend exactly
  const [product,  setProduct]  = useState('');
  const [supplier, setSupplier] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [address,  setAddress]  = useState('');
  const [phone,    setPhone]    = useState('');

  const [loading, setLoading] = useState(false);
  const [errors,  setErrors]  = useState<Record<string, string>>({});

  // Derived: show price of selected product
  const selectedProduct = products.find(p => String(p.id) === product);

  useEffect(() => {
    if (!open) return;
    // Reset form
    setProduct(''); setSupplier(''); setQuantity('1');
    setAddress(''); setPhone(''); setErrors({});

    // Fetch products and suppliers in parallel
    Promise.all([
      fetch(`${BASE_URL}/products/`, { headers: authHeaders() }).then(r => r.json()),
      fetch(`${BASE_URL}/orders/suppliers/`, { headers: authHeaders() }).then(r => r.json()),
    ])
      .then(([prods, sups]) => {
        setProducts(Array.isArray(prods) ? prods : []);
        setSuppliers(Array.isArray(sups) ? sups : []);
      })
      .catch(() => onError('Failed to load products or suppliers.'));
  }, [open]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    // Validate
    const errs: Record<string, string> = {};
    if (!product)            errs.product  = 'Required';
    if (!supplier)           errs.supplier = 'Required';
    if (!quantity || Number(quantity) < 1) errs.quantity = 'Must be at least 1';
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      // Payload matches backend OrderCreateSerializer exactly
      const payload = {
        product:  Number(product),
        supplier: Number(supplier),
        quantity: Number(quantity),
        address:  address.trim(),
        phone:    phone.trim(),
      };

      const res = await fetch(`${BASE_URL}/orders/create/`, {
        method:  'POST',
        headers: authHeaders(),
        body:    JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        // Map field-level DRF errors back to form
        const fieldErrs: Record<string, string> = {};
        Object.entries(err).forEach(([k, v]) => {
          fieldErrs[k] = Array.isArray(v) ? v[0] : String(v);
        });
        setErrors(fieldErrs);
        return;
      }

      onSaved('Order created successfully.');
    } catch {
      onError('Network error. Check the backend is running.');
    } finally {
      setLoading(false);
    }
  }

  const total = selectedProduct
    ? (Number(quantity) || 0) * Number(selectedProduct.price)
    : 0;

  return (
    <Modal open={open} onClose={onClose} title="New order" width={500}>
      <form onSubmit={handleSubmit} noValidate>

        {/* Product */}
        <div style={{ marginBottom: 14 }}>
          <label htmlFor="order-product" style={{
            display: 'block', fontSize: 13, fontWeight: 500,
            color: 'var(--ink)', marginBottom: 5,
          }}>
            Product <span style={{ color: '#DC2626' }}>*</span>
          </label>
          <select
            id="order-product"
            value={product}
            onChange={e => setProduct(e.target.value)}
            style={{
              width: '100%', padding: '9px 12px', borderRadius: 8,
              border: `1px solid ${errors.product ? '#FCA5A5' : 'var(--border)'}`,
              fontSize: 13.5, background: 'var(--surface)', color: 'var(--ink)',
            }}
          >
            <option value="">Select product…</option>
            {products.map(p => (
              <option key={p.id} value={p.id}>
                {p.name} — KSh {Number(p.price).toLocaleString()}
              </option>
            ))}
          </select>
          {errors.product && (
            <p role="alert" style={{ fontSize: 12, color: '#DC2626', marginTop: 4 }}>{errors.product}</p>
          )}
        </div>

        {/* Supplier */}
        <div style={{ marginBottom: 14 }}>
          <label htmlFor="order-supplier" style={{
            display: 'block', fontSize: 13, fontWeight: 500,
            color: 'var(--ink)', marginBottom: 5,
          }}>
            Supplier <span style={{ color: '#DC2626' }}>*</span>
          </label>
          <select
            id="order-supplier"
            value={supplier}
            onChange={e => setSupplier(e.target.value)}
            style={{
              width: '100%', padding: '9px 12px', borderRadius: 8,
              border: `1px solid ${errors.supplier ? '#FCA5A5' : 'var(--border)'}`,
              fontSize: 13.5, background: 'var(--surface)', color: 'var(--ink)',
            }}
          >
            <option value="">Select supplier…</option>
            {suppliers.map(s => (
              <option key={s.id} value={s.id}>
                {s.company_name} — {s.email}
              </option>
            ))}
          </select>
          {errors.supplier && (
            <p role="alert" style={{ fontSize: 12, color: '#DC2626', marginTop: 4 }}>{errors.supplier}</p>
          )}
          {suppliers.length === 0 && (
            <p style={{ fontSize: 12, color: 'var(--mist)', marginTop: 4 }}>
              No suppliers found. Register a supplier account first.
            </p>
          )}
        </div>

        {/* Quantity */}
        <div style={{ marginBottom: 14 }}>
          <label htmlFor="order-qty" style={{
            display: 'block', fontSize: 13, fontWeight: 500,
            color: 'var(--ink)', marginBottom: 5,
          }}>
            Quantity <span style={{ color: '#DC2626' }}>*</span>
          </label>
          <input
            id="order-qty"
            type="number"
            min="1"
            value={quantity}
            onChange={e => setQuantity(e.target.value)}
            style={{
              width: '100%', padding: '9px 12px', borderRadius: 8,
              border: `1px solid ${errors.quantity ? '#FCA5A5' : 'var(--border)'}`,
              fontSize: 13.5, background: 'var(--surface)',
            }}
          />
          {errors.quantity && (
            <p role="alert" style={{ fontSize: 12, color: '#DC2626', marginTop: 4 }}>{errors.quantity}</p>
          )}
        </div>

        {/* Address */}
        <Field
          label="Delivery address"
          id="order-address"
          value={address}
          onChange={setAddress}
          placeholder="Westlands, Nairobi"
        />

        {/* Phone */}
        <Field
          label="Contact phone"
          id="order-phone"
          type="tel"
          value={phone}
          onChange={setPhone}
          placeholder="+254 700 000 000"
        />

        {/* Total preview */}
        {total > 0 && (
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '11px 14px', borderRadius: 8,
            background: 'var(--surface)', border: '1px solid var(--border)',
            marginBottom: 16,
          }}>
            <span style={{ fontSize: 13.5, color: 'var(--slate)' }}>
              {quantity} × KSh {Number(selectedProduct?.price).toLocaleString()}
            </span>
            <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--ink)' }}>
              KSh {total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>
        )}

        <SubmitButton loading={loading}>Create order</SubmitButton>
      </form>
    </Modal>
  );
}
