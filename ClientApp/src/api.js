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

// Delivers the message to my inbox straight from the browser via FormSubmit (free, no API key).
// The very first submission sends an "Activate form" email to the address; after one click, messages arrive.
async function emailViaFormSubmit(to, { name, email, subject, message }) {
  const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(to)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      name,
      email,
      _replyto: email,
      _subject: `Portfolio contact: ${subject || name}`,
      _template: 'table',
      _captcha: 'false',
      message,
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || String(data.success) !== 'true') throw new Error(data.message || 'Email delivery failed.');
}

// Saves the message on the server (database + optional server-side email) and emails it via FormSubmit.
// Succeeds when either path works, so a message is never silently lost.
export async function sendContact(payload, to) {
  if (payload.website) return { message: "Thanks! Your message has been sent. I'll get back to you soon." };

  let serverError = null;
  try {
    await postJson('/api/contact', payload);
  } catch (err) {
    // Validation or rate-limit problems should be shown to the visitor
    if (/Too many|must|required|valid/i.test(err.message)) throw err;
    serverError = err;
  }

  try {
    await emailViaFormSubmit(to, payload);
  } catch (err) {
    if (serverError) throw new Error('Your message could not be sent. Please email me directly instead.');
    console.warn('FormSubmit delivery failed:', err.message);
  }

  return { message: "Thanks! Your message has been sent. I'll get back to you soon." };
}
