'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { Profile, ProfileUpdate } from '@/types/profile'

export async function getProfile(): Promise<Profile | null> {
  const supabase = await createClient()

  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) return null

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) {
    console.error('getProfile error:', error.message)
    return null
  }

  return data
}

export async function updateProfile(updates: ProfileUpdate) {
  const supabase = await createClient()

  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    return { error: 'Nicht authentifiziert' }
  }

  const { data, error } = await supabase
    .from('profiles')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id)
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  revalidatePath('/settings')

  return { data }
}

export async function getCurrentUserWithProfile() {
  const supabase = await createClient()

  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return {
    user,
    profile: profile as Profile | null,
  }
}

export async function uploadAvatar(formData: FormData) {
  const supabase = await createClient()

  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    return { error: 'Nicht authentifiziert' }
  }

  const file = formData.get('avatar') as File
  if (!file || file.size === 0) {
    return { error: 'Keine Datei ausgewählt' }
  }

  if (file.size > 2 * 1024 * 1024) {
    return { error: 'Datei darf maximal 2 MB groß sein' }
  }

  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  if (!allowedTypes.includes(file.type)) {
    return { error: 'Nur JPG, PNG, WebP oder GIF erlaubt' }
  }

  const fileExt = file.name.split('.').pop()
  const filePath = `${user.id}/avatar.${fileExt}`

  await supabase.storage.from('avatars').remove([
    `${user.id}/avatar.jpg`,
    `${user.id}/avatar.png`,
    `${user.id}/avatar.webp`,
    `${user.id}/avatar.gif`,
  ])

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, file, { upsert: true })

  if (uploadError) {
    return { error: uploadError.message }
  }

  const { data: { publicUrl } } = supabase.storage
    .from('avatars')
    .getPublicUrl(filePath)

  const avatarUrl = `${publicUrl}?t=${Date.now()}`

  const { error: updateError } = await supabase
    .from('profiles')
    .update({
      avatar_url: avatarUrl,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id)

  if (updateError) {
    return { error: updateError.message }
  }

  revalidatePath('/dashboard')
  revalidatePath('/settings')

  return { data: { avatar_url: avatarUrl } }
}
