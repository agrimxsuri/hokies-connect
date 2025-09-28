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
  XCircle
} from 'lucide-react'
import { studentDataManager, userDataManager, StudentProfile } from '@/lib/dataManager'
import { generateMatchesForStudent, saveMatches } from '@/lib/matching'
import { supabase } from '@/lib/supabase'

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

const ConnectScreen = () => {
  const [profile, setProfile] = useState<StudentProfile | null>(null)
  const [matches, setMatches] = useState<MatchedAlumni[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [hasGenerated, setHasGenerated] = useState(false)

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const currentUser = userDataManager.getCurrentUser()
      if (currentUser?.userType === 'student') {
        const studentProfile = studentDataManager.getProfileById(currentUser.userId)
        setProfile(studentProfile)
      }
    } catch (error) {
      console.error('Error loading profile:', error)
    }
  }

  const handleConnect = async () => {
    if (!profile) return

    setIsGenerating(true)
    try {
      console.log('Generating AI matches for student:', profile.id)
      const generatedMatches = await generateMatchesForStudent(profile.id)
      console.log('Generated matches:', generatedMatches)

      if (generatedMatches.length === 0) {
        console.log('No matches found')
        setMatches([])
        setHasGenerated(true)
        return
      }

      // Get alumni details for each match
      const alumniIds = generatedMatches.map(match => match.alumniId)
      const { data: alumniData, error } = await supabase
        .from('alumni_profiles')
        .select('*')
        .in('user_id', alumniIds)

      if (error) {
        console.error('Error fetching alumni data:', error)
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
    } finally {
      setIsGenerating(false)
    }
  }

  const handleAcceptMatch = (matchId: string) => {
    setMatches(prev => prev.map(match => 
      match.id === matchId 
        ? { ...match, status: 'accepted' as const }
        : match
    ))
  }

  const handleDeclineMatch = (matchId: string) => {
    setMatches(prev => prev.map(match => 
      match.id === matchId 
        ? { ...match, status: 'declined' as const }
        : match
    ))
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

        {/* Matches Display */}
        {hasGenerated && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-vt-maroon">
                Your AI Matches ({matches.length})
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
                  <h3 className="text-xl font-semibold mb-2">No Matches Found</h3>
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
                      <div className="flex gap-2 pt-4">
                        {match.status === 'pending' && (
                          <>
                            <Button
                              onClick={() => handleAcceptMatch(match.id)}
                              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Connect
                            </Button>
                            <Button
                              onClick={() => handleDeclineMatch(match.id)}
                              variant="outline"
                              className="flex-1"
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Decline
                            </Button>
                          </>
                        )}
                        {match.status === 'accepted' && (
                          <div className="flex-1 text-center py-2 text-green-600 font-medium">
                            <CheckCircle className="h-4 w-4 inline mr-2" />
                            Connected!
                          </div>
                        )}
                        {match.status === 'declined' && (
                          <div className="flex-1 text-center py-2 text-gray-500 font-medium">
                            <XCircle className="h-4 w-4 inline mr-2" />
                            Declined
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default ConnectScreen