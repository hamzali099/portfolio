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

export async function sendContact(payload) {
  const res = await fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const errors = data.errors ? Object.values(data.errors).flat() : [];
    throw new Error(errors[0] || data.title || 'Something went wrong. Please try again.');
  }
  return data;
}
