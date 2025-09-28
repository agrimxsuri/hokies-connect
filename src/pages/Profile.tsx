import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  Edit, 
  User, 
  Calendar, 
  Eye, 
  ArrowLeft,
  GraduationCap,
  Briefcase,
  Building,
  MapPin,
  ChevronDown,
  Award
} from "lucide-react";
import { alumniDataManager, userDataManager, AlumniProfile } from "@/lib/dataManager";
import TimelineComponent from "@/components/TimelineComponent";

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<AlumniProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hokieJourneyCollapsed, setHokieJourneyCollapsed] = useState(false);
  const [professionalJourneyCollapsed, setProfessionalJourneyCollapsed] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const currentUser = userDataManager.getCurrentUser();
      if (currentUser?.userType === 'alumni') {
        const alumniProfile = alumniDataManager.getProfileById(currentUser.userId);
        setProfile(alumniProfile);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditProfile = () => {
    navigate("/alumni-profile-edit");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vt-maroon mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
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

  // Convert journey entries to timeline format for display
  const timelineEntries = profile.journeyEntries.map(entry => ({
    year: entry.year,
    title: `${entry.year} Year`,
    description: `Academic year with ${entry.courses.length} courses, ${entry.clubs.length} clubs, ${entry.internships.length} internships`,
    type: "education" as const,
    details: [
      ...entry.courses.slice(0, 3),
      ...entry.clubs.slice(0, 2),
      ...entry.internships.slice(0, 2)
    ].filter(Boolean)
  }));

  // Convert professional entries to timeline format
  const professionalTimelineEntries = profile.professionalEntries.map(entry => ({
    year: new Date(entry.startDate).getFullYear().toString(),
    title: entry.position,
    description: entry.description || `Worked at ${entry.company}`,
    type: "work" as const,
    details: entry.achievements
  }));

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
              <h1 className="text-2xl font-bold text-vt-maroon">Profile View</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => navigate('/schedule')}
                variant="outline"
                size="sm"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Schedule
              </Button>
              <Button
                onClick={handleEditProfile}
                variant="outline"
                size="sm"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <Card className="mb-8">
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
                  <h2 className="text-3xl font-bold text-vt-maroon">{profile.name}</h2>
                  <div className="flex items-center gap-2 text-gray-600 mt-2">
                    <Briefcase className="h-4 w-4" />
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
                  <div className="flex flex-wrap gap-2 mt-3">
                    {profile.majors.map((major, index) => (
                      <Badge key={index} variant="secondary" className="bg-vt-maroon/10 text-vt-maroon">
                        {major}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Hokie Journey Section */}
        <Card className="mb-8">
          <Collapsible open={!hokieJourneyCollapsed} onOpenChange={setHokieJourneyCollapsed}>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl text-vt-maroon flex items-center gap-2">
                    <GraduationCap className="h-6 w-6" />
                    Hokie Journey
                  </CardTitle>
                  <ChevronDown className={`h-5 w-5 transition-transform ${hokieJourneyCollapsed ? 'rotate-180' : ''}`} />
                </div>
                <p className="text-muted-foreground">
                  Your experiences and achievements from your time at Virginia Tech
                </p>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent>
                {timelineEntries.length > 0 ? (
                  <TimelineComponent entries={timelineEntries} />
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <GraduationCap className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No journey entries yet.</p>
                  </div>
                )}
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Professional Journey Section */}
        <Card className="mb-8">
          <Collapsible open={!professionalJourneyCollapsed} onOpenChange={setProfessionalJourneyCollapsed}>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl text-vt-maroon flex items-center gap-2">
                    <Briefcase className="h-6 w-6" />
                    Professional Journey
                  </CardTitle>
                  <ChevronDown className={`h-5 w-5 transition-transform ${professionalJourneyCollapsed ? 'rotate-180' : ''}`} />
                </div>
                <p className="text-muted-foreground">
                  Your work history, positions, companies, and achievements
                </p>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent>
                {professionalTimelineEntries.length > 0 ? (
                  <TimelineComponent entries={professionalTimelineEntries} />
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No professional experience recorded yet.</p>
                  </div>
                )}
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
