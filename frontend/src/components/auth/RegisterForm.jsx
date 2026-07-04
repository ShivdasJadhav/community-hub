import { Link, useNavigate } from 'react-router-dom'
import { UserPlus } from 'lucide-react'
import { useState } from 'react'
import Button from '../common/Button'
import Card from '../common/Card'
import Input from '../common/Input'
import { ROUTES } from '../../constants'
import { register } from '../../services/authService'
import { isRequired, isValidEmail, validatePasswordStrength } from '../../utils/validation'

const initialFormState = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
}

const initialErrorState = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  form: '',
}

export default function RegisterForm() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState(initialFormState)
  const [errors, setErrors] = useState(initialErrorState)
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  function handleChange(event) {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: '', form: '' }))
    setSuccessMessage('')
  }

  function validateForm() {
    const nextErrors = { ...initialErrorState }
    let isValid = true

    if (!isRequired(formData.firstName)) {
      nextErrors.firstName = 'First name is required.'
      isValid = false
    }

    if (!isRequired(formData.lastName)) {
      nextErrors.lastName = 'Last name is required.'
      isValid = false
    }

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
    } else {
      const passwordError = validatePasswordStrength(formData.password)
      if (passwordError) {
        nextErrors.password = passwordError
        isValid = false
      }
    }

    if (!isRequired(formData.confirmPassword)) {
      nextErrors.confirmPassword = 'Please confirm your password.'
      isValid = false
    } else if (formData.password !== formData.confirmPassword) {
      nextErrors.confirmPassword = 'Passwords do not match.'
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
    setSuccessMessage('')

    try {
      await register({
        email: formData.email.trim(),
        password: formData.password,
        first_name: formData.firstName.trim(),
        last_name: formData.lastName.trim(),
      })

      setSuccessMessage('Account created successfully. Redirecting to login...')
      setTimeout(() => {
        navigate(ROUTES.LOGIN)
      }, 1500)
    } catch (error) {
      setErrors((current) => ({
        ...current,
        form: error.message || 'Unable to create account. Please try again.',
      }))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-[var(--padding-lg)]" noValidate>
        {successMessage ? (
          <p
            className="rounded-[var(--border-radius-md)] bg-success-surface px-[var(--padding-md)] py-[var(--padding-sm)] text-sm text-fg-success"
            role="status"
          >
            {successMessage}
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

        <div className="grid gap-[var(--padding-lg)] sm:grid-cols-2">
          <Input
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            error={errors.firstName}
            placeholder="Jane"
            autoComplete="given-name"
            required
          />

          <Input
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            error={errors.lastName}
            placeholder="Doe"
            autoComplete="family-name"
            required
          />
        </div>

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
          placeholder="At least 8 chars, upper, lower, number"
          autoComplete="new-password"
          required
        />

        <Input
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          placeholder="Re-enter your password"
          autoComplete="new-password"
          required
        />

        <Button type="submit" loading={loading} className="w-full">
          <UserPlus size={16} aria-hidden="true" />
          Create Account
        </Button>
      </form>

      <p className="mt-[var(--margin-xl)] text-center text-sm text-fg-muted">
        Already have an account?{' '}
        <Link to={ROUTES.LOGIN} className="font-medium text-fg-link hover:text-fg-link-hover">
          Sign in
        </Link>
      </p>
    </Card>
  )
}
