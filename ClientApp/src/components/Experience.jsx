import Section from './Section.jsx';
import { Briefcase, MapPin } from './Icons.jsx';
import { formatMonth, duration } from '../utils.js';

export default function Experience({ profile }) {
  return (
    <Section id="experience" eyebrow="Experience" title="Where I've worked">
      <ol className="timeline">
        {profile.experience.map((job) => (
          <li key={job.company + job.start} className="timeline__item reveal">
            <span className="timeline__dot"><Briefcase width={16} height={16} /></span>
            <div className="card card--hover timeline__card">
              <div className="timeline__head">
                <div>
                  <h3>{job.role}</h3>
                  <p className="timeline__company">{job.company}</p>
                </div>
                <div className="timeline__date">
                  {!job.end && <span className="pill">Current</span>}
                  <span>{formatMonth(job.start)} — {formatMonth(job.end)}</span>
                  <small>{duration(job.start, job.end)}</small>
                </div>
              </div>
              <p className="timeline__loc"><MapPin width={14} height={14} /> {job.location}</p>
              {job.points?.length > 0 && (
                <ul className="bullets">
                  {job.points.map((p) => <li key={p}>{p}</li>)}
                </ul>
              )}
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}
