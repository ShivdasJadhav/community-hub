import LoginForm from '../../components/auth/LoginForm'
import AuthLayout from '../../components/layout/AuthLayout'

export default function LoginPage() {
  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your Community Hub account"
    >
      <LoginForm />
    </AuthLayout>
  )
}
