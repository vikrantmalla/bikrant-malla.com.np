import { Links } from "@/types/data";
import * as gtag from "../../helpers/lib/gtag";
import React from "react";

const ExternalLink = ({
  className,
  href,
  children,
  label,
  gtagAction,
  gtagCategory,
  gtagLabel,
}: Links) => {
  const handleClick = () => {
    if (gtagAction && gtagCategory && gtagLabel) {
      gtag.event({
        action: gtagAction,
        category: gtagCategory,
        label: gtagLabel,
      });
    }
  };
  return (
    <a
      className={className}
      target="_blank"
      rel="noopener noreferrer"
      href={href}
      aria-label={label}
      onClick={handleClick}
    >
      {children}
    </a>
  );
};

export default ExternalLink;
