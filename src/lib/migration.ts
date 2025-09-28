import { supabase, getCurrentUser } from './supabase'
import { uploadAvatar } from './storage'

// Legacy localStorage keys
const STORAGE_KEYS = {
  STUDENT_PROFILES: 'hokies_connect_student_profiles',
  ALUMNI_PROFILES: 'hokies_connect_alumni_profiles',
  CALL_REQUESTS: 'hokies_connect_call_requests',
} as const

interface LegacyStudentProfile {
  id: string
  name: string
  majors: string[]
  currentStanding: string
  clubPositions: string[]
  minors: string[]
  profilePicture: string
  journeyEntries: Array<{
    id: string
    year: string
    courses: string[]
    gpa: string
    clubs: string[]
    internships: string[]
    research: string[]
  }>
  createdAt: string
  updatedAt: string
}

interface LegacyAlumniProfile {
  id: string
  name: string
  email: string
  contact: {
    phone?: string
    location?: string
    linkedin?: string
    website?: string
  }
  majors: string[]
  graduationYear: string
  currentPosition: string
  company: string
  location: string
  profilePicture: string
  resume: string
  journeyEntries: Array<{
    id: string
    year: string
    courses: string[]
    gpa: string
    clubs: string[]
    internships: string[]
    research: string[]
  }>
  professionalEntries: Array<{
    id: string
    position: string
    company: string
    startDate: string
    endDate: string
    description: string
    achievements: string[]
  }>
  hokieJourney: any[]
  createdAt: string
  updatedAt: string
}

interface LegacyCallRequest {
  id: string
  studentId: string
  alumniId: string
  message: string
  preferredTimes: string[]
  status: 'pending' | 'accepted' | 'declined' | 'proposed_time'
  scheduledTime?: string
  responseMessage?: string
  createdAt: string
  updatedAt: string
}

// Convert data URL to File object
const dataURLtoFile = (dataurl: string, filename: string): File | null => {
  if (!dataurl.startsWith('data:')) return null
  
  const arr = dataurl.split(',')
  const mime = arr[0].match(/:(.*?);/)?.[1]
  if (!mime) return null
  
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], filename, { type: mime })
}

// Migrate student profile
const migrateStudentProfile = async (legacyProfile: LegacyStudentProfile): Promise<boolean> => {
  try {
    const user = await getCurrentUser()
    if (!user) return false

    // Upload profile picture if it exists
    let profilePictureUrl = ''
    if (legacyProfile.profilePicture && legacyProfile.profilePicture.startsWith('data:')) {
      const file = dataURLtoFile(legacyProfile.profilePicture, 'profile.jpg')
      if (file) {
        profilePictureUrl = await uploadAvatar(file, user.id)
      }
    }

    // Convert journey entries to hokie_journey records
    const journeyEntries = legacyProfile.journeyEntries.flatMap(entry => [
      ...entry.courses.map(course => ({
        user_id: user.id,
        type: 'education' as const,
        year_label: entry.year,
        title: course,
        details: null,
        metadata: { gpa: entry.gpa }
      })),
      ...entry.clubs.map(club => ({
        user_id: user.id,
        type: 'club' as const,
        year_label: entry.year,
        title: club,
        details: null,
        metadata: null
      })),
      ...entry.internships.map(internship => ({
        user_id: user.id,
        type: 'internship' as const,
        year_label: entry.year,
        title: internship,
        details: null,
        metadata: null
      })),
      ...entry.research.map(research => ({
        user_id: user.id,
        type: 'research' as const,
        year_label: entry.year,
        title: research,
        details: null,
        metadata: null
      }))
    ])

    // Insert journey entries
    if (journeyEntries.length > 0) {
      const { error: journeyError } = await supabase
        .from('hokie_journey')
        .insert(journeyEntries)

      if (journeyError) throw journeyError
    }

    // Insert student profile
    const { error: profileError } = await supabase
      .from('student_profiles')
      .insert({
        user_id: user.id,
        name: legacyProfile.name,
        majors: legacyProfile.majors,
        current_standing: legacyProfile.currentStanding,
        club_positions: legacyProfile.clubPositions,
        minors: legacyProfile.minors,
        profile_picture: profilePictureUrl || null,
      })

    if (profileError) throw profileError

    return true
  } catch (error) {
    console.error('Error migrating student profile:', error)
    return false
  }
}

