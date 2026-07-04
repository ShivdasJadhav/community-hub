import Spinner from './Spinner'
import { getButtonClasses } from '../../utils/buttonClasses'

export default function Button({
  children,
  type = 'button',
  variant = 'primary',
  disabled = false,
  loading = false,
  className = '',
  onClick,
}) {
  const isDisabled = disabled || loading

  return (
    <button
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      className={getButtonClasses(variant, className)}
    >
      {loading ? <Spinner size="sm" /> : null}
      {children}
    </button>
  )
}
