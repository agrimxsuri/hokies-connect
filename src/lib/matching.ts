import { supabase } from './supabase'

export interface MatchScore {
  studentId: string
  alumniId: string
  score: number
  reasons: string[]
}

export interface StudentProfile {
  id: string
  user_id: string
  name: string
  majors: string[]
  current_standing: string
  club_positions: string[]
  minors: string[]
  profile_picture: string | null
  created_at: string
  updated_at: string
}

export interface AlumniProfile {
  id: string
  user_id: string
  name: string
  graduation_year: string
  current_position: string
  company: string
  location: string
  majors: string[]
  contact_info: any
  profile_picture: string | null
  created_at: string
  updated_at: string
}

// Calculate match score between student and alumni
const calculateMatchScore = (student: StudentProfile, alumni: AlumniProfile): MatchScore => {
  let score = 0
  const reasons: string[] = []

  // Major matching (40% weight)
  const commonMajors = student.majors.filter(major => 
    alumni.majors.some(alumniMajor => 
      alumniMajor.toLowerCase().includes(major.toLowerCase()) ||
      major.toLowerCase().includes(alumniMajor.toLowerCase())
    )
  )
  
  if (commonMajors.length > 0) {
    score += 40
    reasons.push(`Same major(s): ${commonMajors.join(', ')}`)
  }

  // Industry relevance (25% weight)
  const studentInterests = [
    ...student.club_positions,
    ...student.minors
  ].map(item => item.toLowerCase())

  const alumniIndustry = alumni.current_position.toLowerCase()
  const alumniCompany = alumni.company.toLowerCase()

  // Check if student interests match alumni industry
  const industryMatch = studentInterests.some(interest => 
    alumniIndustry.includes(interest) || 
    interest.includes(alumniIndustry) ||
    alumniCompany.includes(interest) ||
    interest.includes(alumniCompany)
  )

  if (industryMatch) {
    score += 25
    reasons.push(`Industry alignment: ${alumni.current_position} at ${alumni.company}`)
  }

  // Career stage relevance (20% weight)
  const graduationYear = parseInt(alumni.graduation_year)
  const currentYear = new Date().getFullYear()
  const yearsSinceGraduation = currentYear - graduationYear

  // Recent graduates (0-5 years) are great for current students
  if (yearsSinceGraduation <= 5) {
    score += 20
    reasons.push(`Recent graduate (${yearsSinceGraduation} years ago)`)
  } else if (yearsSinceGraduation <= 10) {
    score += 15
    reasons.push(`Experienced professional (${yearsSinceGraduation} years ago)`)
  } else {
    score += 10
    reasons.push(`Senior professional (${yearsSinceGraduation} years ago)`)
  }

  // Location preference (10% weight)
  if (alumni.location && alumni.location.toLowerCase().includes('virginia')) {
    score += 10
    reasons.push('Based in Virginia')
  } else if (alumni.location) {
    score += 5
    reasons.push(`Located in ${alumni.location}`)
  }

  // Additional factors (5% weight)
  if (alumni.contact_info?.linkedin) {
    score += 3
    reasons.push('Has LinkedIn profile')
  }

  if (alumni.contact_info?.website) {
    score += 2
    reasons.push('Has professional website')
  }

  return {
    studentId: student.user_id,
    alumniId: alumni.user_id,
    score: Math.min(score, 100), // Cap at 100
    reasons
  }
}

// Get all students and alumni for matching
export const getAllProfiles = async () => {
  try {
    const [studentsResult, alumniResult] = await Promise.all([
      supabase.from('student_profiles').select('*'),
      supabase.from('alumni_profiles').select('*')
    ])

    if (studentsResult.error) throw studentsResult.error
    if (alumniResult.error) throw alumniResult.error

    return {
      students: studentsResult.data || [],
      alumni: alumniResult.data || []
    }
  } catch (error) {
    console.error('Error fetching profiles:', error)
    return { students: [], alumni: [] }
  }
}

// Generate matches for all students using database alumni
export const generateAllMatches = async (): Promise<MatchScore[]> => {
  const { students, alumni } = await getAllProfiles()
  const allMatches: MatchScore[] = []

  console.log(`Generating matches for ${students.length} students with ${alumni.length} alumni`)

  for (const student of students) {
    for (const alumniProfile of alumni) {
      const match = calculateMatchScore(student, alumniProfile)
      if (match.score >= 30) { // Only include matches with score >= 30
        allMatches.push(match)
      }
    }
  }

  console.log(`Generated ${allMatches.length} total matches`)
  // Sort by score (highest first)
  return allMatches.sort((a, b) => b.score - a.score)
}

// Generate matches for a specific student using database alumni
export const generateMatchesForStudent = async (studentId: string): Promise<MatchScore[]> => {
  const { students, alumni } = await getAllProfiles()
  const student = students.find(s => s.user_id === studentId)
  
  if (!student) {
    console.log('Student not found:', studentId)
    return []
  }

  console.log(`Generating matches for student: ${student.name}`)
  console.log(`Available alumni: ${alumni.length}`)

  const matches: MatchScore[] = []

  for (const alumniProfile of alumni) {
    const match = calculateMatchScore(student, alumniProfile)
    if (match.score >= 30) {
      matches.push(match)
    }
  }

  console.log(`Generated ${matches.length} matches for student`)
  return matches.sort((a, b) => b.score - a.score)
}

// Get top matches for a student (limit to top 5)
export const getTopMatchesForStudent = async (studentId: string, limit: number = 5): Promise<MatchScore[]> => {
  const matches = await generateMatchesForStudent(studentId)
  return matches.slice(0, limit)
}

// Save matches to database
export const saveMatches = async (matches: MatchScore[]) => {
  try {
    // Create a matches table entry for each match
    const matchRecords = matches.map(match => ({
      student_user_id: match.studentId,
      alumni_user_id: match.alumniId,
      match_score: match.score,
      match_reasons: match.reasons,
      created_at: new Date().toISOString()
    }))

    const { error } = await supabase
      .from('matches')
      .insert(matchRecords)

    if (error) throw error
    return true
  } catch (error) {
    console.error('Error saving matches:', error)
    return false
  }
}