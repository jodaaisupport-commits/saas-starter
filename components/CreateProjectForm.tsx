'use client'

import { useState, useTransition } from 'react'
import { createProject } from '@/app/actions/projects'

export default function CreateProjectForm() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    startTransition(async () => {
      const result = await createProject({ title, description })

      if (result.error) {
        setError(result.error)
      } else {
        setTitle('')
        setDescription('')
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="p-5 bg-white rounded-xl border border-gray-100 shadow-sm space-y-4">
      <h2 className="font-medium">Neues Projekt</h2>

      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Projekttitel"
        required
        className="w-full h-10 px-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500"
      />

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Beschreibung (optional)"
        rows={2}
        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
      />

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={isPending || !title.trim()}
        className="h-10 px-4 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium transition disabled:opacity-60"
      >
        {isPending ? 'Erstellen…' : 'Projekt erstellen'}
      </button>
    </form>
  )
}
