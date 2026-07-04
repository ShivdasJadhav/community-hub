import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { LogIn } from 'lucide-react'
import { useState } from 'react'
import Button from '../common/Button'
import Card from '../common/Card'
import Input from '../common/Input'
import { ROUTES } from '../../constants'
import useAuth from '../../hooks/useAuth'
import { isRequired, isValidEmail } from '../../utils/validation'

const initialFormState = {
  email: '',
  password: '',
}

const initialErrorState = {
  email: '',
  password: '',
  form: '',
}

export default function LoginForm() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { login } = useAuth()
  const [formData, setFormData] = useState(initialFormState)
  const [errors, setErrors] = useState(initialErrorState)
  const [loading, setLoading] = useState(false)

  const sessionExpired = searchParams.get('session') === 'expired'

  function handleChange(event) {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: '', form: '' }))
  }

  function validateForm() {
    const nextErrors = { ...initialErrorState }
    let isValid = true

    if (!isRequired(formData.email)) {
      nextErrors.email = 'Email is required.'
      isValid = false
    } else if (!isValidEmail(formData.email)) {
      nextErrors.email = 'Invalid email address.'
      isValid = false
    }

    if (!isRequired(formData.password)) {
      nextErrors.password = 'Password is required.'
      isValid = false
    }

    setErrors(nextErrors)
    return isValid
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)
    setErrors(initialErrorState)

    try {
      await login({
        email: formData.email.trim(),
        password: formData.password,
      })
      navigate(ROUTES.HOME)
    } catch (error) {
      setErrors((current) => ({
        ...current,
        form: error.message || 'Unable to sign in. Please try again.',
      }))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-[var(--padding-lg)]" noValidate>
        {sessionExpired ? (
          <p
            className="rounded-[var(--border-radius-md)] bg-error-surface px-[var(--padding-md)] py-[var(--padding-sm)] text-sm text-fg-error"
            role="alert"
          >
            Session expired. Please login again.
          </p>
        ) : null}

        {errors.form ? (
          <p
            className="rounded-[var(--border-radius-md)] bg-error-surface px-[var(--padding-md)] py-[var(--padding-sm)] text-sm text-fg-error"
            role="alert"
          >
            {errors.form}
          </p>
        ) : null}

        <Input
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          placeholder="you@example.com"
          autoComplete="email"
          required
        />

        <Input
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          placeholder="Enter your password"
          autoComplete="current-password"
          required
        />

        <Button type="submit" loading={loading} className="w-full">
          <LogIn size={16} aria-hidden="true" />
          Login
        </Button>
      </form>

      <p className="mt-[var(--margin-xl)] text-center text-sm text-fg-muted">
        Don&apos;t have an account?{' '}
        <Link to={ROUTES.REGISTER} className="font-medium text-fg-link hover:text-fg-link-hover">
          Create Account
        </Link>
      </p>
    </Card>
  )
}
