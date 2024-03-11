"use client";
import { joseFont, tekoFont } from "@/helpers/lib/font";
import { ContactPageData } from "../../../types/data";
import SocialMedia from "./SocialMedia";
import ExternalLink from "../externalLink";

const Contact = ({ contactData }: ContactPageData) => {
  return (
    <>
      <section className="contact" id="contact">
        <h2 className={`heading ${tekoFont} fs-700`}>Get In Touch</h2>
        {contactData?.contact.map((details, index) => (
          <div key={index}>
            <p className={`${joseFont} fs-400`}>{details.message}</p>
            <ExternalLink
              className={`button ${joseFont} fs-500`}
              href={details.emailUrl}
              label={`Email (opens in a new tab)`}
              gtagAction={`email_clicked`}
              gtagCategory="contact_interaction"
              gtagLabel="click_through_link"
            >
              {details.ctaMessage}
            </ExternalLink>
          </div>
        ))}
        <SocialMedia contactData={contactData} visibleCount={4} />
      </section>
    </>
  );
};

export default Contact;
