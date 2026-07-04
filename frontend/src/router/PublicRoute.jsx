import { Navigate } from 'react-router-dom'
import Spinner from '../components/common/Spinner'
import { ROUTES } from '../constants'
import useAuth from '../hooks/useAuth'

export default function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas">
        <Spinner size="lg" />
      </div>
    )
  }

  if (isAuthenticated) {
    return <Navigate to={ROUTES.HOME} replace />
  }

  return children
}
