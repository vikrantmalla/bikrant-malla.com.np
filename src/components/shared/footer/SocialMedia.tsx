import React from "react";
import { FaGithub, FaBehance, FaLinkedinIn, FaTwitter, FaFacebook, FaInstagram } from "react-icons/fa";
import type { Contact } from "@/types/data";
import ExternalLink from "../externalLink";

const SocialMedia = ({
  gitHub,
  linkedIn,
  facebook,
  instagram,
  visibleCount = 4,
}: Contact & { visibleCount?: number }) => {
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
      key: "facebook",
      icon: <FaFacebook size={20} />,
      url: facebook ?? "",
    },
    {
      key: "instagram",
      icon: <FaInstagram size={20} />,
      url: instagram ?? "",
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
