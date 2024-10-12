import React from "react";

const Tools = () => {
  return (
    <div className="skills__content">
      <h3 className="skills__title">Developer Tooling</h3>

      <div className="skills__box">
        <div className="skills__group">
          <div className="skills__data">
            <i class="bx bx-badge-check"></i>

            <div>
              <h3 className="skills__name">PostgreSQL</h3>
              {/* <span className="skills__level">Intermediate</span> */}
            </div>
          </div>

          <div className="skills__data">
            <i class="bx bx-badge-check"></i>

            <div>
              <h3 className="skills__name">MongoDB</h3>
              {/* <span className="skills__level">Intermediate</span> */}
            </div>
          </div>

          <div className="skills__data">
            <i class="bx bx-badge-check"></i>

            <div>
              <h3 className="skills__name">Docker</h3>
              {/* <span className="skills__level">Basic</span> */}
            </div>
          </div>
        </div>

        <div className="skills__group">

          <div className="skills__data">
            <i class="bx bx-badge-check"></i>

            <div>
              <h3 className="skills__name">Jenkins</h3>
              <span className="skills__level">&nbsp;</span>
            </div>
          </div>

          <div className="skills__data">
            <i class="bx bx-badge-check"></i>

            <div>
              <h3 className="skills__name">Kubernetes</h3>
              <span className="skills__level">&nbsp;</span>
            </div>
          </div>

          <div className="skills__data">
            <i class="bx bx-badge-check"></i>

            <div>
              <h3 className="skills__name">Git</h3>
              <span className="skills__level">&nbsp;</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Tools;
