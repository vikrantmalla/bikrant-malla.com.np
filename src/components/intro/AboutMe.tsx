import React from "react";
import { joseFont, tekoFont } from "@/helpers/lib/font";
import { AboutMePageData } from "@/types/data";

const AboutMe = ({ aboutMeData }: AboutMePageData) => {
  return (
    <>
      <section>
        {aboutMeData.aboutme.map((intro, index) => (
          <div className="intro" key={index}>
            <h1 className={`name ${joseFont} fs-600`}>
              {intro.subTitle}
              <br />
              <span className={`hover ${tekoFont} fs-700`}>{intro.title}</span>
            </h1>
            <h2 className={`profession ${tekoFont} fs-700`}>
              {intro.jobTitle}
            </h2>
          </div>
        ))}
      </section>
      <section id="aboutme">
        <h2 className={`headingleft ${joseFont} fs-600`}>About me</h2>
        {aboutMeData.aboutme.map((about, index) => (
          <div className="aboutme" key={index}>
            <p className={`${joseFont} fs-400`}>{about.aboutDescription1}</p>
            <p className={`${joseFont} fs-400`}>{about.aboutDescription2}</p>
          </div>
        ))}
      </section>
      <section id="skill">
        <h2 className={`headingright ${joseFont} fs-600`}>Skillsets</h2>
        <div>
          {aboutMeData.aboutme.map((skill, index) => (
            <div className="techstack" key={index}>
              <div className="list">
                <h2 className={`${joseFont} fs-500`}>
                  {`I'm`} <span>Comfortable</span> With
                </h2>
                {skill.skill1.map((tech, index) => (
                  <p className={`${joseFont} fs-400`} key={index}>
                    {tech}
                  </p>
                ))}
              </div>
              <div className="list" key={index}>
                <h2 className={`${joseFont} fs-500`}>
                  I Also <span>Can Work</span> With
                </h2>
                {skill.skill2.map((tech, index) => (
                  <p className={`${joseFont} fs-400`} key={index}>
                    {tech}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default AboutMe;
