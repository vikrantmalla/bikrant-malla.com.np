"use client";
import React from "react";
import { joseFont } from "@/helpers/lib/font";
import ExternalLink from "../externalLink";

const ResumeLink = () => {
  return (
    <>
      <ExternalLink
        className={`resume-link ${joseFont} fs-400`}
        href="/resume.pdf"
        label="View Résumé (opens in a new tab)"
        gtagAction="#resume_link"
        gtagCategory="document_interaction"
        gtagLabel="resume_view"
      >
        Resume
      </ExternalLink>
    </>
  );
};

export default ResumeLink;
