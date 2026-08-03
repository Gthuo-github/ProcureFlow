'use client';

import Link from 'next/link';

const STATS = [
  { value: '12k+', label: 'Active suppliers' },
  { value: '98%', label: 'Order accuracy' },
  { value: '3.2x', label: 'Faster sourcing' },
];

export default function Hero() {
  return (
    <section className="hero-section">
      <div className="hero-orb hero-orb-one" aria-hidden="true" />
      <div className="hero-orb hero-orb-two" aria-hidden="true" />
      <div className="hero-grid" aria-hidden="true" />
      <div className="hero-wrap">
        <div className="hero-copy">
          <div className="hero-eyebrow"><span /> Procurement made effortless</div>
          <h1>Procure to pay.<br /><em>Simplified.</em></h1>
          <p>Bring every supplier, purchase order, and spend decision into one beautifully simple workspace.</p>
          <div className="hero-actions">
            <Link className="button button-primary" href="/register">Get started free <span>→</span></Link>
            <Link className="button button-secondary" href="/products">Explore platform</Link>
          </div>
          <div className="hero-stats">
            {STATS.map((stat, index) => <div className="hero-stat" style={{ animationDelay: `${0.6 + index * 0.1}s` }} key={stat.label}><strong>{stat.value}</strong><span>{stat.label}</span></div>)}
          </div>
        </div>
        <div className="product-stage" aria-label="ProcureFlow dashboard preview">
          <div className="stage-glow" aria-hidden="true" />
          <div className="app-window">
            <div className="app-sidebar"><div className="app-brand"><i /> PF</div>{['Overview', 'Orders', 'Suppliers', 'Invoices', 'Reports'].map((item, i) => <span className={i === 0 ? 'active' : ''} key={item}>{item}</span>)}</div>
            <div className="app-content">
              <div className="app-top"><span>Overview</span><b>•••</b></div>
              <div className="app-welcome"><div><small>Friday, May 17</small><h2>Good morning, Alex <span>👋</span></h2><p>Here&apos;s what&apos;s happening with your procurement.</p></div><div className="mini-avatar">AU</div></div>
              <div className="metric-row"><Metric value="$24.8k" label="Total spend" trend="↗ 12.4%" /><Metric value="68" label="Open orders" trend="↗ 8 this week" /><Metric value="92%" label="On-time delivery" trend="↗ 2.1%" /></div>
              <div className="dashboard-grid"><div className="chart-card"><div className="card-title">Spend overview <small>Last 6 months</small></div><div className="line-chart"><svg viewBox="0 0 360 130" preserveAspectRatio="none"><path d="M0 106 L42 82 L84 91 L126 52 L168 72 L210 34 L252 55 L294 24 L360 40" fill="none" stroke="#2563eb" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/><path d="M0 106 L42 82 L84 91 L126 52 L168 72 L210 34 L252 55 L294 24 L360 40 L360 130 L0 130Z" fill="url(#chartFill)"/><defs><linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1"><stop stopColor="#2563eb" stopOpacity=".2"/><stop offset="1" stopColor="#2563eb" stopOpacity="0"/></linearGradient></defs></svg></div><div className="chart-months"><span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span></div></div><div className="ring-card"><div className="card-title">Orders by status</div><div className="ring"><strong>24<small>Total</small></strong></div><div className="legend"><span><i /> Approved</span><span><i /> Pending</span></div></div></div>
              <div className="recent-card"><div className="card-title">Recent purchase orders <a>View all</a></div>{['Office equipment', 'Cloud services', 'Marketing campaign'].map((name, i) => <div className="order-row" key={name}><span className="order-icon">{i === 0 ? '▣' : i === 1 ? '◌' : '◇'}</span><span>{name}<small>PO-2024-0{42 + i}</small></span><b>${[4500, 2200, 6800][i].toLocaleString()}</b><em>{i === 1 ? 'Pending' : 'Approved'}</em></div>)}</div>
            </div>
          </div>
          <div className="floating-card savings-card"><span>Monthly savings</span><strong>$8,240</strong><small>↑ 18.2% this month</small></div>
          <div className="floating-card notification-card"><div>✓</div><span><b>Order approved</b><small>PO-2024-042 is ready</small></span></div>
        </div>
      </div>
    </section>
  );
}

function Metric({ value, label, trend }: { value: string; label: string; trend: string }) { return <div className="metric"><small>{label}</small><strong>{value}</strong><span>{trend}</span></div>; }
