// The same JSON the C# API serves; used as a fallback when the API is unreachable
// (e.g. running `npm run dev` without the backend).
import fallbackProfile from '../../Portfolio.Web/Data/profile.json';

export async function getProfile() {
  try {
    const res = await fetch('/api/profile');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch {
    return fallbackProfile;
  }
}

async function postJson(url, payload) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (res.status === 429) throw new Error('Too many submissions. Please try again in a few minutes.');
  if (!res.ok) {
    const errors = data.errors ? Object.values(data.errors).flat() : [];
    throw new Error(errors[0] || data.title || 'Something went wrong. Please try again.');
  }
  return data;
}

export async function getFeedback() {
  const res = await fetch('/api/feedback');
  if (!res.ok) throw new Error('Could not load feedback.');
  return res.json();
}

export const sendFeedback = (payload) => postJson('/api/feedback', payload);

export async function sendContact(payload) {
  return postJson('/api/contact', payload);
}
