// ===== AUTH API SERVICE =====
const baseUrl = '/api/users';

// Handle response errors
async function handleResponse(res) {
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Server error' }));
    throw new Error(error.message || 'Request failed');
  }
  return res.json();
}

// ---- LOGIN ----
export async function loginAPI(data) {
  const res = await fetch(`${baseUrl}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  return handleResponse(res);
}

// ---- REGISTER ----
export async function registerAPI(data) {
  const res = await fetch(`${baseUrl}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  return handleResponse(res);
}

// ---- LOGOUT (JWT is stateless, handled on client) ----
export function logoutAPI() {
  localStorage.removeItem('travelspots-user');
}
