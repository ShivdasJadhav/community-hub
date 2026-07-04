const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PASSWORD_MIN_LENGTH = 8

export function isValidEmail(value) {
  return EMAIL_PATTERN.test(value.trim())
}

export function isRequired(value) {
  return value.trim().length > 0
}

export function hasMinLength(value, minLength) {
  return value.length >= minLength
}

/**
 * Validate password strength to match backend rules.
 * Returns an error message string, or null if valid.
 */
export function validatePasswordStrength(password) {
  if (password.length < PASSWORD_MIN_LENGTH) {
    return `Password must be at least ${PASSWORD_MIN_LENGTH} characters long.`
  }

  if (!/[A-Z]/.test(password)) {
    return 'Password must contain at least one uppercase letter.'
  }

  if (!/[a-z]/.test(password)) {
    return 'Password must contain at least one lowercase letter.'
  }

  if (!/\d/.test(password)) {
    return 'Password must contain at least one number.'
  }

  return null
}
