import React from "react";
import { FaGithub, FaBehance, FaLinkedinIn } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import ExternalLink from "../externalLink";

interface SocialMediaProps {
  gitHub?: string;
  linkedIn?: string;
  behance?: string;
  twitter?: string;
  visibleCount?: number;
}

const SocialMedia: React.FC<SocialMediaProps> = ({
  gitHub,
  linkedIn,
  behance,
  twitter,
  visibleCount = 4,
}) => {
  const socialMediaIcons = [
    {
      key: "github",
      icon: <FaGithub size={20} />,
      url: gitHub ?? "",
    },
    {
      key: "linkedin",
      icon: <FaLinkedinIn size={20} />,
      url: linkedIn ?? "",
    },
    {
      key: "behance",
      icon: <FaBehance size={20} />,
      url: behance ?? "",
    },
    {
      key: "twitter",
      icon: <FaXTwitter size={20} />,
      url: twitter ?? "",
    },
  ];

  const visibleSocialMediaIcons = socialMediaIcons.slice(0, visibleCount);
  return (
    <>
      <div className="social-media">
        {visibleSocialMediaIcons.map((socialMedia) => {
          const { key, icon, url } = socialMedia;
          return (
            <ExternalLink
              key={key}
              href={url}
              label={`${
                key.charAt(0).toUpperCase() + key.slice(1)
              } (opens in a new tab)`}
              gtagAction={`social_media_${key}_clicked`}
              gtagCategory="social_media_interaction"
              gtagLabel="click_through_link"
            >
              {icon}
            </ExternalLink>
          );
        })}
      </div>
    </>
  );
};

export default SocialMedia;
