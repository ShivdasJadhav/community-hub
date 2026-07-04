import { Link } from 'react-router-dom'
import { UsersRound } from 'lucide-react'
import { ROUTES } from '../../constants'

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <main className="flex flex-1 items-center justify-center px-[var(--padding-lg)] py-[var(--padding-2xl)] sm:px-[var(--padding-xl)]">
        <div className="w-full max-w-md">
          <div className="mb-[var(--margin-2xl)] text-center">
            <Link
              to={ROUTES.HOME}
              className="mx-auto mb-[var(--margin-lg)] inline-flex h-12 w-12 items-center justify-center rounded-[var(--border-radius-lg)] bg-brand text-fg-inverse transition-colors hover:bg-brand-hover"
              aria-label="Back to home"
            >
              <UsersRound size={24} strokeWidth={2.25} />
            </Link>
            <h1 className="text-2xl font-bold text-fg sm:text-3xl">{title}</h1>
            {subtitle ? (
              <p className="mt-[var(--margin-sm)] text-sm text-fg-muted sm:text-base">{subtitle}</p>
            ) : null}
          </div>
          {children}
        </div>
      </main>
    </div>
  )
}
