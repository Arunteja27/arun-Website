import React from "react";
import "./experience.css";
import ShopifyLogo from "../../assets/shopify-logo.png";
import RBCLogo from "../../assets/rbc-logo.png";
import CarletonLogo from "../../assets/carleton-logo.png";

const Experience = () => {
  const experiences = [
    {
      id: 1,
      company: "Shopify Inc.",
      role: "Software Engineer Intern - Ads Experience",
      period: "May 2026 - August 2026",
      location: "Toronto, Ontario",
      description: "Building merchant-facing ad tools for campaign setup, optimization, and performance tracking across ads surfaces.",
      logo: ShopifyLogo
    },
    {
      id: 2,
      company: "Shopify Inc.",
      role: "Software Engineer Intern - Sell in Minutes",
      period: "May 2025 - August 2025",
      location: "Toronto, Ontario",
      description: "Built Ruby backend services and GraphQL APIs for merchant onboarding, including Gemini-powered voice agent rollouts across 15+ regions and zero-downtime migration from legacy endpoints.",
      logo: ShopifyLogo
    },
    {
      id: 3,
      company: "Carleton University",
      role: "Teaching Assistant for Abstract Data Types and Algorithms",
      period: "September 2022 - December 2024",
      location: "Ottawa, Ontario",
      description: "Mentored 600+ students through office hours and workshops on Big-O analysis, graph theory, dynamic programming, and Java programming.",
      logo: CarletonLogo
    },
    {
      id: 4,
      company: "Royal Bank of Canada",
      role: "Software Developer Intern - Financial Data Exchange",
      period: "May 2024 - August 2024",
      location: "Toronto, Ontario",
      description: "Built Spring WebFlux orchestration and Java REST APIs for high-scale banking systems, reducing API startup latency by 50% and securing financial data exchange for 15M+ users.",
      logo: RBCLogo
    },
    {
      id: 5,
      company: "Royal Bank of Canada",
      role: "Software Developer Intern - DevOps Engineering",
      period: "May 2023 - December 2023",
      location: "Toronto, Ontario",
      description: "Built Python ETL tooling for Entra ID data to eliminate redundant frontend lookups and reduce load times by 50%.",
      logo: RBCLogo
    }
  ];

  return (
    <section className="experience section" id="experience">
      <h2 className="section__title">Work Experience</h2>
      <span className="section__subtitle">My professional journey</span>

      <div className="experience__container container">
        {experiences.map((exp) => (
          <div key={exp.id} className="experience__content">
            <div className="experience__header">
              <div className="experience__logo">

                {exp.logo && typeof exp.logo === 'string' && !exp.logo.includes('placeholder') ? (
                  <img
                    src={exp.logo}
                    alt={`${exp.company} logo`}
                    className="experience__logo-img"
                  />
                ) : exp.logo && typeof exp.logo !== 'string' ? (
                  <img
                    src={exp.logo}
                    alt={`${exp.company} logo`}
                    className="experience__logo-img"
                  />
                ) : (
                  <div className="experience__logo-placeholder">
                    {exp.company.charAt(0)}
                  </div>
                )}
              </div>
              <div className="experience__info">
                <h3 className="experience__company">{exp.company}</h3>
                <h4 className="experience__role">{exp.role}</h4>
              </div>
              <div className="experience__date-location">
                <span className="experience__period">{exp.period}</span>
                <span className="experience__location">{exp.location}</span>
              </div>
            </div>
            <p className="experience__description">{exp.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Experience; 