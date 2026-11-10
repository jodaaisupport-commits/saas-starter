'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { Project, ProjectInsert, ProjectUpdate } from '@/types/project'

export async function getProjects(): Promise<Project[]> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('getProjects error:', error.message)
    return []
  }

  return data ?? []
}

export async function getProject(id: string): Promise<Project | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return null
  return data
}

export async function createProject(input: ProjectInsert) {
  const supabase = await createClient()

  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    return { error: 'Nicht authentifiziert' }
  }

  if (!input.title?.trim()) {
    return { error: 'Titel ist erforderlich' }
  }

  const { data, error } = await supabase
    .from('projects')
    .insert({
      user_id: user.id,
      title: input.title.trim(),
      description: input.description?.trim() || null,
    })
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/projects')
  revalidatePath('/dashboard')

  return { data }
}

export async function updateProject(id: string, updates: ProjectUpdate) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Nicht authentifiziert' }

  const { data, error } = await supabase
    .from('projects')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/projects')
  revalidatePath(`/projects/${id}`)

  return { data }
}

export async function deleteProject(id: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Nicht authentifiziert' }

  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/projects')
  revalidatePath('/dashboard')

  return { success: true }
}
