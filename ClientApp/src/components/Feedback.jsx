import { useEffect, useState } from 'react';
import Section from './Section.jsx';
import { Star, Message, Send } from './Icons.jsx';
import { getFeedback, sendFeedback } from '../api.js';
import { initials, timeAgo } from '../utils.js';

const EMPTY = { name: '', role: '', rating: 5, comment: '', website: '' };

function Stars({ value, size = 16 }) {
  return (
    <span className="stars" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} width={size} height={size} className={n <= value + 0.001 ? 'is-on' : ''} />
      ))}
    </span>
  );
}

export default function Feedback() {
  const [data, setData] = useState({ count: 0, average: 0, items: [] });
  const [loadState, setLoadState] = useState('loading');
  const [form, setForm] = useState(EMPTY);
  const [hover, setHover] = useState(0);
  const [status, setStatus] = useState({ state: 'idle', text: '' });

  useEffect(() => {
    getFeedback()
      .then((d) => { setData(d); setLoadState('ready'); })
      .catch(() => setLoadState('error'));
  }, []);

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setStatus({ state: 'sending', text: '' });
    try {
      const item = await sendFeedback(form);
      if (item?.id) {
        setData((d) => {
          const count = d.count + 1;
          const average = Math.round(((d.average * d.count + item.rating) / count) * 10) / 10;
          return { count, average, items: [item, ...d.items] };
        });
      }
      setForm(EMPTY);
      setStatus({ state: 'success', text: 'Thank you! Your feedback has been posted.' });
    } catch (err) {
      setStatus({ state: 'error', text: err.message });
    }
  }

  return (
    <Section id="feedback" alt eyebrow="Feedback" title="What visitors say" intro="Visited my portfolio or worked with me? Leave a comment and rating. It appears here for everyone.">
      <div className="feedback">
        <div className="feedback__side reveal">
          <div className="card rating-summary">
            <strong>{data.count ? data.average.toFixed(1) : '–'}</strong>
            <div>
              <Stars value={data.average} size={20} />
              <span>{data.count} {data.count === 1 ? 'review' : 'reviews'}</span>
            </div>
          </div>

          <form className="card form" onSubmit={submit}>
            <h3 className="form__title">Leave your feedback</h3>
            <div className="star-input" role="radiogroup" aria-label="Rating" onMouseLeave={() => setHover(0)}>
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n} type="button" role="radio" aria-checked={form.rating === n} aria-label={`${n} star${n > 1 ? 's' : ''}`}
                  className={n <= (hover || form.rating) ? 'is-on' : ''}
                  onMouseEnter={() => setHover(n)} onClick={() => setForm({ ...form, rating: n })}
                >
                  <Star width={26} height={26} />
                </button>
              ))}
            </div>
            <div className="form__row">
              <label>Name<input name="name" value={form.name} onChange={update} required minLength={2} maxLength={60} placeholder="Your name" /></label>
              <label>Role / Company<input name="role" value={form.role} onChange={update} maxLength={80} placeholder="Optional, e.g. Recruiter" /></label>
            </div>
            <input className="hp" name="website" value={form.website} onChange={update} tabIndex={-1} autoComplete="off" aria-hidden="true" />
            <label>Comment<textarea name="comment" rows={4} value={form.comment} onChange={update} required minLength={5} maxLength={1000} placeholder="Share your thoughts…" /></label>
            <button className="btn btn--primary" disabled={status.state === 'sending'}>
              {status.state === 'sending' ? 'Posting…' : <>Post feedback <Send width={18} height={18} /></>}
            </button>
            {status.text && <p className={`form__status form__status--${status.state}`} role="status">{status.text}</p>}
          </form>
        </div>

        <div className="feedback__list reveal">
          {loadState === 'loading' && <p className="feedback__empty">Loading feedback…</p>}
          {loadState === 'error' && <p className="feedback__empty">Feedback couldn't be loaded right now.</p>}
          {loadState === 'ready' && data.items.length === 0 && (
            <div className="feedback__empty">
              <span className="card__icon card__icon--lg"><Message width={28} height={28} /></span>
              <p>No feedback yet. Be the first to leave a comment!</p>
            </div>
          )}
          {data.items.map((f) => (
            <article key={f.id} className="card card--hover comment">
              <header className="comment__head">
                <span className="comment__avatar">{initials(f.name)}</span>
                <div className="comment__who">
                  <strong>{f.name}</strong>
                  {f.role && <small>{f.role}</small>}
                </div>
                <time dateTime={f.createdAt}>{timeAgo(f.createdAt)}</time>
              </header>
              <Stars value={f.rating} />
              <p>{f.comment}</p>
            </article>
          ))}
        </div>
      </div>
    </Section>
  );
}