// Migrate alumni profile
const migrateAlumniProfile = async (legacyProfile: LegacyAlumniProfile): Promise<boolean> => {
  try {
    const user = await getCurrentUser()
    if (!user) return false

    // Upload profile picture if it exists
    let profilePictureUrl = ''
    if (legacyProfile.profilePicture && legacyProfile.profilePicture.startsWith('data:')) {
      const file = dataURLtoFile(legacyProfile.profilePicture, 'profile.jpg')
      if (file) {
        profilePictureUrl = await uploadAvatar(file, user.id)
      }
    }

    // Convert journey entries to hokie_journey records
    const journeyEntries = legacyProfile.journeyEntries.flatMap(entry => [
      ...entry.courses.map(course => ({
        user_id: user.id,
        type: 'education' as const,
        year_label: entry.year,
        title: course,
        details: null,
        metadata: { gpa: entry.gpa }
      })),
      ...entry.clubs.map(club => ({
        user_id: user.id,
        type: 'club' as const,
        year_label: entry.year,
        title: club,
        details: null,
        metadata: null
      })),
      ...entry.internships.map(internship => ({
        user_id: user.id,
        type: 'internship' as const,
        year_label: entry.year,
        title: internship,
        details: null,
        metadata: null
      })),
      ...entry.research.map(research => ({
        user_id: user.id,
        type: 'research' as const,
        year_label: entry.year,
        title: research,
        details: null,
        metadata: null
      }))
    ])

    // Insert journey entries
    if (journeyEntries.length > 0) {
      const { error: journeyError } = await supabase
        .from('hokie_journey')
        .insert(journeyEntries)

      if (journeyError) throw journeyError
    }

    // Insert professional experiences
    if (legacyProfile.professionalEntries.length > 0) {
      const professionalEntries = legacyProfile.professionalEntries.map(entry => ({
        user_id: user.id,
        position: entry.position,
        company: entry.company,
        start_date: entry.startDate,
        end_date: entry.endDate || null,
        description: entry.description || null,
        achievements: entry.achievements || []
      }))

      const { error: professionalError } = await supabase
        .from('professional_experiences')
        .insert(professionalEntries)

      if (professionalError) throw professionalError
    }

    // Insert alumni profile
    const { error: profileError } = await supabase
      .from('alumni_profiles')
      .insert({
        user_id: user.id,
        name: legacyProfile.name,
        graduation_year: legacyProfile.graduationYear,
        current_position: legacyProfile.currentPosition,
        company: legacyProfile.company,
        location: legacyProfile.location,
        majors: legacyProfile.majors,
        contact_info: {
          email: legacyProfile.email,
          phone: legacyProfile.contact.phone || '',
          linkedin: legacyProfile.contact.linkedin || '',
          website: legacyProfile.contact.website || ''
        },
        profile_picture: profilePictureUrl || null,
      })

    if (profileError) throw profileError

    return true
  } catch (error) {
    console.error('Error migrating alumni profile:', error)
    return false
  }
}

// Main migration function
export const migrateLocalData = async (): Promise<{
  success: boolean
  message: string
  migrated: {
    studentProfiles: number
    alumniProfiles: number
    callRequests: number
  }
}> => {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return {
        success: false,
        message: 'User not authenticated',
        migrated: { studentProfiles: 0, alumniProfiles: 0, callRequests: 0 }
      }
    }

    let migrated = { studentProfiles: 0, alumniProfiles: 0, callRequests: 0 }

    // Migrate student profiles
    const studentData = localStorage.getItem(STORAGE_KEYS.STUDENT_PROFILES)
    if (studentData) {
      const profiles: LegacyStudentProfile[] = JSON.parse(studentData)
      for (const profile of profiles) {
        if (await migrateStudentProfile(profile)) {
          migrated.studentProfiles++
        }
      }
    }

    // Migrate alumni profiles
    const alumniData = localStorage.getItem(STORAGE_KEYS.ALUMNI_PROFILES)
    if (alumniData) {
      const profiles: LegacyAlumniProfile[] = JSON.parse(alumniData)
      for (const profile of profiles) {
        if (await migrateAlumniProfile(profile)) {
          migrated.alumniProfiles++
        }
      }
    }

    // Note: Call requests migration is complex due to user ID mapping
    // For now, we'll skip them and let users recreate them

    // Clear migrated data
    if (migrated.studentProfiles > 0 || migrated.alumniProfiles > 0) {
      localStorage.removeItem(STORAGE_KEYS.STUDENT_PROFILES)
      localStorage.removeItem(STORAGE_KEYS.ALUMNI_PROFILES)
    }

    return {
      success: true,
      message: `Successfully migrated ${migrated.studentProfiles} student profiles and ${migrated.alumniProfiles} alumni profiles`,
      migrated
    }
  } catch (error) {
    console.error('Migration error:', error)
    return {
      success: false,
      message: `Migration failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      migrated: { studentProfiles: 0, alumniProfiles: 0, callRequests: 0 }
    }
  }
}
