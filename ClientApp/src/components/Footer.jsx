import { useEffect, useState } from 'react';
import { Mail, LinkedIn, ArrowUp } from './Icons.jsx';
import { initials } from '../utils.js';

export default function Footer({ profile }) {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <span className="nav__logo">{initials(profile.name)}</span>
          <div>
            <strong>{profile.name}</strong>
            <p>{profile.title} · {profile.location}</p>
          </div>
        </div>
        <div className="footer__links">
          <a href={`mailto:${profile.email}`} aria-label="Email"><Mail /></a>
          <a href={profile.linkedIn} target="_blank" rel="noreferrer" aria-label="LinkedIn"><LinkedIn /></a>
        </div>
      </div>
      <div className="container footer__bottom">
        © {new Date().getFullYear()} {profile.name}. Built with React &amp; ASP.NET Core MVC.
        <span className="footer__build">Version: {__BUILD_TIME__} · email v2</span>
      </div>
      <a href="#top" className={`to-top ${showTop ? 'is-visible' : ''}`} aria-label="Back to top"><ArrowUp /></a>
    </footer>
  );
}
