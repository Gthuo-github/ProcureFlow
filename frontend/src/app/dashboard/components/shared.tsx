'use client';

import { useEffect, ReactNode } from 'react';

// ── Modal ─────────────────────────────────────────────────────────────────────

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  width?: number;
}

export function Modal({ open, onClose, title, children, width = 480 }: ModalProps) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose(); }
    if (open) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(13,17,23,0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1.5rem',
        animation: 'fadeIn 0.15s ease',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        style={{
          background: 'white', borderRadius: 14,
          width: '100%', maxWidth: width,
          maxHeight: '85vh', overflowY: 'auto',
          boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
          animation: 'slideUp 0.2s cubic-bezier(.4,0,.2,1)',
        }}
      >
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '1.1rem 1.4rem', borderBottom: '1px solid var(--border)',
          position: 'sticky', top: 0, background: 'white', zIndex: 1,
        }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--ink)' }}>{title}</h3>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              background: 'var(--ink)', border: '1px solid var(--ink)',
              width: 28, height: 28, borderRadius: 8,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', cursor: 'pointer',
            }}
            onMouseOver={e => (e.currentTarget.style.background = '#0F172A')}
            onMouseOut={e => (e.currentTarget.style.background = 'var(--ink)')}
          >
            <i className="ti ti-x" style={{ fontSize: 15 }} aria-hidden="true" />
          </button>
        </div>
        <div style={{ padding: '1.4rem' }}>{children}</div>
      </div>
      <style>{`
        @keyframes fadeIn  { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}

// ── Form field ────────────────────────────────────────────────────────────────

interface FieldProps {
  label: string;
  id: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  as?: 'input' | 'textarea' | 'select';
  options?: { value: string; label: string }[];
  step?: string;
  min?: string;
}

export function Field({
  label, id, type = 'text', value, onChange, placeholder,
  required, error, as = 'input', options, step, min,
}: FieldProps) {
  const baseStyle: React.CSSProperties = {
    width: '100%', padding: '9px 12px', borderRadius: 8,
    border: `1px solid ${error ? '#FCA5A5' : 'var(--border)'}`,
    fontSize: 13.5, color: 'var(--ink)',
    background: error ? '#FFF5F5' : 'var(--surface)',
    outline: 'none', transition: 'border-color 0.15s',
    fontFamily: 'inherit',
  };

  return (
    <div style={{ marginBottom: 14 }}>
      <label htmlFor={id} style={{
        display: 'block', fontSize: 13, fontWeight: 500,
        color: 'var(--ink)', marginBottom: 5,
      }}>
        {label}{required && <span style={{ color: '#DC2626' }}> *</span>}
      </label>

      {as === 'textarea' ? (
        <textarea
          id={id} value={value} placeholder={placeholder}
          onChange={e => onChange(e.target.value)}
          rows={3} style={{ ...baseStyle, resize: 'vertical' }}
        />
      ) : as === 'select' ? (
        <select id={id} value={value} onChange={e => onChange(e.target.value)} style={baseStyle}>
          <option value="">Select…</option>
          {options?.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      ) : (
        <input
          id={id} type={type} value={value} placeholder={placeholder}
          step={step} min={min}
          onChange={e => onChange(e.target.value)}
          style={baseStyle}
        />
      )}

      {error && <p role="alert" style={{ fontSize: 12, color: '#DC2626', marginTop: 4 }}>{error}</p>}
    </div>
  );
}

// ── Submit button ─────────────────────────────────────────────────────────────

export function SubmitButton({ loading, children }: { loading: boolean; children: ReactNode }) {
  return (
    <button
      type="submit"
      disabled={loading}
      style={{
        width: '100%', padding: '11px', borderRadius: 8,
        background: loading ? 'var(--mist)' : 'var(--brand)',
        color: 'white', fontSize: 14, fontWeight: 500, border: 'none',
        cursor: loading ? 'not-allowed' : 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        marginTop: 6,
      }}
    >
      {loading && (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"
          style={{ animation: 'spin 1s linear infinite' }} aria-hidden="true">
          <circle cx="12" cy="12" r="10" strokeOpacity=".25" />
          <path d="M12 2a10 10 0 0110 10" strokeLinecap="round" />
        </svg>
      )}
      {children}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </button>
  );
}

// ── Toast ─────────────────────────────────────────────────────────────────────

export function Toast({ message, type = 'success', onDone }: { message: string; type?: 'success' | 'error'; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3000);
    return () => clearTimeout(t);
  }, [onDone]);

  const isError = type === 'error';

  return (
    <div role="status" style={{
      position: 'fixed', bottom: 24, right: 24, zIndex: 300,
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '12px 18px', borderRadius: 10,
      background: isError ? '#FEF2F2' : '#ECFDF5',
      border: `1px solid ${isError ? '#FCA5A5' : '#A7F3D0'}`,
      color: isError ? '#991B1B' : '#065F46',
      fontSize: 14, fontWeight: 500,
      boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
      animation: 'slideIn 0.2s ease',
      maxWidth: 360,
    }}>
      <i className={`ti ${isError ? 'ti-alert-circle' : 'ti-circle-check'}`} style={{ fontSize: 18, flexShrink: 0 }} aria-hidden="true" />
      {message}
      <style>{`@keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }`}</style>
    </div>
  );
}

// ── Confirm dialog ────────────────────────────────────────────────────────────

interface ConfirmProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({ open, title, message, confirmLabel = 'Confirm', danger, onConfirm, onCancel }: ConfirmProps) {
  if (!open) return null;
  return (
    <Modal open={open} onClose={onCancel} title={title} width={380}>
      <p style={{ fontSize: 14, color: 'var(--slate)', lineHeight: 1.6, marginBottom: 20 }}>{message}</p>
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={onCancel} style={{
          flex: 1, padding: '10px', borderRadius: 8,
          border: '1px solid var(--border)', background: 'white',
          fontSize: 13.5, color: 'var(--brand)', cursor: 'pointer',
        }} onMouseOver={e => (e.currentTarget.style.background = '#F8FAFC')}
          onMouseOut={e => (e.currentTarget.style.background = 'white')}>
          Cancel
        </button>
        <button onClick={onConfirm} style={{
          flex: 1, padding: '10px', borderRadius: 8, border: 'none',
          background: danger ? '#B91C1C' : '#1A56DB',
          fontSize: 13.5, fontWeight: 500, color: 'white', cursor: 'pointer',
        }} onMouseOver={e => (e.currentTarget.style.opacity = '0.92')}
          onMouseOut={e => (e.currentTarget.style.opacity = '1')}>
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
