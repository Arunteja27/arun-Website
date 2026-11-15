import './portfolio-profile.css';

const contactLinks = [
  { title: 'Email', label: 'aruntejavk@gmail.com', href: 'mailto:aruntejavk@gmail.com' },
  { title: 'LinkedIn', label: 'arunkuchibhatla', href: 'https://www.linkedin.com/in/arunkuchibhatla/' },
  { title: 'GitHub', label: 'Arunteja27', href: 'https://github.com/Arunteja27' },
];

export default function PortfolioContact() {
  return (
    <section className="portfolio-contact" id="contact" aria-labelledby="portfolio-contact-title" tabIndex={-1}>
      <div className="redesign-shell portfolio-contact-layout">
        <h2 className="portfolio-profile-heading" id="portfolio-contact-title">Get in touch</h2>
        <ul className="portfolio-contact-links" role="list">
          {contactLinks.map(({ title, label, href }) => (
            <li key={title}>
              <a href={href}>
                <span className="portfolio-contact-channel">{title}</span>
                <span className="portfolio-contact-address">{label}</span>
                <span className="portfolio-contact-arrow" aria-hidden="true">↗</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
