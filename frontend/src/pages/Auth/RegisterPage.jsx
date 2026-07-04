import RegisterForm from '../../components/auth/RegisterForm'
import AuthLayout from '../../components/layout/AuthLayout'

export default function RegisterPage() {
  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join Community Hub and start connecting"
    >
      <RegisterForm />
    </AuthLayout>
  )
}
