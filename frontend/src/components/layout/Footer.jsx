import { APP_NAME } from '../../constants'
import PageContainer from '../common/PageContainer'

export default function Footer() {
  return (
    <footer className="border-solid-token border-thin border-border bg-surface">
      <PageContainer>
        <div className="flex flex-col items-center justify-between gap-[var(--margin-lg)] py-[var(--padding-2xl)] text-center sm:flex-row sm:text-left">
          <p className="text-sm text-fg-muted">
            &copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.
          </p>
          <p className="text-sm text-fg-subtle">Built for connected communities.</p>
        </div>
      </PageContainer>
    </footer>
  )
}
