import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  Calendar, 
  MessageCircle, 
  Settings, 
  Bell, 
  Clock, 
  MapPin, 
  Building,
  GraduationCap,
  Plus,
  Eye,
  Check,
  X
} from "lucide-react";
import { alumniDataManager, callRequestManager, userDataManager } from "@/lib/dataManager";
import { AlumniProfile, CallRequest } from "@/lib/dataManager";

const AlumniDashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<AlumniProfile | null>(null);
  const [callRequests, setCallRequests] = useState<CallRequest[]>([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
    
    // Set up polling for new requests
    const interval = setInterval(loadCallRequests, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      // Load alumni profile
      const currentUser = userDataManager.getCurrentUser();
      if (currentUser?.userType === 'alumni') {
        const alumniProfile = alumniDataManager.getProfileById(currentUser.userId);
        setProfile(alumniProfile);
      }
      
      // Load call requests
      await loadCallRequests();
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadCallRequests = async () => {
    try {
      const currentUser = userDataManager.getCurrentUser();
      if (currentUser?.userType === 'alumni') {
        const requests = callRequestManager.getRequestsByAlumni(currentUser.userId);
        setCallRequests(requests);
        setPendingCount(requests.filter(r => r.status === 'pending').length);
      }
    } catch (error) {
      console.error('Error loading call requests:', error);
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vt-maroon mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="text-center py-12">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-600">No profile found</h3>
              <p className="text-gray-500">
                You need to create your alumni profile first.
              </p>
              <Button 
                onClick={() => navigate('/alumni-profile')}
                className="bg-vt-maroon hover:bg-vt-maroon-light text-white"
              >
                Create Profile
              </Button>
            </div>
          </CardContent>
        </Card>
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
              <h1 className="text-2xl font-bold text-vt-maroon">Alumni Dashboard</h1>
              {pendingCount > 0 && (
                <Badge variant="destructive" className="flex items-center gap-1">
                  <Bell className="h-3 w-3" />
                  {pendingCount} pending
                </Badge>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => navigate('/alumni-requests')}
                variant="outline"
                size="sm"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Requests
              </Button>
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
                    <h3 className="text-xl font-semibold text-vt-maroon">{profile.name}</h3>
                    <div className="flex items-center gap-2 text-gray-600 mt-1">
                      <Building className="h-4 w-4" />
                      <span>{profile.currentPosition} at {profile.company}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 mt-1">
                      <MapPin className="h-4 w-4" />
                      <span>{profile.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 mt-1">
                      <GraduationCap className="h-4 w-4" />
                      <span>Class of {profile.graduationYear}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {profile.majors.map((major, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {major}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Hokie Journey Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    Hokie Journey Preview
                  </span>
                  <Button
                    onClick={() => navigate('/alumni-profile')}
                    variant="outline"
                    size="sm"
                  >
                    View All
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {profile.journeyEntries.slice(0, 3).map((entry, index) => (
                    <div key={entry.id} className="border-l-4 border-vt-orange pl-4">
                      <h4 className="font-semibold text-vt-maroon">{entry.year}</h4>
                      <div className="text-sm text-gray-600 mt-1">
                        {entry.courses.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {entry.courses.slice(0, 3).map((course, i) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {course}
                              </Badge>
                            ))}
                            {entry.courses.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{entry.courses.length - 3} more
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Recent Requests & Messages */}
          <div className="space-y-6">
            {/* Recent Call Requests */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Recent Requests
                  {pendingCount > 0 && (
                    <Badge variant="destructive" className="ml-2">
                      {pendingCount}
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {callRequests.slice(0, 5).map((request) => (
                    <div key={request.id} className="border rounded-lg p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">Student Request</h4>
                          <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                            {request.description}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Clock className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-500">
                              {new Date(request.createdAt).toLocaleDateString()}
                            </span>
                            <Badge 
                              variant={request.status === 'pending' ? 'default' : 
                                     request.status === 'accepted' ? 'secondary' : 'destructive'}
                              className="text-xs"
                            >
                              {request.status}
                            </Badge>
                          </div>
                        </div>
                        {request.status === 'pending' && (
                          <div className="flex gap-1 ml-2">
                            <Button
                              onClick={() => handleAcceptRequest(request.id)}
                              size="sm"
                              variant="outline"
                              className="h-6 w-6 p-0 text-green-600 hover:text-green-700"
                            >
                              <Check className="h-3 w-3" />
                            </Button>
                            <Button
                              onClick={() => handleDeclineRequest(request.id)}
                              size="sm"
                              variant="outline"
                              className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {callRequests.length === 0 && (
                    <div className="text-center py-4 text-gray-500">
                      <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No requests yet</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Messages */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Messages
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4 text-gray-500">
                  <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No messages yet</p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  onClick={() => navigate('/alumni-requests')}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Requests
                </Button>
                <Button
                  onClick={() => navigate('/profile')}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Profile View
                </Button>
                <Button
                  onClick={() => navigate('/alumni-profile-edit')}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <User className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
                <Button
                  onClick={() => navigate('/call-requests')}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  View All Requests
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlumniDashboard;
