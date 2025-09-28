import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { 
  Calendar, 
  Clock, 
  User, 
  MessageCircle, 
  Check, 
  X, 
  Eye,
  CalendarDays,
  MapPin,
  GraduationCap,
  Building
} from "lucide-react";
import { callRequestManager, studentDataManager, userDataManager, CallRequest } from "@/lib/dataManager";

const CallRequestsPanel = () => {
  const [callRequests, setCallRequests] = useState<CallRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<CallRequest[]>([]);
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'accepted' | 'rejected'>('all');
  const [selectedRequest, setSelectedRequest] = useState<CallRequest | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [responseMessage, setResponseMessage] = useState('');

  useEffect(() => {
    loadCallRequests();
    
    // Set up polling for new requests
    const interval = setInterval(loadCallRequests, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    filterRequests();
  }, [callRequests, activeFilter]);

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

  const filterRequests = () => {
    if (activeFilter === 'all') {
      setFilteredRequests(callRequests);
    } else {
      setFilteredRequests(callRequests.filter(req => req.status === activeFilter));
    }
  };

  const handleAcceptRequest = async (requestId: string) => {
    try {
      callRequestManager.updateRequestStatus(requestId, 'accepted');
      await loadCallRequests();
    } catch (error) {
      console.error('Error accepting request:', error);
    }
  };

  const handleDeclineRequest = async (requestId: string) => {
    try {
      callRequestManager.updateRequestStatus(requestId, 'rejected');
      await loadCallRequests();
    } catch (error) {
      console.error('Error declining request:', error);
    }
  };

  const handleProposeTime = async (requestId: string) => {
    try {
      // This would open a scheduling modal or redirect to scheduling
      console.log('Proposing time for request:', requestId);
      // For now, just mark as accepted
      callRequestManager.updateRequestStatus(requestId, 'accepted');
      await loadCallRequests();
    } catch (error) {
      console.error('Error proposing time:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStudentInfo = (studentId: string) => {
    // This would normally fetch from the student data manager
    // For now, return mock data
    return {
      name: `Student ${studentId.slice(-4)}`,
      major: 'Computer Science',
      year: 'Junior',
      profilePicture: ''
    };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-vt-maroon mx-auto mb-4"></div>
          <p className="text-gray-600">Loading requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-vt-maroon">Call Requests</h2>
        <Badge variant="outline" className="text-sm">
          {callRequests.filter(req => req.status === 'pending').length} pending
        </Badge>
      </div>

      {/* Filter Tabs */}
      <Tabs value={activeFilter} onValueChange={(value) => setActiveFilter(value as any)}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All ({callRequests.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({callRequests.filter(req => req.status === 'pending').length})</TabsTrigger>
          <TabsTrigger value="accepted">Accepted ({callRequests.filter(req => req.status === 'accepted').length})</TabsTrigger>
          <TabsTrigger value="rejected">Declined ({callRequests.filter(req => req.status === 'rejected').length})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeFilter} className="mt-6">
          <div className="space-y-4">
            {filteredRequests.map((request) => {
              const studentInfo = getStudentInfo(request.studentId);
              
              return (
                <Card key={request.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={studentInfo.profilePicture} />
                          <AvatarFallback className="bg-vt-orange text-white">
                            {studentInfo.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg">{studentInfo.name}</h3>
                            <Badge className={getStatusColor(request.status)}>
                              {request.status}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                            <div className="flex items-center gap-1">
                              <GraduationCap className="h-4 w-4" />
                              <span>{studentInfo.major}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>{studentInfo.year}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>{new Date(request.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                          
                          <p className="text-gray-700 mb-4 line-clamp-2">
                            {request.description}
                          </p>
                          
                          {request.meetingLink && (
                            <div className="flex items-center gap-2 text-sm text-blue-600 mb-4">
                              <CalendarDays className="h-4 w-4" />
                              <span>Meeting Link: {request.meetingLink}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedRequest(request)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Call Request Details</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="flex items-center space-x-4">
                                <Avatar className="h-16 w-16">
                                  <AvatarImage src={studentInfo.profilePicture} />
                                  <AvatarFallback className="bg-vt-orange text-white text-lg">
                                    {studentInfo.name.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <h3 className="text-xl font-semibold">{studentInfo.name}</h3>
                                  <p className="text-gray-600">{studentInfo.major} • {studentInfo.year}</p>
                                </div>
                              </div>
                              
                              <div>
                                <h4 className="font-medium mb-2">Request Message</h4>
                                <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                                  {request.description}
                                </p>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <h4 className="font-medium mb-2">Requested Date</h4>
                                  <p className="text-gray-600">{request.date}</p>
                                </div>
                                <div>
                                  <h4 className="font-medium mb-2">Status</h4>
                                  <Badge className={getStatusColor(request.status)}>
                                    {request.status}
                                  </Badge>
                                </div>
                              </div>
                              
                              {request.meetingLink && (
                                <div>
                                  <h4 className="font-medium mb-2">Meeting Link</h4>
                                  <p className="text-blue-600 break-all">{request.meetingLink}</p>
                                </div>
                              )}
                              
                              {request.status === 'pending' && (
                                <div className="flex gap-2 pt-4 border-t">
                                  <Button
                                    onClick={() => {
                                      handleAcceptRequest(request.id);
                                      setIsViewModalOpen(false);
                                    }}
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                  >
                                    <Check className="h-4 w-4 mr-2" />
                                    Accept
                                  </Button>
                                  <Button
                                    onClick={() => {
                                      handleProposeTime(request.id);
                                      setIsViewModalOpen(false);
                                    }}
                                    variant="outline"
                                  >
                                    <CalendarDays className="h-4 w-4 mr-2" />
                                    Propose Time
                                  </Button>
                                  <Button
                                    onClick={() => {
                                      handleDeclineRequest(request.id);
                                      setIsViewModalOpen(false);
                                    }}
                                    variant="outline"
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    <X className="h-4 w-4 mr-2" />
                                    Decline
                                  </Button>
                                </div>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>
                        
                        {request.status === 'pending' && (
                          <>
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
                              className="text-red-600 hover:text-red-700"
                            >
                              <X className="h-4 w-4 mr-2" />
                              Decline
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            
            {filteredRequests.length === 0 && (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">
                  No {activeFilter === 'all' ? '' : activeFilter} requests
                </h3>
                <p className="text-gray-500">
                  {activeFilter === 'pending' 
                    ? 'You have no pending call requests at the moment.'
                    : `No ${activeFilter} call requests found.`
                  }
                </p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CallRequestsPanel;
