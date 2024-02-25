"use client";
import { joseFont, tekoFont } from "@/helpers/lib/font";
import { ContactPageData } from "../../../types/data";
import SocialMedia from "./SocialMedia";

const Contact = ({ contactData }: ContactPageData) => {
  return (
    <>
      <section className="contact" id="contact">
        <h2 className={`heading ${tekoFont} fs-700`}>Get In Touch</h2>
        {contactData.contact.map((details, index) => (
          <div key={index}>
            <p className={`${joseFont} fs-400`}>{details.message}</p>

            <a href={details.emailUrl} className={`button ${joseFont} fs-500`}>
              {details.ctaMessage}
            </a>
          </div>
        ))}
        <SocialMedia contactData={contactData} visibleCount={4} />
      </section>
    </>
  );
};

export default Contact;
