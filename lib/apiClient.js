/**
 * Client-side helper for authenticated API requests
 * Safely attaches Bearer token from localStorage when available
 */

export const TOKEN_KEY = 'qistbook_token';

export async function authFetch(url, init = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;
  const headers = new Headers(init.headers || {});

  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  return fetch(url, {
    ...init,
    headers,
  });
}
