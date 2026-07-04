import { Link } from 'react-router-dom'
import { ArrowLeft, FileQuestion } from 'lucide-react'
import { getButtonClasses } from '../utils/buttonClasses'
import PageContainer from '../components/common/PageContainer'
import { ROUTES } from '../constants'

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas px-[var(--padding-lg)]">
      <PageContainer className="max-w-lg text-center">
        <span className="mx-auto mb-[var(--margin-lg)] inline-flex rounded-[var(--border-radius-xl)] bg-brand-subtle p-[var(--padding-lg)] text-fg-link">
          <FileQuestion size={40} strokeWidth={2} aria-hidden="true" />
        </span>
        <p className="text-sm font-medium uppercase tracking-wide text-fg-link">404</p>
        <h1 className="mt-[var(--margin-sm)] text-3xl font-bold text-fg">Page not found</h1>
        <p className="mt-[var(--margin-md)] text-fg-muted">
          The page you are looking for does not exist or may have been moved.
        </p>
        <div className="mt-[var(--margin-2xl)]">
          <Link to={ROUTES.HOME} className={getButtonClasses('primary')}>
            <ArrowLeft size={16} aria-hidden="true" />
            Back to Home
          </Link>
        </div>
      </PageContainer>
    </div>
  )
}
