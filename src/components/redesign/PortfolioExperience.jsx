import './portfolio-profile.css';

const employers = [
  {
    name: 'Shopify',
    location: 'Toronto, Ontario',
    roles: [
      {
        title: 'Software Engineer Intern',
        team: 'Shopify Ads',
        period: 'May–August 2026',
        description: 'Built merchant-facing tools for setting up ad campaigns, optimizing them, and tracking performance.',
      },
      {
        title: 'Software Engineer Intern',
        team: 'Sell in Minutes',
        period: 'May–August 2025',
        description: 'Built Ruby services and GraphQL APIs for merchant onboarding. Shipped a Gemini-powered voice agent across 15+ regions and migrated legacy endpoints with zero downtime.',
      },
    ],
  },
  {
    name: 'RBC',
    location: 'Toronto, Ontario',
    roles: [
      {
        title: 'Software Developer Intern',
        team: 'Financial Data Exchange',
        period: 'May–August 2024',
        description: 'Built Java REST APIs and Spring WebFlux orchestration for financial data exchange serving 15M+ users. Cut API startup latency by 50%.',
      },
      {
        title: 'Software Developer Intern',
        team: 'DevOps Engineering',
        period: 'May–December 2023',
        description: 'Built Python ETL tooling for Entra ID data that removed redundant frontend lookups and cut load times by 50%.',
      },
    ],
  },
  {
    name: 'Carleton University',
    location: 'Ottawa, Ontario',
    roles: [
      {
        title: 'Teaching Assistant',
        team: 'Abstract Data Types and Algorithms',
        period: 'September 2022–December 2024',
        description: 'Mentored 600+ students in office hours and workshops on Java, complexity analysis, graph algorithms, and dynamic programming.',
      },
    ],
  },
];

export default function PortfolioExperience() {
  return (
    <section className="portfolio-experience" id="experience" aria-labelledby="portfolio-experience-title" tabIndex={-1}>
      <div className="redesign-shell">
        <h2 className="portfolio-profile-heading" id="portfolio-experience-title">Experience</h2>
        <div className="portfolio-experience-list">
          {employers.map((employer) => (
            <div className="portfolio-employer" key={employer.name}>
              <div className="portfolio-employer-meta">
                <h3>{employer.name}</h3>
                <p>{employer.location}</p>
              </div>
              <ul className="portfolio-role-list" role="list">
                {employer.roles.map((role) => (
                  <li className="portfolio-role" key={role.team}>
                    <div className="portfolio-role-header">
                      <h4>{role.team}</h4>
                      <span>{role.period}</span>
                    </div>
                    <p className="portfolio-role-title">{role.title}</p>
                    <p className="portfolio-role-description">{role.description}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
