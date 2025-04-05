import { ReactNode } from "react";

declare namespace Data {
  declare namespace ProviderContext {
    interface AppState {
      toggleMenu: boolean;
      navColor: boolean;
      activeLink: string;
      showForgetPasswordModal: boolean;
      setToggleMenu: (value: boolean) => void;
      setNavColor: (value: boolean) => void;
      setActiveLink: (value: string) => void;
      setShowForgetPasswordModal: (value: boolean) => void;
    }

    interface ThemeStore {
      isDarkTheme: boolean;
      themes: Theme;
      setIsDarkTheme: (value: boolean) => void;
    }

    interface Theme {
      light: ThemeProperties;
      dark: ThemeProperties;
    }

    interface ProjectStore {
      projectList: ArchiveProject[];
      selectedTag: string;
      showSkeletonLoading: boolean;
      isAscending: boolean;
      setSelectedTag: (tag: string) => void;
      setProjectList: (projects: ArchiveProject[]) => void;
      sortProjectList: () => void;
      setSkeletonLoading: (value: boolean) => void;
    }

    interface MouseStore {
      cursorType: string;
      mousePosition: { x: number; y: number };
      setCursorType: (type: string) => void;
      setMousePosition: (position: { x: number; y: number }) => void;
    }
  }
}

export = Data;

export interface PortfolioDetails {
  success: boolean;
  aboutme: AboutMe[];
  behance: BehanceProject[];
  contact: ContactInfo[];
  metaData: MetaData[];
  project: Project[];
  config: Config[];
}

export interface AboutMeData {
  aboutme: Aboutme[];
}

export interface AboutMe {
  _id: string;
  title: string;
  jobTitle: string;
  subTitle: string;
  aboutDescription1: string;
  aboutDescription2: string;
  skill1: string[];
  skill2: string[];
  __v: number;
}

export interface BehanceData {
  behance: BehanceProject[];
  configData: Config;
}

export interface BehanceCard {
  key: number;
  project: BehanceProject;
  config: Config;
}

export interface BehanceProject {
  id: string;
  title: string;
  subTitle: string;
  images: string;
  imageUrl: string;
  alt: string;
  tools: string[];
  projectview: string;
  __v: number;
}

export interface Contact {
  contact: ContactInfo[];
}

export interface NavBarProps {
  contact?: ContactInfo[];
}

export interface ContactInfo {
  _id: string;
  message: string;
  ctaMessage: string;
  emailUrl: string;
  githubUrl: string;
  behanceUrl: string;
  linkedinUrl: string;
  twitterUrl: string;
  __v: number;
}

export interface SocialMedia {
  githubUrl: string;
  behanceUrl: string;
  linkedinUrl: string;
  twitterUrl: string;
  visibleCount: number;
}

export interface MetaData {
  _id: string;
  title: string;
  description: string;
  keyword: string;
  author: string;
  fbID: string;
  twitterID: string;
  __v: number;
}

export interface ProjectHighlightData {
  project: Project[];
  configData: Config;
}

export interface ProjectHighlightsCard {
  key: number;
  project: Project;
  config: Config;
}

export interface Project {
  _id: string;
  title: string;
  images: string;
  imageUrl: string;
  alt: string;
  projectview: string;
  build: string[];
  __v: number;
}

interface Config {
  _id: number;
  allowBackupImages: boolean;
}

export interface Links {
  children: ReactNode;
  className?: string;
  href: string;
  label: string;
  gtagAction?: string;
  gtagCategory?: string;
  gtagLabel?: string;
}

export interface Props {
  children: ReactNode;
}

export interface GTagEvent {
  action: string;
  category: string;
  label: string;
}

export interface NavItemProps {
  tabId: string;
  pathname: string;
  activeLink: string;
  onTabClick: (tabId: string) => void;
  onMenuClick: () => void;
}

// Archive page Data types

export interface ArchiveDetailsData {
  success: boolean;
  metaData: MetaData[];
  techTag: TechTag[];
  archiveProject: ArchiveProject[];
}

export interface ArchiveProps {
  project: ArchiveProject[];
  techTag: TechTag[];
}

export interface TechTag {
  _id: string;
  tag: string;
}

export interface ArchiveProject {
  isnew: boolean;
  id: string;
  _id: string;
  __v: number;
  build: string[];
  isnew: boolean;
  projectview: string;
  title: string;
  viewcode: string;
  year: number;
}

export interface ConfigData {
  config: Config[];
}

export interface Config {
  _id: string;
  allowSignUp: boolean;
}

export interface ThemeProperties {
  background: string;
  navBackground: string;
  navBackgroundShadow: string;
  navActiveLink: string;
  text: string;
  textRev: string;
  headingStroke: string;
  hoverStroke: string;
  toggle: string;
  toggleHover: string;
  link: string;
  card: string;
  cardBackgroundShadow: string;
  span: string;
}
