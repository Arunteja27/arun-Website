import React from "react";

const Info = () => {
  return (
    <div className="about__info grid">
      <div className="about__box">
        <i class="bx bx-award about__icon"></i>

        <h3 className="about__title">SWE Experience</h3>
        <span className="about__subtitle">1 year combined</span>
      </div>

      <div className="about__box">
        <i class="bx bx-briefcase-alt about__icon"></i>

        <h3 className="about__title">Completed</h3>
        <span className="about__subtitle">8 quality projects</span>
      </div>

      <div className="about__box">
        {/* <i class="bx bx-support about__icon"></i> */}
        <i class='bx bxs-book about__icon'></i>

        <h3 className="about__title">Education</h3>
        <span className="about__subtitle">4th Year CS</span>
      </div>
    </div>
  );
};

export default Info;
