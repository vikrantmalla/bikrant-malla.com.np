/**
 * Lightweight JWT verification for Edge Runtime
 * This doesn't use Node.js crypto module, so it works in middleware
 */

export interface JWTPayload {
  userId: string;
  email: string;
  type?: 'access' | 'refresh';
  iat?: number;
  exp?: number;
}

/**
 * Simple JWT verification for Edge Runtime
 * Note: This is a basic implementation for middleware use
 * For full security, use the Node.js version in API routes
 */
export function verifyTokenEdge(token: string): JWTPayload | null {
  try {
    // Split the token
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    // Decode the payload (without verification for now)
    const payload = JSON.parse(atob(parts[1])) as JWTPayload;
    
    // Check if token is expired
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      return null;
    }

    // Basic validation
    if (!payload.userId || !payload.email) {
      return null;
    }

    return payload;
  } catch (error) {
    console.error('Edge JWT verification failed:', error);
    return null;
  }
}

/**
 * Check if token is expired
 */
export function isTokenExpiredEdge(token: string): boolean {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return true;
    }

    const payload = JSON.parse(atob(parts[1])) as JWTPayload;
    if (!payload.exp) {
      return true;
    }

    return Date.now() >= payload.exp * 1000;
  } catch {
    return true;
  }
}
