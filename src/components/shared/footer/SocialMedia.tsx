import React from "react";
import { FaGithub, FaBehance, FaLinkedinIn, FaTwitter } from "react-icons/fa";
import { SocialMedia } from "../../../types/data";
import ExternalLink from "../externalLink";

const SocialMedia = ({
  githubUrl,
  behanceUrl,
  linkedinUrl,
  twitterUrl,
  visibleCount,
}: SocialMedia) => {
  const socialMediaIcons = [
    {
      key: "github",
      icon: <FaGithub size={20} />,
      url: githubUrl ?? "",
    },
    {
      key: "linkedin",
      icon: <FaLinkedinIn size={20} />,
      url: linkedinUrl ?? "",
    },
    {
      key: "behance",
      icon: <FaBehance size={20} />,
      url: behanceUrl ?? "",
    },
    {
      key: "twitter",
      icon: <FaTwitter size={20} />,
      url: twitterUrl ?? "",
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
