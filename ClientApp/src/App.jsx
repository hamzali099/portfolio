import { useEffect, useState } from 'react';
import { getProfile } from './api.js';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import About from './components/About.jsx';
import Skills from './components/Skills.jsx';
import Experience from './components/Experience.jsx';
import Projects from './components/Projects.jsx';
import Education from './components/Education.jsx';
import Feedback from './components/Feedback.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';

export default function App() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    getProfile().then(setProfile);
  }, []);

  // Fade sections in as they scroll into view
  useEffect(() => {
    if (!profile) return;
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          observer.unobserve(e.target);
        }
      }),
      { threshold: 0.12 }
    );
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [profile]);

  if (!profile) {
    return <div className="loader" aria-label="Loading"><span /></div>;
  }

  return (
    <>
      <Navbar name={profile.name} />
      <main>
        <Hero profile={profile} />
        <About profile={profile} />
        <Skills profile={profile} />
        <Experience profile={profile} />
        <Projects profile={profile} />
        <Education profile={profile} />
        <Feedback />
        <Contact profile={profile} />
      </main>
      <Footer profile={profile} />
    </>
  );
}
