'use client'

import { useState, useTransition } from 'react'
import { updateProfile } from '@/app/actions/profile'
import type { Profile } from '@/types/profile'

export default function ProfileForm({ profile }: { profile: Profile }) {
  const [fullName, setFullName] = useState(profile.full_name || '')
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMessage(null)

    startTransition(async () => {
      const result = await updateProfile({ full_name: fullName })

      if (result.error) {
        setMessage({ type: 'error', text: result.error })
      } else {
        setMessage({ type: 'success', text: 'Profil gespeichert' })
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
          Vollständiger Name
        </label>
        <input
          id="full_name"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="mt-1 w-full h-10 px-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
          placeholder="Max Mustermann"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">E-Mail</label>
        <input
          type="email"
          value={profile.email || ''}
          disabled
          className="mt-1 w-full h-10 px-3 rounded-lg border border-gray-100 bg-gray-50 text-gray-500"
        />
        <p className="mt-1 text-xs text-gray-400">E-Mail wird über GitHub verwaltet</p>
      </div>

      {message && (
        <p
          className={`text-sm p-3 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-50 text-green-700'
              : 'bg-red-50 text-red-700'
          }`}
        >
          {message.text}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full h-10 rounded-lg bg-violet-600 hover:bg-violet-700 text-white font-medium transition disabled:opacity-60"
      >
        {isPending ? 'Speichern…' : 'Änderungen speichern'}
      </button>
    </form>
  )
}
