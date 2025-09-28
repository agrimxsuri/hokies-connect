import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, MessageCircle, MapPin, Briefcase, Calendar, Award, Building, GraduationCap, Star, Users, BookOpen } from "lucide-react";
import { alumniData, AlumniProfile } from "@/data/alumniData";
import { alumniDataManager, studentDataManager, connectionDataManager, userDataManager } from "@/lib/dataManager";
import RequestCallModal from "./RequestCallModal";

const AlumniProfileView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [alumni, setAlumni] = useState<AlumniProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [isStudent, setIsStudent] = useState(false);

  useEffect(() => {
    if (id) {
      // First check static alumni data
      let foundAlumni = alumniData.find(a => a.id === id);
      
      // If not found in static data, check dynamic alumni profiles
      if (!foundAlumni) {
        const dynamicAlumni = alumniDataManager.getProfileById(id);
        if (dynamicAlumni) {
          // Convert dynamic alumni to static format
          foundAlumni = {
            id: dynamicAlumni.id,
            name: dynamicAlumni.name,
            major: dynamicAlumni.majors.join(', '),
            club: dynamicAlumni.journeyEntries?.[0]?.clubs?.join(', ') || 'Various clubs',
            field: dynamicAlumni.currentPosition || 'Professional',
            company: dynamicAlumni.company,
            graduationYear: dynamicAlumni.graduationYear,
            currentPosition: dynamicAlumni.currentPosition,
            location: dynamicAlumni.location,
            bio: `Virginia Tech ${dynamicAlumni.majors.join(' and ')} graduate working as ${dynamicAlumni.currentPosition} at ${dynamicAlumni.company}.`,
            interests: dynamicAlumni.professionalEntries?.map(entry => entry.position) || [dynamicAlumni.currentPosition],
            profilePicture: dynamicAlumni.profilePicture
          };
        }
      }
      
      if (foundAlumni) {
        setAlumni(foundAlumni);
      }
      setIsLoading(false);
    }
  }, [id]);

  // Check if current user is a student
  useEffect(() => {
    const currentUser = userDataManager.getCurrentUser();
    setIsStudent(currentUser?.userType === 'student');
  }, []);

  const handleConnect = () => {
    if (!alumni) return;
    
    try {
      const studentProfile = studentDataManager.getCurrentProfile();
      if (!studentProfile) {
        alert("Student profile not found. Please create your profile first.");
        return;
      }

      // Send connection request using centralized data manager
      console.log('🔍 DEBUG - Sending connection request with:', {
        studentId: studentProfile.id,
        alumniId: alumni.id,
        message: `Hi! I'm ${studentProfile.name}, a ${studentProfile.currentStanding} ${studentProfile.majors.join(' and ')} student. I'd love to connect and learn about your career path!`
      });
      
      const connectionRequest = connectionDataManager.sendRequest(
        studentProfile.id,
        alumni.id,
        `Hi! I'm ${studentProfile.name}, a ${studentProfile.currentStanding} ${studentProfile.majors.join(' and ')} student. I'd love to connect and learn about your career path!`
      );
      
      console.log('🔍 DEBUG - Connection request sent:', connectionRequest);
      console.log('🔍 DEBUG - All connection requests after sending:', connectionDataManager.getAllRequests());
      alert("Connection request sent! The alumni will be notified.");
    } catch (error) {
      console.error('Error sending connection request:', error);
      alert("Error sending connection request. Please try again.");
    }
  };

  const handleScheduleCall = () => {
    if (!alumni) return;
    setShowScheduleModal(true);
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-vt-maroon border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading alumni profile...</p>
        </div>
      </div>
    );
  }

  if (!alumni) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <GraduationCap className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-600 mb-2">Alumni Not Found</h2>
          <p className="text-gray-500 mb-4">The alumni profile you're looking for doesn't exist.</p>
          <Button onClick={handleBack} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button 
            onClick={handleBack}
            variant="ghost"
            className="mb-4 text-vt-maroon hover:text-vt-maroon-dark"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Matches
          </Button>
          
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={alumni.profilePicture} />
                <AvatarFallback className="bg-vt-maroon text-white text-2xl">
                  {alumni.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-4xl font-bold text-vt-maroon mb-2">{alumni.name}</h1>
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <GraduationCap className="h-5 w-5" />
                  <span className="text-lg">{alumni.major}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <Building className="h-5 w-5" />
                  <span>{alumni.currentPosition} at {alumni.company}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="h-5 w-5" />
                  <span>{alumni.location}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              {isStudent ? (
                <div className="flex gap-3">
                  <Button 
                    onClick={handleConnect}
                    variant="outline"
                    className="px-6 py-3"
                  >
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Connect
                  </Button>
                  <Button 
                    onClick={handleScheduleCall}
                    className="bg-vt-maroon hover:bg-vt-maroon-dark text-white px-6 py-3"
                  >
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Request Call
                  </Button>
                </div>
              ) : (
                <Button 
                  onClick={handleConnect}
                  className="bg-vt-maroon hover:bg-vt-maroon-dark text-white px-6 py-3"
                >
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Connect
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-vt-maroon">About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  {alumni.bio || `Meet ${alumni.name}, a ${alumni.major} graduate who has built a successful career in ${alumni.field}. With experience at ${alumni.company}, they bring valuable insights and expertise to help guide the next generation of Virginia Tech students.`}
                </p>
              </CardContent>
            </Card>

            {/* Career Journey */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-vt-maroon">Career Journey</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-vt-orange/20 rounded-full flex items-center justify-center">
                      <GraduationCap className="h-6 w-6 text-vt-orange" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Virginia Tech</h3>
                      <p className="text-gray-600">{alumni.major}</p>
                      <p className="text-sm text-gray-500">{alumni.graduationYear ? `Class of ${alumni.graduationYear}` : 'Virginia Tech Graduate'}</p>
                      {alumni.club && (
                        <div className="mt-2">
                          <Badge variant="outline" className="text-xs">
                            {alumni.club}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-400">
                    <div className="w-px h-8 bg-gray-300 ml-6"></div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-vt-maroon/20 rounded-full flex items-center justify-center">
                      <Briefcase className="h-6 w-6 text-vt-maroon" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{alumni.company}</h3>
                      <p className="text-gray-600">{alumni.currentPosition}</p>
                      <p className="text-sm text-gray-500">{alumni.field}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Interests & Expertise */}
            {alumni.interests && alumni.interests.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-vt-maroon">Interests & Expertise</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {alumni.interests.map((interest, index) => (
                      <Badge key={index} variant="secondary" className="px-3 py-1">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Why Connect */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-vt-maroon">Why Connect?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Star className="h-5 w-5 text-vt-orange mt-0.5" />
                    <div>
                      <h4 className="font-medium">Career Guidance</h4>
                      <p className="text-sm text-gray-600">Get insights into the {alumni.field} industry and career progression</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-vt-orange mt-0.5" />
                    <div>
                      <h4 className="font-medium">Network Building</h4>
                      <p className="text-sm text-gray-600">Connect with professionals in your field of interest</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <BookOpen className="h-5 w-5 text-vt-orange mt-0.5" />
                    <div>
                      <h4 className="font-medium">Academic Advice</h4>
                      <p className="text-sm text-gray-600">Learn about relevant courses, projects, and opportunities</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-vt-maroon">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Field</span>
                  <Badge variant="outline">{alumni.field}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Company</span>
                  <span className="text-sm font-medium">{alumni.company}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Location</span>
                  <span className="text-sm font-medium">{alumni.location}</span>
                </div>
                {alumni.graduationYear && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Graduation</span>
                    <span className="text-sm font-medium">{alumni.graduationYear}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Contact Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-vt-maroon">Get in Touch</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={handleConnect}
                  className="w-full bg-vt-maroon hover:bg-vt-maroon-dark text-white"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Send Connection Request
                </Button>
                {isStudent && (
                  <Button 
                    onClick={handleScheduleCall}
                    variant="outline" 
                    className="w-full"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Request a Call
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Similar Alumni */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-vt-maroon">Similar Alumni</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {(() => {
                    // Get all alumni (static + dynamic) for similar alumni suggestions
                    const allAlumni = [
                      ...alumniData,
                      ...alumniDataManager.getAllProfiles().map(dynamicAlumni => ({
                        id: dynamicAlumni.id,
                        name: dynamicAlumni.name,
                        major: dynamicAlumni.majors.join(', '),
                        field: dynamicAlumni.currentPosition || 'Professional',
                        company: dynamicAlumni.company,
                        profilePicture: dynamicAlumni.profilePicture
                      }))
                    ];
                    
                    return allAlumni
                      .filter(a => a.id !== alumni.id && (a.major === alumni.major || a.field === alumni.field))
                      .slice(0, 3)
                      .map(similarAlumni => (
                        <div 
                          key={similarAlumni.id}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                          onClick={() => navigate(`/alumni/${similarAlumni.id}`)}
                        >
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={similarAlumni.profilePicture} />
                            <AvatarFallback className="bg-vt-maroon text-white text-xs">
                              {similarAlumni.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{similarAlumni.name}</p>
                            <p className="text-xs text-gray-500 truncate">{similarAlumni.company}</p>
                          </div>
                        </div>
                      ));
                  })()}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Request Call Modal */}
      {alumni && (
        <RequestCallModal
          isOpen={showScheduleModal}
          onClose={() => setShowScheduleModal(false)}
          alumniId={alumni.id}
          alumniName={alumni.name}
          alumniCompany={alumni.company}
        />
      )}
    </div>
  );
};

export default AlumniProfileView;
