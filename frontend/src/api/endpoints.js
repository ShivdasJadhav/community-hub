import { API_BASE_URL, AUTH_ENDPOINTS } from '../constants'

export { AUTH_ENDPOINTS }

export function buildUrl(path) {
  return `${API_BASE_URL}${path}`
}

export const ENDPOINTS = {
  AUTH: {
    REGISTER: buildUrl(AUTH_ENDPOINTS.REGISTER),
    LOGIN: buildUrl(AUTH_ENDPOINTS.LOGIN),
    REFRESH: buildUrl(AUTH_ENDPOINTS.REFRESH),
    LOGOUT: buildUrl(AUTH_ENDPOINTS.LOGOUT),
    ME: buildUrl(AUTH_ENDPOINTS.ME),
  },
}
