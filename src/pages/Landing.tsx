import { Navigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import LandingHero from '@/components/LandingHero'

export default function Landing() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen" style={{ backgroundColor: 'var(--color-bg-page)' }}>
        <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--color-accent-green)' }} />
      </div>
    )
  }

  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  return <LandingHero />
}
