'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

const links = [
  { href: '/products', label: 'Products' },
  { href: '/suppliers', label: 'Suppliers' },
  { href: '/dashboard', label: 'Dashboard' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { user, logout, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 12);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  async function signOut() {
    await logout();
    router.push('/');
  }

  return (
    <nav className={`site-nav ${scrolled ? 'site-nav-scrolled' : ''}`} aria-label="Main navigation">
      <Link href="/" className="site-brand" aria-label="ProcureFlow home">
        <i><span /><span /><span /><span /></i><strong>ProcureFlow</strong>
      </Link>
      <div className="site-links">
        {links.map(link => <Link className={pathname === link.href ? 'selected' : ''} href={link.href} key={link.href}>{link.label}</Link>)}
      </div>
      <div className="site-actions">
        {!loading && (user ? <><span className="site-user">{user.first_name}</span><button onClick={signOut}>Sign out</button></> : <><Link className="nav-signin" href="/login">Sign in</Link><Link className="nav-primary" href="/register">Get started</Link></>)}
      </div>
      <button className="site-menu" type="button" aria-label="Toggle navigation" aria-expanded={open} onClick={() => setOpen(value => !value)}><span /><span /><span /></button>
      {open && <div className="site-mobile-links">{links.map(link => <Link href={link.href} key={link.href}>{link.label}</Link>)}{!user && <Link href="/login">Sign in</Link>}<Link href="/register">Get started</Link></div>}
      <style>{`
        .site-nav{height:var(--nav-h);position:fixed;inset:0 0 auto;z-index:100;display:flex;align-items:center;padding:0 clamp(1rem,5vw,3rem);gap:1.4rem;background:transparent;transition:.25s}.site-nav-scrolled{background:rgba(255,255,255,.92);backdrop-filter:blur(14px);border-bottom:1px solid #e2e8f0;box-shadow:0 1px 20px rgba(0,0,0,.05)}.site-brand{display:flex;align-items:center;gap:.55rem;color:#10264e}.site-brand i{display:grid;grid-template-columns:repeat(2,5px);gap:2px;padding:7px;border-radius:7px;background:#1a56db}.site-brand i span{width:5px;height:5px;border-radius:1px;background:#fff}.site-brand strong{font-family:var(--font-display);font-size:1rem;letter-spacing:-.03em}.site-links{display:flex;gap:.2rem;margin-left:auto}.site-links a,.site-actions button,.nav-signin{padding:.48rem .75rem;border-radius:7px;color:#53657e;font-size:.82rem;transition:.2s}.site-links a:hover,.site-links .selected{background:#edf4ff;color:#1a56db}.site-actions{display:flex;align-items:center;gap:.45rem}.site-actions button{border:1px solid #dce5f2;background:transparent}.site-user{font-size:.78rem;color:#53657e}.nav-signin{border:1px solid #dce5f2}.nav-primary{padding:.52rem .9rem;border-radius:7px;background:#1a56db;color:#fff;font-size:.8rem;font-weight:600;box-shadow:0 5px 12px rgba(26,86,219,.2)}.site-menu{display:none;margin-left:auto;border:0;background:transparent}.site-menu span{display:block;width:22px;height:2px;margin:4px;background:#10264e}.site-mobile-links{display:none}@media(max-width:768px){.site-links,.site-actions{display:none}.site-menu{display:block}.site-mobile-links{position:absolute;top:calc(var(--nav-h) - 1px);left:0;right:0;display:grid;gap:.35rem;padding:1rem;background:#fff;border-bottom:1px solid #e2e8f0;box-shadow:0 12px 24px rgba(0,0,0,.08)}.site-mobile-links a{padding:.7rem .8rem;border-radius:7px;color:#314665;font-size:.85rem}.site-mobile-links a:last-child{background:#1a56db;color:#fff;text-align:center;font-weight:600}}
      `}</style>
    </nav>