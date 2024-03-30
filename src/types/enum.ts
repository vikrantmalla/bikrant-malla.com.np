export enum ApiEndpoint {
  PortfolioDetails = "api/portfoliodetails",
  AboutMe = "api/aboutme",
  ProjectHighlights = "api/projecthighlight",
  Behance = "api/behance",
  Projects = "api/projects",
  Contact = "api/contact",
  MetaData = "api/metadata",
  Tags = "api/tags",
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

// ENDPOINT
export enum Endpoint {
  AUTH_SIGN_UP_ENDPOINT = "/api/auth/signup",
  AUTH_SIGN_IN_ENDPOINT = "/api/auth/signin",
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
