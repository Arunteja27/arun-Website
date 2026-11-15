import { useEffect, useRef, useState } from 'react';
import resume from '../../assets/Resume_Arunteja_Kuchibhatla.pdf';
import './portfolio-menu.css';

const destinations = [
  { label: 'Experience', id: 'experience' },
  { label: 'Projects', id: 'projects' },
  { label: 'Contact', id: 'contact' },
  { label: 'Résumé', href: resume },
];

function moveMenuFocus(event) {
  if (event.altKey || event.ctrlKey || event.metaKey) return;
  if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
  const links = Array.from(event.currentTarget.querySelectorAll('a'));
  const focusedIndex = links.indexOf(document.activeElement);
  if (focusedIndex < 0) return;

  event.preventDefault();
  let nextIndex;
  switch (event.key) {
    case 'Home':
      nextIndex = 0;
      break;
    case 'End':
      nextIndex = links.length - 1;
      break;
    case 'ArrowUp':
    case 'ArrowLeft':
      nextIndex = (focusedIndex + links.length - 1) % links.length;
      break;
    default:
      nextIndex = (focusedIndex + 1) % links.length;
  }
  links[nextIndex].focus();
}

function renderPortfolioLinks({ current, opening = false }) {
  return (
    <nav
      className={opening ? 'portfolio-menu' : 'portfolio-menu portfolio-menu--compact'}
      aria-label={opening ? 'Explore the portfolio' : 'Portfolio navigation'}
      onKeyDown={moveMenuFocus}
    >
      <ul>
        {destinations.map(({ id, label, href }) => (
          <li key={label}>
            <a
              className="portfolio-menu-link"
              href={href || `#${id}`}
              aria-current={id && id === current ? 'location' : undefined}
              data-featured={opening && id === 'projects' ? 'true' : undefined}
              target={href ? '_blank' : undefined}
              rel={href ? 'noopener noreferrer' : undefined}
            >
              <span>{label}</span>
              {opening && <span aria-hidden="true">{href ? '↗' : '↘'}</span>}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function PortfolioOpeningMenu() {
  return renderPortfolioLinks({ opening: true });
}

export default function PortfolioMenu() {
  const headerRef = useRef(null);
  const [current, setCurrent] = useState(null);

  useEffect(() => {
    const header = headerRef.current;
    const hero = document.getElementById('home');
    const sections = destinations.map(({ id }) => id && document.getElementById(id)).filter(Boolean);
    let frame = 0;

    function updateCurrent() {
      frame = 0;
      // The heading at an anchored section sits just below the sticky header.
      const headerBoundary = header.offsetHeight + 12;
      if (hero.getBoundingClientRect().bottom > headerBoundary) {
        setCurrent(null);
        return;
      }

      const readingLine = Math.max(headerBoundary, window.innerHeight * 0.28);
      const atBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
      const section = atBottom
        ? sections.at(-1)
        : sections.findLast((item) => item.getBoundingClientRect().top <= readingLine);
      setCurrent(section?.id || 'experience');
    }

    function scheduleUpdate() {
      if (!frame) frame = requestAnimationFrame(updateCurrent);
    }

    updateCurrent();
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
    };
  }, []);

  return (
    <header className="redesign-header" ref={headerRef} data-past-intro={current ? 'true' : undefined}>
      <div className="redesign-shell redesign-header-inner">
        <a className="redesign-wordmark" href="#home" aria-label="Arunteja Kuchibhatla, home">AK</a>
        {renderPortfolioLinks({ current })}
      </div>
    </header>
  );
}
