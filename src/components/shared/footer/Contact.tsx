"use client";
import { joseFont, tekoFont } from "@/helpers/lib/font";
import { Contact, ContactInfo } from "../../../types/data";
import SocialMedia from "./SocialMedia";
import ExternalLink from "../externalLink";

const Contact = ({ contact }: Contact) => {
  return (
    <>
      <section className="contact" id="contact">
        <h2 className={`heading ${tekoFont} fs-700`}>Get In Touch</h2>
        {contact.map((details: ContactInfo, index: number) => {
          const { message, emailUrl, ctaMessage } = details;
          return (
            <div key={index}>
              <p className={`${joseFont} fs-400`}>{message}</p>
              <ExternalLink
                className={`button ${joseFont} fs-500`}
                href={emailUrl}
                label={`Email (opens in a new tab)`}
                gtagAction={`email_clicked`}
                gtagCategory="contact_interaction"
                gtagLabel="click_through_link"
              >
                {ctaMessage}
              </ExternalLink>
            </div>
          );
        })}
        {contact.map((details: ContactInfo, index: number) => {
          return (
            <div key={index}>
              <SocialMedia {...details} visibleCount={4} />
            </div>
          );
        })}
      </section>
    </>
  );
};

export default Contact;
