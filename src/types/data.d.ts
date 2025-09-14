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
  id: string | null;
  name: string;
  jobTitle: string;
  aboutDescription1: string;
  aboutDescription2: string;
  skills: string[];
  email: string;
  ownerEmail: string;
  linkedIn: string;
  gitHub: string;
  behance: string;
  twitter: string;
  projects: Project[];
  archiveProjects: ArchiveProject[];
  // Optional relations that might be included in API responses
  userRoles?: UserPortfolioRole[];
}

// Base Portfolio interface matching Prisma schema
export interface Portfolio {
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
  behance: string;
  twitter: string;
  // Optional relations that might be included in API responses
  projects?: Project[];
  archiveProjects?: ArchiveProject[];
  userRoles?: UserPortfolioRole[];
}

export interface AboutMeData {
  aboutme: Aboutme;
}

export interface AboutMe {
  title: string;
  subTitle: string;
  aboutDescription1: string;
  aboutDescription2: string;
  skills: string[];
}

export interface BehanceData {
  project: Project[];
}

export interface BehanceCard {
  key: number;
  project: Project;
}

export interface BehanceProject {
  id: string;
  title: string;
  subTitle?: string;
  images?: string;
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
  behance?: string;
  twitter?: string;
}

export interface ContactProps {
  contact: Contact;
}

export interface NavBarProps {
  contact: Contact;
}

export interface SocialMedia {
  gitHub?: string;
  linkedIn?: string;
  behance?: string;
  twitter?: string;
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
  projects: Project[];
}

export interface ProjectHighlightsCard {
  key: number;
  project: Project;
}

export interface Project {
  id: string;
  title: string;
  subTitle: string; // Required in Prisma schema
  images: string; // Required in Prisma schema - Array of Cloudinary URLs
  alt: string; // Required in Prisma schema
  projectView: string;
  tools: string[];
  platform: "Web" | "Design"; // Required in Prisma schema - using Platform enum values
  portfolioId?: string;
  // Optional relations that might be included in API responses
  portfolio?: Portfolio;
  tagRelations?: ProjectTag[];
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
  email: string;
  password: string;
  name?: string;
  roles: UserPortfolioRole[];
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  emailVerified: boolean;
}

export interface UserPortfolioRole {
  id: string;
  userId: string;
  portfolioId: string;
  role: "OWNER" | "EDITOR" | "VIEWER"; // Using Role enum values
  invitedAt: Date;
  // Optional relations that might be included in API responses
  user?: User;
  portfolio?: Portfolio;
}

export interface ProjectTag {
  id: string;
  projectId: string;
  tagId: string;
  // Optional relations that might be included in API responses
  project?: Project;
  tag?: TechTag;
}

export interface ArchiveProjectTag {
  id: string;
  archiveProjectId: string;
  tagId: string;
  // Optional relations that might be included in API responses
  archiveProject?: ArchiveProject;
  tag?: TechTag;
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
  // Optional relations that might be included in API responses
  portfolio?: Portfolio;
  tagRelations?: ArchiveProjectTag[];
}

export interface ConfigData {
  config: Config[];
}

export interface Config {
  id: string;
  allowSignUp: boolean;
}

export interface TechOption {
  id: string;
  name: string;
  category: string;
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
