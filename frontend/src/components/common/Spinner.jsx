const sizes = {
  sm: 'h-4 w-4 border-[var(--border-width-medium)]',
  md: 'h-6 w-6 border-[var(--border-width-medium)]',
  lg: 'h-8 w-8 border-[var(--border-width-thick)]',
}

export default function Spinner({ size = 'md', className = '' }) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={`inline-block animate-spin rounded-full border-brand border-t-transparent ${sizes[size]} ${className}`}
    />
  )
}
