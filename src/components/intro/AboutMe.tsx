"use client";
import React from "react";
import { joseFont, tekoFont } from "@/helpers/lib/font";
import { AboutMeData } from "@/types/data";

interface Props {
  tech: string;
  index: number;
}

const AboutMe = ({ aboutme }: AboutMeData) => {
  return (
    <>
      <section>
        {aboutme.map((intro, index) => (
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
        {aboutme.map((about, index) => {
          const { aboutDescription1, aboutDescription2 } = about;
          return (
            <div className="aboutme" key={index}>
              <p className={`${joseFont} fs-400`}>{aboutDescription1}</p>
              <p className={`${joseFont} fs-400`}>{aboutDescription2}</p>
            </div>
          );
        })}
      </section>
      <section id="skill">
        <h2 className={`headingright ${joseFont} fs-600`}>Skillsets</h2>
        <div>
          {aboutme.map((skill, index) => {
            const { skill1, skill2 } = skill;
            return (
              <div className="techstack" key={index}>
                <div className="list">
                  <h2 className={`${joseFont} fs-500`}>
                    {`I'm`} <span>Comfortable</span> With
                  </h2>
                  {skill1.map(({ tech, index }: Props) => {
                    return (
                      <span className={`${joseFont} fs-400`} key={index}>
                        {tech}
                      </span>
                    );
                  })}
                </div>
                <div className="list" key={index}>
                  <h2 className={`${joseFont} fs-500`}>
                    I Also <span>Can Work</span> With
                  </h2>
                  {skill2.map(({ tech, index }: Props) => {
                    return (
                      <p className={`${joseFont} fs-400`} key={index}>
                        {tech}
                      </p>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
};

export default AboutMe;
