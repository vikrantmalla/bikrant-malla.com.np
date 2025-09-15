import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET

export interface JWTPayload {
  userId: string;
  email: string;
  type?: 'access' | 'refresh';
  iat?: number;
  exp?: number;
}

/**
 * Generate a JWT token
 */
export function generateToken(
  payload: Omit<JWTPayload, 'iat' | 'exp'>,
  options: { expiresIn: string } = { expiresIn: '15m' }
): string {
  const secret = payload.type === 'refresh' ? JWT_REFRESH_SECRET : JWT_SECRET;
  
  return jwt.sign(
    payload, 
    secret, 
    {
      expiresIn: options.expiresIn,
      issuer: 'bikrant-malla-portfolio',
      audience: 'bikrant-malla-users',
    } as jwt.SignOptions
  );
}

/**
 * Verify a JWT token
 */
export function verifyToken(token: string, isRefresh = false): JWTPayload | null {
  try {
    // Check if token is malformed before attempting verification
    if (!token || typeof token !== 'string' || token.split('.').length !== 3) {
      console.error('JWT verification failed: Malformed token');
      return null;
    }

    const secret = isRefresh ? JWT_REFRESH_SECRET : JWT_SECRET;
    
    if (!secret) {
      console.error('JWT verification failed: Secret not configured');
      return null;
    }
    
    const decoded = jwt.verify(token, secret, {
      issuer: 'bikrant-malla-portfolio',
      audience: 'bikrant-malla-users',
    }) as JWTPayload;

    return decoded;
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      if (error.name === 'TokenExpiredError') {
        console.error('JWT verification failed: Token expired');
      } else if (error.name === 'JsonWebTokenError') {
        console.error('JWT verification failed: Invalid token format');
      } else {
        console.error('JWT verification failed:', error.message);
      }
    } else {
      console.error('JWT verification failed:', error);
    }
    return null;
  }
}

/**
 * Verify refresh token
 */
export function verifyRefreshToken(token: string): JWTPayload | null {
  return verifyToken(token, true);
}

/**
 * Extract token from Authorization header
 */
export function extractTokenFromHeader(authHeader: string | null): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  return authHeader.substring(7);
}

/**
 * Check if token is expired
 */
export function isTokenExpired(token: string): boolean {
  try {
    const decoded = jwt.decode(token) as JWTPayload;
    if (!decoded || !decoded.exp) {
      return true;
    }
    
    return Date.now() >= decoded.exp * 1000;
  } catch {
    return true;
  }
}
