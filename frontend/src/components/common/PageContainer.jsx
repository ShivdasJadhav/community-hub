export default function PageContainer({ children, className = '' }) {
  return (
    <div
      className={`mx-auto w-full max-w-7xl px-[var(--padding-lg)] sm:px-[var(--padding-xl)] lg:px-[var(--padding-2xl)] ${className}`}
    >
      {children}
    </div>
  )
}
