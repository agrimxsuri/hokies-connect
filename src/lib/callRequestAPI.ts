import { supabase } from './supabase'

export interface CallRequest {
  id: string
  student_user_id: string
  alumni_user_id: string
  scheduled_time: string
  message: string
  response_message?: string
  status: 'pending' | 'accepted' | 'declined'
  created_at: string
  updated_at: string
}

export interface CallRequestInsert {
  student_user_id: string
  alumni_user_id: string
  scheduled_time: string
  message: string
  response_message?: string
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
        console.error('Supabase error creating call request:', error)
        throw new Error(`Database error: ${error.message}`)
      }

      if (!data) {
        throw new Error('No data returned from database')
      }

      console.log('Call request created successfully:', data)
      return data
    } catch (error: any) {
      console.error('Error in createRequest:', error)
      if (error.message) {
        throw error
      }
      throw new Error('Failed to create call request')
    }
  },

  // Get call requests for a specific alumni (fetch requests, then enrich with student profiles)
  getRequestsForAlumni: async (alumniUserId: string): Promise<(CallRequest & { student_profile?: any })[]> => {
    try {
      console.log('🔍 callRequestAPI: Fetching call requests for alumni:', alumniUserId)

      // Step 1: fetch requests
      const { data: requests, error: reqError } = await supabase
        .from('call_requests')
        .select('*')
        .eq('alumni_user_id', alumniUserId)
        .order('created_at', { ascending: false })

      if (reqError) {
        console.error('❌ callRequestAPI: Error fetching call requests:', reqError)
        throw reqError
      }

      if (!requests || requests.length === 0) {
        return []
      }

      // Step 2: fetch student profiles for all unique student_user_ids
      const studentIds = Array.from(new Set(requests.map(r => r.student_user_id)))
      const { data: students, error: stuError } = await supabase
        .from('student_profiles')
        .select('user_id, name, majors, current_standing, profile_picture')
        .in('user_id', studentIds)

      if (stuError) {
        console.error('❌ callRequestAPI: Error fetching student profiles:', stuError)
        // Return requests without enrichment rather than failing entirely
        return requests as any
      }

      const byId: Record<string, any> = {}
      for (const s of students || []) {
        byId[s.user_id] = s
      }

      // Step 3: merge
      const enriched = requests.map(r => ({
        ...r,
        student_profile: byId[r.student_user_id]
      }))

      console.log('✅ callRequestAPI: Enriched call requests count:', enriched.length)
      return enriched
    } catch (error) {
      console.error('❌ callRequestAPI: Error in getRequestsForAlumni:', error)
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
