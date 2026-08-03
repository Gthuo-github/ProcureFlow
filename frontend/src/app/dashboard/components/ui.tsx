// ── Stat card ────────────────────────────────────────────────────────────────
interface StatCardProps {
  label:  string;
  value:  string | number;
  icon:   string;
  trend?: { value: string; up: boolean };
  color?: string;
  bg?:    string;
}

export function StatCard({ label, value, icon, trend, color = 'var(--brand)', bg = 'var(--brand-pale)' }: StatCardProps) {
  return (
    <div style={{
      background:   'white',
      border:       '1px solid var(--border)',
      borderRadius: 12,
      padding:      '1.25rem',
    }} className="dashboard-stat">
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 10,
          background: bg, color,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <i className={`ti ${icon}`} style={{ fontSize: 20 }} aria-hidden="true" />
        </div>
        {trend && (
          <span style={{
            fontSize: 12, fontWeight: 500,
            color:    trend.up ? '#059669' : '#DC2626',
            background: trend.up ? '#ECFDF5' : '#FEF2F2',
            padding:  '3px 8px', borderRadius: 100,
            display:  'flex', alignItems: 'center', gap: 3,
          }}>
            <i className={`ti ${trend.up ? 'ti-trending-up' : 'ti-trending-down'}`}
               style={{ fontSize: 13 }} aria-hidden="true" />
            {trend.value}
          </span>
        )}
      </div>
      <p style={{ fontSize: 13, color: 'var(--mist)', marginBottom: 4 }}>{label}</p>
      <p style={{ fontSize: 26, fontWeight: 600, color: 'var(--ink)', letterSpacing: '-0.03em', lineHeight: 1 }}>
        {value}
      </p>
    </div>
  );
}

// ── Section header ────────────────────────────────────────────────────────────
interface SectionHeaderProps {
  title:    string;
  subtitle?: string;
  action?:  React.ReactNode;
}

export function SectionHeader({ title, subtitle, action }: SectionHeaderProps) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start',
      justifyContent: 'space-between', marginBottom: '1.25rem',
      gap: 12, flexWrap: 'wrap',
    }}>
      <div>
        <h2 style={{
          fontSize: 18, fontWeight: 600,
          color: 'var(--ink)', letterSpacing: '-0.02em',
        }}>{title}</h2>
        {subtitle && (
          <p style={{ fontSize: 13, color: 'var(--mist)', marginTop: 2 }}>{subtitle}</p>
        )}
      </div>
      {action}
    </div>
  );
}

// ── Empty state ───────────────────────────────────────────────────────────────
export function EmptyState({ icon, message }: { icon: string; message: string }) {
  return (
    <div style={{
      padding: '2.5rem', textAlign: 'center',
      color: 'var(--mist)',
    }}>
      <i className={`ti ${icon}`} style={{ fontSize: 36, marginBottom: 10, display: 'block' }} aria-hidden="true" />
      <p style={{ fontSize: 14 }}>{message}</p>
    </div>
  );
}

// ── Status badge ─────────────────────────────────────────────────────────────
const STATUS_MAP: Record<string, { bg: string; color: string }> = {
  pending:   { bg: '#FFFBEB', color: '#854D0E' },
  active:    { bg: '#ECFDF5', color: '#065F46' },
  completed: { bg: '#EFF6FF', color: '#1D4ED8' },
  cancelled: { bg: '#FEF2F2', color: '#991B1B' },
  paid:      { bg: '#ECFDF5', color: '#065F46' },
  overdue:   { bg: '#FEF2F2', color: '#991B1B' },
  draft:     { bg: 'var(--surface)', color: 'var(--slate)' },
  'pending approval': { bg: '#FFF7ED', color: '#9A3412' },
  approved: { bg: '#ECFDF5', color: '#065F46' },
  sourcing: { bg: '#EFF6FF', color: '#1D4ED8' },
  'purchase order issued': { bg: '#F5F3FF', color: '#6D28D9' },
  rejected: { bg: '#FEF2F2', color: '#991B1B' },
  exception: { bg: '#FEF2F2', color: '#991B1B' },
};

export function StatusBadge({ status }: { status: string }) {
  const s = STATUS_MAP[status.toLowerCase()] || STATUS_MAP.draft;
  return (
    <span style={{
      padding: '3px 10px', borderRadius: 100,
      fontSize: 12, fontWeight: 500,
      background: s.bg, color: s.color,
      textTransform: 'capitalize',
    }}>
      {status}
    </span>
  );
}

// ── Table wrapper ─────────────────────────────────────────────────────────────
export function TableCard({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      background: 'white', border: '1px solid var(--border)',
      borderRadius: 12, overflow: 'hidden',
    }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 500 }}>
          {children}
        </table>
      </div>
    </div>
  );
}

export function Th({ children }: { children: React.ReactNode }) {
  return (
    <th style={{
      padding: '11px 16px', textAlign: 'left',
      fontSize: 12, fontWeight: 500, color: 'var(--mist)',
      borderBottom: '1px solid var(--border)',
      textTransform: 'uppercase', letterSpacing: '0.05em',
      background: 'var(--surface)',
    }}>
      {children}
    </th>
  );
}

export function Td({ children, muted }: { children: React.ReactNode; muted?: boolean }) {
  return (
    <td style={{
      padding: '12px 16px',
      fontSize: 14,
      color: muted ? 'var(--mist)' : 'var(--ink)',
      borderBottom: '1px solid var(--border)',
    }}>
      {children}
    </td>
  );
}
