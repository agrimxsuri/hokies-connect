import { supabase } from './supabase'

export interface AlumniProfile {
  id: string
  user_id: string
  name: string
  email: string
  contact: {
    phone: string
    location: string
    linkedin: string
    website: string
  }
  majors: string[]
  graduationYear: string
  currentPosition: string
  company: string
  location: string
  profilePicture: string
  resume: string
  journeyEntries: any[]
  professionalEntries: any[]
  hokieJourney: any[]
  createdAt: string
  updatedAt: string
}

export const alumniDataManager = {
  // Get alumni profile by user ID from Supabase
  getProfileById: async (userId: string): Promise<AlumniProfile | null> => {
    try {
      console.log('🔍 Fetching alumni profile for user ID:', userId)
      
      const { data, error } = await supabase
        .from('alumni_profiles')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error) {
        console.error('Error fetching alumni profile:', error)
        return null
      }

      if (!data) {
        console.log('No alumni profile found for user ID:', userId)
        return null
      }

      // Convert Supabase data to our interface format
      const profile: AlumniProfile = {
        id: data.user_id,
        user_id: data.user_id,
        name: data.name || '',
        email: data.email || '',
        contact: {
          phone: data.contact_info?.phone || '',
          location: data.location || '',
          linkedin: data.contact_info?.linkedin || '',
          website: data.contact_info?.website || ''
        },
        majors: data.majors || [],
        graduationYear: data.graduation_year || '',
        currentPosition: data.current_position || '',
        company: data.company || '',
        location: data.location || '',
        profilePicture: data.profile_picture || '',
        resume: '',
        journeyEntries: [],
        professionalEntries: [],
        hokieJourney: [],
        createdAt: data.created_at || new Date().toISOString(),
        updatedAt: data.updated_at || new Date().toISOString()
      }

      console.log('✅ Alumni profile loaded:', profile)
      return profile
    } catch (error) {
      console.error('Error in getProfileById:', error)
      return null
    }
  },

  // Get all alumni profiles
  getAllProfiles: async (): Promise<AlumniProfile[]> => {
    try {
      const { data, error } = await supabase
        .from('alumni_profiles')
        .select('*')

      if (error) {
        console.error('Error fetching all alumni profiles:', error)
        return []
      }

      return (data || []).map(item => ({
        id: item.user_id,
        user_id: item.user_id,
        name: item.name || '',
        email: item.email || '',
        contact: {
          phone: item.contact_info?.phone || '',
          location: item.location || '',
          linkedin: item.contact_info?.linkedin || '',
          website: item.contact_info?.website || ''
        },
        majors: item.majors || [],
        graduationYear: item.graduation_year || '',
        currentPosition: item.current_position || '',
        company: item.company || '',
        location: item.location || '',
        profilePicture: item.profile_picture || '',
        resume: '',
        journeyEntries: [],
        professionalEntries: [],
        hokieJourney: [],
        createdAt: item.created_at || new Date().toISOString(),
        updatedAt: item.updated_at || new Date().toISOString()
      }))
    } catch (error) {
      console.error('Error in getAllProfiles:', error)
      return []
    }
  },

  // Save alumni profile to Supabase
  saveProfile: async (profile: AlumniProfile): Promise<AlumniProfile> => {
    try {
      const profileData = {
        user_id: profile.user_id,
        name: profile.name,
        email: profile.email,
        contact_info: profile.contact,
        majors: profile.majors,
        graduation_year: profile.graduationYear,
        current_position: profile.currentPosition,
        company: profile.company,
        location: profile.location,
        profile_picture: profile.profilePicture
      }

      const { data, error } = await supabase
        .from('alumni_profiles')
        .upsert(profileData)
        .select()
        .single()

      if (error) {
        console.error('Error saving alumni profile:', error)
        throw error
      }

      return profile
    } catch (error) {
      console.error('Error in saveProfile:', error)
      throw error
    }
  }
}
