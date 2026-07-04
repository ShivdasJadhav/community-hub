import { AUTH_ENDPOINTS } from '../constants'
import { request } from './interceptor'

/**
 * Central API client. All backend communication goes through this module.
 */
export const apiClient = {
  get(path, options = {}) {
    return request(path, { ...options, method: 'GET' })
  },

  post(path, body, options = {}) {
    return request(path, {
      ...options,
      method: 'POST',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  },

  put(path, body, options = {}) {
    return request(path, {
      ...options,
      method: 'PUT',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  },

  delete(path, options = {}) {
    return request(path, { ...options, method: 'DELETE' })
  },
}

export { setSessionExpiredHandler } from './interceptor'

/** @deprecated Use apiClient directly — kept for endpoint path reference */
export { AUTH_ENDPOINTS }
