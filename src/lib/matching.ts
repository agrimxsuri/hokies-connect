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

// Define engineering discipline categories for cross-disciplinary matching
const ENGINEERING_CATEGORIES = {
  'Computer Science': ['Computer Engineering', 'Software Engineering', 'Data Science', 'Information Technology'],
  'Computer Engineering': ['Computer Science', 'Electrical Engineering', 'Software Engineering', 'Data Science'],
  'Mechanical Engineering': ['Aerospace Engineering', 'Industrial Engineering', 'Automotive Engineering', 'Manufacturing'],
  'Electrical Engineering': ['Computer Engineering', 'Aerospace Engineering', 'Telecommunications', 'Power Systems'],
  'Aerospace Engineering': ['Mechanical Engineering', 'Electrical Engineering', 'Materials Science', 'Physics'],
  'Civil Engineering': ['Environmental Engineering', 'Structural Engineering', 'Construction Management', 'Urban Planning'],
  'Chemical Engineering': ['Materials Science', 'Biomedical Engineering', 'Environmental Engineering', 'Process Engineering'],
  'Industrial Engineering': ['Mechanical Engineering', 'Operations Research', 'Supply Chain', 'Manufacturing'],
  'Biomedical Engineering': ['Chemical Engineering', 'Mechanical Engineering', 'Electrical Engineering', 'Biology'],
  'Materials Science': ['Chemical Engineering', 'Mechanical Engineering', 'Physics', 'Chemistry']
}

// Define industry categories for cross-industry matching
const INDUSTRY_CATEGORIES = {
  'Software Engineering': ['Data Analytics', 'Cybersecurity', 'Product Management', 'Technical Consulting'],
  'Data Analytics': ['Software Engineering', 'Business Intelligence', 'Machine Learning', 'Statistics'],
  'Cybersecurity': ['Software Engineering', 'Information Technology', 'Risk Management', 'Compliance'],
  'Financial Services': ['Consulting', 'Investment Banking', 'Risk Management', 'Fintech'],
  'Automotive Engineering': ['Mechanical Engineering', 'Manufacturing', 'Product Development', 'Quality Engineering'],
  'Consulting': ['Financial Services', 'Technology', 'Strategy', 'Operations'],
  'Manufacturing': ['Automotive Engineering', 'Industrial Engineering', 'Quality Control', 'Supply Chain']
}

// Define skill transferability matrix
const SKILL_TRANSFERABILITY = {
  'Programming': ['Software Engineering', 'Data Analytics', 'Cybersecurity', 'Computer Science', 'Computer Engineering'],
  'Data Analysis': ['Data Analytics', 'Statistics', 'Business Intelligence', 'Machine Learning', 'Computer Science'],
  'Problem Solving': ['Engineering', 'Consulting', 'Management', 'Research', 'Product Development'],
  'Project Management': ['Consulting', 'Management', 'Operations', 'Product Management', 'Engineering'],
  'Communication': ['Consulting', 'Management', 'Sales', 'Marketing', 'Education'],
  'Leadership': ['Management', 'Consulting', 'Entrepreneurship', 'Operations', 'Strategy'],
  'Research': ['Academia', 'R&D', 'Product Development', 'Consulting', 'Government'],
  'Design': ['Product Development', 'User Experience', 'Architecture', 'Engineering', 'Marketing']
}

