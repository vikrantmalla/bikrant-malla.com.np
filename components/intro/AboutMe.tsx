import React from "react";

const AboutMe = () => {
    return (
        <>
            <section>
                <div className="intro">
                    <h1 className="name ff-serif-jose fs-600">My Name is<br /><span className='hover ff-serif-teko fs-700'>BIKRANT MALLA.</span></h1>
                    <h1 className="profession ff-serif-teko fs-700">FRONTEND WEB DEVELOPER.</h1>
                </div>
            </section>
            <section id="aboutme">
                <h1 className="headingleft ff-serif-jose fs-600">About me</h1>
                <div className="aboutme">
                    <p className="ff-serif-jose fs-400">Hello! My name is Bikrant. I am a self-taught, passionate front-end developer from Nepal. My interest in front-end web development started in 2012. Before that, I had experience as a UI/UX designer. I completed my undergraduate degree in Bachelor of Computer Applications (BCA) from India.</p>
                    <p className="ff-serif-jose fs-400">I have always wanted to create new things and explore new development tools. This has led me to a career in web development, which has changed a lot for me. I strive to push my work to new horizons with each project and prioritize quality. To learn more, please check my work and feel free to get in touch.</p>
                </div>
            </section>
            <section id="skill">
                <h1 className="headingright ff-serif-jose fs-600">Skillsets</h1>
                <div className="techstack">
                    <div className="list">
                        <h2 className="ff-serif-jose fs-500">{`I'm`} <span>Comfortable</span> With</h2>

                        <p className="ff-serif-jose fs-400">HTML</p>
                        <p className="ff-serif-jose fs-400">CSS / SCSS</p>
                        <p className="ff-serif-jose fs-400">JavaScript(ES6+)</p>
                        <p className="ff-serif-jose fs-400">React JS</p>
                        <p className="ff-serif-jose fs-400">TypeScript</p>

                    </div>
                    <div className="list">
                        <h2 className="ff-serif-jose fs-500">I Also <span>Can Work</span> With</h2>

                        <p className="ff-serif-jose fs-400">Bootstrap / Tailwind CSS</p>
                        <p className="ff-serif-jose fs-400">Next JS</p>
                        <p className="ff-serif-jose fs-400">Node JS</p>
                        <p className="ff-serif-jose fs-400">Express JS</p>
                        <p className="ff-serif-jose fs-400">MongoDB/Mongoose</p>

                    </div>
                </div>
            </section>
        </>
    )
}

export default AboutMe
