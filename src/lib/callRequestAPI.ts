import { supabase } from './supabase'

export interface CallRequest {
  id: string
  student_user_id: string
  alumni_user_id: string
  scheduled_date: string
  description: string
  meeting_link?: string
  status: 'pending' | 'accepted' | 'declined'
  created_at: string
  updated_at: string
}

export interface CallRequestInsert {
  student_user_id: string
  alumni_user_id: string
  scheduled_date: string
  description: string
  meeting_link?: string
  status?: 'pending' | 'accepted' | 'declined'
}

export const callRequestAPI = {
  // Create a new call request
  createRequest: async (requestData: CallRequestInsert): Promise<CallRequest> => {
    try {
      console.log('Creating call request:', requestData)
      
      const { data, error } = await supabase
        .from('call_requests')
        .insert(requestData)
        .select()
        .single()

      if (error) {
        console.error('Error creating call request:', error)
        throw error
      }

      console.log('Call request created successfully:', data)
      return data
    } catch (error) {
      console.error('Error in createRequest:', error)
      throw error
    }
  },

  // Get call requests for a specific alumni
  getRequestsForAlumni: async (alumniUserId: string): Promise<CallRequest[]> => {
    try {
      console.log('Fetching call requests for alumni:', alumniUserId)
      
      const { data, error } = await supabase
        .from('call_requests')
        .select(`
          *,
          student_profiles (
            name, majors, current_standing, profile_picture
          )
        `)
        .eq('alumni_user_id', alumniUserId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching call requests:', error)
        throw error
      }

      console.log('Call requests fetched:', data)
      return data || []
    } catch (error) {
      console.error('Error in getRequestsForAlumni:', error)
      return []
    }
  },

  // Get call requests for a specific student
  getRequestsForStudent: async (studentUserId: string): Promise<CallRequest[]> => {
    try {
      console.log('Fetching call requests for student:', studentUserId)
      
      const { data, error } = await supabase
        .from('call_requests')
        .select(`
          *,
          alumni_profiles (
            name, current_position, company, profile_picture
          )
        `)
        .eq('student_user_id', studentUserId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching call requests:', error)
        throw error
      }

      console.log('Call requests fetched:', data)
      return data || []
    } catch (error) {
      console.error('Error in getRequestsForStudent:', error)
      return []
    }
  },

  // Update call request status
  updateRequestStatus: async (requestId: string, status: 'accepted' | 'declined'): Promise<CallRequest> => {
    try {
      console.log('Updating call request status:', requestId, status)
      
      const { data, error } = await supabase
        .from('call_requests')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', requestId)
        .select()
        .single()

      if (error) {
        console.error('Error updating call request status:', error)
        throw error
      }

      console.log('Call request status updated:', data)
      return data
    } catch (error) {
      console.error('Error in updateRequestStatus:', error)
      throw error
    }
  },

  // Delete call request
  deleteRequest: async (requestId: string): Promise<boolean> => {
    try {
      console.log('Deleting call request:', requestId)
      
      const { error } = await supabase
        .from('call_requests')
        .delete()
        .eq('id', requestId)

      if (error) {
        console.error('Error deleting call request:', error)
        throw error
      }

      console.log('Call request deleted successfully')
      return true
    } catch (error) {
      console.error('Error in deleteRequest:', error)
      return false
    }
  }
}
