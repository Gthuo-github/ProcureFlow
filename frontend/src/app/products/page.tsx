'use client';

import { useEffect, useState } from 'react';
import { getProducts, Product } from '@/lib/api';
import { EmptyState } from '@/app/dashboard/components/ui';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      try {
        const items = await getProducts(search ? { search } : undefined);
        if (active) setProducts(items);
      } catch {
        if (active) setProducts([]);
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => { active = false; };
  }, [search]);

  return (
    <div style={{
      padding: 'calc(var(--nav-h) + 1.5rem) clamp(1rem, 5vw, 3rem) 2rem',
      maxWidth: 1200,
      margin: '0 auto',
      width: '100%',
      boxSizing: 'border-box',
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24, minWidth: 0 }}>
        <div>
          <p style={{ margin: 0, fontSize: 13, color: 'var(--brand)', textTransform: 'uppercase', letterSpacing: '.12em' }}>
            Browse products
          </p>
          <h1 style={{ margin: '0.5rem 0 0', fontSize: 32, lineHeight: 1.1, fontWeight: 700, color: 'var(--ink)' }}>
            All available products
          </h1>
        </div>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search products by name or category..."
          style={{
            width: '100%', maxWidth: 520,
            padding: '12px 14px', borderRadius: 12,
            border: '1px solid var(--border)', fontSize: 14,
            outline: 'none', background: 'white', color: 'var(--ink)',
          }}
        />
      </div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
          {[...Array(6)].map((_, idx) => (
            <div key={idx} style={{ height: 220, borderRadius: 12, background: 'white', border: '1px solid var(--border)' }} />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div style={{ background: 'white', borderRadius: 12, border: '1px solid var(--border)', padding: 32 }}>
          <EmptyState icon="ti-box-off" message="No products are available right now. Try another search or check back later." />
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
          {products.map(product => (
            <div key={product.id} style={{
              background: 'white', border: '1px solid var(--border)',
              borderRadius: 12, overflow: 'hidden',
              transition: 'box-shadow 0.15s',
            }}
              onMouseOver={e => ((e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px rgba(0,0,0,0.07)')}
              onMouseOut={e  => ((e.currentTarget as HTMLElement).style.boxShadow = 'none')}
            >
              <div style={{ position: 'relative', width: '100%', height: 140, background: 'var(--surface)' }}>
                {product.image ? (
                  <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className="ti ti-photo" style={{ fontSize: 28, color: 'var(--mist)' }} aria-hidden="true" />
                  </div>
                )}
              </div>
              <div style={{ padding: '0.9rem' }}>
                <p style={{ fontSize: 11, color: 'var(--brand)', fontWeight: 500, marginBottom: 3, textTransform: 'uppercase', letterSpacing: '.03em' }}>
                  {product.category_name}
                </p>
                <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink)', marginBottom: 8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {product.name}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink)' }}>
                    KSh {Number(product.price).toLocaleString()}
                  </span>
                  <button
                    type="button"
                    style={{
                      border: 'none', borderRadius: 7,
                      padding: '8px 10px', background: 'var(--brand)', color: 'white',
                      cursor: 'pointer', fontSize: 13, fontWeight: 600,
                    }}
                  >
                    Request quote
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
