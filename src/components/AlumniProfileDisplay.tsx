import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit, MapPin, Briefcase, Calendar, Award, Building } from "lucide-react";
import { alumniDataManager, AlumniProfile, JourneyEntry, ProfessionalEntry } from "@/lib/dataManager";


const AlumniProfileDisplay = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<AlumniProfile | null>(null);

  useEffect(() => {
    // Load profile using centralized data manager
    const savedProfile = alumniDataManager.getCurrentProfile();
    if (savedProfile) {
      setProfile(savedProfile);
    }
  }, []);

  if (!profile) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-600">No profile found</h3>
            <p className="text-gray-500">
              You haven't created your alumni profile yet. Create one to get started!
            </p>
            <Button 
              onClick={() => navigate('/alumni-profile')}
              className="bg-vt-maroon hover:bg-vt-maroon-dark text-white"
            >
              Create Profile
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatDate = (dateString: string) => {
    if (dateString === "Present") return "Present";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short' 
    });
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={profile.profilePicture} />
                <AvatarFallback className="bg-vt-maroon text-white text-xl">
                  {profile.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold text-vt-maroon">{profile.name}</h1>
                <div className="flex items-center gap-2 text-gray-600 mt-1">
                  <Building className="h-4 w-4" />
                  <span>{profile.currentPosition} at {profile.company}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 mt-1">
                  <MapPin className="h-4 w-4" />
                  <span>{profile.location}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 mt-1">
                  <Calendar className="h-4 w-4" />
                  <span>Class of {profile.graduationYear}</span>
                </div>
              </div>
            </div>
            <Button 
              onClick={() => navigate('/alumni-profile')}
              variant="outline"
              className="gap-2"
            >
              <Edit className="h-4 w-4" />
              Edit Profile
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Majors */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-vt-maroon">Majors</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {profile.majors.map((major, index) => (
              <Badge key={index} variant="secondary" className="text-sm px-3 py-1">
                {major}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Hokie Journey */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-vt-maroon">Hokie Journey</CardTitle>
          <p className="text-muted-foreground">Your complete Virginia Tech experience</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {profile.journeyEntries.map((entry) => (
              <div key={entry.id} className="border-l-4 border-vt-orange pl-4">
                <h3 className="text-lg font-semibold text-vt-maroon mb-3">{entry.year}</h3>
                
                {/* Courses */}
                {entry.courses.length > 0 && (
                  <div className="mb-3">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Courses</h4>
                    <div className="flex flex-wrap gap-1">
                      {entry.courses.map((course, index) => (
                        <Badge key={index} variant="default" className="bg-vt-maroon text-white text-xs">
                          {course}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* GPA */}
                {entry.gpa && (
                  <div className="mb-3">
                    <h4 className="text-sm font-medium text-gray-700 mb-1">GPA</h4>
                    <p className="text-sm text-gray-600">{entry.gpa}</p>
                  </div>
                )}

                {/* Clubs */}
                {entry.clubs.length > 0 && (
                  <div className="mb-3">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Clubs & Organizations</h4>
                    <div className="flex flex-wrap gap-1">
                      {entry.clubs.map((club, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {club}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Internships/Jobs */}
                {entry.internships.length > 0 && (
                  <div className="mb-3">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Internships & Jobs</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {entry.internships.map((internship, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="w-1 h-1 bg-vt-orange rounded-full"></div>
                          {internship}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Research/Projects */}
                {entry.research.length > 0 && (
                  <div className="mb-3">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Research & Projects</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {entry.research.map((project, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="w-1 h-1 bg-vt-orange rounded-full"></div>
                          {project}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Professional Journey */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-vt-maroon">Professional Journey</CardTitle>
          <p className="text-muted-foreground">Your career progression after Virginia Tech</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {profile.professionalEntries.map((entry, index) => (
              <div key={entry.id} className="border-l-4 border-vt-maroon pl-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-vt-maroon">{entry.position}</h3>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Briefcase className="h-4 w-4" />
                      <span>{entry.company}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 mt-1">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(entry.startDate)} - {formatDate(entry.endDate)}</span>
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-3">{entry.description}</p>
                
                {entry.achievements.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Key Achievements</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {entry.achievements.map((achievement, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <Award className="h-3 w-3 text-vt-orange" />
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AlumniProfileDisplay;
