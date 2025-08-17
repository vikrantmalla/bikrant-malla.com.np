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
  id: string;
  name: string;
  jobTitle: string;
  aboutDescription1: string;
  aboutDescription2: string;
  skills: string[];
  email: string;
  ownerEmail: string;
  linkedIn: string;
  gitHub: string;
  facebook: string;
  instagram: string;
  projects: Project[];
  archiveProjects: ArchiveProject[];
}

export interface AboutMeData {
  aboutme: Aboutme;
}

export interface AboutMe {
  title: string;
  subTitle: string;
  aboutDescription1: string;
  aboutDescription2: string;
}

export interface BehanceData {
  behance: BehanceProject[];
  configData: BackupConfig;
}

export interface BehanceCard {
  key: number;
  project: BehanceProject;
  config: BackupConfig;
}

export interface BehanceProject {
  id: string;
  title: string;
  subTitle?: string;
  images?: string;
  imageUrl?: string;
  alt?: string;
  tools: string[];
  projectView: string;
  platform?: string;
  portfolioId?: string;
}

export interface Contact {
  email: string;
  linkedIn?: string;
  gitHub?: string;
  facebook?: string;
  instagram?: string;
}

export interface ContactProps {
  contact: Contact;
}

export interface NavBarProps {
  contact?: ContactInfo[];
}

export interface ContactInfo {
  id: string;
  message: string;
  ctaMessage: string;
  emailUrl: string;
  githubUrl: string;
  behanceUrl: string;
  linkedinUrl: string;
  twitterUrl: string;
}

export interface SocialMedia {
  gitHub?: string;
  linkedIn?: string;
  facebook?: string;
  instagram?: string;
  visibleCount?: number;
}

export interface MetaData {
  id: string;
  title: string;
  description: string;
  keyword: string;
  author: string;
  fbID: string;
  twitterID: string;
}

export interface ProjectHighlightData {
  project: Project[];
  configData: BackupConfig;
}

export interface ProjectHighlightsCard {
  key: number;
  project: Project;
  config: BackupConfig;
}

export interface Project {
  id: string;
  title: string;
  subTitle?: string;
  images?: string;
  imageUrl?: string;
  alt?: string;
  projectView: string;
  tools: string[];
  platform?: string;
  portfolioId?: string;
}

export interface BackupConfig {
  id?: string;
  allowBackupImages: boolean;
}

export interface MetaTag {
  id: string;
  title: string;
  description: string;
  keyword: string;
  author: string;
  fbID: string;
  twitterID: string;
}

export interface User {
  id: string;
  kindeUserId: string;
  email: string;
  name?: string;
  roles: UserPortfolioRole[];
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPortfolioRole {
  id: string;
  userId: string;
  portfolioId: string;
  role: string;
  invitedAt: Date;
}

export interface ProjectTag {
  id: string;
  projectId: string;
  tagId: string;
}

export interface ArchiveProjectTag {
  id: string;
  archiveProjectId: string;
  tagId: string;
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
  id: string;
  tag: string;
}

export interface ArchiveProject {
  id: string;
  title: string;
  year: number;
  isNew: boolean;
  projectView: string;
  viewCode: string;
  build: string[];
  portfolioId?: string;
}

export interface ConfigData {
  config: Config[];
}

export interface Config {
  id: string;
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
