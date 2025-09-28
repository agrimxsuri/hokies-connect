import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
  Building,
  MessageCircle,
  Clock,
  Home,
  Phone
} from 'lucide-react'
import { studentDataManager, userDataManager, StudentProfile } from '@/lib/dataManager'
import ConnectScreen from '@/components/ConnectScreen'
import MatchingTest from '@/components/MatchingTest'
import DatabaseDebug from '@/components/DatabaseDebug'
import TimelineComponent from '@/components/TimelineComponent'

const StudentDashboard = () => {
  const [profile, setProfile] = useState<StudentProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("home")
  const [hokieJourneyCollapsed, setHokieJourneyCollapsed] = useState(false)

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const currentUser = userDataManager.getCurrentUser()
      if (currentUser?.userType === 'student') {
        const studentProfile = studentDataManager.getProfileById(currentUser.userId)
        console.log('Found profile:', studentProfile)
        setProfile(studentProfile)
      }
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
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-vt-maroon mb-2">
            Student Dashboard
          </h1>
          <p className="text-lg text-gray-600">
            Connect with alumni and manage your profile
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="home" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Home
            </TabsTrigger>
            <TabsTrigger value="connect" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Connect
            </TabsTrigger>
            <TabsTrigger value="schedule" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Schedule Management
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
          </TabsList>

          {/* Home Tab - Profile Summary & Quick Actions */}
          <TabsContent value="home" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => setActiveTab("connect")}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Find Alumni Matches
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => window.location.href = '/student-profile'}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => setActiveTab("schedule")}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Manage Schedule
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => setActiveTab("profile")}
                  >
                    <User className="h-4 w-4 mr-2" />
                    View Full Profile
                  </Button>
                </CardContent>
              </Card>
            </div>

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
          </TabsContent>

          {/* Connect Tab - AI Matching Screen */}
          <TabsContent value="connect" className="space-y-6">
            <ConnectScreen />
            <MatchingTest />
            <DatabaseDebug />
          </TabsContent>

          {/* Schedule Management Tab */}
          <TabsContent value="schedule" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Schedule Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Clock className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Schedule Management</h3>
                  <p className="text-muted-foreground mb-4">
                    Manage your scheduled calls and meetings with alumni
                  </p>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">• View upcoming calls</p>
                    <p className="text-sm text-muted-foreground">• Reschedule meetings</p>
                    <p className="text-sm text-muted-foreground">• Track call history</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Tab - Full Profile View */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-vt-maroon">Profile Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-8">
                  {/* Profile Picture */}
                  <div className="flex flex-col items-center">
                    <Avatar className="h-32 w-32 mb-4">
                      <AvatarImage src={profile.profilePicture} />
                      <AvatarFallback className="bg-vt-maroon text-white text-2xl">
                        {profile.name ? profile.name.charAt(0).toUpperCase() : "?"}
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  {/* Basic Information */}
                  <div className="flex-1 space-y-4">
                    <div>
                      <h3 className="text-2xl font-bold text-vt-maroon mb-2">{profile.name}</h3>
                      <p className="text-muted-foreground">Student at Virginia Tech</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-vt-maroon mb-2">Major(s)</h4>
                        <div className="flex flex-wrap gap-1">
                          {profile.majors.map((major, index) => (
                            <Badge key={index} variant="secondary" className="bg-vt-maroon/10 text-vt-maroon">
                              {major}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-vt-maroon mb-2">Current Standing</h4>
                        <p className="text-muted-foreground">{profile.currentStanding}</p>
                      </div>

                      {profile.minors.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-vt-maroon mb-2">Minor(s)</h4>
                          <div className="flex flex-wrap gap-1">
                            {profile.minors.map((minor, index) => (
                              <Badge key={index} variant="outline">
                                {minor}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {profile.clubPositions.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-vt-maroon mb-2">Club Positions</h4>
                          <div className="flex flex-wrap gap-1">
                            {profile.clubPositions.map((position, index) => (
                              <Badge key={index} variant="outline">
                                {position}
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default StudentDashboard