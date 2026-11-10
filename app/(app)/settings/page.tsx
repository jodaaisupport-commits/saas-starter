import { getProfile } from '@/app/actions/profile'
import { redirect } from 'next/navigation'
import AvatarUpload from '@/components/AvatarUpload'
import ProfileForm from '@/components/ProfileForm'
import Link from 'next/link'

export default async function SettingsPage() {
  const profile = await getProfile()

  if (!profile) {
    redirect('/login')
  }

  return (
    <div className="max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Link
          href="/dashboard"
          className="text-sm text-gray-500 hover:text-gray-800 transition"
        >
          ← Dashboard
        </Link>
      </div>

      <h1 className="text-2xl font-semibold mb-6">Einstellungen</h1>

      <section className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm mb-6">
        <h2 className="text-sm font-medium text-gray-500 mb-4">Profilbild</h2>
        <AvatarUpload
          currentAvatarUrl={profile.avatar_url}
          fullName={profile.full_name}
        />
      </section>

      <section className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <h2 className="text-sm font-medium text-gray-500 mb-4">Persönliche Daten</h2>
        <ProfileForm profile={profile} />
      </section>
    </div>
  )
}
