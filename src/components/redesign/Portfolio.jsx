import { useLayoutEffect } from 'react';
import DitherPortrait from './DitherPortrait.jsx';
import RocketCursor from './RocketCursor.jsx';
import PortfolioMenu, { PortfolioOpeningMenu } from './PortfolioMenu.jsx';
import PortfolioExperience from './PortfolioExperience.jsx';
import PortfolioContact from './PortfolioContact.jsx';
import ProjectArchive from './ProjectArchive.jsx';
import RepoLens from './RepoLens.jsx';
import './redesign.css';

export default function Portfolio() {
  useLayoutEffect(() => {
    // A shared section link may load before React has mounted its target.
    const sectionId = window.location.hash.slice(1);
    if (sectionId) document.getElementById(sectionId)?.scrollIntoView({ behavior: 'instant' });
  }, []);

  return (
    <>
      <a className="redesign-skip" href="#main">Skip to content</a>
      <PortfolioMenu />

      <main id="main" tabIndex={-1}>
        <section
          className="redesign-hero"
          id="home"
          aria-labelledby="redesign-intro"
          tabIndex={-1}
        >
          <div className="redesign-shell redesign-hero-scene">
            <div className="redesign-intro">
              <p className="redesign-role">Software engineer</p>
              <h1 className="redesign-name" id="redesign-intro">Arunteja Kuchibhatla</h1>
              <p className="redesign-background">
                Bachelor of Computer Science Honours @ Carleton University
              </p>
              <p className="redesign-availability">Seeking 2027 new-grad software engineering roles.</p>
            </div>
            <PortfolioOpeningMenu />
            <div className="redesign-hero-media">
              <DitherPortrait />
            </div>
          </div>
        </section>

        <PortfolioExperience />
        <section id="projects" aria-labelledby="portfolio-projects-title" tabIndex={-1}>
          <header className="portfolio-projects-intro">
            <div className="redesign-shell portfolio-projects-index">
              <h2 className="portfolio-profile-heading" id="portfolio-projects-title">Projects</h2>
              <nav aria-label="Project sections">
                <a href="#repolens">RepoLens AI <span aria-hidden="true">↘</span></a>
                <a href="#project-archive">Project archive <span aria-hidden="true">↘</span></a>
              </nav>
            </div>
          </header>
          <RepoLens />
          <ProjectArchive />
        </section>
        <PortfolioContact />
      </main>
      <RocketCursor />
    </>
  );
}
