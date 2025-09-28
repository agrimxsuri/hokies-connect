import { supabase, getCurrentUser } from '../supabase'
import type { Database } from '../database.types'

type CallRequest = Database['public']['Tables']['call_requests']['Row']
type CallRequestInsert = Database['public']['Tables']['call_requests']['Insert']
type CallRequestUpdate = Database['public']['Tables']['call_requests']['Update']

export interface CallRequestWithUsers extends CallRequest {
  student_name?: string
  alumni_name?: string
}

// Get all call requests for current user (as student or alumni)
export const listMine = async (): Promise<CallRequestWithUsers[]> => {
  try {
    const user = await getCurrentUser()
    if (!user) return []

    const { data, error } = await supabase
      .from('call_requests')
      .select(`
        *,
        student:student_user_id(student_profiles(name)),
        alumni:alumni_user_id(alumni_profiles(name))
      `)
      .or(`student_user_id.eq.${user.id},alumni_user_id.eq.${user.id}`)
      .order('created_at', { ascending: false })

    if (error) throw error

    return data.map(request => ({
      ...request,
      student_name: request.student?.student_profiles?.name,
      alumni_name: request.alumni?.alumni_profiles?.name
    }))
  } catch (error) {
    console.error('Error getting call requests:', error)
    return []
  }
}

// Create a call request (student to alumni)
export const create = async (alumniUserId: string, message: string): Promise<CallRequest> => {
  try {
    const user = await getCurrentUser()
    if (!user) throw new Error('User not authenticated')

    const request: CallRequestInsert = {
      student_user_id: user.id,
      alumni_user_id: alumniUserId,
      message,
      status: 'pending'
    }

    const { data, error } = await supabase
      .from('call_requests')
      .insert(request)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error creating call request:', error)
    throw error
  }
}

// Update call request status (alumni can accept/decline)
export const setStatus = async (requestId: string, status: 'accepted' | 'declined', responseMessage?: string): Promise<CallRequest> => {
  try {
    const user = await getCurrentUser()
    if (!user) throw new Error('User not authenticated')

    const updateData: CallRequestUpdate = {
      status,
      response_message: responseMessage || null,
      updated_at: new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('call_requests')
      .update(updateData)
      .eq('id', requestId)
      .eq('alumni_user_id', user.id) // Only alumni can update status
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error updating call request status:', error)
    throw error
  }
}

// Get call requests for alumni (pending, accepted, declined)
export const getForAlumni = async (): Promise<CallRequestWithUsers[]> => {
  try {
    const user = await getCurrentUser()
    if (!user) return []

    const { data, error } = await supabase
      .from('call_requests')
      .select(`
        *,
        student:student_user_id(student_profiles(name))
      `)
      .eq('alumni_user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error

    return data.map(request => ({
      ...request,
      student_name: request.student?.student_profiles?.name
    }))
  } catch (error) {
    console.error('Error getting alumni call requests:', error)
    return []
  }
}

// Get call requests for student
export const getForStudent = async (): Promise<CallRequestWithUsers[]> => {
  try {
    const user = await getCurrentUser()
    if (!user) return []

    const { data, error } = await supabase
      .from('call_requests')
      .select(`
        *,
        alumni:alumni_user_id(alumni_profiles(name))
      `)
      .eq('student_user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error

    return data.map(request => ({
      ...request,
      alumni_name: request.alumni?.alumni_profiles?.name
    }))
  } catch (error) {
    console.error('Error getting student call requests:', error)
    return []
  }
}
