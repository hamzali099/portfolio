import Section from './Section.jsx';
import { highlightIcon, Code } from './Icons.jsx';

export default function About({ profile }) {
  return (
    <Section id="about" eyebrow="About me" title="Building software that moves the business forward">
      <p className="about__summary reveal">{profile.summary}</p>
      <div className="grid grid--3">
        {profile.highlights.map((h, i) => {
          const Icon = highlightIcon[h.icon] ?? Code;
          return (
            <article key={h.title} className="card card--hover reveal" style={{ transitionDelay: `${i * 80}ms` }}>
              <span className="card__icon"><Icon /></span>
              <h3>{h.title}</h3>
              <p>{h.description}</p>
              <span className="card__num">0{i + 1}</span>
            </article>
          );
        })}
      </div>
    </Section>
  );
}
