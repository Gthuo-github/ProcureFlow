'use client';

import { useEffect, useState, FormEvent } from 'react';
import Image from 'next/image';
import {
  getProducts, createProduct, updateProduct, deleteProduct,
  getCategories, createCategory, Product, Category,
} from '@/lib/api';
import { SectionHeader, EmptyState } from '../components/ui';
import { Modal, Field, SubmitButton, Toast, ConfirmDialog } from '../components/shared';

export default function ProductsPage() {
  const [products,   setProducts]   = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading,     setLoading]   = useState(true);
  const [search,      setSearch]    = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const [modalOpen,  setModalOpen]  = useState(false);
  const [editing,    setEditing]    = useState<Product | null>(null);
  const [confirmDel, setConfirmDel] = useState<Product | null>(null);
  const [toast,      setToast]      = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  async function load() {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (search)         params.search   = search;
      if (categoryFilter) params.category = categoryFilter;
      const [p, c] = await Promise.all([getProducts(params), getCategories()]);
      setProducts(p);
      setCategories(c);
    } catch {
      setToast({ msg: 'Failed to load products.', type: 'error' });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);
  useEffect(() => {
    const t = setTimeout(load, 350); // debounce search
    return () => clearTimeout(t);
  }, [search, categoryFilter]);

  async function handleDelete() {
    if (!confirmDel) return;
    try {
      await deleteProduct(confirmDel.id);
      setToast({ msg: `"${confirmDel.name}" deleted.`, type: 'success' });
      setConfirmDel(null);
      load();
    } catch {
      setToast({ msg: 'Failed to delete product.', type: 'error' });
    }
  }

  return (
    <div>
      <SectionHeader
        title="Products"
        subtitle={`${products.length} product${products.length !== 1 ? 's' : ''} in catalogue`}
        action={
          <button
            onClick={() => { setEditing(null); setModalOpen(true); }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '8px 16px', borderRadius: 8,
              background: 'var(--brand)', color: 'white',
              fontSize: 13.5, fontWeight: 500, border: 'none', cursor: 'pointer',
            }}
          >
            <i className="ti ti-plus" style={{ fontSize: 15 }} aria-hidden="true" />
            Add product
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
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search products…"
            style={{
              width: '100%', padding: '9px 12px 9px 36px', borderRadius: 8,
              border: '1px solid var(--border)', fontSize: 13.5,
              background: 'white', outline: 'none',
            }}
          />
        </div>
        <select
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
          style={{
            padding: '9px 12px', borderRadius: 8,
            border: '1px solid var(--border)', fontSize: 13.5,
            background: 'white', color: 'var(--ink)', minWidth: 160,
          }}
        >
          <option value="">All categories</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      {/* Grid */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
          {[...Array(4)].map((_, i) => (
            <div key={i} style={{ height: 220, borderRadius: 12, background: 'white', border: '1px solid var(--border)' }} />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div style={{ background: 'white', borderRadius: 12, border: '1px solid var(--border)' }}>
          <EmptyState icon="ti-box-off" message="No products found. Try adjusting your filters or add a new product." />
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
          {products.map(p => (
            <div key={p.id} style={{
              background: 'white', border: '1px solid var(--border)',
              borderRadius: 12, overflow: 'hidden',
              transition: 'box-shadow 0.15s',
            }}
              onMouseOver={e => ((e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px rgba(0,0,0,0.07)')}
              onMouseOut={e  => ((e.currentTarget as HTMLElement).style.boxShadow = 'none')}
            >
              <div style={{ position: 'relative', width: '100%', height: 140, background: 'var(--surface)' }}>
                {p.image ? (
                  <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className="ti ti-photo" style={{ fontSize: 28, color: 'var(--mist)' }} aria-hidden="true" />
                  </div>
                )}
              </div>
              <div style={{ padding: '0.9rem' }}>
                <p style={{ fontSize: 11, color: 'var(--brand)', fontWeight: 500, marginBottom: 3, textTransform: 'uppercase', letterSpacing: '.03em' }}>
                  {p.category_name}
                </p>
                <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink)', marginBottom: 8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {p.name}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink)' }}>
                    KSh {Number(p.price).toLocaleString()}
                  </span>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button
                      onClick={() => { setEditing(p); setModalOpen(true); }}
                      aria-label={`Edit ${p.name}`}
                      style={{
                        width: 28, height: 28, borderRadius: 7,
                        border: '1px solid var(--border)', background: 'white',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'var(--slate)', cursor: 'pointer',
                      }}
                    >
                      <i className="ti ti-pencil" style={{ fontSize: 13 }} aria-hidden="true" />
                    </button>
                    <button
                      onClick={() => setConfirmDel(p)}
                      aria-label={`Delete ${p.name}`}
                      style={{
                        width: 28, height: 28, borderRadius: 7,
                        border: '1px solid var(--border)', background: 'white',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#DC2626', cursor: 'pointer',
                      }}
                    >
                      <i className="ti ti-trash" style={{ fontSize: 13 }} aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit modal */}
      <ProductFormModal
        open={modalOpen}
        product={editing}
        categories={categories}
        onClose={() => setModalOpen(false)}
        onSaved={(msg) => { setToast({ msg, type: 'success' }); setModalOpen(false); load(); }}
        onError={(msg) => setToast({ msg, type: 'error' })}
        onCategoryAdded={load}
      />

      <ConfirmDialog
        open={!!confirmDel}
        title="Delete product"
        message={`Are you sure you want to delete "${confirmDel?.name}"? This cannot be undone.`}
        confirmLabel="Delete"
        danger
        onConfirm={handleDelete}
        onCancel={() => setConfirmDel(null)}
      />

      {toast && <Toast message={toast.msg} type={toast.type} onDone={() => setToast(null)} />}
    </div>
  );
}

// ── Form modal ──────────────────────────────────────────────────────────────

function ProductFormModal({
  open, product, categories, onClose, onSaved, onError, onCategoryAdded,
}: {
  open: boolean;
  product: Product | null;
  categories: Category[];
  onClose: () => void;
  onSaved: (msg: string) => void;
  onError: (msg: string) => void;
  onCategoryAdded: () => void;
}) {
  const isEdit = !!product;
  const [name,        setName]        = useState('');
  const [price,       setPrice]       = useState('');
  const [category,    setCategory]    = useState('');
  const [description, setDescription] = useState('');
  const [imageFile,   setImageFile]   = useState<File | null>(null);
  const [newCatName,  setNewCatName]  = useState('');
  const [addingCat,   setAddingCat]   = useState(false);
  const [loading,     setLoading]     = useState(false);
  const [errors,      setErrors]      = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      setName(product?.name || '');
      setPrice(product?.price || '');
      setCategory(product ? String(product.category) : '');
      setDescription(product?.description || '');
      setImageFile(null);
      setErrors({});
      setAddingCat(false);
      setNewCatName('');
    }
  }, [open, product]);

  async function handleAddCategory() {
    if (!newCatName.trim()) return;
    try {
      const cat = await createCategory(newCatName.trim());
      setCategory(String(cat.id));
      setNewCatName('');
      setAddingCat(false);
      onCategoryAdded();
    } catch {
      onError('Failed to add category.');
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!name.trim())     errs.name     = 'Required';
    if (!price)           errs.price    = 'Required';
    if (Number(price) < 0) errs.price   = 'Must be 0 or above';
    if (!category)        errs.category = 'Required';
    if (!isEdit && !imageFile) errs.image = 'Image is required';
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('name', name);
      fd.append('price', price);
      fd.append('category', category);
      fd.append('description', description);
      if (imageFile) fd.append('image', imageFile);

      if (isEdit) {
        await updateProduct(product!.id, fd);
        onSaved('Product updated successfully.');
      } else {
        await createProduct(fd);
        onSaved('Product created successfully.');
      }
    } catch (err: any) {
      const fieldErrs: Record<string, string> = {};
      if (err && typeof err === 'object') {
        Object.entries(err).forEach(([k, v]) => {
          fieldErrs[k] = Array.isArray(v) ? v[0] : String(v);
        });
      }
      if (Object.keys(fieldErrs).length) setErrors(fieldErrs);
      else onError('Failed to save product.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Edit product' : 'Add product'}>
      <form onSubmit={handleSubmit} noValidate>
        <Field label="Product name" id="name" value={name} onChange={setName}
          placeholder="Laptop Stand Pro" required error={errors.name} />

        <Field label="Price (KSh)" id="price" type="number" step="0.01" min="0"
          value={price} onChange={setPrice} placeholder="4999.00" required error={errors.price} />

        <div style={{ marginBottom: 14 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--ink)', marginBottom: 5 }}>
            Category <span style={{ color: '#DC2626' }}>*</span>
          </label>
          {!addingCat ? (
            <div style={{ display: 'flex', gap: 8 }}>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                style={{
                  flex: 1, padding: '9px 12px', borderRadius: 8,
                  border: `1px solid ${errors.category ? '#FCA5A5' : 'var(--border)'}`,
                  fontSize: 13.5, background: 'var(--surface)', color: 'var(--ink)',
                }}
              >
                <option value="">Select category…</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <button type="button" onClick={() => setAddingCat(true)} style={{
                padding: '0 12px', borderRadius: 8, border: '1px solid var(--border)',
                background: 'white', color: 'var(--brand)', fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap',
              }}>+ New</button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                value={newCatName} onChange={e => setNewCatName(e.target.value)}
                placeholder="Category name" autoFocus
                style={{
                  flex: 1, padding: '9px 12px', borderRadius: 8,
                  border: '1px solid var(--border)', fontSize: 13.5, background: 'var(--surface)',
                }}
              />
              <button type="button" onClick={handleAddCategory} style={{
                padding: '0 12px', borderRadius: 8, border: 'none',
                background: 'var(--brand)', color: 'white', fontSize: 13, cursor: 'pointer',
              }}>Add</button>
              <button type="button" onClick={() => setAddingCat(false)} style={{
                padding: '0 10px', borderRadius: 8, border: '1px solid var(--border)',
                background: 'white', color: 'var(--mist)', fontSize: 13, cursor: 'pointer',
              }}>✕</button>
            </div>
          )}
          {errors.category && <p role="alert" style={{ fontSize: 12, color: '#DC2626', marginTop: 4 }}>{errors.category}</p>}
        </div>

        <Field label="Description" id="description" as="textarea"
          value={description} onChange={setDescription}
          placeholder="Adjustable aluminium laptop stand…" />

        <div style={{ marginBottom: 14 }}>
          <label htmlFor="image" style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--ink)', marginBottom: 5 }}>
            Product image {!isEdit && <span style={{ color: '#DC2626' }}>*</span>}
            {isEdit && <span style={{ color: 'var(--mist)', fontWeight: 400 }}> (leave blank to keep current)</span>}
          </label>
          <input
            id="image" type="file" accept="image/jpeg,image/png,image/webp"
            onChange={e => setImageFile(e.target.files?.[0] || null)}
            style={{
              width: '100%', padding: '8px', borderRadius: 8,
              border: `1px solid ${errors.image ? '#FCA5A5' : 'var(--border)'}`,
              fontSize: 12.5, background: 'var(--surface)',
            }}
          />
          {errors.image && <p role="alert" style={{ fontSize: 12, color: '#DC2626', marginTop: 4 }}>{errors.image}</p>}
          <p style={{ fontSize: 11, color: 'var(--mist)', marginTop: 4 }}>JPEG, PNG, or WebP. Max 5MB.</p>
        </div>

        <SubmitButton loading={loading}>{isEdit ? 'Save changes' : 'Create product'}</SubmitButton>
      </form>
    </Modal>
  );
}
