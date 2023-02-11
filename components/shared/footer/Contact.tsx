import Link from 'next/link'
import { Links } from '../../../types/data';
import * as gtag from "../../../helpers/lib/gtag";


const handleClick = () => {
    gtag.event({
      action: 'social_media_clicked',
      category: 'engagement',
      label: 'method'
    })
  }

const ExternalLink = ({ href, children, label }: Links) => (
    <a
        target="_blank"
        rel="noopener noreferrer"
        href={href}
        aria-label={label}
        onClick={handleClick}
    >
        {children}
    </a>
);


const Contact = () => {
    return (
        <>
            <section className="contact" id="contact">
                <h1 className="heading ff-serif-teko fs-700">Get In Touch</h1>
                <p className="ff-serif-jose fs-400">Although {`I'm`} currently looking any new opportunities, my inbox is always open. Whether you have a question or just want to say hi, {`I'll`} try my best to get back to you!</p>

                <Link href="mailto:vikrantmalla999@gmail.com" className="button ff-serif-jose fs-500" passHref>
                    {`Say Hello!!`}
                </Link>
                <div className="social-media">
                    <ExternalLink href="https://github.com/vikrantmalla" label="Github">
                        <i className="fab fa-github" />
                    </ExternalLink>
                    <ExternalLink href="https://www.behance.net/vikrantmalla09" label="Behance">
                        <i className="fab fa-behance" />
                    </ExternalLink>
                    <ExternalLink href="https://www.linkedin.com/in/vikrant-malla" label="Linkedin">
                        <i className="fab fa-linkedin-in" />
                    </ExternalLink>
                    <ExternalLink href="https://twitter.com/Vikrantmalla09" label="Twitter">
                        <i className="fab fa-twitter" />
                    </ExternalLink>
                </div>
            </section>
        </>
    )
}

export default Contact
