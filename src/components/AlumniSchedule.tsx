import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Calendar, 
  Clock, 
  User, 
  CheckCircle, 
  XCircle, 
  MessageSquare,
  Phone,
  Mail
} from 'lucide-react'
import { callRequestAPI, CallRequest } from '@/lib/callRequestAPI'
import { useParams } from 'react-router-dom'

const AlumniSchedule = () => {
  const [requests, setRequests] = useState<CallRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const { userId: routeUserId } = useParams()

  useEffect(() => {
    loadRequests()
  }, [routeUserId])

  const loadRequests = async () => {
    try {
      setIsLoading(true)
      setError('')
      
      const effectiveUserId = routeUserId
      console.log('🔍 AlumniSchedule: Loading requests for userId:', effectiveUserId)
      
      if (!effectiveUserId) {
        console.error('❌ AlumniSchedule: No userId found in route params')
        setError('Alumni user not found')
        return
      }

      console.log('🔍 AlumniSchedule: Calling getRequestsForAlumni with:', effectiveUserId)
      const callRequests = await callRequestAPI.getRequestsForAlumni(effectiveUserId)
      console.log('🔍 AlumniSchedule: Received requests:', callRequests)
      setRequests(callRequests)
    } catch (err) {
      console.error('❌ AlumniSchedule: Error loading call requests:', err)
      setError('Failed to load call requests')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAcceptRequest = async (requestId: string) => {
    try {
      await callRequestAPI.updateRequestStatus(requestId, 'accepted')
      setRequests(prev => prev.map(req => 
        req.id === requestId ? { ...req, status: 'accepted' } : req
      ))
      alert('Call request accepted!')
    } catch (err) {
      console.error('Error accepting request:', err)
      alert('Failed to accept request. Please try again.')
    }
  }

  const handleDeclineRequest = async (requestId: string) => {
    try {
      await callRequestAPI.updateRequestStatus(requestId, 'declined')
      setRequests(prev => prev.map(req => 
        req.id === requestId ? { ...req, status: 'declined' } : req
      ))
      alert('Call request declined.')
    } catch (err) {
      console.error('Error declining request:', err)
      alert('Failed to decline request. Please try again.')
    }
  }

  const formatDateTime = (dateString: string) => {
    if (!dateString) return 'No date specified'
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatRelativeTime = (dateString: string) => {
    if (!dateString) return 'No date specified'
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((date.getTime() - now.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 0) return 'Past'
    if (diffInHours < 24) return 'Today'
    if (diffInHours < 48) return 'Tomorrow'
    return `In ${Math.floor(diffInHours / 24)} days`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500'
      case 'accepted': return 'bg-green-500'
      case 'declined': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Pending'
      case 'accepted': return 'Accepted'
      case 'declined': return 'Declined'
      default: return 'Unknown'
    }
  }

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vt-maroon mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading call requests...</p>
      </div>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <div className="text-red-600">
            <p className="font-semibold">Error:</p>
            <p>{error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (requests.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Call Requests</h3>
          <p className="text-muted-foreground">
            You don't have any call requests from students yet.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-vt-maroon">Call Requests</h2>
        <Badge variant="outline" className="bg-vt-maroon/10 text-vt-maroon">
          {requests.length} request{requests.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      <div className="space-y-6">
        {requests.map((request) => (
          <Card key={request.id} className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-vt-maroon">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={(request as any).student_profile?.profile_picture} />
                    <AvatarFallback className="bg-vt-maroon text-white text-lg">
                      {(request as any).student_profile?.name?.split(' ').map((n: string) => n[0]).join('') || 'S'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-bold text-xl text-vt-maroon">
                        {(request as any).student_profile?.name || 'Student'}
                      </h3>
                      <Badge variant="outline" className="bg-vt-maroon/10 text-vt-maroon border-vt-maroon">
                        {(request as any).student_profile?.current_standing || 'Student'}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-700">
                        {(request as any).student_profile?.majors?.join(', ') || 'Major not specified'}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatRelativeTime(request.scheduled_time)}
                        </span>
                        <Badge className={`${getStatusColor(request.status)} text-white text-xs`}>
                          {getStatusLabel(request.status)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Call Request Details */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-vt-maroon mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Requested Call Time</h4>
                    <p className="text-sm text-gray-700">{formatDateTime(request.scheduled_time)}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <MessageSquare className="h-5 w-5 text-vt-maroon mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">Student's Message</h4>
                    <p className="text-sm text-gray-700 bg-white p-3 rounded border">
                      {request.message || 'No message provided'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Student Profile Summary */}
              {(request as any).student_profile && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Student Profile
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="font-medium text-blue-800">Name:</span>
                      <span className="ml-2 text-blue-700">{(request as any).student_profile.name}</span>
                    </div>
                    <div>
                      <span className="font-medium text-blue-800">Standing:</span>
                      <span className="ml-2 text-blue-700">{(request as any).student_profile.current_standing}</span>
                    </div>
                    <div className="md:col-span-2">
                      <span className="font-medium text-blue-800">Major(s):</span>
                      <span className="ml-2 text-blue-700">{(request as any).student_profile.majors?.join(', ')}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              {request.status === 'pending' && (
                <div className="flex gap-4 pt-4 border-t">
                  <Button
                    onClick={() => handleAcceptRequest(request.id)}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white h-12 text-lg font-semibold"
                  >
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Accept Invitation
                  </Button>
                  <Button
                    onClick={() => handleDeclineRequest(request.id)}
                    variant="outline"
                    className="flex-1 h-12 text-lg font-semibold border-red-300 text-red-600 hover:bg-red-50"
                  >
                    <XCircle className="h-5 w-5 mr-2" />
                    Decline
                  </Button>
                </div>
              )}

              {request.status === 'accepted' && (
                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center gap-3 text-green-700">
                      <CheckCircle className="h-6 w-6" />
                      <div>
                        <span className="font-semibold text-lg">Call Accepted</span>
                        <p className="text-sm">You've accepted this call request</p>
                      </div>
                    </div>
                    <Button className="bg-vt-maroon hover:bg-vt-maroon-light text-white">
                      <Phone className="h-4 w-4 mr-2" />
                      Join Call
                    </Button>
                  </div>
                </div>
              )}

              {request.status === 'declined' && (
                <div className="pt-4 border-t">
                  <div className="flex items-center gap-3 text-red-600 bg-red-50 p-4 rounded-lg">
                    <XCircle className="h-6 w-6" />
                    <div>
                      <span className="font-semibold text-lg">Call Declined</span>
                      <p className="text-sm">You've declined this call request</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default AlumniSchedule
