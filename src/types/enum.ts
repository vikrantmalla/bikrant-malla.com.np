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
  INVALID_EMAIL = "Please enter a valid email",
  EMAIL_REQUIRED = "Please enter your email",
  PASSWORD_REQUIRED = "Please enter your password",
  PASSWORD_MIN_LENGTH = "Password must be at least 4 characters long",
}
