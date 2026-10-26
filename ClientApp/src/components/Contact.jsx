import { useState } from 'react';
import Section from './Section.jsx';
import { Mail, LinkedIn, MapPin, Send } from './Icons.jsx';
import { sendContact } from '../api.js';

const EMPTY = { name: '', email: '', subject: '', message: '', website: '' };

export default function Contact({ profile }) {
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState({ state: 'idle', text: '' });

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setStatus({ state: 'sending', text: '' });
    try {
      const res = await sendContact(form, profile.email);
      setStatus({ state: 'success', text: res.message });
      setForm(EMPTY);
    } catch (err) {
      setStatus({ state: 'error', text: err.message });
    }
  }

  return (
    <Section id="contact" eyebrow="Contact" title="Let's work together">
      <div className="contact">
        <div className="contact__panel reveal">
          <h3>Get in touch</h3>
          <p>Have a project, role or idea in mind? Send a message here and it goes straight to my inbox. I'll get back to you soon.</p>
          <a className="contact__row" href={`mailto:${profile.email}`}>
            <span className="contact__icon"><Mail /></span>
            <span><small>Email</small>{profile.email}</span>
          </a>
          <a className="contact__row" href={profile.linkedIn} target="_blank" rel="noreferrer">
            <span className="contact__icon"><LinkedIn /></span>
            <span><small>LinkedIn</small>ali-hamza-176aab36b</span>
          </a>
          <div className="contact__row">
            <span className="contact__icon"><MapPin /></span>
            <span><small>Location</small>{profile.location}</span>
          </div>
        </div>

        <form className="card form reveal" onSubmit={submit}>
          <div className="form__row">
            <label>Name<input name="name" value={form.name} onChange={update} required minLength={2} maxLength={100} placeholder="Your name" /></label>
            <label>Email<input name="email" type="email" value={form.email} onChange={update} required maxLength={200} placeholder="you@example.com" /></label>
          </div>
          <input className="hp" name="website" value={form.website} onChange={update} tabIndex={-1} autoComplete="off" aria-hidden="true" />
          <label>Subject<input name="subject" value={form.subject} onChange={update} maxLength={150} placeholder="What's this about?" /></label>
          <label>Message<textarea name="message" rows={5} value={form.message} onChange={update} required minLength={10} maxLength={4000} placeholder="Tell me a little about your project…" /></label>
          <button className="btn btn--primary" disabled={status.state === 'sending'}>
            {status.state === 'sending' ? 'Sending…' : <>Send message <Send width={18} height={18} /></>}
          </button>
          {status.text && <p className={`form__status form__status--${status.state}`} role="status">{status.text}</p>}
        </form>
      </div>
    </Section>
  );
}
