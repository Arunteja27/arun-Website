import React, { useState } from "react";

const WorkItems = ({ item }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = (e) => {
   
    if (e.target.closest('.work__button')) {
      return;
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="work__card" key={item.id} onClick={handleCardClick}>
        <div className="work__img-container">
          <img src={item.image} alt="" className="work__img" />
        </div>
        <h3 className="work__title">{item.title}</h3>
        <a 
          href={item.link} 
          className="work__button"
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
        >
          GitHub Link
          <i className="bx bx-right-arrow-alt work__button-icon"></i>
        </a>
      </div>

      {isModalOpen && (
        <div className="work__modal-overlay" onClick={closeModal}>
          <div className="work__modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="work__modal-close" onClick={closeModal}>
              <i className="bx bx-x"></i>
            </button>
            <div className="work__modal-image">
              <img src={item.image} alt={item.title} />
            </div>
            <div className="work__modal-info">
              <h2 className="work__modal-title">{item.title}</h2>
              <p className="work__modal-description">
                {item.description || "A comprehensive project showcasing modern development practices and innovative solutions."}
              </p>
              <div className="work__modal-category">
                <span className="work__category-tag">{item.category}</span>
              </div>
              <a 
                href={item.link} 
                className="work__modal-button"
                target="_blank"
                rel="noopener noreferrer"
              >
                View on GitHub
                <i className="bx bx-link-external"></i>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default WorkItems;
