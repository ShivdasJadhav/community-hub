import { AUTH_ENDPOINTS } from '../constants'
import { apiClient } from '../api/client'

/**
 * Authentication service — all auth-related API communication.
 */

export async function register(userData) {
  return apiClient.post(AUTH_ENDPOINTS.REGISTER, userData)
}

export async function login(credentials) {
  return apiClient.post(AUTH_ENDPOINTS.LOGIN, credentials)
}

export async function refresh(refreshToken) {
  return apiClient.post(AUTH_ENDPOINTS.REFRESH, { refresh_token: refreshToken })
}

export async function logout() {
  try {
    return await apiClient.post(AUTH_ENDPOINTS.LOGOUT)
  } catch {
    return null
  }
}

export async function getCurrentUser() {
  return apiClient.get(AUTH_ENDPOINTS.ME)
}
