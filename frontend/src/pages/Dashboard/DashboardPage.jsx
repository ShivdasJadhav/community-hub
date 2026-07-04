import { LogOut } from 'lucide-react'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'
import PageContainer from '../../components/common/PageContainer'
import Footer from '../../components/layout/Footer'
import Navbar from '../../components/layout/Navbar'
import useAuth from '../../hooks/useAuth'

export default function DashboardPage() {
  const { user, logout } = useAuth()

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1 py-[var(--padding-4xl)]">
        <PageContainer>
          <div className="mx-auto max-w-2xl">
            <Card>
              <h1 className="text-2xl font-bold text-fg sm:text-3xl">
                Welcome, {user?.first_name} {user?.last_name}
              </h1>
              <p className="mt-[var(--margin-md)] text-fg-muted">{user?.email}</p>

              <div className="mt-[var(--margin-2xl)]">
                <Button onClick={logout}>
                  <LogOut size={16} aria-hidden="true" />
                  Logout
                </Button>
              </div>
            </Card>
          </div>
        </PageContainer>
      </main>

      <Footer />
    </div>
  )
}
