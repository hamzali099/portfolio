export default function Section({ id, eyebrow, title, intro, alt, children }) {
  return (
    <section id={id} className={`section ${alt ? 'section--alt' : ''}`}>
      <div className="container">
        <header className="section__head reveal">
          <span className="eyebrow">{eyebrow}</span>
          <h2>{title}</h2>
          {intro && <p>{intro}</p>}
        </header>
        {children}
      </div>
    </section>
  );
}
