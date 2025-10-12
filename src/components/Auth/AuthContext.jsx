import { createContext, useContext, useEffect, useState } from 'react'
import { authService } from '../../lib/supabase/auth'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    authService.getCurrentSession().then(session => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = authService.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const value = {
    user,
    session,
    loading,
    signUp: (email, password, metadata) => authService.signUp(email, password, metadata),
    signIn: (email, password) => authService.signIn(email, password),
    signOut: () => authService.signOut()
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
