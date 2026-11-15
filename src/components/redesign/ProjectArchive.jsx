import { useEffect, useRef, useState } from 'react';
import { projectsData } from '../Projects/Data.jsx';
import './project-archive.css';

const compactLayout = '(max-width: 680px)';

const projectDetails = {
  2: {
    type: 'VS Code extension',
    description: 'A VS Code extension with Spotify controls and AI-selected editor backgrounds. The background changes as you switch files, and you can adjust its opacity to keep the code readable.',
  },
  3: {
    type: 'C++ simulation',
    description: 'A terminal ride-hailing game. Its dispatcher assigns taxis using Manhattan distance and shows their movements on a map as they pick up and drop off passengers.',
  },
  4: {
    type: 'C++ and Qt',
    description: 'A team project simulating a health monitoring device. I worked on collecting and processing readings, generating recommendations, and defining use cases.',
  },
  5: {
    type: 'Automation',
    description: 'A Python bot that gathers contact information from web pages and batches Save Soil outreach emails over SMTP.',
  },
  6: {
    type: 'Express web app',
    description: 'A community fridge management app. The browser interface reads and updates fridge data through an Express server with persistent storage.',
    link: 'https://github.com/Arunteja27/Catch-that-fridge-Express-server',
  },
  7: {
    type: 'C++ audio engine',
    description: 'A low-latency music engine that runs effects on live audio and exposes FFT spectrum data over a REST API.',
  },
  8: {
    type: 'Virtual experience project',
    description: 'A Python exercise from the JPMorgan software engineering virtual experience. The client reads a quote feed, calculates mid-prices from the bid and ask, and compares two stocks.',
  },
  9: {
    type: 'React web app',
    description: 'The React and Vite source behind this portfolio.',
  },
};

const archive = projectsData
  .filter((project) => projectDetails[project.id])
  .map((project) => ({ ...project, ...projectDetails[project.id] }));

function projectTabId(project) {
  return `project-archive-tab-${project.id}`;
}

export default function ProjectArchive() {
  const [selected, setSelected] = useState(0);
  const [compact, setCompact] = useState(() => window.matchMedia(compactLayout).matches);
  const buttons = useRef([]);
  const project = archive[selected];

  useEffect(() => {
    const query = window.matchMedia(compactLayout);
    const updateLayout = (event) => setCompact(event.matches);
    query.addEventListener('change', updateLayout);
    return () => query.removeEventListener('change', updateLayout);
  }, []);

  function handleTabKey(event, index) {
    const previousKey = compact ? 'ArrowLeft' : 'ArrowUp';
    const nextKey = compact ? 'ArrowRight' : 'ArrowDown';
    let next;

    switch (event.key) {
      case previousKey:
        next = (index + archive.length - 1) % archive.length;
        break;
      case nextKey:
        next = (index + 1) % archive.length;
        break;
      case 'Home':
        next = 0;
        break;
      case 'End':
        next = archive.length - 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    setSelected(next);
    buttons.current[next]?.focus();
  }

  return (
    <section className="project-archive" id="project-archive" aria-labelledby="project-archive-heading" tabIndex={-1}>
      <div className="redesign-shell">
        <h2 className="project-archive-heading" id="project-archive-heading">More projects</h2>
        <div className="project-archive-layout">
          <div
            className="project-archive-menu"
            role="tablist"
            aria-label="Browse projects"
            aria-orientation={compact ? 'horizontal' : 'vertical'}
          >
            {archive.map((entry, index) => (
              <button
                className="project-archive-tab"
                key={entry.id}
                ref={(button) => { buttons.current[index] = button; }}
                type="button"
                role="tab"
                id={projectTabId(entry)}
                aria-controls="project-archive-details"
                aria-selected={selected === index}
                tabIndex={selected === index ? 0 : -1}
                onClick={() => setSelected(index)}
                onKeyDown={(event) => handleTabKey(event, index)}
              >
                {entry.title}
                <span className="project-archive-caret" aria-hidden="true" />
              </button>
            ))}
          </div>
          <div
            className="project-archive-details"
            id="project-archive-details"
            role="tabpanel"
            aria-labelledby={projectTabId(project)}
            tabIndex={0}
          >
            <article key={project.id} className="project-archive-card">
              <div className="project-archive-art">
                <img src={project.image} alt="" loading="lazy" decoding="async" />
              </div>
              <div className="project-archive-copy">
                <p className="project-archive-type">{project.type}</p>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <a
                  className="project-archive-source"
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View on GitHub <span aria-hidden="true">↗</span>
                </a>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
