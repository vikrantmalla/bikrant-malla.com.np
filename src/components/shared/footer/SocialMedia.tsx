import React from "react";
import { FaGithub, FaBehance, FaLinkedinIn, FaTwitter } from "react-icons/fa";
import { ContactData } from "../../../types/data";
import ExternalLink from "../externalLink";

interface SocialMediaProps {
  contactData?: ContactData;
  visibleCount: number;
}

const SocialMedia = ({ contactData, visibleCount }: SocialMediaProps) => {
  const socialMediaIcons = [
    {
      key: "github",
      icon: <FaGithub size={20} />,
      url: contactData?.contact[0].githubUrl ?? "",
    },
    {
      key: "linkedin",
      icon: <FaLinkedinIn size={20} />,
      url: contactData?.contact[0].linkedinUrl ?? "",
    },
    {
      key: "behance",
      icon: <FaBehance size={20} />,
      url: contactData?.contact[0].behanceUrl ?? "",
    },
    {
      key: "twitter",
      icon: <FaTwitter size={20} />,
      url: contactData?.contact[0].twitterUrl ?? "",
    },
  ];

  const visibleSocialMediaIcons = socialMediaIcons.slice(0, visibleCount);
  return (
    <>
      <div className="social-media">
        {visibleSocialMediaIcons.map((socialMedia) => (
          <ExternalLink
            key={socialMedia.key}
            href={socialMedia.url}
            label={
              `${socialMedia.key.charAt(0).toUpperCase() + socialMedia.key.slice(1)} (opens in a new tab)`
            }
            gtagAction={`social_media_${socialMedia.key}_clicked`}
            gtagCategory="social_media_interaction"
            gtagLabel="click_through_link"
          >
            {socialMedia.icon}
          </ExternalLink>
        ))}
      </div>
    </>
  );
};

export default SocialMedia;
