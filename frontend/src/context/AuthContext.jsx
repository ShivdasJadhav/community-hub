import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { setSessionExpiredHandler } from '../api/client'
import { ROUTES } from '../constants'
import * as authService from '../services/authService'
import { clearTokens, getAccessToken, setTokens } from '../utils/storage'
import { AuthContext } from './authContext'

export function AuthProvider({ children }) {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [sessionExpired, setSessionExpired] = useState(false)

  const handleSessionExpired = useCallback(() => {
    clearTokens()
    setUser(null)
    setSessionExpired(true)
    navigate(`${ROUTES.LOGIN}?session=expired`)
  }, [navigate])

  const logout = useCallback(async () => {
    await authService.logout()
    clearTokens()
    setUser(null)
    setSessionExpired(false)
    navigate(ROUTES.LOGIN)
  }, [navigate])

  const refreshUser = useCallback(async () => {
    const currentUser = await authService.getCurrentUser()
    setUser(currentUser)
    return currentUser
  }, [])

  const login = useCallback(async (credentials) => {
    const tokens = await authService.login(credentials)
    setTokens({
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
    })
    const currentUser = await authService.getCurrentUser()
    setUser(currentUser)
    setSessionExpired(false)
    return currentUser
  }, [])

  useEffect(() => {
    setSessionExpiredHandler(handleSessionExpired)
  }, [handleSessionExpired])

  useEffect(() => {
    let cancelled = false

    async function initializeAuth() {
      const accessToken = getAccessToken()
      if (!accessToken) {
        if (!cancelled) {
          setLoading(false)
        }
        return
      }

      try {
        const currentUser = await authService.getCurrentUser()
        if (!cancelled) {
          setUser(currentUser)
        }
      } catch {
        if (!cancelled) {
          clearTokens()
          setUser(null)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    initializeAuth()

    return () => {
      cancelled = true
    }
  }, [])

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      loading,
      sessionExpired,
      login,
      logout,
      refreshUser,
    }),
    [user, loading, sessionExpired, login, logout, refreshUser],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
