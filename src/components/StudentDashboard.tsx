import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { 
  User, 
  Calendar, 
  Edit, 
  GraduationCap, 
  ChevronDown,
  Users,
  Star,
  MapPin,
  Building
} from 'lucide-react'
import { studentDataManager, StudentProfile } from '@/lib/dataManager'
import MatchesDisplay from './MatchesDisplay'
import TimelineComponent from './TimelineComponent'

interface StudentDashboardProps {
  userId: string
}

const StudentDashboard = ({ userId }: StudentDashboardProps) => {
  const [profile, setProfile] = useState<StudentProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hokieJourneyCollapsed, setHokieJourneyCollapsed] = useState(false)

  useEffect(() => {
    loadProfile()
  }, [userId])

  const loadProfile = async () => {
    try {
      console.log('Loading profile for userId:', userId)
      const studentProfile = studentDataManager.getProfileById(userId)
      console.log('Found profile:', studentProfile)
      setProfile(studentProfile)
    } catch (error) {
      console.error('Error loading profile:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vt-maroon mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your profile...</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <User className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Profile Not Found</h2>
            <p className="text-muted-foreground mb-4">
              We couldn't find your profile. Please create one to get started.
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
      {/* Header */}
      <div className="bg-vt-maroon text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Welcome back, {profile.name}!</h1>
              <p className="text-vt-maroon-light mt-1">Student Dashboard</p>
            </div>
            <Button 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-vt-maroon"
              onClick={() => window.location.href = '/student-profile'}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Summary & Hokie Journey */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={profile.profilePicture} />
                    <AvatarFallback className="bg-vt-maroon text-white text-lg">
                      {profile.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-vt-maroon mb-2">{profile.name}</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Major(s): </span>
                        <div className="flex flex-wrap gap-1">
                          {profile.majors.map((major, index) => (
                            <Badge key={index} variant="secondary" className="bg-vt-maroon/10 text-vt-maroon">
                              {major}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Current Standing: {profile.currentStanding}</span>
                      </div>
                      {profile.minors.length > 0 && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">Minor(s): </span>
                          <div className="flex flex-wrap gap-1">
                            {profile.minors.map((minor, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {minor}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Hokie Journey */}
            <Card>
              <Collapsible open={!hokieJourneyCollapsed} onOpenChange={setHokieJourneyCollapsed}>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <GraduationCap className="h-5 w-5" />
                        Hokie Journey
                      </span>
                      <ChevronDown className={`h-4 w-4 transition-transform ${hokieJourneyCollapsed ? 'rotate-180' : ''}`} />
                    </CardTitle>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent>
                    {profile.hokieJourney && profile.hokieJourney.length > 0 ? (
                      <TimelineComponent entries={profile.hokieJourney} />
                    ) : (
                      <p className="text-muted-foreground text-center py-4">
                        No journey entries yet. Edit your profile to add your Hokie journey!
                      </p>
                    )}
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          </div>

          {/* Right Column - AI Matches */}
          <div className="space-y-6">
            <MatchesDisplay userType="student" userId={userId} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentDashboard
