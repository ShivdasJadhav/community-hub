export const buttonVariants = {
  primary:
    'bg-brand text-fg-inverse hover:bg-brand-hover focus-visible:ring-brand border-solid-token border-thin border-transparent',
  secondary:
    'bg-surface text-fg-link border-solid-token border-thin border-brand hover:bg-brand-subtle focus-visible:ring-brand',
  ghost:
    'bg-transparent text-fg-secondary border-solid-token border-thin border-transparent hover:bg-surface-muted focus-visible:ring-border-strong',
}

export function getButtonClasses(variant = 'primary', className = '') {
  return `inline-flex items-center justify-center gap-[var(--padding-sm)] rounded-[var(--border-radius-md)] px-[var(--padding-lg)] py-[var(--padding-sm)] text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${buttonVariants[variant]} ${className}`
}
