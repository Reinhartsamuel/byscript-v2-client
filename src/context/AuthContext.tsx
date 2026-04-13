import { createContext, useContext, useEffect, useState } from 'react'
import type { User } from 'firebase/auth'
import { onIdTokenChanged, signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth'
import { auth, googleProvider } from '@/lib/firebase'
import { loginWithFirebaseToken } from '@/lib/api'
import Cookies from 'js-cookie'

function setSharedAuthCookie(idToken: string) {
  document.cookie = `fb_id_token=${idToken}; path=/; domain=.byscript.io; SameSite=Lax; Secure; Max-Age=3600`
}

function clearSharedAuthCookie() {
  document.cookie = `fb_id_token=; path=/; domain=.byscript.io; Max-Age=0`
}

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
    const unsubscribe = onIdTokenChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)
      setLoading(false)
      if (firebaseUser) {
        const idToken = await firebaseUser.getIdToken()
        console.log('getting fb_id_token:::::::::', idToken)
        setSharedAuthCookie(idToken)
      } else {
        clearSharedAuthCookie()
      }
    })
    return unsubscribe
  }, [])

  async function signInWithGoogle() {
    const credential = await signInWithPopup(auth, googleProvider)
    const idToken = await credential.user.getIdToken()
    console.log('creating fb_id_token on sign in:::::::::', idToken)
    setSharedAuthCookie(idToken)

    console.log('requesting screeners')
    const res = await fetch('https://byscript-screener-backend-production.up.railway.app/screeners', {
      headers: {
        'Authorization': `Bearer ${idToken}`
      }
    })
    const data = await res.json()
    console.log('screeners', data)
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
    Cookies.remove('fb_id_token')
    clearSharedAuthCookie()
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
