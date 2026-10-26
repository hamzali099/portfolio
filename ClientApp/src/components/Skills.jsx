import Section from './Section.jsx';
import { skillIcon, Code } from './Icons.jsx';

export default function Skills({ profile }) {
  return (
    <Section id="skills" alt eyebrow="Skills" title="Tools & technologies" intro="The stack I use to build reliable web, API and desktop software.">
      <div className="grid grid--3">
        {profile.skillGroups.map((g, i) => {
          const Icon = skillIcon[g.icon] ?? Code;
          return (
            <div key={g.category} className="card card--hover skill-card reveal" style={{ transitionDelay: `${i * 80}ms` }}>
              <div className="skill-card__head">
                <span className="card__icon"><Icon /></span>
                <h3>{g.category}</h3>
              </div>
              <ul className="chips">
                {g.skills.map((s) => (
                  <li key={s} className={profile.topSkills.includes(s) ? 'chip chip--top' : 'chip'}>{s}</li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
      <p className="note reveal"><span className="chip chip--top chip--sm">Highlighted</span> top skills on LinkedIn</p>
    </Section>
  );
}
