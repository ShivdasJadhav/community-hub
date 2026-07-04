import { Link } from 'react-router-dom'
import {
  ArrowRight,
  CalendarDays,
  Megaphone,
  NotebookPen,
  UsersRound,
} from 'lucide-react'
import { getButtonClasses } from '../../utils/buttonClasses'
import PageContainer from '../../components/common/PageContainer'
import Footer from '../../components/layout/Footer'
import Navbar from '../../components/layout/Navbar'
import { APP_NAME, ROUTES } from '../../constants'

const features = [
  {
    title: 'Community Management',
    description:
      'Organize members, roles, and groups in one place so your community stays connected.',
    icon: UsersRound,
  },
  {
    title: 'Events',
    description:
      'Plan, promote, and manage events with schedules that keep everyone informed.',
    icon: CalendarDays,
  },
  {
    title: 'Announcements',
    description:
      'Share important updates quickly with clear, timely communication for all members.',
    icon: Megaphone,
  },
  {
    title: 'Resource Booking',
    description:
      'Reserve shared spaces and resources with a simple booking flow built for communities.',
    icon: NotebookPen,
  },
]

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main>
        <section className="bg-surface py-[var(--padding-4xl)] sm:py-[var(--padding-3xl)]">
          <PageContainer>
            <div className="mx-auto max-w-3xl text-center">
              <p className="mb-[var(--margin-lg)] text-sm font-medium uppercase tracking-wide text-fg-link">
                Welcome to {APP_NAME}
              </p>
              <h1 className="text-4xl font-bold tracking-tight text-fg sm:text-5xl">
                Connect, collaborate, and grow together
              </h1>
              <p className="mt-[var(--margin-xl)] text-lg text-fg-muted">
                A modern platform for managing communities, events, announcements, and shared
                resources — all in one simple hub.
              </p>
              <div className="mt-[var(--margin-2xl)]">
                <Link
                  to={ROUTES.REGISTER}
                  className={getButtonClasses(
                    'primary',
                    'px-[var(--padding-xl)] py-[var(--padding-md)] text-base',
                  )}
                >
                  Get Started
                  <ArrowRight size={18} aria-hidden="true" />
                </Link>
              </div>
            </div>
          </PageContainer>
        </section>

        <section className="py-[var(--padding-4xl)] sm:py-[var(--padding-3xl)]">
          <PageContainer>
            <div className="mb-[var(--margin-3xl)] text-center">
              <h2 className="text-3xl font-bold text-fg">Everything your community needs</h2>
              <p className="mt-[var(--margin-md)] text-fg-muted">
                Simple tools designed to help members stay engaged and organized.
              </p>
            </div>

            <div className="grid gap-[var(--padding-xl)] sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => {
                const Icon = feature.icon

                return (
                  <article
                    key={feature.title}
                    className="rounded-[var(--border-radius-2xl)] border-solid-token border-thin border-border bg-surface p-[var(--padding-xl)] shadow-sm"
                  >
                    <span className="mb-[var(--margin-lg)] inline-flex rounded-[var(--border-radius-md)] bg-brand-subtle p-[var(--padding-sm)] text-fg-link">
                      <Icon size={22} strokeWidth={2.25} aria-hidden="true" />
                    </span>
                    <h3 className="text-lg font-semibold text-fg">{feature.title}</h3>
                    <p className="mt-[var(--margin-md)] text-sm leading-6 text-fg-muted">
                      {feature.description}
                    </p>
                  </article>
                )
              })}
            </div>
          </PageContainer>
        </section>

        <section className="bg-brand py-[var(--padding-4xl)] sm:py-[var(--padding-3xl)]">
          <PageContainer>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold text-fg-inverse">Ready to join the community?</h2>
              <p className="mt-[var(--margin-lg)] text-fg-on-brand">
                Create your account today and start connecting with the people around you.
              </p>
              <div className="mt-[var(--margin-2xl)] flex flex-col items-center justify-center gap-[var(--padding-md)] sm:flex-row">
                <Link
                  to={ROUTES.REGISTER}
                  className={getButtonClasses(
                    'primary',
                    'bg-surface text-fg-link hover:bg-brand-subtle',
                  )}
                >
                  <UsersRound size={16} aria-hidden="true" />
                  Create Account
                </Link>
                <Link
                  to={ROUTES.LOGIN}
                  className={getButtonClasses(
                    'secondary',
                    'border-fg-inverse bg-transparent text-fg-inverse hover:bg-brand-hover',
                  )}
                >
                  Sign In
                </Link>
              </div>
            </div>
          </PageContainer>
        </section>
      </main>

      <Footer />
    </div>
  )
}
