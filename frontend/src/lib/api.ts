const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

function getTokens() {
  if (typeof window === 'undefined') return {};
  return {
    access:  localStorage.getItem('access_token'),
    refresh: localStorage.getItem('refresh_token'),
  };
}

function saveTokens(tokens: { access: string; refresh: string }) {
  localStorage.setItem('access_token',  tokens.access);
  localStorage.setItem('refresh_token', tokens.refresh);
}

function clearTokens() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  auth = true,
): Promise<T> {
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (auth) {
    const { access } = getTokens();
    if (access) headers['Authorization'] = `Bearer ${access}`;
  }

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Request failed' }));
    throw err;
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

// ── Auth ──────────────────────────────────────────────────────────────────────

export async function loginUser(email: string, password: string) {
  const data = await request<{ tokens: { access: string; refresh: string }; role: string }>(
    '/auth/login/',
    { method: 'POST', body: JSON.stringify({ email, password }) },
    false,
  );
  saveTokens(data.tokens);
  return data;
}

export async function registerCustomer(payload: Record<string, string>) {
  const data = await request<{ tokens: { access: string; refresh: string } }>(
    '/auth/register/customer/',
    { method: 'POST', body: JSON.stringify(payload) },
    false,
  );
  saveTokens(data.tokens);
  return data;
}

export async function registerSupplier(payload: Record<string, string>) {
  const data = await request<{ message: string; tokens: { access: string; refresh: string } }>(
    '/auth/register/supplier/',
    { method: 'POST', body: JSON.stringify(payload) },
    false,
  );
  saveTokens(data.tokens);
  return data;
}

export async function registerAdmin(payload: Record<string, string>) {
  return request<{ message: string; user_id: number }>(
    '/auth/register/admin/',
    { method: 'POST', body: JSON.stringify(payload) },
  );
}

export async function logoutUser() {
  const { refresh } = getTokens();
  await request('/auth/logout/', {
    method: 'POST',
    body: JSON.stringify({ refresh }),
  }).catch(() => {});
  clearTokens();
}

export async function getMe() {
  return request<{ id: number; first_name: string; last_name: string; email: string; role: string }>(
    '/users/me/',
  );
}

// ── Users (admin) ─────────────────────────────────────────────────────────────

export interface AppUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role: 'admin' | 'customer' | 'supplier';
  is_active: boolean;
  created_at: string;
}

export async function getUsers(role?: string) {
  const qs = role ? `?role=${role}` : '';
  return request<AppUser[]>(`/users/${qs}`);
}

export async function getUser(id: number) {
  return request<AppUser>(`/users/${id}/`);
}

export async function deactivateUser(id: number) {
  return request<{ message: string }>(`/users/${id}/deactivate/`, { method: 'PATCH' });
}

export async function activateUser(id: number) {
  return request<{ message: string }>(`/users/${id}/activate/`, { method: 'PATCH' });
}

export async function changeUserRole(id: number, role: string) {
  return request<{ message: string }>(`/users/${id}/role/`, {
    method: 'PATCH',
    body: JSON.stringify({ role }),
  });
}

// ── Products ──────────────────────────────────────────────────────────────────

export interface Product {
  id: number;
  name: string;
  price: string;
  category: number;
  category_name: string;
  description: string;
  image: string;
}

export async function getProducts(params?: Record<string, string>) {
  const qs = params ? '?' + new URLSearchParams(params).toString() : '';
  return request<Product[]>(`/products/${qs}`);
}

export async function getProduct(id: number) {
  return request<Product>(`/products/${id}/`);
}

export async function createProduct(formData: FormData) {
  return request<Product>('/products/create/', { method: 'POST', body: formData });
}

export async function updateProduct(id: number, formData: FormData) {
  return request<Product>(`/products/${id}/update/`, { method: 'PATCH', body: formData });
}

export async function deleteProduct(id: number) {
  return request<{ message: string }>(`/products/${id}/delete/`, { method: 'DELETE' });
}

// ── Categories ────────────────────────────────────────────────────────────────

export interface Category {
  id: number;
  name: string;
  product_count: number;
}

export async function getCategories() {
  return request<Category[]>('/products/categories/');
}

export async function createCategory(name: string) {
  return request<Category>('/products/categories/', {
    method: 'POST',
    body: JSON.stringify({ name }),
  });
}

// ── Orders ────────────────────────────────────────────────────────────────────
// Adjust paths/fields to match your orders app's actual serializer once built.

export interface Order {
  id: number;
  product: number;
  product_name: string;
  product_image?: string;
  product_price?: string;
  total_price?: string;
  supplier: number;
  supplier_name?: string;
  supplier_email?: string;
  quantity: number;
  address: string;
  phone: string;
  date: string;
  status: string;
  status_display?: string;
}

export async function getOrders(params?: Record<string, string>) {
  const qs = params ? '?' + new URLSearchParams(params).toString() : '';
  return request<Order[]>(`/orders/${qs}`);
}

export async function getOrderStats() {
  return request<{ total: number; pending: number; active: number; completed: number; cancelled: number }>('/orders/stats/');
}

export async function getOrder(id: number) {
  return request<Order>(`/orders/${id}/`);
}

export async function createOrder(payload: Record<string, any>) {
  return request<Order>('/orders/create/', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function updateOrderStatus(id: number, status: string) {
  return request<Order>(`/orders/${id}/update/`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

export async function deleteOrder(id: number) {
  return request<{ message: string }>(`/orders/${id}/delete/`, { method: 'DELETE' });
}

// ── Invoices ──────────────────────────────────────────────────────────────────
// Adjust paths/fields to match your invoices app's actual serializer once built.

export interface Invoice {
  id: number;
  invoice_number: string;
  invoice_amount: string;
  customer: number;
  customer_name?: string;
  created_by?: number;
  date: string;
  due_date: string | null;
  status?: string;
  items?: { description: number; product_name?: string; quantity: number; unit_price: string }[];
}

export async function getInvoices(params?: Record<string, string>) {
  const qs = params ? '?' + new URLSearchParams(params).toString() : '';
  return request<Invoice[]>(`/invoices/${qs}`);
}

export async function getInvoice(id: number) {
  return request<Invoice>(`/invoices/${id}/`);
}

export async function createInvoice(payload: Record<string, any>) {
  return request<Invoice>('/invoices/create/', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function updateInvoice(id: number, payload: Record<string, any>) {
  return request<Invoice>(`/invoices/${id}/update/`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export async function deleteInvoice(id: number) {
  return request<{ message: string }>(`/invoices/${id}/delete/`, { method: 'DELETE' });
}

export { saveTokens, clearTokens, getTokens };
