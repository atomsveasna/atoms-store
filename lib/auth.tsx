'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

interface User {
  id: string
  email: string
  createdAt: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  signUp: (email: string, password: string) => Promise<{ error?: string }>
  signIn: (email: string, password: string) => Promise<{ error?: string }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const ANON_KEY     = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

async function supabaseAuth(path: string, body: object) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/${path}`, {
    method: 'POST',
    headers: { apikey: ANON_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  return res.json()
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]       = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing session in localStorage
    try {
      const token = localStorage.getItem('atoms-auth-token')
      const userData = localStorage.getItem('atoms-auth-user')
      if (token && userData) {
        setUser(JSON.parse(userData))
      }
    } catch {}
    setLoading(false)
  }, [])

  async function signUp(email: string, password: string) {
    const data = await supabaseAuth('signup', { email, password })
    if (data.error) return { error: data.error.message ?? data.error }
    if (data.user) {
      const u = { id: data.user.id, email: data.user.email, createdAt: data.user.created_at }
      setUser(u)
      localStorage.setItem('atoms-auth-token', data.access_token)
      localStorage.setItem('atoms-auth-user', JSON.stringify(u))
    }
    return {}
  }

  async function signIn(email: string, password: string) {
    const data = await supabaseAuth('token?grant_type=password', { email, password })
    if (data.error) return { error: data.error.message ?? data.error }
    if (data.user) {
      const u = { id: data.user.id, email: data.user.email, createdAt: data.user.created_at }
      setUser(u)
      localStorage.setItem('atoms-auth-token', data.access_token)
      localStorage.setItem('atoms-auth-user', JSON.stringify(u))
    }
    return {}
  }

  async function signOut() {
    const token = localStorage.getItem('atoms-auth-token')
    if (token) {
      await fetch(`${SUPABASE_URL}/auth/v1/logout`, {
        method: 'POST',
        headers: { apikey: ANON_KEY, Authorization: `Bearer ${token}` },
      }).catch(() => {})
    }
    setUser(null)
    localStorage.removeItem('atoms-auth-token')
    localStorage.removeItem('atoms-auth-user')
  }

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
