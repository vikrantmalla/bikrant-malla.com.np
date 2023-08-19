import React from 'react'
import Data, { ContactData, ContactPageData, Links } from "../../../types/data";
import * as gtag from "../../../helpers/lib/gtag";
import { FaGithub, FaBehance, FaLinkedinIn, FaTwitter } from "react-icons/fa";


interface SocialMediaProps {
    contactData: ContactData,
    visibleCount: number
}


const handleClick = () => {
    gtag.event({
        action: "social_media_clicked",
        category: "engagement",
        label: "method",
    });
};

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

const SocialMedia = ({ contactData, visibleCount }: SocialMediaProps) => {
    const socialMediaIcons = [
        { key: 'github', icon: <FaGithub size={20} />, url: contactData.contact[0].githubUrl },
        { key: 'linkedin', icon: <FaLinkedinIn size={20} />, url: contactData.contact[0].linkedinUrl },
        { key: 'behance', icon: <FaBehance size={20} />, url: contactData.contact[0].behanceUrl },
        { key: 'twitter', icon: <FaTwitter size={20} />, url: contactData.contact[0].twitterUrl },
    ];

    const visibleSocialMediaIcons = socialMediaIcons.slice(0, visibleCount);
    return (
        <>
            <div className="social-media">
            {visibleSocialMediaIcons.map((socialMedia, index) => (
                    <ExternalLink
                        key={socialMedia.key}
                        href={socialMedia.url}
                        label={socialMedia.key.charAt(0).toUpperCase() + socialMedia.key.slice(1)}>
                        {socialMedia.icon}
                    </ExternalLink>
                ))}
            </div>

        </>
    )
}

export default SocialMedia