import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../constants'
import useAuth from './useAuth'

/**
 * Hook for pages that require authentication beyond route wrappers.
 */
export default function useProtectedRoute() {
  const { user, isAuthenticated, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate(ROUTES.LOGIN, { replace: true })
    }
  }, [isAuthenticated, loading, navigate])

  return { user, isAuthenticated, loading }
}
