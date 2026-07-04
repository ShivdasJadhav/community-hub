import { Link } from 'react-router-dom'
import { LayoutDashboard, LogIn, LogOut, UserPlus, UsersRound } from 'lucide-react'
import { APP_NAME, ROUTES } from '../../constants'
import useAuth from '../../hooks/useAuth'
import { getButtonClasses } from '../../utils/buttonClasses'
import Button from '../common/Button'
import PageContainer from '../common/PageContainer'

export default function Navbar() {
  const { isAuthenticated, loading, logout } = useAuth()

  return (
    <header className="border-solid-token border-thin border-border bg-surface">
      <PageContainer>
        <nav
          className="flex items-center justify-between py-[var(--padding-lg)]"
          aria-label="Main navigation"
        >
          <Link
            to={ROUTES.HOME}
            className="flex items-center gap-[var(--padding-sm)] text-lg font-semibold text-fg"
          >
            <span
              className="flex h-9 w-9 items-center justify-center rounded-[var(--border-radius-md)] bg-brand text-fg-inverse"
              aria-hidden="true"
            >
              <UsersRound size={20} strokeWidth={2.25} />
            </span>
            {APP_NAME}
          </Link>

          <div className="flex items-center gap-[var(--padding-sm)] sm:gap-[var(--padding-md)]">
            {loading ? null : isAuthenticated ? (
              <>
                <Link to={ROUTES.DASHBOARD} className={getButtonClasses('ghost')}>
                  <LayoutDashboard size={16} aria-hidden="true" />
                  Dashboard
                </Link>
                <Button variant="primary" onClick={logout}>
                  <LogOut size={16} aria-hidden="true" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to={ROUTES.LOGIN} className={getButtonClasses('ghost')}>
                  <LogIn size={16} aria-hidden="true" />
                  Login
                </Link>
                <Link to={ROUTES.REGISTER} className={getButtonClasses('primary')}>
                  <UserPlus size={16} aria-hidden="true" />
                  Register
                </Link>
              </>
            )}
          </div>
        </nav>
      </PageContainer>
    </header>
  )
}
