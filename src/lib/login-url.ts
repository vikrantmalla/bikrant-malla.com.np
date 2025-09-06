/**
 * Utility function to get the login URL from environment variables
 * This ensures consistency across the application
 */
export function getLoginUrl(): string {
  return process.env.KINDE_POST_LOGIN_REDIRECT_URL || '/login';
}

/**
 * Client-side function to get login URL
 * For use in client components where environment variables might not be available
 */
export function getClientLoginUrl(): string {
  // In client components, we can't access server environment variables directly
  // This should be passed as a prop or use a different approach
  return '/login';
}
