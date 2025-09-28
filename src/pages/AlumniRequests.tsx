import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar, 
  Clock, 
  Check, 
  X, 
  MessageCircle,
  Eye,
  User,
  ArrowLeft
} from "lucide-react";
import { callRequestManager, userDataManager, CallRequest } from "@/lib/dataManager";

const AlumniRequests = () => {
  const navigate = useNavigate();
  const [callRequests, setCallRequests] = useState<CallRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCallRequests();
  }, []);

  const loadCallRequests = async () => {
    try {
      const currentUser = userDataManager.getCurrentUser();
      if (currentUser?.userType === 'alumni') {
        const requests = callRequestManager.getRequestsByAlumni(currentUser.userId);
        setCallRequests(requests);
      }
    } catch (error) {
      console.error('Error loading call requests:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptRequest = (requestId: string) => {
    try {
      callRequestManager.updateRequestStatus(requestId, 'accepted');
      loadCallRequests();
    } catch (error) {
      console.error('Error accepting request:', error);
    }
  };

  const handleDeclineRequest = (requestId: string) => {
    try {
      callRequestManager.updateRequestStatus(requestId, 'rejected');
      loadCallRequests();
    } catch (error) {
      console.error('Error declining request:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'declined':
        return 'bg-red-100 text-red-800';
      case 'proposed_time':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const pendingRequests = callRequests.filter(r => r.status === 'pending');
  const acceptedRequests = callRequests.filter(r => r.status === 'accepted');
  const declinedRequests = callRequests.filter(r => r.status === 'declined');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vt-maroon mx-auto mb-4"></div>
          <p className="text-gray-600">Loading requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => navigate('/alumni-dashboard')}
                variant="outline"
                size="sm"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <h1 className="text-2xl font-bold text-vt-maroon">Call Requests</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => navigate('/profile')}
                variant="outline"
                size="sm"
              >
                <Eye className="h-4 w-4 mr-2" />
                Profile View
              </Button>
              <Button
                onClick={() => navigate('/alumni-profile-edit')}
                variant="outline"
                size="sm"
              >
                <User className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="pending" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Pending ({pendingRequests.length})
            </TabsTrigger>
            <TabsTrigger value="accepted" className="flex items-center gap-2">
              <Check className="h-4 w-4" />
              Accepted ({acceptedRequests.length})
            </TabsTrigger>
            <TabsTrigger value="declined" className="flex items-center gap-2">
              <X className="h-4 w-4" />
              Declined ({declinedRequests.length})
            </TabsTrigger>
            <TabsTrigger value="all" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              All ({callRequests.length})
            </TabsTrigger>
          </TabsList>

          {/* Pending Requests */}
          <TabsContent value="pending" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Pending Call Requests
                </CardTitle>
              </CardHeader>
              <CardContent>
                {pendingRequests.length > 0 ? (
                  <div className="space-y-4">
                    {pendingRequests.map((request) => (
                      <div key={request.id} className="border rounded-lg p-6 bg-yellow-50 border-yellow-200">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-lg font-semibold text-vt-maroon">Student Call Request</h3>
                              <Badge className={getStatusColor(request.status)}>
                                {request.status}
                              </Badge>
                            </div>
                            <p className="text-gray-700 mb-4">{request.message}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>Requested: {new Date(request.createdAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <Button
                              onClick={() => handleAcceptRequest(request.id)}
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              <Check className="h-4 w-4 mr-2" />
                              Accept
                            </Button>
                            <Button
                              onClick={() => handleDeclineRequest(request.id)}
                              size="sm"
                              variant="outline"
                              className="text-red-600 hover:text-red-700 border-red-300"
                            >
                              <X className="h-4 w-4 mr-2" />
                              Decline
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No pending requests at the moment.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Accepted Requests */}
          <TabsContent value="accepted" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Check className="h-5 w-5" />
                  Accepted Call Requests
                </CardTitle>
              </CardHeader>
              <CardContent>
                {acceptedRequests.length > 0 ? (
                  <div className="space-y-4">
                    {acceptedRequests.map((request) => (
                      <div key={request.id} className="border rounded-lg p-6 bg-green-50 border-green-200">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-lg font-semibold text-vt-maroon">Scheduled Call</h3>
                              <Badge className={getStatusColor(request.status)}>
                                {request.status}
                              </Badge>
                            </div>
                            <p className="text-gray-700 mb-4">{request.message}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>Accepted: {new Date(request.updatedAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <Button
                              size="sm"
                              variant="outline"
                              className="gap-2"
                            >
                              <MessageCircle className="h-4 w-4" />
                              Message
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Check className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No accepted requests yet.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Declined Requests */}
          <TabsContent value="declined" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <X className="h-5 w-5" />
                  Declined Call Requests
                </CardTitle>
              </CardHeader>
              <CardContent>
                {declinedRequests.length > 0 ? (
                  <div className="space-y-4">
                    {declinedRequests.map((request) => (
                      <div key={request.id} className="border rounded-lg p-6 bg-red-50 border-red-200">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-lg font-semibold text-vt-maroon">Declined Call Request</h3>
                              <Badge className={getStatusColor(request.status)}>
                                {request.status}
                              </Badge>
                            </div>
                            <p className="text-gray-700 mb-4">{request.message}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>Declined: {new Date(request.updatedAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <X className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No declined requests.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* All Requests */}
          <TabsContent value="all" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  All Call Requests
                </CardTitle>
              </CardHeader>
              <CardContent>
                {callRequests.length > 0 ? (
                  <div className="space-y-4">
                    {callRequests.map((request) => (
                      <div key={request.id} className={`border rounded-lg p-6 ${
                        request.status === 'pending' ? 'bg-yellow-50 border-yellow-200' :
                        request.status === 'accepted' ? 'bg-green-50 border-green-200' :
                        'bg-red-50 border-red-200'
                      }`}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-lg font-semibold text-vt-maroon">Call Request</h3>
                              <Badge className={getStatusColor(request.status)}>
                                {request.status}
                              </Badge>
                            </div>
                            <p className="text-gray-700 mb-4">{request.message}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>Created: {new Date(request.createdAt).toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                <span>Updated: {new Date(request.updatedAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                          {request.status === 'pending' && (
                            <div className="flex gap-2 ml-4">
                              <Button
                                onClick={() => handleAcceptRequest(request.id)}
                                size="sm"
                                className="bg-green-600 hover:bg-green-700 text-white"
                              >
                                <Check className="h-4 w-4 mr-2" />
                                Accept
                              </Button>
                              <Button
                                onClick={() => handleDeclineRequest(request.id)}
                                size="sm"
                                variant="outline"
                                className="text-red-600 hover:text-red-700 border-red-300"
                              >
                                <X className="h-4 w-4 mr-2" />
                                Decline
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No call requests yet.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AlumniRequests;
