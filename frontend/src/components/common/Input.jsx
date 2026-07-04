export default function Input({
  id,
  label,
  type = 'text',
  name,
  value,
  onChange,
  error,
  placeholder,
  autoComplete,
  required = false,
}) {
  const inputId = id || name

  return (
    <div className="w-full">
      <label
        htmlFor={inputId}
        className="mb-[var(--margin-xs)] block text-sm font-medium text-fg-secondary"
      >
        {label}
        {required ? <span className="text-fg-error"> *</span> : null}
      </label>
      <input
        id={inputId}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${inputId}-error` : undefined}
        className={`w-full rounded-[var(--border-radius-md)] border-solid-token border-thin bg-surface px-[var(--padding-md)] py-[var(--padding-sm)] text-sm text-fg placeholder:text-fg-subtle focus:border-border-focus focus:outline-none focus:ring-2 focus:ring-brand/20 ${
          error ? 'border-border-error' : 'border-border-strong'
        }`}
      />
      {error ? (
        <p
          id={`${inputId}-error`}
          className="mt-[var(--margin-xs)] text-sm text-fg-error"
          role="alert"
        >
          {error}
        </p>
      ) : null}
    </div>
  )
}
