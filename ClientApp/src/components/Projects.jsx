import { useMemo, useState } from 'react';
import Section from './Section.jsx';
import { projectIcon, Code, Github, External, Check, Star } from './Icons.jsx';

// Subtle 3D tilt that follows the cursor
function tilt(e) {
  const card = e.currentTarget;
  const r = card.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width - 0.5;
  const y = (e.clientY - r.top) / r.height - 0.5;
  card.style.setProperty('--rx', `${(-y * 6).toFixed(2)}deg`);
  card.style.setProperty('--ry', `${(x * 6).toFixed(2)}deg`);
  card.style.setProperty('--mx', `${(x + 0.5) * 100}%`);
  card.style.setProperty('--my', `${(y + 0.5) * 100}%`);
}

function resetTilt(e) {
  e.currentTarget.style.setProperty('--rx', '0deg');
  e.currentTarget.style.setProperty('--ry', '0deg');
}

export default function Projects({ profile }) {
  const categories = useMemo(() => ['All', ...new Set(profile.projects.map((p) => p.category))], [profile.projects]);
  const [filter, setFilter] = useState('All');
  const shown = profile.projects.filter((p) => filter === 'All' || p.category === filter);

  return (
    <Section id="projects" alt eyebrow="Portfolio" title="Projects I've built" intro="A selection of applications I've designed and developed.">
      <div className="filters reveal" role="tablist">
        {categories.map((c) => (
          <button key={c} role="tab" aria-selected={filter === c} className={`filter ${filter === c ? 'is-active' : ''}`} onClick={() => setFilter(c)}>
            {c}
            <span>{c === 'All' ? profile.projects.length : profile.projects.filter((p) => p.category === c).length}</span>
          </button>
        ))}
      </div>

      <div className="grid grid--2 projects">
        {shown.map((p) => {
          const Icon = projectIcon[p.category] ?? Code;
          return (
            <article key={p.title} className="project" onMouseMove={tilt} onMouseLeave={resetTilt}>
              <div className="project__cover">
                <span className="project__icon"><Icon width={30} height={30} /></span>
                <span className="project__cat">{p.category}</span>
                {p.featured && <span className="project__featured"><Star width={14} height={14} /> Featured</span>}
              </div>
              <div className="project__body">
                <h3>{p.title}</h3>
                <p>{p.description}</p>
                <ul className="project__features">
                  {p.features.map((f) => <li key={f}><Check width={15} height={15} /> {f}</li>)}
                </ul>
                <ul className="chips chips--sm">
                  {p.tech.map((t) => <li key={t} className="chip">{t}</li>)}
                </ul>
                {(p.github || p.demo) && (
                  <div className="project__links">
                    {p.github && <a href={p.github} target="_blank" rel="noreferrer"><Github width={18} height={18} /> Code</a>}
                    {p.demo && <a href={p.demo} target="_blank" rel="noreferrer"><External width={18} height={18} /> Live demo</a>}
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </Section>
  );
}
