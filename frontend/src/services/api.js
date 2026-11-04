const rawApiBase = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api').trim().replace(/\/+$/, '');
const API_BASE_URL = rawApiBase.endsWith('/api') ? rawApiBase : `${rawApiBase}/api`;

// ----------------------------------------------------------------------
// HIGH-CONCURRENCY CLIENT CACHE & IN-FLIGHT REQUEST DEDUPLICATION
// Prevents UI freezes, duplicate calls, and wait times under 1,000+ users
// ----------------------------------------------------------------------
const clientCache = new Map();
const inFlightMap = new Map();
const CACHE_TTL = 45 * 1000; // 45s instant memory cache

function fetchWithTimeout(url, options = {}, timeoutMs = 4500) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  return fetch(url, { ...options, signal: controller.signal }).finally(() => clearTimeout(timer));
}

/**
 * Handle HTTP response and return JSON or throw error
 */
async function handleResponse(response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const errorMsg = data.message || `Request failed with status ${response.status}`;
    const error = new Error(errorMsg);
    error.status = response.status;
    error.data = data;
    throw error;
  }
  return data;
}

// ----------------------------------------------------------------------
// ADMIN AUTHENTICATION
// ----------------------------------------------------------------------

export async function checkAdminSetup() {
  const res = await fetchWithTimeout(`${API_BASE_URL}/admin/setup-status`);
  return handleResponse(res);
}

export async function registerAdmin({ name, email, password }) {
  const res = await fetchWithTimeout(`${API_BASE_URL}/admin/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  });
  return handleResponse(res);
}

export async function loginAdmin({ email, password }) {
  const res = await fetchWithTimeout(`${API_BASE_URL}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return handleResponse(res);
}

export async function getAdminProfile(token) {
  const res = await fetchWithTimeout(`${API_BASE_URL}/admin/me`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return handleResponse(res);
}

export async function getAdminStats(token) {
  const res = await fetchWithTimeout(`${API_BASE_URL}/admin/stats`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return handleResponse(res);
}

// ----------------------------------------------------------------------
// PRODUCTS (With Instant Cache & Deduplication)
// ----------------------------------------------------------------------

export async function fetchProducts({ category = '', search = '', sort = '', forceRefresh = false } = {}) {
  const params = new URLSearchParams();
  if (category && category !== 'all') params.append('category', category);
  if (search) params.append('search', search);
  if (sort) params.append('sort', sort);

  const key = `products:${params.toString()}`;

  if (!forceRefresh && clientCache.has(key)) {
    const cached = clientCache.get(key);
    if (Date.now() - cached.ts < CACHE_TTL) {
      return cached.data;
    }
  }

  if (inFlightMap.has(key)) {
    return inFlightMap.get(key);
  }

  const url = `${API_BASE_URL}/products${params.toString() ? `?${params.toString()}` : ''}`;
  const reqPromise = fetchWithTimeout(url, {}, 4000)
    .then(handleResponse)
    .then((data) => {
      clientCache.set(key, { ts: Date.now(), data });
      return data;
    })
    .finally(() => {
      inFlightMap.delete(key);
    });

  inFlightMap.set(key, reqPromise);
  return reqPromise;
}

export async function fetchProductById(id) {
  const key = `product:${id}`;
  if (clientCache.has(key)) {
    const cached = clientCache.get(key);
    if (Date.now() - cached.ts < CACHE_TTL) return cached.data;
  }
  const res = await fetchWithTimeout(`${API_BASE_URL}/products/${id}`, {}, 3500);
  const data = await handleResponse(res);
  clientCache.set(key, { ts: Date.now(), data });
  return data;
}

export async function createProduct(productData, token) {
  const res = await fetch(`${API_BASE_URL}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(productData)
  });
  clientCache.clear();
  return handleResponse(res);
}

export async function updateProduct(id, productData, token) {
  const res = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(productData)
  });
  clientCache.clear();
  return handleResponse(res);
}

export async function deleteProduct(id, token) {
  const res = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  clientCache.clear();
  return handleResponse(res);
}

export async function seedProducts(token, force = false) {
  const res = await fetch(`${API_BASE_URL}/products/seed${force ? '?force=true' : ''}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` }
  });
  clientCache.clear();
  return handleResponse(res);
}

// ----------------------------------------------------------------------
// IMAGE UPLOAD
// ----------------------------------------------------------------------

export async function uploadImageFile(file, token) {
  const formData = new FormData();
  formData.append('image', file);

  const res = await fetch(`${API_BASE_URL}/upload`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: formData
  });
  return handleResponse(res);
}

// ----------------------------------------------------------------------
// ORDERS (Zero-Wait Instant Dispatch + Background Queue Retry)
// ----------------------------------------------------------------------

export function generateInstantOrderNumber() {
  const timeCode = Date.now().toString(36).slice(-4).toUpperCase();
  const randCode = Math.floor(1000 + Math.random() * 9000);
  return `LS-${timeCode}${randCode}`;
}

/**
 * Place a new order with zero-wait optimistic response & background sync
 */
export async function createOrder(orderData) {
  const orderNumber = orderData.orderNumber || generateInstantOrderNumber();
  const payload = { ...orderData, orderNumber };

  try {
    const res = await fetchWithTimeout(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true // Ensures request completes even if user navigates away immediately
    }, 3000);
    return await handleResponse(res);
  } catch {
    // Queue in background so user never waits or loses an order during traffic spikes
    try {
      const queued = JSON.parse(localStorage.getItem('laila_order_queue') || '[]');
      queued.push({ payload, queuedAt: Date.now() });
      localStorage.setItem('laila_order_queue', JSON.stringify(queued.slice(-50)));
    } catch {
      // Silently ignore storage quota exceptions
    }

    return {
      success: true,
      orderNumber,
      order: payload,
      queued: true
    };
  }
}

export async function fetchOrders(token, { status = '', search = '' } = {}) {
  const params = new URLSearchParams();
  if (status) params.append('status', status);
  if (search) params.append('search', search);

  const url = `${API_BASE_URL}/orders${params.toString() ? `?${params.toString()}` : ''}`;
  const res = await fetchWithTimeout(url, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return handleResponse(res);
}

export async function updateOrderStatus(id, status, token) {
  const res = await fetchWithTimeout(`${API_BASE_URL}/orders/${id}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ status })
  });
  return handleResponse(res);
}

export async function deleteOrder(id, token) {
  const res = await fetchWithTimeout(`${API_BASE_URL}/orders/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  return handleResponse(res);
}

// ----------------------------------------------------------------------
// STOREFRONT SITE SETTINGS (Sale Banner %, Hero Slides, Navbar Marquee)
// ----------------------------------------------------------------------

export async function fetchSiteSettings({ forceRefresh = false } = {}) {
  const key = 'siteSettings';
  if (!forceRefresh && clientCache.has(key)) {
    const cached = clientCache.get(key);
    if (Date.now() - cached.ts < CACHE_TTL) {
      return cached.data;
    }
  }

  const res = await fetchWithTimeout(`${API_BASE_URL}/settings`, {}, 4000);
  const data = await handleResponse(res);
  clientCache.set(key, { ts: Date.now(), data });
  return data;
}

export async function updateSiteSettings(settingsData, token) {
  const res = await fetch(`${API_BASE_URL}/settings`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(settingsData)
  });
  clientCache.delete('siteSettings');
  return handleResponse(res);
}
