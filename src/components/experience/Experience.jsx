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
      role: "Software Engineer Intern - Growth RnD, Sell in Minutes",
      period: "May 2025 - Present",
      location: "Toronto, Ontario",
      description: "Building merchant onboarding features in Ruby, React & GPT-4 for 3M+ merchants serving 270M+ clients.",
      logo: ShopifyLogo 
    },
    {
      id: 2,
      company: "Carleton University",
      role: "Teaching Assistant for Abstract Data Types and Algorithms",
      period: "September 2022 - December 2024",
      location: "Ottawa, Ontario",
      description: "Guided 600+ students in mastering data structures and algorithms via office hours. Led optimization workshops, contributing to 200+ A+ grades.",
      logo: CarletonLogo
    },
    {
      id: 3,
      company: "Royal Bank of Canada",
      role: "Software Developer Intern - Financial Data Exchange",
      period: "May 2024 - August 2024",
      location: "Toronto, Ontario",
      description: "Developed RESTful APIs in Java with JWT, impacting 15M+ online banking users. Engineered a Spring WebFlux orchestrator that triggers downstream services based on user interactions, reducing app load times by 50% (4s to 2s).",
      logo: RBCLogo
    },
    {
      id: 4,
      company: "Royal Bank of Canada",
      role: "Software Developer Intern - DevOps Engineering",
      period: "May 2023 - December 2023",
      location: "Toronto, Ontario",
      description: "Automated onboarding with React service portal, increasing registered services by 35% QoQ. Built Python ETL pipelines reducing load times by 40%.",
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