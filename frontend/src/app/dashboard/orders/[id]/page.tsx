'use client';

import Link from 'next/link';

export default function PurchaseOrderDetailPlaceholder() {
  return <div style={{ maxWidth: 760, margin: '40px auto', background: 'white', border: '1px solid var(--border)', borderRadius: 12, padding: 28 }}><p style={{ color: 'var(--mist)', fontSize: 13 }}>Purchase order</p><h1 style={{ fontSize: 22, marginTop: 5 }}>Purchase-order details are being upgraded</h1><p style={{ color: 'var(--slate)', margin: '10px 0 20px', fontSize: 14 }}>The new P2P flow will expose issued POs, receipt progress, invoice matching, and an audit timeline here.</p><Link href="/dashboard/orders" style={{ color: 'var(--brand)', fontWeight: 600, fontSize: 14 }}>Back to purchase orders</Link></div>;
}
