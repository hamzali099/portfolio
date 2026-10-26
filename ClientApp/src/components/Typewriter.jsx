import { useEffect, useState } from 'react';

// Types and deletes each word in turn
export default function Typewriter({ words }) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!words.length) return;
    const word = words[index % words.length];
    let delay = deleting ? 45 : 90;
    if (!deleting && text === word) delay = 1800;
    if (deleting && text === '') delay = 300;

    const t = setTimeout(() => {
      if (!deleting && text === word) setDeleting(true);
      else if (deleting && text === '') {
        setDeleting(false);
        setIndex((i) => i + 1);
      } else {
        setText(word.slice(0, text.length + (deleting ? -1 : 1)));
      }
    }, delay);
    return () => clearTimeout(t);
  }, [text, deleting, index, words]);

  return <span className="typewriter">{text}<span className="typewriter__caret" aria-hidden="true" /></span>;
}
