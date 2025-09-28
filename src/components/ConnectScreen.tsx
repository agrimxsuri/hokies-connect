import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Users, 
  Star, 
  MapPin, 
  Building, 
  GraduationCap,
  Phone,
  Mail,
  ExternalLink,
  RefreshCw,
  CheckCircle,
  XCircle,
  Eye
} from 'lucide-react'
import { studentDataManager, userDataManager, StudentProfile } from '@/lib/dataManager'
import { generateMatchesForStudent, saveMatches } from '@/lib/matching'
import { supabase } from '@/lib/supabase'
import ExistingMatches from './ExistingMatches'
import AlumniProfileView from './AlumniProfileView'
import RequestCallModal from './RequestCallModal'

interface MatchedAlumni {
  id: string
  user_id: string
  name: string
  graduation_year: string
  current_position: string
  company: string
  location: string
  majors: string[]
  contact_info: {
    email?: string
    linkedin?: string
    website?: string
  }
  match_score: number
  match_reasons: string[]
  status: 'pending' | 'accepted' | 'declined'
}

interface ConnectScreenProps {
  onCallRequested?: () => void
}

const ConnectScreen = ({ onCallRequested }: ConnectScreenProps) => {
  const [profile, setProfile] = useState<StudentProfile | null>(null)
  const [matches, setMatches] = useState<MatchedAlumni[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [hasGenerated, setHasGenerated] = useState(false)
  const [error, setError] = useState('')
  const [selectedAlumniId, setSelectedAlumniId] = useState<string | null>(null)
  const [requestCallAlumni, setRequestCallAlumni] = useState<{id: string, name: string} | null>(null)

  useEffect(() => {
    loadProfile()
    loadExistingMatches()
  }, [])

  const loadProfile = async () => {
    try {
      const currentUser = userDataManager.getCurrentUser()
      console.log('Current user:', currentUser)
      if (currentUser?.userType === 'student') {
        const studentProfile = studentDataManager.getProfileById(currentUser.userId)
        console.log('Student profile:', studentProfile)
        setProfile(studentProfile)
      }
    } catch (error) {
      console.error('Error loading profile:', error)
    }
  }

  const loadExistingMatches = async () => {
    try {
      const currentUser = userDataManager.getCurrentUser()
      if (currentUser?.userType === 'student' && currentUser.userId) {
        console.log('🔍 ConnectScreen: Loading existing matches for student:', currentUser.userId)
        
        // Load existing matches from database
        const { data: matchesData, error: matchesError } = await supabase
          .from('matches')
          .select(`
            *,
            alumni:alumni_user_id(alumni_profiles(*))
          `)
          .eq('student_user_id', currentUser.userId)
          .order('created_at', { ascending: false })

        if (matchesError) {
          console.error('Error loading existing matches:', matchesError)
          return
        }

        if (matchesData && matchesData.length > 0) {
          console.log('🔍 ConnectScreen: Found existing matches:', matchesData.length)
          
          // Convert database matches to MatchedAlumni format
          const existingMatches: MatchedAlumni[] = matchesData.map(match => {
            const alumniProfile = match.alumni?.alumni_profiles
            return {
              id: match.alumni_user_id,
              user_id: match.alumni_user_id,
              name: alumniProfile?.name || 'Alumni Member',
              email: alumniProfile?.email || '',
              contact: {
                phone: alumniProfile?.contact_info?.phone || '',
                location: alumniProfile?.location || '',
                linkedin: alumniProfile?.contact_info?.linkedin || '',
                website: alumniProfile?.contact_info?.website || ''
              },
              majors: alumniProfile?.majors || [],
              graduationYear: alumniProfile?.graduation_year || '',
              currentPosition: alumniProfile?.current_position || '',
              company: alumniProfile?.company || '',
              location: alumniProfile?.location || '',
              profilePicture: alumniProfile?.profile_picture || '',
              journeyEntries: [],
              professionalEntries: [],
              hokieJourney: [],
              createdAt: match.created_at,
              updatedAt: match.updated_at,
              match_score: match.match_score,
              match_reasons: match.match_reasons,
              status: match.status as 'pending' | 'accepted' | 'declined'
            }
          })

          setMatches(existingMatches)
          setHasGenerated(true)
          console.log('✅ ConnectScreen: Loaded existing matches:', existingMatches.length)
        } else {
          console.log('🔍 ConnectScreen: No existing matches found')
        }
      }
    } catch (error) {
      console.error('Error loading existing matches:', error)
    }
  }

  const handleConnect = async () => {
    if (!profile) {
      setError('No profile found. Please create your profile first.')
      return
    }

    setIsGenerating(true)
    setError('')
    
    try {
      console.log('Generating AI matches for student:', profile.id)
      console.log('Student user_id:', profile.id)
      
      // Use profile.id (which should be user_id) for matching
      const generatedMatches = await generateMatchesForStudent(profile.id)
      console.log('Generated matches:', generatedMatches)

      if (generatedMatches.length === 0) {
        console.log('No matches found')
        setMatches([])
        setHasGenerated(true)
        setError('No matches found. This could be because there are no alumni in the database or no compatible matches.')
        return
      }

      // Get alumni details for each match
      const alumniIds = generatedMatches.map(match => match.alumniId)
      console.log('Alumni IDs to fetch:', alumniIds)
      
      const { data: alumniData, error: alumniError } = await supabase
        .from('alumni_profiles')
        .select('*')
        .in('user_id', alumniIds)

      if (alumniError) {
        console.error('Error fetching alumni data:', alumniError)
        setError('Error fetching alumni data: ' + alumniError.message)
        return
      }

      console.log('Fetched alumni data:', alumniData)

      if (!alumniData || alumniData.length === 0) {
        setError('No alumni data found in database. Please make sure alumni profiles are populated.')
        return
      }

      // Convert matches to alumni format with real data
      const alumniMatches: MatchedAlumni[] = generatedMatches.map(match => {
        const alumni = alumniData?.find(a => a.user_id === match.alumniId)
        return {
          id: match.alumniId,
          user_id: match.alumniId,
          name: alumni?.name || 'Alumni Member',
          graduation_year: alumni?.graduation_year || '2020',
          current_position: alumni?.current_position || 'Professional',
          company: alumni?.company || 'Tech Company',
          location: alumni?.location || 'Virginia',
          majors: alumni?.majors || [],
          contact_info: alumni?.contact_info || {},
          match_score: match.score,
          match_reasons: match.reasons,
          status: 'pending'
        }
      })

      setMatches(alumniMatches)
      setHasGenerated(true)

      // Save matches to database
      if (generatedMatches.length > 0) {
        await saveMatches(generatedMatches)
        console.log('Matches saved to database')
      }
    } catch (error) {
      console.error('Error generating matches:', error)
      setError('Error generating matches: ' + (error as Error).message)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleAcceptMatch = async (matchId: string) => {
    try {
      // Update local state immediately for better UX
      setMatches(prev => prev.map(match => 
        match.id === matchId 
          ? { ...match, status: 'accepted' as const }
          : match
      ))

      // Save to database
      const { error } = await supabase
        .from('matches')
        .update({ 
          status: 'accepted',
          updated_at: new Date().toISOString()
        })
        .eq('alumni_user_id', matchId)
        .eq('student_user_id', profile?.id)

      if (error) {
        console.error('Error updating match status:', error)
        // Revert local state on error
        setMatches(prev => prev.map(match => 
          match.id === matchId 
            ? { ...match, status: 'pending' as const }
            : match
        ))
        alert('Failed to save connection. Please try again.')
      } else {
        console.log('Match accepted and saved to database')
      }
    } catch (error) {
      console.error('Error accepting match:', error)
      alert('Failed to save connection. Please try again.')
    }
  }

  const handleDeclineMatch = async (matchId: string) => {
    try {
      // Update local state immediately for better UX
      setMatches(prev => prev.map(match => 
        match.id === matchId 
          ? { ...match, status: 'declined' as const }
          : match
      ))

      // Save to database
      const { error } = await supabase
        .from('matches')
        .update({ 
          status: 'declined',
          updated_at: new Date().toISOString()
        })
        .eq('alumni_user_id', matchId)
        .eq('student_user_id', profile?.id)

      if (error) {
        console.error('Error updating match status:', error)
        // Revert local state on error
        setMatches(prev => prev.map(match => 
          match.id === matchId 
            ? { ...match, status: 'pending' as const }
            : match
        ))
        alert('Failed to save connection. Please try again.')
      } else {
        console.log('Match declined and saved to database')
      }
    } catch (error) {
      console.error('Error declining match:', error)
      alert('Failed to save connection. Please try again.')
    }
  }

  const handleViewProfile = (alumniId: string) => {
    console.log('Viewing profile for alumni:', alumniId)
    setSelectedAlumniId(alumniId)
  }

  const handleCloseProfile = () => {
    setSelectedAlumniId(null)
  }

  const handleRequestCall = (alumniId: string, alumniName: string) => {
    console.log('Requesting call with alumni:', alumniId, alumniName)
    setRequestCallAlumni({ id: alumniId, name: alumniName })
  }

  const handleCloseRequestCall = () => {
    setRequestCallAlumni(null)
  }

  const handleRequestCallSuccess = () => {
    // Refresh matches or show success message
    console.log('Call request sent successfully')
    // Trigger refresh of schedule tab
    if (onCallRequested) {
      onCallRequested()
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-500'
    if (score >= 60) return 'bg-yellow-500'
    if (score >= 40) return 'bg-orange-500'
    return 'bg-red-500'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent Match'
    if (score >= 60) return 'Good Match'
    if (score >= 40) return 'Fair Match'
    return 'Basic Match'
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Profile Required</h2>
            <p className="text-muted-foreground mb-4">
              Please create your profile first to connect with alumni.
            </p>
            <Button 
              onClick={() => window.location.href = '/student-profile'}
              className="bg-vt-maroon hover:bg-vt-maroon-light text-white"
            >
              Create Profile
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-vt-maroon mb-2">
            Connect with Alumni
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            AI-powered matching to connect you with the right alumni
          </p>
          
          {!hasGenerated && (
            <Button
              onClick={handleConnect}
              disabled={isGenerating}
              className="bg-vt-maroon hover:bg-vt-maroon-light text-white px-8 py-3 text-lg"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                  Finding Matches...
                </>
              ) : (
                <>
                  <Users className="h-5 w-5 mr-2" />
                  Find My Matches
                </>
              )}
            </Button>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="text-red-600 text-center">
                <p className="font-semibold">Error:</p>
                <p>{error}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Existing Matches from Database */}
        <div className="mb-8">
          <ExistingMatches userId={profile.id} />
        </div>

        {/* New Matches Display */}
        {hasGenerated && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-vt-maroon">
                New AI Matches ({matches.length})
              </h2>
              <Button
                onClick={handleConnect}
                disabled={isGenerating}
                variant="outline"
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh Matches
              </Button>
            </div>

            {matches.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No New Matches Found</h3>
                  <p className="text-muted-foreground">
                    Try updating your profile to get better matches, or check if alumni profiles are available.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {matches.map((match) => (
                  <Card key={match.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-12 w-12">
                            <AvatarFallback className="bg-vt-maroon text-white">
                              {match.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold text-lg">{match.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              Class of {match.graduation_year}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={`${getScoreColor(match.match_score)} text-white`}>
                            {match.match_score}%
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">
                            {getScoreLabel(match.match_score)}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      {/* Professional Info */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{match.current_position} at {match.company}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{match.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <GraduationCap className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {match.majors.join(', ')}
                          </span>
                        </div>
                      </div>

                      {/* Match Reasons */}
                      <div>
                        <h4 className="font-medium text-sm mb-2">Why this is a good match:</h4>
                        <ul className="space-y-1">
                          {match.match_reasons.slice(0, 3).map((reason, index) => (
                            <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                              <Star className="h-3 w-3 mt-1 flex-shrink-0" />
                              <span>{reason}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Contact Info */}
                      <div className="space-y-2">
                        {match.contact_info.email && (
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{match.contact_info.email}</span>
                          </div>
                        )}
                        {match.contact_info.linkedin && (
                          <div className="flex items-center gap-2">
                            <ExternalLink className="h-4 w-4 text-muted-foreground" />
                            <a 
                              href={`https://${match.contact_info.linkedin}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-vt-maroon hover:underline"
                            >
                              LinkedIn Profile
                            </a>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="space-y-2 pt-4">
                        {/* View Profile Button - Always visible */}
                        <Button
                          onClick={() => handleViewProfile(match.id)}
                          variant="outline"
                          className="w-full"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Profile
                        </Button>
                        
                        {/* Request Call Button */}
                        <Button
                          onClick={() => handleRequestCall(match.id, match.name)}
                          className="w-full bg-vt-maroon hover:bg-vt-maroon-light text-white"
                        >
                          <Phone className="h-4 w-4 mr-2" />
                          Request Call
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Alumni Profile View Modal */}
      {selectedAlumniId && (
        <AlumniProfileView 
          alumniId={selectedAlumniId} 
          onClose={handleCloseProfile} 
        />
      )}

      {/* Request Call Modal */}
      {requestCallAlumni && profile && (
        <RequestCallModal
          alumniId={requestCallAlumni.id}
          alumniName={requestCallAlumni.name}
          studentUserId={profile.id}
          onClose={handleCloseRequestCall}
          onSuccess={handleRequestCallSuccess}
        />
      )}
    </div>
  )
}

export default ConnectScreen
export type { ConnectScreenProps }