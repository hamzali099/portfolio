import { Mail, MapPin, LinkedIn, Arrow, Check } from './Icons.jsx';
import Typewriter from './Typewriter.jsx';
import { initials } from '../utils.js';

export default function Hero({ profile }) {
  return (
    <section className="hero" id="top">
      <div className="hero__bg" aria-hidden="true" />
      <div className="container hero__inner">
        <div className="hero__text">
          <span className="badge reveal"><span className="badge__dot" /> Available for new opportunities</span>
          <h1 className="reveal">
            Hi, I'm {profile.name}.<br />
            <span className="hero__role"><Typewriter words={profile.roles.length ? profile.roles : [profile.title]} /></span>
          </h1>
          <p className="hero__lead reveal">
            I design and deliver enterprise applications, real-time monitoring systems and data-driven
            solutions with <strong>C#</strong> and <strong>ASP.NET Core</strong>, built to be scalable, reliable and maintainable.
          </p>
          <div className="hero__actions reveal">
            <a href="#projects" className="btn btn--primary">View my projects <Arrow width={18} height={18} /></a>
            <a href="#contact" className="btn btn--outline">Contact me</a>
          </div>
          <div className="hero__meta reveal">
            <span><MapPin width={16} height={16} /> {profile.location}</span>
            <a href={`mailto:${profile.email}`}><Mail width={16} height={16} /> {profile.email}</a>
          </div>
        </div>

        <aside className="profile-card reveal">
          <div className="profile-card__top">
            <div className="profile-card__avatar">{initials(profile.name)}</div>
            <div>
              <h2>{profile.name}</h2>
              <p>{profile.title}</p>
            </div>
          </div>
          <ul className="profile-card__list">
            {profile.experience[0] && (
              <li><Check width={16} height={16} /> {profile.experience[0].role} at {profile.experience[0].company}</li>
            )}
            {profile.education[0] && (
              <li><Check width={16} height={16} /> {profile.education[0].field}, {profile.education[0].institution}</li>
            )}
            <li><Check width={16} height={16} /> {profile.topSkills.join(' · ')}</li>
          </ul>
          <a href={profile.linkedIn} target="_blank" rel="noreferrer" className="btn btn--light btn--block">
            <LinkedIn width={18} height={18} /> Connect on LinkedIn
          </a>
        </aside>
      </div>

      <div className="container">
        <ul className="stats">
          {profile.stats.map((s) => (
            <li key={s.label} className="stat reveal">
              <strong>{s.value}</strong>
              <span>{s.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
