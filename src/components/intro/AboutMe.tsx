"use client";
import React from "react";
import { joseFont, tekoFont } from "@/helpers/lib/font";
import { AboutMe as Aboutme } from "@/types/data";

const AboutMe = ({ aboutme }: { aboutme: Aboutme }) => {
  return (
    <>
      <section>
        <div className="intro">
          <h1 className={`name ${joseFont} fs-600`}>
            My Name is
            <br />
            <span className={`${tekoFont} fs-800`}>{aboutme.title}</span>
          </h1>
          <h2 className={`profession ${tekoFont} fs-800`}>
            {aboutme.subTitle}
          </h2>
        </div>
      </section>
      <section id="aboutme">
        <h2 className={`headingleft ${joseFont} fs-600`}>About me</h2>
        <div className="aboutme">
          <p className={`${joseFont} fs-400`}>{aboutme.aboutDescription1}</p>
          <p className={`${joseFont} fs-400`}>{aboutme.aboutDescription2}</p>
        </div>
      </section>
      {/* <section id="skill">
        <h2 className={`headingright ${joseFont} fs-600`}>Skillsets</h2>
        <div>
          {aboutme.map((skill: Aboutme, index: number) => {
            const { skill1, skill2 } = skill;
            return (
              <div className="techstack" key={index}>
                <div className="list">
                  <h2 className={`${joseFont} fs-500`}>
                    {`I'm`} <span>Comfortable</span> With
                  </h2>
                  {skill1.map((tech: string, index: number) => {
                    return (
                      <p className={`${joseFont} fs-400`} key={index}>
                        {tech}
                      </p>
                    );
                  })}
                </div>
                <div className="list">
                  <h2 className={`${joseFont} fs-500`}>
                    I Also <span>Can Work</span> With
                  </h2>
                  {skill2.map((tech: string, index: number) => {
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
      </section> */}
    </>
  );
};

export default AboutMe;
