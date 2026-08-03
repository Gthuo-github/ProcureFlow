'use client'
import Link from 'next/link';

const LINKS = {
  Product:  ['Features', 'Pricing', 'Changelog', 'Roadmap'],
  Company:  ['About', 'Blog', 'Careers', 'Press'],
  Support:  ['Documentation', 'API Reference', 'Status', 'Contact'],
  Legal:    ['Privacy', 'Terms', 'Security', 'Cookies'],
};

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer style={{
      borderTop:  '1px solid var(--border)',
      background: 'var(--surface)',
      padding:    'clamp(3rem, 6vw, 5rem) clamp(1.5rem, 6vw, 3rem) 2rem',
    }}>
      <div style={{ maxWidth: 1120, margin: '0 auto' }}>

        {/* Top row */}
        <div style={{
          display:             'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap:                 '2.5rem',
          paddingBottom:       '3rem',
          borderBottom:        '1px solid var(--border)',
        }}>
          {/* Brand column */}
          <div style={{ gridColumn: 'span 1' }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <span style={{
                width: 32, height: 32, borderRadius: 7,
                background: 'var(--brand)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                  <rect x="2" y="2" width="6" height="6" rx="1.5" fill="white"/>
                  <rect x="10" y="2" width="6" height="6" rx="1.5" fill="white" opacity=".6"/>
                  <rect x="2" y="10" width="6" height="6" rx="1.5" fill="white" opacity=".6"/>
                  <rect x="10" y="10" width="6" height="6" rx="1.5" fill="white"/>
                </svg>
              </span>
              <span style={{
                fontFamily:   'var(--font-display)',
                fontWeight:   700,
                fontSize:     16,
                color:        'var(--ink)',
                letterSpacing: '-0.02em',
              }}>ProcureFlow</span>
            </Link>
            <p style={{ fontSize: 13, color: 'var(--mist)', lineHeight: 1.6, maxWidth: 200 }}>
              Modern procurement for teams that move fast.
            </p>

            {/* Social links */}
            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              {[
                { label: 'Twitter', path: 'M22 4.01c-.77.35-1.6.58-2.46.69a4.3 4.3 0 001.88-2.37c-.83.49-1.75.85-2.72 1.04A4.28 4.28 0 0015.42 2c-2.37 0-4.29 1.92-4.29 4.29 0 .34.04.67.11.98C7.39 7.1 4.1 5.39 1.67 2.8a4.3 4.3 0 00-.58 2.16c0 1.49.76 2.8 1.91 3.57-.7-.02-1.37-.22-1.95-.54v.05c0 2.08 1.48 3.81 3.44 4.21-.36.1-.74.15-1.13.15-.28 0-.54-.03-.8-.08.54 1.69 2.11 2.92 3.97 2.95A8.6 8.6 0 012 16.54 12.13 12.13 0 008.29 18.5c7.55 0 11.68-6.26 11.68-11.68l-.01-.53A8.34 8.34 0 0022 4.01z' },
                { label: 'LinkedIn', path: 'M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z M4 6a2 2 0 100-4 2 2 0 000 4z' },
              ].map(({ label, path }) => (
                  <button
                  key={label}
                  aria-label={label}
                  style={{
                    width:        34,
                    height:       34,
                    borderRadius: 8,
                    border:       '1px solid var(--border)',
                    background:   'white',
                    display:      'flex',
                    alignItems:   'center',
                    justifyContent: 'center',
                    color:        'var(--mist)',
                    transition:   'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    cursor:       'pointer',
                  }}
                  onMouseOver={e => { 
                    const el = e.currentTarget;
                    (el as HTMLElement).style.color='var(--brand)'; 
                    (el as HTMLElement).style.borderColor='var(--brand)';
                    (el as HTMLElement).style.transform='translateY(-2px)';
                    (el as HTMLElement).style.boxShadow='0 4px 12px rgba(26,86,219,0.15)';
                  }}
                  onMouseOut={e  => { 
                    const el = e.currentTarget;
                    (el as HTMLElement).style.color='var(--mist)'; 
                    (el as HTMLElement).style.borderColor='var(--border)';
                    (el as HTMLElement).style.transform='none';
                    (el as HTMLElement).style.boxShadow='none';
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d={path}/>
                  </svg>
                </button>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([category, items]) => (
            <div key={category}>
              <p style={{
                fontSize:     12,
                fontWeight:   500,
                color:        'var(--ink)',
                letterSpacing: '.07em',
                textTransform: 'uppercase',
                marginBottom: 14,
              }}>
                {category}
              </p>
              <ul style={{ listStyle: 'none' }}>
                {items.map(item => (
                  <li key={item} style={{ marginBottom: 10 }}>
                     <Link
                      href="#"
                      style={{
                        fontSize:   14,
                        color:      'var(--mist)',
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                      }}
                      onMouseOver={e => {
                        const el = e.currentTarget as HTMLElement;
                        el.style.color = 'var(--brand)';
                        el.style.transform = 'translateX(4px)';
                      }}
                      onMouseOut={e  => {
                        const el = e.currentTarget as HTMLElement;
                        el.style.color = 'var(--mist)';
                        el.style.transform = 'none';
                      }}
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom row */}
        <div style={{
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'space-between',
          paddingTop:     '1.5rem',
          flexWrap:       'wrap',
          gap:            12,
        }}>
          <p style={{ fontSize: 13, color: 'var(--mist)' }}>
            © {year} ProcureFlow. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: 20 }}>
            {['Privacy', 'Terms', 'Cookies'].map(item => (
              <Link
                key={item}
                href="#"
                style={{
                  fontSize:   13,
                  color:      'var(--mist)',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
                onMouseOver={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.color = 'var(--brand)';
                  el.style.transform = 'translateX(2px)';
                }}
                onMouseOut={e  => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.color = 'var(--mist)';
                  el.style.transform = 'none';
                }}
              >
                {item}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}
