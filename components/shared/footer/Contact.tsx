import { ContactPageData } from "../../../types/data";
import SocialMedia from "./SocialMedia";

const Contact = ({ contactData }: ContactPageData) => {
  return (
    <>
      <section className="contact" id="contact">
        <h1 className="heading ff-serif-teko fs-700">Get In Touch</h1>
        {
          contactData.contact.map((details, index) => (
            <div key={index}>
              <p className="ff-serif-jose fs-400">
                {details.message}
              </p>

              <a
                href={details.emailUrl}
                className="button ff-serif-jose fs-500"
              >
                {details.ctaMessage}
              </a>
            </div>
          ))
        }
          <SocialMedia contactData={contactData} visibleCount={4} />
      </section>
    </>
  );
};

export default Contact;
