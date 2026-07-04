import { API_BASE_URL, AUTH_ENDPOINTS } from '../constants'
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  setTokens,
} from '../utils/storage'
import { ENDPOINTS } from './endpoints'

let refreshPromise = null
let sessionExpiredHandler = null

/**
 * Register a callback invoked when token refresh fails.
 */
export function setSessionExpiredHandler(handler) {
  sessionExpiredHandler = handler
}

function isAuthBypassPath(path) {
  return (
    path === AUTH_ENDPOINTS.LOGIN ||
    path === AUTH_ENDPOINTS.REGISTER ||
    path === AUTH_ENDPOINTS.REFRESH
  )
}

async function parseResponse(response) {
  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    let message = 'Something went wrong. Please try again.'

    if (typeof data.detail === 'string') {
      message = data.detail
    } else if (Array.isArray(data.detail) && data.detail.length > 0) {
      const firstError = data.detail[0]
      const rawMessage = firstError.msg || message
      message = rawMessage.replace(/^Value error,\s*/i, '')
    }

    const error = new Error(message)
    error.status = response.status
    throw error
  }

  return data
}

async function refreshAccessToken() {
  const refreshToken = getRefreshToken()
  if (!refreshToken) {
    throw new Error('No refresh token available.')
  }

  const response = await fetch(ENDPOINTS.AUTH.REFRESH, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refresh_token: refreshToken }),
  })

  const data = await parseResponse(response)
  setTokens({
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
  })

  return data.access_token
}

async function handleUnauthorized(path, retryFn) {
  if (isAuthBypassPath(path)) {
    return null
  }

  const refreshToken = getRefreshToken()
  if (!refreshToken) {
    clearTokens()
    sessionExpiredHandler?.()
    return null
  }

  try {
    if (!refreshPromise) {
      refreshPromise = refreshAccessToken().finally(() => {
        refreshPromise = null
      })
    }

    await refreshPromise
    return retryFn()
  } catch {
    clearTokens()
    sessionExpiredHandler?.()
    return null
  }
}

/**
 * Execute a fetch request with auth header attachment and 401 refresh retry.
 */
export async function request(path, options = {}, isRetry = false) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  const accessToken = getAccessToken()
  if (accessToken && !headers.Authorization && !isAuthBypassPath(path)) {
    headers.Authorization = `Bearer ${accessToken}`
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  })

  if (response.status === 401 && !isRetry && !isAuthBypassPath(path)) {
    const retryResponse = await handleUnauthorized(path, () => request(path, options, true))
    if (retryResponse) {
      return retryResponse
    }

    const data = await response.json().catch(() => ({}))
    const message =
      typeof data.detail === 'string'
        ? data.detail
        : 'Session expired. Please login again.'
    const error = new Error(message)
    error.status = 401
    throw error
  }

  return parseResponse(response)
}
