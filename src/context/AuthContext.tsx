import { createContext, useContext, useEffect, useState } from 'react'
import type { User } from 'firebase/auth'
import { onAuthStateChanged, signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth'
import { auth, googleProvider } from '@/lib/firebase'
import { loginWithFirebaseToken } from '@/lib/api'

interface AuthContextType {
  user: User | null
  loading: boolean
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  async function signInWithGoogle() {
    const credential = await signInWithPopup(auth, googleProvider)
    const idToken = await credential.user.getIdToken()
    try {
      const res = await loginWithFirebaseToken(idToken)
      localStorage.setItem('token', res.token)
      localStorage.setItem('user', JSON.stringify(res.user))
    } catch (err) {
      console.error('Backend login sync failed:', err)
    }
  }

  async function signOut() {
    await firebaseSignOut(auth)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
