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
  Phone,
  CheckCircle,
  XCircle,
  AlertCircle,
  MessageSquare
} from 'lucide-react'
import { studentDataManager, userDataManager, StudentProfile } from '@/lib/dataManager'
import ConnectScreen, { ConnectScreenProps } from '@/components/ConnectScreen'
import TimelineComponent from '@/components/TimelineComponent'
import { callRequestAPI, type CallRequest } from '@/lib/callRequestAPI'

interface CallRequestWithAlumni extends CallRequest {
  alumni_profiles?: {
    name: string
    current_position: string
    company: string
    profile_picture: string
  }
}

const StudentDashboard = () => {
  const [profile, setProfile] = useState<StudentProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("home")
  const [hokieJourneyCollapsed, setHokieJourneyCollapsed] = useState(false)
  const [callRequests, setCallRequests] = useState<CallRequestWithAlumni[]>([])
  const [isLoadingCalls, setIsLoadingCalls] = useState(false)
  
  // ADDON: State for student request data
  const [studentRequestData, setStudentRequestData] = useState<any[]>([])

  useEffect(() => {
    loadProfile()
    loadCallRequests() // Load call requests immediately on page load
    loadStudentRequestData() // ADDON: Load student request data
  }, [])

  useEffect(() => {
    if (activeTab === 'requests') {
      loadCallRequests()
      loadStudentRequestData() // ADDON: Refresh student request data
      
      // Set up polling to check for updates every 5 seconds when requests tab is active
      const interval = setInterval(() => {
        console.log('🔄 Polling for call request updates...')
        loadCallRequests()
        loadStudentRequestData() // ADDON: Also refresh student request data
      }, 5000) // Check every 5 seconds
      
      return () => clearInterval(interval)
    }
  }, [activeTab])

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

  const loadCallRequests = async () => {
    try {
      setIsLoadingCalls(true)
      const currentUser = userDataManager.getCurrentUser()
      if (currentUser?.userType === 'student' && currentUser.userId) {
        console.log('🔍 StudentDashboard: Loading call requests for student:', currentUser.userId)
        
        // Load from database only - no local storage
        const requests = await callRequestAPI.getRequestsForStudent(currentUser.userId)
        console.log('🔍 StudentDashboard: Received requests from database:', requests.length)
        console.log('🔍 StudentDashboard: Database requests details:', requests)
        
        // Enhanced logging to verify data integrity
        requests.forEach((request, index) => {
          const requestWithAlumni = request as CallRequestWithAlumni
          console.log(`📋 Request ${index + 1}:`)
          console.log(`  - ID: ${request.id}`)
          console.log(`  - Student ID: ${request.student_user_id}`)
          console.log(`  - Alumni ID: ${request.alumni_user_id}`)
          console.log(`  - Scheduled Time: ${request.scheduled_time}`)
          console.log(`  - Message: ${request.message}`)
          console.log(`  - Status: ${request.status}`)
          console.log(`  - Alumni Name: ${requestWithAlumni.alumni_profiles?.name || 'N/A'}`)
          console.log(`  - Alumni Company: ${requestWithAlumni.alumni_profiles?.company || 'N/A'}`)
        })
        
        setCallRequests(requests)
        console.log('🔍 StudentDashboard: Set call requests in state:', requests.length)
      }
    } catch (error) {
      console.error('❌ StudentDashboard: Error loading call requests:', error)
      setCallRequests([])
    } finally {
      setIsLoadingCalls(false)
    }
  }

  // ADDON: Function to load student request data
  const loadStudentRequestData = () => {
    try {
      const currentUser = userDataManager.getCurrentUser()
      if (currentUser?.userType === 'student' && currentUser.userId) {
        const savedData = JSON.parse(localStorage.getItem('student_request_data') || '[]')
        const userRequests = savedData.filter((req: any) => req.studentId === currentUser.userId)
        setStudentRequestData(userRequests)
        console.log('✅ ADDON: Loaded student request data:', userRequests.length)
      }
    } catch (error) {
      console.error('❌ ADDON: Error loading student request data:', error)
    }
  }

  // Debug function to show current data
  const showDebugInfo = () => {
    const currentUser = userDataManager.getCurrentUser()
    console.log('🐛 DEBUG INFO:')
    console.log('Current User:', currentUser)
    console.log('Current State Requests:', callRequests)
    console.log('Loading State:', isLoadingCalls)
    console.log('Student Request Data:', studentRequestData)
  }

  const formatDateTime = (dateTimeString: string) => {
    if (!dateTimeString) return 'Not scheduled'
    
    const date = new Date(dateTimeString)
    const now = new Date()
    const diffTime = date.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    const formattedDate = date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
    
    const formattedTime = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
    
    let timeIndicator = ''
    if (diffDays < 0) {
      timeIndicator = ' (Past)'
    } else if (diffDays === 0) {
      timeIndicator = ' (Today)'
    } else if (diffDays === 1) {
      timeIndicator = ' (Tomorrow)'
    } else if (diffDays <= 7) {
      timeIndicator = ` (In ${diffDays} days)`
    }
    
    return `${formattedDate} at ${formattedTime}${timeIndicator}`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'bg-vt-orange/10 text-vt-orange border-vt-orange/20'
      case 'declined':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'pending':
        return 'bg-vt-maroon/10 text-vt-maroon border-vt-maroon/20'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle className="h-4 w-4" />
      case 'declined':
        return <XCircle className="h-4 w-4" />
      case 'pending':
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
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
            <TabsTrigger value="requests" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Requests
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
                    {profile.journeyEntries && profile.journeyEntries.length > 0 ? (
                      <TimelineComponent entries={profile.journeyEntries.map(entry => ({
                        year: entry.year,
                        title: `${entry.year} Year`,
                        description: `Academic year with ${entry.courses.length} courses, ${entry.clubs.length} clubs, ${entry.internships.length} internships`,
                        type: "education" as const,
                        details: [
                          ...entry.courses.slice(0, 3),
                          ...entry.clubs.slice(0, 2),
                          ...entry.internships.slice(0, 2)
                        ].filter(Boolean)
                      }))} />
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
            <ConnectScreen onCallRequested={loadCallRequests} />
          </TabsContent>

          {/* Requests Tab */}
          <TabsContent value="requests" className="space-y-6">

            {isLoadingCalls ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vt-maroon mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading your requests...</p>
                </CardContent>
              </Card>
            ) : callRequests.length === 0 && studentRequestData.length === 0 ? (
            <Card>
                <CardContent className="pt-6 text-center">
                  <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No call requests yet</h3>
                  <p className="text-muted-foreground mb-4">
                    You haven't requested any calls with alumni yet. Start connecting with alumni to schedule mentorship sessions!
                  </p>
                  <Button 
                    onClick={() => setActiveTab("connect")}
                    className="bg-vt-maroon hover:bg-vt-maroon-light text-white"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Find Alumni to Connect With
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {/* Your Call Requests */}
                <Card className="border-vt-maroon/20 bg-gradient-to-br from-vt-maroon/5 to-vt-orange/5">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-vt-maroon">
                      <MessageSquare className="h-5 w-5 text-vt-orange" />
                      📝 Your Call Requests ({callRequests.length + studentRequestData.length})
                    </CardTitle>
                    <p className="text-sm text-vt-maroon/80">All the call requests you've made to alumni</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Database Requests */}
                    {callRequests.map((request, index) => (
                      <div key={request.id} className="p-4 bg-white border border-vt-maroon/20 rounded-lg hover:border-vt-orange/30 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-lg text-vt-maroon mb-2">
                              Request to {request.alumni_profiles?.name || 'Alumni Member'}
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm">
                                  <Calendar className="h-4 w-4 text-vt-orange" />
                                  <span className="font-medium text-vt-maroon">Scheduled Date & Time:</span>
                                </div>
                                <p className="text-sm text-gray-700 ml-6">
                                  {formatDateTime(request.scheduled_time)}
                                </p>
                              </div>
                              <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm">
                                  <MessageSquare className="h-4 w-4 text-vt-orange" />
                                  <span className="font-medium text-vt-maroon">Your Message:</span>
                                </div>
                                <p className="text-sm text-gray-700 ml-6 bg-vt-maroon/5 p-2 rounded border border-vt-maroon/10">
                                  "{request.message}"
                                </p>
                              </div>
                            </div>
                            <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                              <Clock className="h-3 w-3" />
                              <span>Requested on: {new Date(request.created_at).toLocaleString()}</span>
                            </div>
                          </div>
                          <Badge className={`${getStatusColor(request.status)} flex items-center gap-1`}>
                            {getStatusIcon(request.status)}
                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                          </Badge>
                        </div>
                      </div>
                    ))}

                    {/* Local Storage Requests */}
                    {studentRequestData.map((request, index) => (
                      <div key={request.id} className="p-4 bg-white border border-vt-maroon/20 rounded-lg hover:border-vt-orange/30 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-lg text-vt-maroon mb-2">
                              Request to {request.alumniName}
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm">
                                  <Calendar className="h-4 w-4 text-vt-orange" />
                                  <span className="font-medium text-vt-maroon">Scheduled Date & Time:</span>
                                </div>
                                <p className="text-sm text-gray-700 ml-6">
                                  {formatDateTime(request.scheduledDate)}
                                </p>
                              </div>
                  <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm">
                                  <MessageSquare className="h-4 w-4 text-vt-orange" />
                                  <span className="font-medium text-vt-maroon">Your Message:</span>
                                </div>
                                <p className="text-sm text-gray-700 ml-6 bg-vt-maroon/5 p-2 rounded border border-vt-maroon/10">
                                  "{request.message}"
                                </p>
                              </div>
                            </div>
                            <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                              <Clock className="h-3 w-3" />
                              <span>Requested on: {new Date(request.created_at).toLocaleString()}</span>
                            </div>
                          </div>
                          <Badge className="bg-vt-maroon text-white hover:bg-vt-maroon-light">
                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            )}
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