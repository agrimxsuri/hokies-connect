import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock, MessageCircle, Check, X, User, GraduationCap, MapPin, RefreshCw } from "lucide-react";
import { callRequestManager, studentDataManager, userDataManager, CallRequest } from "@/lib/dataManager";

const CallRequestManagement = () => {
  const [callRequests, setCallRequests] = useState<CallRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastRequestCount, setLastRequestCount] = useState(0);
  const [showNewRequestNotification, setShowNewRequestNotification] = useState(false);

  const loadCallRequests = () => {
    const currentUser = userDataManager.getCurrentUser();
    console.log('🔍 DEBUG - Current user:', currentUser);
    
    if (currentUser?.userType === 'alumni') {
      const requests = callRequestManager.getRequestsByAlumni(currentUser.userId);
      console.log('🔍 DEBUG - Alumni ID:', currentUser.userId);
      console.log('🔍 DEBUG - Call requests found:', requests);
      console.log('🔍 DEBUG - All call requests:', callRequestManager.getAllRequests());
      
      // Check for new requests
      if (requests.length > lastRequestCount && lastRequestCount > 0) {
        setShowNewRequestNotification(true);
        setTimeout(() => setShowNewRequestNotification(false), 5000); // Hide after 5 seconds
      }
      setLastRequestCount(requests.length);
      setCallRequests(requests);
    } else {
      console.log('🔍 DEBUG - No alumni user found or user type is not alumni');
      console.log('🔍 DEBUG - All call requests:', callRequestManager.getAllRequests());
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadCallRequests();
  }, []);

  // Refresh data every 2 seconds to show new requests in real-time
  useEffect(() => {
    const interval = setInterval(() => {
      loadCallRequests();
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleAcceptRequest = (requestId: string) => {
    const success = callRequestManager.updateRequestStatus(requestId, 'accepted');
    if (success) {
      setCallRequests(prev => 
        prev.map(req => 
          req.id === requestId 
            ? { ...req, status: 'accepted' as const }
            : req
        )
      );
      alert('Call request accepted! The student will be notified.');
    } else {
      alert('Error accepting request. Please try again.');
    }
  };

  const handleRejectRequest = (requestId: string) => {
    const success = callRequestManager.updateRequestStatus(requestId, 'rejected');
    if (success) {
      setCallRequests(prev => 
        prev.map(req => 
          req.id === requestId 
            ? { ...req, status: 'rejected' as const }
            : req
        )
      );
      alert('Call request rejected.');
    } else {
      alert('Error rejecting request. Please try again.');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'accepted': return <Check className="h-4 w-4" />;
      case 'rejected': return <X className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="w-8 h-8 border-4 border-vt-maroon border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const pendingRequests = callRequests.filter(req => req.status === 'pending');
  const acceptedRequests = callRequests.filter(req => req.status === 'accepted');
  const rejectedRequests = callRequests.filter(req => req.status === 'rejected');

  return (
    <div className="space-y-6">
      {/* New Request Notification */}
      {showNewRequestNotification && (
        <Card className="bg-green-50 border-green-200 animate-pulse">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-green-800">
              <MessageCircle className="h-5 w-5" />
              <span className="font-semibold">New call request received!</span>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-vt-maroon">Call Requests</h2>
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <Badge variant="outline" className="text-yellow-600">
              {pendingRequests.length} Pending
            </Badge>
            <Badge variant="outline" className="text-green-600">
              {acceptedRequests.length} Accepted
            </Badge>
            <Badge variant="outline" className="text-red-600">
              {rejectedRequests.length} Rejected
            </Badge>
          </div>
          <Button
            onClick={loadCallRequests}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Debug Information - Remove this after fixing */}
      <Card className="bg-yellow-50 border-yellow-200 mb-4">
        <CardContent className="pt-4">
          <h3 className="font-semibold text-yellow-800 mb-2">Debug Information</h3>
          <div className="text-sm text-yellow-700 space-y-1">
            <p><strong>Current User:</strong> {JSON.stringify(userDataManager.getCurrentUser())}</p>
            <p><strong>All Call Requests:</strong> {JSON.stringify(callRequestManager.getAllRequests())}</p>
            <p><strong>All Alumni Profiles:</strong> {JSON.stringify(alumniDataManager.getAllProfiles())}</p>
            <p><strong>Request Count:</strong> {callRequests.length} (Last: {lastRequestCount})</p>
          </div>
          <div className="mt-4">
            <Button
              onClick={() => {
                const currentUser = userDataManager.getCurrentUser();
                if (currentUser?.userType === 'alumni') {
                  // Create a test call request
                  const testRequest = callRequestManager.sendRequest(
                    'test-student-id',
                    currentUser.userId,
                    new Date().toISOString().split('T')[0],
                    'This is a test call request to verify the system is working!',
                    'https://meet.google.com/test'
                  );
                  console.log('Test request created:', testRequest);
                  loadCallRequests();
                }
              }}
              variant="outline"
              size="sm"
              className="text-yellow-700 border-yellow-300"
            >
              Create Test Request
            </Button>
          </div>
        </CardContent>
      </Card>

      {callRequests.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MessageCircle className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No Call Requests Yet</h3>
            <p className="text-gray-500 text-center">
              Students will send you call requests that you can accept or reject.
              <br />
              Check back later for new requests!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Pending Requests */}
          {pendingRequests.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-vt-maroon mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Pending Requests ({pendingRequests.length})
              </h3>
              <div className="grid gap-4">
                {pendingRequests.map((request) => {
                  const studentProfile = studentDataManager.getProfileById(request.studentId);
                  return (
                    <Card key={request.id} className="border-l-4 border-l-yellow-500">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={studentProfile?.profilePicture} />
                              <AvatarFallback className="bg-vt-orange text-white">
                                {studentProfile?.name?.charAt(0) || 'S'}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle className="text-lg">{studentProfile?.name || 'Unknown Student'}</CardTitle>
                              <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                                <div className="flex items-center gap-1">
                                  <GraduationCap className="h-4 w-4" />
                                  {studentProfile?.currentStanding} • {studentProfile?.majors?.join(', ')}
                                </div>
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-4 w-4" />
                                  Blacksburg, VA
                                </div>
                              </div>
                            </div>
                          </div>
                          <Badge className={getStatusColor(request.status)}>
                            {getStatusIcon(request.status)}
                            <span className="ml-1 capitalize">{request.status}</span>
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="h-4 w-4" />
                            <span>Preferred Date: {formatDate(request.date)}</span>
                          </div>
                          
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">What they want to discuss:</h4>
                            <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                              {request.description}
                            </p>
                          </div>

                          {request.meetingLink && (
                            <div className="flex items-center gap-2 text-sm">
                              <MessageCircle className="h-4 w-4 text-vt-maroon" />
                              <a 
                                href={request.meetingLink} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-vt-maroon hover:underline"
                              >
                                Meeting Link
                              </a>
                            </div>
                          )}

                          <div className="flex gap-2 pt-2">
                            <Button 
                              onClick={() => handleAcceptRequest(request.id)}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              <Check className="h-4 w-4 mr-2" />
                              Accept
                            </Button>
                            <Button 
                              onClick={() => handleRejectRequest(request.id)}
                              variant="outline"
                              className="border-red-300 text-red-600 hover:bg-red-50"
                            >
                              <X className="h-4 w-4 mr-2" />
                              Reject
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* Accepted Requests */}
          {acceptedRequests.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-vt-maroon mb-4 flex items-center gap-2">
                <Check className="h-5 w-5" />
                Accepted Requests ({acceptedRequests.length})
              </h3>
              <div className="grid gap-4">
                {acceptedRequests.map((request) => {
                  const studentProfile = studentDataManager.getProfileById(request.studentId);
                  return (
                    <Card key={request.id} className="border-l-4 border-l-green-500">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={studentProfile?.profilePicture} />
                              <AvatarFallback className="bg-vt-orange text-white">
                                {studentProfile?.name?.charAt(0) || 'S'}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle className="text-lg">{studentProfile?.name || 'Unknown Student'}</CardTitle>
                              <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                                <div className="flex items-center gap-1">
                                  <GraduationCap className="h-4 w-4" />
                                  {studentProfile?.currentStanding} • {studentProfile?.majors?.join(', ')}
                                </div>
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-4 w-4" />
                                  Blacksburg, VA
                                </div>
                              </div>
                            </div>
                          </div>
                          <Badge className={getStatusColor(request.status)}>
                            {getStatusIcon(request.status)}
                            <span className="ml-1 capitalize">{request.status}</span>
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="h-4 w-4" />
                            <span>Scheduled for: {formatDate(request.date)}</span>
                          </div>
                          
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Discussion topics:</h4>
                            <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                              {request.description}
                            </p>
                          </div>

                          {request.meetingLink && (
                            <div className="flex items-center gap-2 text-sm">
                              <MessageCircle className="h-4 w-4 text-vt-maroon" />
                              <a 
                                href={request.meetingLink} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-vt-maroon hover:underline"
                              >
                                Join Meeting
                              </a>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* Rejected Requests */}
          {rejectedRequests.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-vt-maroon mb-4 flex items-center gap-2">
                <X className="h-5 w-5" />
                Rejected Requests ({rejectedRequests.length})
              </h3>
              <div className="grid gap-4">
                {rejectedRequests.map((request) => {
                  const studentProfile = studentDataManager.getProfileById(request.studentId);
                  return (
                    <Card key={request.id} className="border-l-4 border-l-red-500 opacity-75">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={studentProfile?.profilePicture} />
                              <AvatarFallback className="bg-vt-orange text-white">
                                {studentProfile?.name?.charAt(0) || 'S'}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle className="text-lg">{studentProfile?.name || 'Unknown Student'}</CardTitle>
                              <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                                <div className="flex items-center gap-1">
                                  <GraduationCap className="h-4 w-4" />
                                  {studentProfile?.currentStanding} • {studentProfile?.majors?.join(', ')}
                                </div>
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-4 w-4" />
                                  Blacksburg, VA
                                </div>
                              </div>
                            </div>
                          </div>
                          <Badge className={getStatusColor(request.status)}>
                            {getStatusIcon(request.status)}
                            <span className="ml-1 capitalize">{request.status}</span>
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="h-4 w-4" />
                            <span>Requested for: {formatDate(request.date)}</span>
                          </div>
                          
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">What they wanted to discuss:</h4>
                            <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                              {request.description}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CallRequestManagement;
