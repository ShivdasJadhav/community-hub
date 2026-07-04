export default function Card({ children, className = '' }) {
  return (
    <div
      className={`rounded-[var(--border-radius-2xl)] border-solid-token border-thin border-border bg-surface p-[var(--padding-xl)] shadow-sm sm:p-[var(--padding-2xl)] ${className}`}
    >
      {children}
    </div>
  )
}
