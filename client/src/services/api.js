const API_URL = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');

async function request(path, options = {}, timeoutMs = 30000) {
  let response;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      signal: controller.signal,
      headers: { 'Content-Type': 'application/json', ...options.headers },
    });
  } catch (error) {
    if (error.name === 'AbortError') throw new Error('The server took too long to respond. Please try again.');
    throw new Error('Could not reach the game server. Check your connection and try again.');
  } finally {
    clearTimeout(timer);
  }
  const contentType = response.headers.get('content-type') || '';
  const data = contentType.includes('application/json') ? await response.json().catch(() => ({})) : {};
  if (!response.ok) throw new Error(data.error || `The request failed (${response.status}). Please try again.`);
  return data;
}

export const api = {
  createMystery: (body) => request('/mysteries', { method: 'POST', body: JSON.stringify(body) }),
  getMystery: (id) => request(`/mysteries/${id}`),
  createSession: (mysteryId) => request('/sessions', { method: 'POST', body: JSON.stringify({ mysteryId }) }),
  getHint: (token) => request(`/sessions/${token}/hints`, { method: 'POST', body: '{}' }),
  submitAnswer: (token, selectedAnswerId) => request(`/sessions/${token}/answer`, { method: 'POST', body: JSON.stringify({ selectedAnswerId }) }),
};
