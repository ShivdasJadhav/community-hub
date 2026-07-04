const EXPIRY_BUFFER_SECONDS = 30

/**
 * Decode a JWT payload without verifying the signature.
 * Used only for client-side expiry checks.
 */
export function decodeToken(token) {
  if (!token || typeof token !== 'string') {
    return null
  }

  const parts = token.split('.')
  if (parts.length !== 3) {
    return null
  }

  try {
    const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/')
    const decoded = atob(payload.padEnd(payload.length + ((4 - (payload.length % 4)) % 4), '='))
    return JSON.parse(decoded)
  } catch {
    return null
  }
}

/**
 * Return token expiration as a Date, or null if unavailable.
 */
export function getTokenExpiration(token) {
  const payload = decodeToken(token)
  if (!payload?.exp) {
    return null
  }

  return new Date(payload.exp * 1000)
}

/**
 * Check whether a JWT is expired (with a small buffer).
 */
export function isTokenExpired(token) {
  const expiration = getTokenExpiration(token)
  if (!expiration) {
    return true
  }

  const now = Date.now()
  const bufferMs = EXPIRY_BUFFER_SECONDS * 1000
  return expiration.getTime() <= now + bufferMs
}
