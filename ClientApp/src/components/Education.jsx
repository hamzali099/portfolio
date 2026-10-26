import Section from './Section.jsx';
import { Cap } from './Icons.jsx';
import { formatMonth } from '../utils.js';

export default function Education({ profile }) {
  return (
    <Section id="education" eyebrow="Education" title="Academic background">
      <div className="grid grid--2">
        {profile.education.map((e) => (
          <article key={e.institution} className="card card--hover edu reveal">
            <span className="card__icon card__icon--lg"><Cap width={28} height={28} /></span>
            <div>
              <h3>{e.institution}</h3>
              <p className="edu__degree">{e.degree}, {e.field}</p>
              <p className="edu__date">{formatMonth(e.start)} — {formatMonth(e.end)}{e.location ? ` · ${e.location}` : ''}</p>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}
