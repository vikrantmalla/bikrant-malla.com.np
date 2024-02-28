"use client";
import React from 'react';
import Link from 'next/link';
import { joseFont } from '@/helpers/lib/font';
import * as gtag from "../../../helpers/lib/gtag";

const ResumeLink = () => {
const handleClick = () => {    
    gtag.event({
    action: `#resume_link`,
    category: "ui_interaction",
    label: "resume_link_click",
  });};
  return (
   <>
    <Link className={`resume-link ${joseFont} fs-400`} href="/resume.pdf" target="_blank" rel="noreferrer" onClick={() => handleClick()}>Resume</Link>
   </>
  )
}

export default ResumeLink