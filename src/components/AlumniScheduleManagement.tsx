import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock, MapPin, Users, MessageCircle, Video, Phone, Star, GraduationCap } from "lucide-react";
import { callDataManager, studentDataManager, userDataManager } from "@/lib/dataManager";

interface ScheduledCall {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  student: {
    id: string;
    name: string;
    profilePicture: string;
    majors: string[];
    currentStanding: string;
    location: string;
    bio: string;
    interests: string[];
    gpa?: string;
    courses: string[];
    clubs: string[];
    internships: string[];
    research: string[];
  };
  meetingType: string;
  meetingLink?: string;
  notes?: string;
  status: "upcoming" | "completed" | "cancelled";
}

const AlumniScheduleManagement = () => {
  const [scheduledCalls, setScheduledCalls] = useState<ScheduledCall[]>([]);
  const [selectedCall, setSelectedCall] = useState<ScheduledCall | null>(null);

  useEffect(() => {
    // Load scheduled calls for current alumni
    const currentUser = userDataManager.getCurrentUser();
    if (currentUser?.userType === 'alumni') {
      const calls = callDataManager.getCallsByAlumni(currentUser.userId);
      
      // Convert calls to include student profile data
      const callsWithStudentData: ScheduledCall[] = calls.map(call => {
        const studentProfile = studentDataManager.getProfileById(call.studentId);
        
        return {
          id: call.id,
          date: call.date,
          startTime: call.startTime,
          endTime: call.endTime,
          student: {
            id: call.studentId,
            name: studentProfile?.name || "Unknown Student",
            profilePicture: studentProfile?.profilePicture || "",
            majors: studentProfile?.majors || [],
            currentStanding: studentProfile?.currentStanding || "Unknown",
            location: "Blacksburg, VA", // Default location
            bio: `Student interested in connecting with alumni for guidance and mentorship.`,
            interests: studentProfile?.journeyEntries?.flatMap(entry => entry.clubs) || [],
            gpa: studentProfile?.journeyEntries?.find(entry => entry.gpa)?.gpa || "",
            courses: studentProfile?.journeyEntries?.flatMap(entry => entry.courses) || [],
            clubs: studentProfile?.clubPositions || [],
            internships: studentProfile?.journeyEntries?.flatMap(entry => entry.internships) || [],
            research: studentProfile?.journeyEntries?.flatMap(entry => entry.research) || []
          },
          meetingType: call.meetingType,
          meetingLink: call.meetingLink,
          notes: call.notes,
          status: call.status as "upcoming" | "completed" | "cancelled"
        };
      });
      
      setScheduledCalls(callsWithStudentData);
    }
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const upcomingCalls = scheduledCalls.filter(call => call.status === "upcoming");
  const completedCalls = scheduledCalls.filter(call => call.status === "completed");

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-vt-maroon">Scheduled Calls</CardTitle>
          <p className="text-muted-foreground">
            Your upcoming and completed mentoring sessions with students
          </p>
        </CardHeader>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-vt-maroon" />
              <div>
                <p className="text-2xl font-bold">{scheduledCalls.length}</p>
                <p className="text-sm text-muted-foreground">Total Calls</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{upcomingCalls.length}</p>
                <p className="text-sm text-muted-foreground">Upcoming</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{completedCalls.length}</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Calls */}
      {upcomingCalls.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-vt-maroon">Upcoming Calls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingCalls.map((call) => (
                <div key={call.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={call.student.profilePicture} />
                        <AvatarFallback className="bg-vt-maroon text-white">
                          {call.student.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-lg font-semibold">{call.student.name}</h3>
                        <p className="text-sm text-gray-600">{call.student.currentStanding} • {call.student.majors.join(", ")}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-600">
                            {formatDate(call.date)} at {formatTime(call.startTime)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(call.status)}>
                        {call.status}
                      </Badge>
                      <Badge variant="outline">{call.meetingType}</Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Student Bio</h4>
                      <p className="text-sm text-gray-600 mb-3">{call.student.bio}</p>
                      
                      <div className="space-y-2">
                        <div>
                          <h5 className="text-sm font-medium text-gray-700">Interests</h5>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {call.student.interests.map((interest, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {interest}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        {call.student.gpa && (
                          <div>
                            <h5 className="text-sm font-medium text-gray-700">GPA</h5>
                            <p className="text-sm text-gray-600">{call.student.gpa}</p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Meeting Details</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Video className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">{call.meetingType}</span>
                        </div>
                        {call.meetingLink && (
                          <div className="flex items-center gap-2">
                            <MessageCircle className="h-4 w-4 text-gray-500" />
                            <a 
                              href={call.meetingLink} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:underline"
                            >
                              Join Meeting
                            </a>
                          </div>
                        )}
                        {call.notes && (
                          <div>
                            <h5 className="text-sm font-medium text-gray-700">Notes</h5>
                            <p className="text-sm text-gray-600">{call.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-4">
                    <Button 
                      onClick={() => setSelectedCall(call)}
                      variant="outline"
                      size="sm"
                    >
                      View Full Profile
                    </Button>
                    {call.meetingLink && (
                      <Button 
                        onClick={() => window.open(call.meetingLink, '_blank')}
                        className="bg-vt-maroon hover:bg-vt-maroon-dark text-white"
                        size="sm"
                      >
                        <Video className="h-4 w-4 mr-2" />
                        Join Call
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Completed Calls */}
      {completedCalls.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-vt-maroon">Completed Calls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {completedCalls.map((call) => (
                <div key={call.id} className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={call.student.profilePicture} />
                        <AvatarFallback className="bg-vt-maroon text-white">
                          {call.student.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{call.student.name}</h3>
                        <p className="text-sm text-gray-600">
                          {formatDate(call.date)} • {call.meetingType}
                        </p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(call.status)}>
                      {call.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {scheduledCalls.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No calls scheduled</h3>
            <p className="text-gray-500">
              You don't have any scheduled calls with students yet.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AlumniScheduleManagement;