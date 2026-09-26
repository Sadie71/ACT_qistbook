import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'qistbook-super-secret-jwt-key-2026';
const COOKIE_NAME = 'token';

/**
 * Sign a JWT for authenticated user
 */
export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

/**
 * Verify a JWT string
 */
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

/**
 * Extract user payload from Next.js Request
 * Checks httpOnly cookie first, then Authorization header as fallback
 */
export function getUserFromRequest(req) {
  try {
    let token = null;

    // 1. Check cookies
    if (req.cookies && typeof req.cookies.get === 'function') {
      const cookieObj = req.cookies.get(COOKIE_NAME);
      token = cookieObj ? cookieObj.value : null;
    }

    // 2. Check Authorization Header fallback
    if (!token && req.headers) {
      const authHeader = req.headers.get('authorization') || req.headers.get('Authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7).trim();
      }
    }

    if (!token) return null;

    return verifyToken(token);
  } catch (err) {
    return null;
  }
}

/**
 * Set the auth cookie on a NextResponse object
 */
export function setAuthCookie(response, token) {
  response.cookies.set({
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    path: '/',
    maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
  });
}

/**
 * Clear the auth cookie on a NextResponse object
 */
export function clearAuthCookie(response) {
  response.cookies.set({
    name: COOKIE_NAME,
    value: '',
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    path: '/',
    maxAge: 0,
    expires: new Date(0),
  });
}
