import { supabase, getCurrentUser } from './supabase'
import type { User } from '@supabase/supabase-js'

export interface UserRole {
  id: string
  role: 'student' | 'alumni'
  created_at: string
  updated_at: string
}

export interface AuthUser {
  id: string
  email?: string
  role: 'student' | 'alumni'
}

// Sign up with email and password
export const signUp = async (email: string, password: string, role: 'student' | 'alumni') => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) throw error

  if (data.user) {
    // Create user_meta record
    const { error: metaError } = await supabase
      .from('user_meta')
      .insert({
        id: data.user.id,
        role,
      })

    if (metaError) throw metaError
  }

  return data
}

// Sign in with email and password
export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw error
  return data
}

// Sign out
export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

// Get current authenticated user with role
export const getAuthUser = async (): Promise<AuthUser | null> => {
  try {
    const user = await getCurrentUser()
    if (!user) return null

    const { data: userMeta, error } = await supabase
      .from('user_meta')
      .select('role')
      .eq('id', user.id)
      .single()

    if (error) throw error

    return {
      id: user.id,
      email: user.email,
      role: userMeta.role,
    }
  } catch (error) {
    console.error('Error getting auth user:', error)
    return null
  }
}

// Check if user is authenticated
export const isAuthenticated = async (): Promise<boolean> => {
  try {
    const user = await getCurrentUser()
    return !!user
  } catch {
    return false
  }
}

// Get user role
export const getUserRole = async (): Promise<'student' | 'alumni' | null> => {
  try {
    const authUser = await getAuthUser()
    return authUser?.role || null
  } catch {
    return null
  }
}

// Get current session (this was missing!)
export const getCurrentSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession()
  if (error) throw error
  return session
}
