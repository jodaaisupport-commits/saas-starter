'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  async function signInWithGitHub() {
    try {
      setLoading(true)
      setError(null)

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) throw error
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#fcfcfc]">
      <div className="w-full max-w-sm p-8 bg-white rounded-2xl shadow-lg border border-gray-100">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center text-white font-bold text-sm">
            S
          </div>
          <span className="font-semibold">saas-starter</span>
        </div>

        <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p className="text-sm text-gray-500 mt-1">Sign in to your saas-starter</p>

        {error && (
          <p className="mt-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
            {error}
          </p>
        )}

        <button
          onClick={signInWithGitHub}
          disabled={loading}
          className="mt-6 w-full h-11 rounded-lg bg-violet-600 hover:bg-violet-700 text-white font-medium transition disabled:opacity-60"
        >
          {loading ? 'Loading…' : 'Continue with GitHub'}
        </button>
      </div>
    </main>
  )
}
