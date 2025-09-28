import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Users, 
  Star, 
  MapPin, 
  Building, 
  GraduationCap,
  Mail,
  ExternalLink,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface ExistingMatch {
  id: string
  student_user_id: string
  alumni_user_id: string
  match_score: number
  match_reasons: string[]
  status: string
  created_at: string
  student_name?: string
  alumni_name?: string
  alumni_position?: string
  alumni_company?: string
  alumni_location?: string
  alumni_majors?: string[]
  alumni_contact_info?: any
}

interface ExistingMatchesProps {
  userId: string
}

const ExistingMatches = ({ userId }: ExistingMatchesProps) => {
  const [matches, setMatches] = useState<ExistingMatch[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchExistingMatches()
  }, [userId])

  const fetchExistingMatches = async () => {
    try {
      console.log('Fetching existing matches for user:', userId)
      
      const { data, error } = await supabase
        .from('matches')
        .select(`
          *,
          student:student_user_id(student_profiles(name)),
          alumni:alumni_user_id(alumni_profiles(name, current_position, company, location, majors, contact_info))
        `)
        .eq('student_user_id', userId)
        .order('match_score', { ascending: false })

      if (error) {
        console.error('Error fetching matches:', error)
        return
      }

      console.log('Fetched matches:', data)

      const processedMatches = data.map(match => ({
        ...match,
        student_name: match.student?.student_profiles?.name,
        alumni_name: match.alumni?.alumni_profiles?.name,
        alumni_position: match.alumni?.alumni_profiles?.current_position,
        alumni_company: match.alumni?.alumni_profiles?.company,
        alumni_location: match.alumni?.alumni_profiles?.location,
        alumni_majors: match.alumni?.alumni_profiles?.majors,
        alumni_contact_info: match.alumni?.alumni_profiles?.contact_info
      }))

      setMatches(processedMatches)
    } catch (error) {
      console.error('Error fetching existing matches:', error)
    } finally {
      setIsLoading(false)
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'declined':
        return <XCircle className="h-4 w-4 text-red-600" />
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'Accepted'
      case 'declined':
        return 'Declined'
      case 'connected':
        return 'Connected'
      default:
        return 'Pending'
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Existing Matches
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-vt-maroon mx-auto mb-2"></div>
            <p className="text-muted-foreground">Loading existing matches...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (matches.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Existing Matches
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Existing Matches</h3>
            <p className="text-muted-foreground">
              You don't have any saved matches yet. Use "Find My Matches" to discover new connections.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Existing Matches ({matches.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {matches.map((match) => (
            <Card key={match.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-vt-maroon text-white text-sm">
                        {match.alumni_name?.split(' ').map(n => n[0]).join('') || 'A'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold text-sm">{match.alumni_name || 'Alumni Member'}</h4>
                      <p className="text-xs text-muted-foreground">
                        {match.alumni_position} at {match.alumni_company}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={`${getScoreColor(match.match_score)} text-white text-xs`}>
                      {match.match_score}%
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      {getScoreLabel(match.match_score)}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 mb-3">
                  {match.alumni_location && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span>{match.alumni_location}</span>
                    </div>
                  )}
                  {match.alumni_majors && match.alumni_majors.length > 0 && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <GraduationCap className="h-3 w-3" />
                      <span>{match.alumni_majors.join(', ')}</span>
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <h5 className="font-medium text-xs mb-1">Match Reasons:</h5>
                  <ul className="space-y-1">
                    {match.match_reasons.slice(0, 2).map((reason, index) => (
                      <li key={index} className="text-xs text-muted-foreground flex items-start gap-1">
                        <Star className="h-2 w-2 mt-1 flex-shrink-0" />
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs">
                    {getStatusIcon(match.status)}
                    <span className="text-muted-foreground">{getStatusText(match.status)}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(match.created_at).toLocaleDateString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default ExistingMatches
