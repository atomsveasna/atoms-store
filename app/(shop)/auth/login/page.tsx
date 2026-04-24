'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/auth'

export default function LoginPage() {
  const router = useRouter()
  const { signIn, signUp } = useAuth()
  const [mode, setMode]       = useState<'login' | 'signup'>('login')
  const [email, setEmail]     = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [success, setSuccess] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    if (mode === 'login') {
      const { error } = await signIn(email, password)
      if (error) { setError(error); setLoading(false); return }
      router.push('/account')
    } else {
      const { error } = await signUp(email, password)
      if (error) { setError(error); setLoading(false); return }
      setSuccess('Account created! Check your email to confirm your account, then sign in.')
      setMode('login')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#080d1a] flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-400 flex items-center justify-center">
              <span className="text-[#080d1a] font-bold text-sm">A</span>
            </div>
            <span className="font-semibold text-white text-lg">Atoms</span>
          </Link>
        </div>

        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-8">
          {/* Tab toggle */}
          <div className="flex gap-1 p-1 bg-white/[0.04] rounded-xl mb-8">
            {(['login', 'signup'] as const).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(''); setSuccess('') }}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                  mode === m ? 'bg-white/[0.08] text-white' : 'text-white/40 hover:text-white/70'
                }`}
              >
                {m === 'login' ? 'Sign in' : 'Create account'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-white/50 mb-1.5">Email</label>
              <input
                required type="email" value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-3 rounded-xl border border-white/[0.08] bg-white/[0.04] text-white text-sm placeholder-white/20 focus:outline-none focus:border-cyan-400/40 focus:ring-1 focus:ring-cyan-400/20 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-white/50 mb-1.5">Password</label>
              <input
                required type="password" value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 6 characters"
                minLength={6}
                className="w-full px-4 py-3 rounded-xl border border-white/[0.08] bg-white/[0.04] text-white text-sm placeholder-white/20 focus:outline-none focus:border-cyan-400/40 focus:ring-1 focus:ring-cyan-400/20 transition-all"
              />
            </div>

            {error   && <p className="text-sm text-red-400 px-4 py-3 rounded-xl bg-red-400/10 border border-red-400/20">{error}</p>}
            {success && <p className="text-sm text-emerald-400 px-4 py-3 rounded-xl bg-emerald-400/10 border border-emerald-400/20">{success}</p>}

            <button
              type="submit" disabled={loading}
              className="w-full py-3.5 bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 text-[#080d1a] font-semibold text-sm rounded-xl transition-colors mt-2"
            >
              {loading ? 'Please wait...' : mode === 'login' ? 'Sign in' : 'Create account'}
            </button>
          </form>

          <p className="text-center text-xs text-white/30 mt-6">
            By continuing you agree to our{' '}
            <Link href="/support/warranty" className="text-white/50 hover:text-white transition-colors">terms</Link>
            {' '}and{' '}
            <Link href="/support" className="text-white/50 hover:text-white transition-colors">privacy policy</Link>.
          </p>
        </div>

        <p className="text-center text-sm text-white/30 mt-6">
          <Link href="/" className="hover:text-white transition-colors">← Back to store</Link>
        </p>
      </div>
    </div>
  )
}
