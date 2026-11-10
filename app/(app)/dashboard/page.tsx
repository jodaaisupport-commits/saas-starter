import { getCurrentUserWithProfile } from '@/app/actions/profile'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const result = await getCurrentUserWithProfile()

  if (!result) {
    redirect('/login')
  }

  const { user, profile } = result

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">
          Hallo {profile?.full_name || user.email?.split('@')[0]}
        </h1>
        <p className="text-gray-500 text-sm mt-1">{user.email}</p>
      </div>

      <div className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm">
        <h2 className="font-medium">Willkommen zurück</h2>
        <p className="text-gray-500 text-sm mt-1">
          Du bist erfolgreich authentifiziert. Hier findest du deine Projekte und Einstellungen.
        </p>
      </div>
    </div>
  )
}
