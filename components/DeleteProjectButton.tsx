'use client'

import { useTransition } from 'react'
import { deleteProject } from '@/app/actions/projects'

export default function DeleteProjectButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition()

  return (
    <button
      onClick={() => {
        if (confirm('Projekt wirklich löschen?')) {
          startTransition(() => deleteProject(id))
        }
      }}
      disabled={isPending}
      className="text-sm text-red-600 hover:text-red-700 disabled:opacity-50"
    >
      {isPending ? '…' : 'Löschen'}
    </button>
  )
}
