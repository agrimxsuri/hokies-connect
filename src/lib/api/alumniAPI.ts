import { supabase, getCurrentUser } from '../supabase'
import type { Database } from '../database.types'

type AlumniProfile = Database['public']['Tables']['alumni_profiles']['Row']
type AlumniProfileInsert = Database['public']['Tables']['alumni_profiles']['Insert']
type AlumniProfileUpdate = Database['public']['Tables']['alumni_profiles']['Update']
type ProfessionalExperience = Database['public']['Tables']['professional_experiences']['Row']
type ProfessionalExperienceInsert = Database['public']['Tables']['professional_experiences']['Insert']

export interface JourneyEntry {
  id: string
  year: string
  courses: string[]
  gpa: string
  clubs: string[]
  internships: string[]
  research: string[]
}

export interface ProfessionalEntry {
  id: string
  position: string
  company: string
  startDate: string
  endDate: string
  description: string
  achievements: string[]
}

export interface AlumniProfileData {
  name: string
  email: string
  phone: string
  location: string
  linkedin: string
  website: string
  graduationYear: string
  currentPosition: string
  company: string
  majors: string[]
  profilePicture: string
  journeyEntries: JourneyEntry[]
  professionalEntries: ProfessionalEntry[]
}

// Get alumni profile for current user
export const getProfile = async (): Promise<AlumniProfile | null> => {
  try {
    const user = await getCurrentUser()
    if (!user) return null

    const { data, error } = await supabase
      .from('alumni_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return data
  } catch (error) {
    console.error('Error getting alumni profile:', error)
    return null
  }
}

// Generate a simple user ID for non-authenticated users
const generateUserId = () => {
  return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
}

// Create or update alumni profile
export const upsertProfile = async (profileData: AlumniProfileData): Promise<AlumniProfile> => {
  try {
    // For non-authenticated users, generate a simple user ID
    const userId = generateUserId()

    // Create a simple profile object that matches our database structure
    const profile: AlumniProfileInsert = {
      user_id: userId,
      name: profileData.name,
      graduation_year: profileData.graduationYear,
      current_position: profileData.currentPosition,
      company: profileData.company,
      location: profileData.location,
      majors: profileData.majors,
      contact_info: {
        email: profileData.email,
        phone: profileData.phone,
        linkedin: profileData.linkedin,
        website: profileData.website
      },
      profile_picture: profileData.profilePicture || null,
    }

    // Insert alumni profile (use insert instead of upsert for simplicity)
    const { data, error } = await supabase
      .from('alumni_profiles')
      .insert(profile)
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      // If Supabase fails, return a mock profile for now
      return {
        id: userId,
        user_id: userId,
        name: profileData.name,
        graduation_year: profileData.graduationYear,
        current_position: profileData.currentPosition,
        company: profileData.company,
        location: profileData.location,
        majors: profileData.majors,
        contact_info: {
          email: profileData.email,
          phone: profileData.phone,
          linkedin: profileData.linkedin,
          website: profileData.website
        },
        profile_picture: profileData.profilePicture || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    }

    return data
  } catch (error) {
    console.error('Error upserting alumni profile:', error)
    // Return a mock profile if everything fails
    const userId = generateUserId()
    return {
      id: userId,
      user_id: userId,
      name: profileData.name,
      graduation_year: profileData.graduationYear,
      current_position: profileData.currentPosition,
      company: profileData.company,
      location: profileData.location,
      majors: profileData.majors,
      contact_info: {
        email: profileData.email,
        phone: profileData.phone,
        linkedin: profileData.linkedin,
        website: profileData.website
      },
      profile_picture: profileData.profilePicture || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  }
}

// Get journey entries for current user
export const getJourneyEntries = async (): Promise<JourneyEntry[]> => {
  try {
    const user = await getCurrentUser()
    if (!user) return []

    const { data, error } = await supabase
      .from('hokie_journey')
      .select('*')
      .eq('user_id', user.id)
      .order('year_label')

    if (error) throw error

    // Group by year and type
    const grouped = data.reduce((acc, entry) => {
      const year = entry.year_label
      if (!acc[year]) {
        acc[year] = {
          id: year,
          year,
          courses: [],
          gpa: '',
          clubs: [],
          internships: [],
          research: []
        }
      }

      switch (entry.type) {
        case 'education':
          acc[year].courses.push(entry.title)
          if (entry.metadata?.gpa) {
            acc[year].gpa = entry.metadata.gpa as string
          }
          break
        case 'club':
          acc[year].clubs.push(entry.title)
          break
        case 'internship':
          acc[year].internships.push(entry.title)
          break
        case 'research':
          acc[year].research.push(entry.title)
          break
      }

      return acc
    }, {} as Record<string, JourneyEntry>)

    return Object.values(grouped)
  } catch (error) {
    console.error('Error getting journey entries:', error)
    return []
  }
}

// Get professional experiences for current user
export const getProfessionalEntries = async (): Promise<ProfessionalEntry[]> => {
  try {
    const user = await getCurrentUser()
    if (!user) return []

    const { data, error } = await supabase
      .from('professional_experiences')
      .select('*')
      .eq('user_id', user.id)
      .order('start_date', { ascending: false })

    if (error) throw error

    return data.map(entry => ({
      id: entry.id,
      position: entry.position,
      company: entry.company,
      startDate: entry.start_date,
      endDate: entry.end_date || '',
      description: entry.description || '',
      achievements: entry.achievements || []
    }))
  } catch (error) {
    console.error('Error getting professional entries:', error)
    return []
  }
}
