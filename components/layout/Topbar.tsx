'use client'

import { useAuth } from '@/components/AuthProvider'
import LogoutButton from '@/components/LogoutButton'

export default function Topbar() {
  const { user } = useAuth()

  return (
    <header className="h-16 shrink-0 border-b border-gray-200 bg-white flex items-center justify-between px-6">
      <div className="md:hidden font-semibold">saas-starter</div>

      <div className="ml-auto flex items-center gap-4">
        <span className="text-sm text-gray-500 hidden sm:inline">
          {user?.email}
        </span>
        <LogoutButton />
      </div>
    </header>
  )
}
