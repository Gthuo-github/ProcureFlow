'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  function submit(event: FormEvent) { event.preventDefault(); setSent(true); }
  return <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24, background: 'var(--surface)' }}><form onSubmit={submit} style={{ width: '100%', maxWidth: 400, background: 'white', border: '1px solid var(--border)', borderRadius: 12, padding: 28 }}><p style={{ color: 'var(--brand)', fontWeight: 700, fontSize: 14, marginBottom: 20 }}>PROCUREFLOW</p><h1 style={{ fontSize: 24, letterSpacing: '-.03em' }}>Reset your password</h1><p style={{ margin: '8px 0 20px', fontSize: 13.5, color: 'var(--slate)' }}>Enter your account email and we will send reset instructions.</p><input aria-label="Email address" type="email" required placeholder="you@company.com" style={{ width: '100%', padding: '11px 12px', border: '1px solid var(--border)', borderRadius: 8, marginBottom: 12 }} /><button style={{ width: '100%', border: 0, borderRadius: 8, padding: '11px 14px', background: 'var(--brand)', color: 'white', fontWeight: 600 }}>{sent ? 'Instructions sent' : 'Send instructions'}</button>{sent && <p style={{ color: '#047857', fontSize: 12.5, marginTop: 12 }}>If an account exists, reset instructions have been sent.</p>}<Link href="/login" style={{ display: 'block', textAlign: 'center', marginTop: 18, color: 'var(--brand)', fontSize: 13 }}>Back to sign in</Link></form></div>;
}
