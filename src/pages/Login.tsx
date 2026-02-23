import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

export default function Login() {
  const { signInWithGoogle } = useAuth()
  const navigate = useNavigate()

  async function handleGoogleSignIn() {
    await signInWithGoogle()
    navigate('/dashboard')
  }

  return (
    <div
      className="flex items-center justify-center h-screen"
      style={{ backgroundColor: 'var(--color-bg-page)' }}
    >
      <div className="card flex flex-col items-center gap-6 w-80 py-10 px-8">
        <div>
          <h1 className="text-primary text-xl font-bold text-center">byscript</h1>
          <p className="text-secondary text-sm text-center mt-1">Sign in to continue</p>
        </div>

        <button
          onClick={handleGoogleSignIn}
          className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-opacity hover:opacity-90"
          style={{ backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border-subtle)' }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.64 9.205c0-.638-.057-1.252-.164-1.84H9v3.48h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
            <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
          </svg>
          <span className="text-primary">Sign in with Google</span>
        </button>
      </div>
    </div>
  )
}
