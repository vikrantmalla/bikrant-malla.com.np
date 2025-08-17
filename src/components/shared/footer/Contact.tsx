"use client";
import { joseFont, tekoFont } from "@/helpers/lib/font";
import { ContactProps } from "../../../types/data";
import SocialMedia from "./SocialMedia";
import ExternalLink from "../externalLink";

const Contact = ({ contact }: ContactProps) => {
  const { email, linkedIn, gitHub, facebook, instagram } = contact;
  return (
    <>
      <section className="contact" id="contact">
        <h2 className={`heading ${tekoFont} fs-700`}>Get In Touch</h2>
        <div>
          <p className={`${joseFont} fs-400`}>
            Although I&apos;m currently looking any new opportunities, my inbox is
            always open. Whether you have a question or just want to say hi,
            I&apos;ll try my best to get back to you!
          </p>
          <ExternalLink
            className={`button ${joseFont} fs-500`}
            href={`mailto:${email}`}
            label={`Email (opens in a new tab)`}
            gtagAction={`email_clicked`}
            gtagCategory="contact_interaction"
            gtagLabel="click_through_link"
          >
            Say Hello !!
          </ExternalLink>
        </div>
        <SocialMedia {...contact} visibleCount={4} />
      </section>
    </>
  );
};

export default Contact;