// Calculate cross-disciplinary match score
const calculateCrossDisciplinaryScore = (studentMajor: string, alumniMajor: string, alumniPosition: string): { score: number, reason: string } => {
  // Direct major match
  if (studentMajor.toLowerCase() === alumniMajor.toLowerCase()) {
    return { score: 40, reason: `Same major: ${alumniMajor}` }
  }

  // Check engineering categories
  for (const [category, relatedMajors] of Object.entries(ENGINEERING_CATEGORIES)) {
    if (studentMajor.toLowerCase().includes(category.toLowerCase()) || 
        category.toLowerCase().includes(studentMajor.toLowerCase())) {
      if (relatedMajors.some(related => 
        alumniMajor.toLowerCase().includes(related.toLowerCase()) || 
        related.toLowerCase().includes(alumniMajor.toLowerCase()))) {
        return { score: 35, reason: `Related engineering field: ${alumniMajor} (${category} related)` }
      }
    }
  }

  // Check industry relevance
  for (const [industry, relatedFields] of Object.entries(INDUSTRY_CATEGORIES)) {
    if (alumniPosition.toLowerCase().includes(industry.toLowerCase()) || 
        industry.toLowerCase().includes(alumniPosition.toLowerCase())) {
      if (relatedFields.some(field => 
        studentMajor.toLowerCase().includes(field.toLowerCase()) || 
        field.toLowerCase().includes(studentMajor.toLowerCase()))) {
        return { score: 30, reason: `Industry alignment: ${alumniPosition} in ${industry}` }
      }
    }
  }

  // Check skill transferability
  for (const [skill, applicableFields] of Object.entries(SKILL_TRANSFERABILITY)) {
    if (applicableFields.some(field => 
      studentMajor.toLowerCase().includes(field.toLowerCase()) || 
      field.toLowerCase().includes(studentMajor.toLowerCase()))) {
      if (applicableFields.some(field => 
        alumniMajor.toLowerCase().includes(field.toLowerCase()) || 
        field.toLowerCase().includes(alumniMajor.toLowerCase()))) {
        return { score: 25, reason: `Skill transferability: ${skill} skills applicable` }
      }
    }
  }

  // General engineering connection
  const engineeringKeywords = ['engineering', 'technology', 'science', 'mathematics', 'physics', 'chemistry']
  const studentHasEngineering = engineeringKeywords.some(keyword => 
    studentMajor.toLowerCase().includes(keyword))
  const alumniHasEngineering = engineeringKeywords.some(keyword => 
    alumniMajor.toLowerCase().includes(keyword))

  if (studentHasEngineering && alumniHasEngineering) {
    return { score: 20, reason: `Both in STEM fields: ${studentMajor} → ${alumniMajor}` }
  }

  // Business/Finance connection
  const businessKeywords = ['business', 'finance', 'economics', 'management', 'marketing']
  const studentHasBusiness = businessKeywords.some(keyword => 
    studentMajor.toLowerCase().includes(keyword))
  const alumniHasBusiness = businessKeywords.some(keyword => 
    alumniMajor.toLowerCase().includes(keyword) || 
    alumniPosition.toLowerCase().includes(keyword))

  if (studentHasBusiness && alumniHasBusiness) {
    return { score: 20, reason: `Both in business/finance fields` }
  }

  // Default connection
  return { score: 15, reason: `Cross-disciplinary connection: ${studentMajor} → ${alumniMajor}` }
}

// Calculate match score between student and alumni
const calculateMatchScore = (student: StudentProfile, alumni: AlumniProfile): MatchScore => {
  let score = 0
  const reasons: string[] = []

  // Cross-disciplinary major matching (40% weight)
  let bestMajorMatch = { score: 0, reason: '' }
  for (const studentMajor of student.majors) {
    for (const alumniMajor of alumni.majors) {
      const match = calculateCrossDisciplinaryScore(studentMajor, alumniMajor, alumni.current_position)
      if (match.score > bestMajorMatch.score) {
        bestMajorMatch = match
      }
    }
  }
  
  if (bestMajorMatch.score > 0) {
    score += bestMajorMatch.score
    reasons.push(bestMajorMatch.reason)
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
      if (match.score >= 20) { // Lower threshold for more matches
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
    if (match.score >= 20) { // Lower threshold for more matches
      matches.push(match)
    }
  }

  console.log(`Generated ${matches.length} matches for student`)
  return matches.sort((a, b) => b.score - a.score)
}

// Get top matches for a student (limit to top 10 for more variety)
export const getTopMatchesForStudent = async (studentId: string, limit: number = 10): Promise<MatchScore[]> => {
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