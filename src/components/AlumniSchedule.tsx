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
import { userDataManager } from '@/lib/userDataManager'

const AlumniSchedule = () => {
  const [requests, setRequests] = useState<CallRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadRequests()
  }, [])

  const loadRequests = async () => {
    try {
      setIsLoading(true)
      setError('')
      
      const currentUser = userDataManager.getCurrentUser()
      if (!currentUser || currentUser.userType !== 'alumni') {
        setError('Alumni user not found')
        return
      }

      const callRequests = await callRequestAPI.getRequestsForAlumni(currentUser.userId)
      setRequests(callRequests)
    } catch (err) {
      console.error('Error loading call requests:', err)
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

      <div className="space-y-4">
        {requests.map((request) => (
          <Card key={request.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-vt-maroon text-white">
                      {request.student_profiles?.name?.split(' ').map((n: string) => n[0]).join('') || 'S'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-lg">
                      {request.student_profiles?.name || 'Student'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {request.student_profiles?.majors?.join(', ')} • {request.student_profiles?.current_standing}
                    </p>
                  </div>
                </div>
                <Badge className={`${getStatusColor(request.status)} text-white`}>
                  {getStatusLabel(request.status)}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Request Details */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Requested Time:</span>
                  <span className="text-sm">{formatDateTime(request.scheduled_date)}</span>
                </div>
                
                <div className="flex items-start gap-2">
                  <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <span className="text-sm font-medium">Description:</span>
                    <p className="text-sm text-muted-foreground mt-1">{request.description}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {request.status === 'pending' && (
                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    onClick={() => handleAcceptRequest(request.id)}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Accept
                  </Button>
                  <Button
                    onClick={() => handleDeclineRequest(request.id)}
                    variant="outline"
                    className="flex-1"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Decline
                  </Button>
                </div>
              )}

              {request.status === 'accepted' && (
                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <span className="font-medium">Call Accepted</span>
                    </div>
                    <Button variant="outline" size="sm">
                      <Phone className="h-4 w-4 mr-2" />
                      Join Call
                    </Button>
                  </div>
                </div>
              )}

              {request.status === 'declined' && (
                <div className="pt-4 border-t">
                  <div className="flex items-center gap-2 text-red-600">
                    <XCircle className="h-4 w-4" />
                    <span className="font-medium">Call Declined</span>
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
