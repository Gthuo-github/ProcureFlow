'use client';

import { useEffect, useState, FormEvent } from 'react';
import {
  getUsers, deactivateUser, activateUser, changeUserRole,
  registerCustomer, registerSupplier, registerAdmin, AppUser,
} from '@/lib/api';
import { SectionHeader, TableCard, Th, Td, EmptyState } from '../components/ui';
import { Modal, Field, SubmitButton, Toast, ConfirmDialog } from '../components/shared';

const ROLE_BADGE: Record<string, { bg: string; color: string }> = {
  admin:    { bg: '#FEF2F2', color: '#991B1B' },
  supplier: { bg: '#FFFBEB', color: '#854D0E' },
  customer: { bg: '#EFF6FF', color: '#1D4ED8' },
};

export default function UsersPage() {
  const [users,   setUsers]   = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{ user: AppUser; type: 'activate' | 'deactivate' } | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  async function load() {
    setLoading(true);
    try {
      const data = await getUsers(roleFilter || undefined);
      setUsers(data);
    } catch {
      setToast({ msg: 'Failed to load users.', type: 'error' });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [roleFilter]);

  const filtered = users.filter(u =>
    !search || `${u.first_name} ${u.last_name} ${u.email}`.toLowerCase().includes(search.toLowerCase())
  );

  async function handleToggleStatus() {
    if (!confirmAction) return;
    try {
      if (confirmAction.type === 'deactivate') {
        await deactivateUser(confirmAction.user.id);
        setToast({ msg: `${confirmAction.user.first_name} deactivated.`, type: 'success' });
      } else {
        await activateUser(confirmAction.user.id);
        setToast({ msg: `${confirmAction.user.first_name} activated.`, type: 'success' });
      }
      setConfirmAction(null);
      load();
    } catch (err: any) {
      setToast({ msg: err?.error || 'Action failed.', type: 'error' });
      setConfirmAction(null);
    }
  }

  async function handleRoleChange(user: AppUser, role: string) {
    try {
      await changeUserRole(user.id, role);
      setToast({ msg: `Role updated to ${role}.`, type: 'success' });
      load();
    } catch (err: any) {
      setToast({ msg: err?.role?.[0] || 'Failed to update role.', type: 'error' });
    }
  }

  return (
    <div>
      <SectionHeader
        title="Users"
        subtitle={`${users.length} registered user${users.length !== 1 ? 's' : ''}`}
        action={
          <button
            onClick={() => setModalOpen(true)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '8px 16px', borderRadius: 8,
              background: 'var(--brand)', color: 'white',
              fontSize: 13.5, fontWeight: 500, border: 'none', cursor: 'pointer',
            }}
          >
            <i className="ti ti-user-plus" style={{ fontSize: 15 }} aria-hidden="true" />
            Add user
          </button>
        }
      />

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <i className="ti ti-search" style={{
            position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
            fontSize: 15, color: 'var(--mist)',
          }} aria-hidden="true" />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or email…"
            style={{
              width: '100%', padding: '9px 12px 9px 36px', borderRadius: 8,
              border: '1px solid var(--border)', fontSize: 13.5, background: 'white', outline: 'none',
            }}
          />
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {['', 'admin', 'customer', 'supplier'].map(r => (
            <button key={r} onClick={() => setRoleFilter(r)} style={{
              padding: '8px 14px', borderRadius: 8,
              border: `1px solid ${roleFilter === r ? 'var(--brand)' : 'var(--border)'}`,
              background: roleFilter === r ? 'var(--brand-pale)' : 'white',
              color: roleFilter === r ? 'var(--brand)' : 'var(--slate)',
              fontSize: 13, fontWeight: roleFilter === r ? 500 : 400,
              cursor: 'pointer', textTransform: 'capitalize',
            }}>
              {r || 'All'}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ height: 300, borderRadius: 12, background: 'white', border: '1px solid var(--border)' }} />
      ) : filtered.length === 0 ? (
        <div style={{ background: 'white', borderRadius: 12, border: '1px solid var(--border)' }}>
          <EmptyState icon="ti-users-group" message="No users match your search." />
        </div>
      ) : (
        <TableCard>
          <thead>
            <tr>
              <Th>User</Th>
              <Th>Email</Th>
              <Th>Role</Th>
              <Th>Status</Th>
              <Th>Joined</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(u => {
              const rb = ROLE_BADGE[u.role] || ROLE_BADGE.customer;
              return (
                <tr key={u.id}
                  onMouseOver={e => (e.currentTarget.style.background = 'var(--surface)')}
                  onMouseOut={e  => (e.currentTarget.style.background = 'transparent')}>
                  <Td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 30, height: 30, borderRadius: '50%',
                        background: 'var(--brand-pale)', flexShrink: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 11, fontWeight: 600, color: 'var(--brand)',
                      }}>
                        {u.first_name[0]}{u.last_name[0]}
                      </div>
                      <span style={{ fontWeight: 500 }}>{u.first_name} {u.last_name}</span>
                    </div>
                  </Td>
                  <Td muted>{u.email}</Td>
                  <Td>
                    <select
                      value={u.role}
                      onChange={e => handleRoleChange(u, e.target.value)}
                      style={{
                        padding: '3px 8px', borderRadius: 100, fontSize: 12, fontWeight: 500,
                        background: rb.bg, color: rb.color, border: 'none',
                        textTransform: 'capitalize', cursor: 'pointer',
                      }}
                    >
                      <option value="customer">Customer</option>
                      <option value="supplier">Supplier</option>
                      <option value="admin">Admin</option>
                    </select>
                  </Td>
                  <Td>
                    <span style={{
                      padding: '3px 10px', borderRadius: 100, fontSize: 12, fontWeight: 500,
                      background: u.is_active ? '#ECFDF5' : '#FEF2F2',
                      color:      u.is_active ? '#065F46' : '#991B1B',
                    }}>
                      {u.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </Td>
                  <Td muted>{new Date(u.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</Td>
                  <Td>
                    <button
                      onClick={() => setConfirmAction({ user: u, type: u.is_active ? 'deactivate' : 'activate' })}
                      style={{
                        padding: '5px 12px', borderRadius: 7,
                        border: '1px solid var(--border)',
                        background: 'white', fontSize: 12.5,
                        color: u.is_active ? '#DC2626' : '#059669',
                        cursor: 'pointer',
                      }}
                    >
                      {u.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </TableCard>
      )}

      <AddUserModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSaved={(msg) => { setToast({ msg, type: 'success' }); setModalOpen(false); load(); }}
        onError={(msg) => setToast({ msg, type: 'error' })}
      />

      <ConfirmDialog
        open={!!confirmAction}
        title={confirmAction?.type === 'deactivate' ? 'Deactivate user' : 'Activate user'}
        message={
          confirmAction?.type === 'deactivate'
            ? `${confirmAction.user.first_name} will lose access to their account immediately. You can reactivate them later.`
            : `${confirmAction?.user.first_name} will regain access to their account.`
        }
        confirmLabel={confirmAction?.type === 'deactivate' ? 'Deactivate' : 'Activate'}
        danger={confirmAction?.type === 'deactivate'}
        onConfirm={handleToggleStatus}
        onCancel={() => setConfirmAction(null)}
      />

      {toast && <Toast message={toast.msg} type={toast.type} onDone={() => setToast(null)} />}
    </div>
  );
}

// ── Add user modal ──────────────────────────────────────────────────────────

function AddUserModal({ open, onClose, onSaved, onError }: {
  open: boolean; onClose: () => void;
  onSaved: (msg: string) => void; onError: (msg: string) => void;
}) {
  const [role, setRole] = useState<'customer' | 'supplier' | 'admin'>('customer');
  const [values, setValues] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) { setValues({}); setErrors({}); setRole('customer'); }
  }, [open]);

  function set(id: string, v: string) {
    setValues(prev => ({ ...prev, [id]: v }));
    setErrors(prev => ({ ...prev, [id]: '' }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!values.first_name) errs.first_name = 'Required';
    if (!values.last_name)  errs.last_name  = 'Required';
    if (!values.email)      errs.email      = 'Required';
    if (!values.password || values.password.length < 8) errs.password = 'Minimum 8 characters';
    if (values.password !== values.password2) errs.password2 = 'Passwords do not match';
    if (role === 'supplier' && !values.company_name) errs.company_name = 'Required';
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      if (role === 'customer') await registerCustomer(values);
      else if (role === 'supplier') await registerSupplier(values);
      else await registerAdmin(values);
      onSaved(`${role.charAt(0).toUpperCase() + role.slice(1)} account created.`);
    } catch (err: any) {
      const fieldErrs: Record<string, string> = {};
      if (err && typeof err === 'object') {
        Object.entries(err).forEach(([k, v]) => { fieldErrs[k] = Array.isArray(v) ? v[0] : String(v); });
      }
      if (Object.keys(fieldErrs).length) setErrors(fieldErrs);
      else onError('Failed to create user.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Add user">
      {/* Role tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 18, background: 'var(--surface)', padding: 4, borderRadius: 9 }}>
        {(['customer', 'supplier', 'admin'] as const).map(r => (
          <button key={r} type="button" onClick={() => setRole(r)} style={{
            flex: 1, padding: '7px', borderRadius: 6, border: 'none',
            background: role === r ? 'white' : 'transparent',
            boxShadow: role === r ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
            fontSize: 13, fontWeight: role === r ? 500 : 400,
            color: role === r ? 'var(--ink)' : 'var(--mist)',
            cursor: 'pointer', textTransform: 'capitalize',
          }}>{r}</button>
        ))}
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 12px' }}>
          <Field label="First name" id="first_name" value={values.first_name || ''} onChange={v => set('first_name', v)} required error={errors.first_name} />
          <Field label="Last name"  id="last_name"  value={values.last_name  || ''} onChange={v => set('last_name', v)}  required error={errors.last_name} />
        </div>
        <Field label="Email" id="email" type="email" value={values.email || ''} onChange={v => set('email', v)} required error={errors.email} />
        <Field label="Phone" id="phone" type="tel" value={values.phone || ''} onChange={v => set('phone', v)} placeholder="+254 700 000 000" />

        {role === 'customer' && (
          <Field label="Address" id="address" value={values.address || ''} onChange={v => set('address', v)} placeholder="Westlands, Nairobi" />
        )}
        {role === 'supplier' && (
          <>
            <Field label="Company name" id="company_name" value={values.company_name || ''} onChange={v => set('company_name', v)} required error={errors.company_name} />
            <Field label="Company address" id="company_address" value={values.company_address || ''} onChange={v => set('company_address', v)} placeholder="Industrial Area, Nairobi" />
          </>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 12px' }}>
          <Field label="Password" id="password" type="password" value={values.password || ''} onChange={v => set('password', v)} required error={errors.password} />
          <Field label="Confirm password" id="password2" type="password" value={values.password2 || ''} onChange={v => set('password2', v)} required error={errors.password2} />
        </div>

        <SubmitButton loading={loading}>Create {role} account</SubmitButton>
      </form>
    </Modal>
  );
}
