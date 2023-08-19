import { ReactNode } from "react";

declare namespace Data {
  declare namespace Contexts {
    interface MouseContext {
      cursorType: string;
      cursorChangeHandler: React.Dispatch<React.SetStateAction<string>>;
    }
    interface ThemeContext {
      dark: boolean;
      toggle: any;
    }
    interface ProjectContext {
      filterKeyword: any;
      AddKeyword: any;
      RemoveKeyword: any;
      ClearKeywords: any;
    }
  }

  declare namespace PageData {
    interface ProjectPageData {
      aboutMeData: AboutMeData;
      behanceData: BehanceData;
      projectHighlightData: ProjectHighlightData;
      contactData: ContactData;
    }
    interface ArchivePageData {
      projectData: ProjectData[];
    }
  }

  interface MetaTagData {
    success: boolean;
    metaTag: MetaTag[];
  }

  interface MetaTag {
    title: string;
    pageTitle: string;
    description: string;
    keyword: string;
    author: string;
    fbID: string;
    twitterID: string;
    googleSiteID: string;
  }

  interface AboutMePageData {
    aboutMeData: AboutMeData;
  }

  interface AboutMeData {
    success: boolean;
    aboutme: Aboutme[];
  }

  interface Aboutme {
    _id: string;
    __v: number;
    title: string;
    jobTitle: string;
    subTitle: string;
    aboutDescription1: string;
    aboutDescription2: string;
    skill1: string[];
    skill2: string[];
  }

  interface ProjectHighlightPageData {
    projectHighlightData: ProjectHighlightData;
  }

  interface ProjectHighlightData {
    success: boolean;
    projectHighlights: ProjectHighlights[];
  }

  interface ProjectHighlights {
    _id: string;
    __v: number;
    alt: string;
    build: string[];
    images: string;
    projectview: string;
    title: string;
  }

  interface ProjectHighlightsCard {
    key: number;
    project: ProjectHighlights;
  }

  interface BehancePageData {
    behanceData: BehanceData;
  }

  interface BehanceData {
    success: boolean;
    behanceProject: BehanceProject[];
  }

  interface BehanceProject {
    _id: string;
    __v: number;
    id: string;
    alt: string;
    images: string;
    projectview: string;
    subTitle: string;
    title: string;
    tools: string[];
  }

  interface BehanceCard {
    key: number;
    project: BehanceProject;
  }

  interface projectHighlights {
    _id: string;
    title: string;
    projectview: string;
    build: string[];
    __v: number;
    alt: string;
    images: string;
  }

  interface ProjectPageData {
    projectData: ProjectData;
  }

  interface ProjectData {
    success: boolean;
    project: Project;
  }

  interface ArchiveList {
    project: any;
  }

  interface ArchiveDetailsData {
    _id: string;
    __v: number;
    id: number;
    isNew: boolean;
    build: string[];
    isnew: boolean;
    projectview: string;
    title: string;
    viewcode: string;
    year: number;
  }

  interface Project {
    filter: any;
    _id: string;
    __v: number;
    build: string[];
    isnew: boolean;
    projectview: string;
    title: string;
    viewcode: string;
    year: number;
  }

  interface ContactPageData {
    contactData: ContactData;
  }

  interface ContactData {
    success: boolean;
    contact: Contact[];
  }

  interface Contact {
    _id: string;
    __v: number;
    message: string;
    ctaMessage: string;
    emailUrl: string;
    githubUrl: string;
    behanceUrl: string;
    linkedinUrl: string;
    twitterUrl: string;
  }

  interface Links {
    children: ReactNode;
    href: string;
    label: string;
  }

  interface Props {
    children: ReactNode;
  }

  interface GTagEvent {
    action: string;
    category: string;
    label: string;
  }
}

export = Data;
