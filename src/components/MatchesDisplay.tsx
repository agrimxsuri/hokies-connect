import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Users, Star, MapPin, Building, GraduationCap } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface Match {
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
}

interface MatchesDisplayProps {
  userType: 'student' | 'alumni'
  userId: string
}

export const MatchesDisplay = ({ userType, userId }: MatchesDisplayProps) => {
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMatches()
  }, [userType, userId])

  const fetchMatches = async () => {
    try {
      const { data, error } = await supabase
        .from('matches')
        .select(`
          *,
          student:student_user_id(student_profiles(name)),
          alumni:alumni_user_id(alumni_profiles(name, current_position, company, location))
        `)
        .eq(userType === 'student' ? 'student_user_id' : 'alumni_user_id', userId)
        .order('match_score', { ascending: false })
        .limit(10)

      if (error) throw error

      const processedMatches = data.map(match => ({
        ...match,
        student_name: match.student?.student_profiles?.name,
        alumni_name: match.alumni?.alumni_profiles?.name,
        alumni_position: match.alumni?.alumni_profiles?.current_position,
        alumni_company: match.alumni?.alumni_profiles?.company,
        alumni_location: match.alumni?.alumni_profiles?.location
      }))

      setMatches(processedMatches)
    } catch (error) {
      console.error('Error fetching matches:', error)
    } finally {
      setLoading(false)
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

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            AI Matches
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Loading matches...</p>
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
            AI Matches
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            No matches found yet. Create your profile to get AI-powered matches!
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          AI Matches ({matches.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {matches.map((match) => (
          <div key={match.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-lg">
                  {userType === 'student' ? match.alumni_name : match.student_name}
                </h3>
                {userType === 'student' && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Building className="h-4 w-4" />
                    <span>{match.alumni_position} at {match.alumni_company}</span>
                  </div>
                )}
                {match.alumni_location && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{match.alumni_location}</span>
                  </div>
                )}
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

            <div className="space-y-2">
              <h4 className="font-medium text-sm">Why this is a good match:</h4>
              <ul className="space-y-1">
                {match.match_reasons.map((reason, index) => (
                  <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                    <Star className="h-3 w-3 mt-1 flex-shrink-0" />
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex gap-2 mt-4">
              <Button size="sm" className="bg-vt-maroon hover:bg-vt-maroon-light text-white">
                Connect
              </Button>
              <Button size="sm" variant="outline">
                View Profile
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export default MatchesDisplay
