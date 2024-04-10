// ENDPOINT
export enum ApiEndpoint {
  ABOUT_ME_ENDPOINT = "api/aboutme",
  AUTH_SIGN_UP_ENDPOINT = "/api/auth/signup",
  AUTH_SIGN_IN_ENDPOINT = "/api/auth/signin",
  BEHANCE_ENDPOINT = "api/behance",
  CONTACT_ENDPOINT = "api/contact",
  META_DATA_ENDPOINT = "api/metadata",
  PORTFOLIO_DETAILS_ENDPOINT = "api/portfoliodetails",
  PROJECTS_ENDPOINT = "api/projects",
  PROJECT_HIGHLIGHTS_ENDPOINT = "api/projecthighlight",
  TAGS_ENDPOINT = "api/tags",
}

export enum TagsCategory {
  ALL = "All",
  FEATURE = "Feature",
  HTML = "HTML",
  CSS = "CSS",
  SCSS = "SCSS",
}

export enum EmailType {
  VERIFY = "VERIFY",
  RESET = "RESET",
}

// MESSAGE
export enum Message {
  USER_ALREADY_EXISTS = "User already exists",
  USER_CREATED_SUCCESSFULLY = " User created successfully!",
  USER_DOES_NOT_EXIST = "User does not exist",
  INVALID_EMAIL = "Please enter a valid email",
  EMAIL_REQUIRED = "Please enter your email",
  PASSWORD_REQUIRED = "Please enter your password",
  PASSWORD_MIN_LENGTH = "Password must be at least 4 characters long",
  LOGIN_SUCCESSFUL = "Login is successful. 🎉",
  INVALID_PASSWORD = "Invalid password",
  INTERNAL_SERVER_ERROR = "Internal server error"
}

// MODAL REQUIRED MESSAGE
export enum SchemaMessage {
  // AboutmeDetails schema
  TITLE_IS_REQUIRED = "Title is required",
  SUB_TITLE_IS_REQUIRED = "Sub title is required",
  JOB_TITLE_IS_REQUIRED = "Job title is required",
  ABOUT_DESCRIPTION_IS_REQUIRED = "About description is required",
  SKILL_REQUIRED = "At least one skill is required.",
}