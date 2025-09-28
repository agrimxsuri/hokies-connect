import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GraduationCap, Calendar, MapPin, Award } from "lucide-react";

interface JourneyEntry {
  id: string;
  year: string;
  courses: string[];
  gpa: string;
  clubs: string[];
  internships: string[];
  research: string[];
}

interface StudentProfile {
  name: string;
  majors: string[];
  currentStanding: string;
  clubPositions: string[];
  minors: string[];
  profilePicture: string;
  journeyEntries: JourneyEntry[];
  createdAt: string;
}

const StudentProfileDisplay = () => {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load profile from localStorage
    const savedProfile = localStorage.getItem('studentProfile');
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="w-8 h-8 border-2 border-vt-maroon border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">No profile found. Please create your profile first.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={profile.profilePicture} />
              <AvatarFallback className="bg-vt-maroon text-white text-2xl">
                {profile.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-vt-maroon mb-2">{profile.name}</h2>
              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4" />
                  <span className="text-muted-foreground">Major(s): </span>
                  <div className="flex flex-wrap gap-1">
                    {profile.majors.map((major, index) => (
                      <Badge key={index} variant="secondary" className="bg-vt-maroon/10 text-vt-maroon">
                        {major}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span className="text-muted-foreground">Current Standing: {profile.currentStanding}</span>
                </div>
                {profile.clubPositions.length > 0 && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span className="text-muted-foreground">Club Positions: </span>
                    <div className="flex flex-wrap gap-1">
                      {profile.clubPositions.map((position, index) => (
                        <Badge key={index} variant="outline">
                          {position}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {profile.minors.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Minor(s): </span>
                    <div className="flex flex-wrap gap-1">
                      {profile.minors.map((minor, index) => (
                        <Badge key={index} variant="outline">
                          {minor}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <Badge variant="secondary" className="bg-vt-orange/10 text-vt-orange border-vt-orange/20">
                Current Student
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Hokie Journey */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-vt-maroon flex items-center gap-2">
            <Award className="h-6 w-6" />
            Hokie Journey
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {profile.journeyEntries.map((entry, index) => (
              <div key={entry.id} className="border-l-4 border-vt-maroon pl-6 pb-6 last:pb-0">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-vt-maroon text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-semibold text-vt-maroon">{entry.year} Year</h3>
                </div>
                
                {/* Courses */}
                {entry.courses.length > 0 && (
                  <div className="mb-4">
                    <h5 className="font-medium text-foreground mb-2">Courses:</h5>
                    <div className="flex flex-wrap gap-2">
                      {entry.courses.map((course, courseIndex) => (
                        course && (
                          <Badge key={courseIndex} variant="secondary" className="bg-vt-maroon/10 text-vt-maroon">
                            {course}
                          </Badge>
                        )
                      ))}
                    </div>
                  </div>
                )}

                {/* GPA */}
                {entry.gpa && (
                  <div className="mb-4">
                    <h5 className="font-medium text-foreground mb-1">GPA:</h5>
                    <p className="text-muted-foreground">{entry.gpa}</p>
                  </div>
                )}

                {/* Clubs */}
                {entry.clubs.length > 0 && (
                  <div className="mb-4">
                    <h5 className="font-medium text-foreground mb-2">Clubs:</h5>
                    <div className="flex flex-wrap gap-2">
                      {entry.clubs.map((club, clubIndex) => (
                        club && (
                          <Badge key={clubIndex} variant="outline">
                            {club}
                          </Badge>
                        )
                      ))}
                    </div>
                  </div>
                )}

                {/* Internships/Jobs */}
                {entry.internships.length > 0 && (
                  <div className="mb-4">
                    <h5 className="font-medium text-foreground mb-2">Internships/Jobs:</h5>
                    <ul className="space-y-1">
                      {entry.internships.map((internship, internshipIndex) => (
                        internship && (
                          <li key={internshipIndex} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <span className="text-vt-orange mt-1">•</span>
                            <span>{internship}</span>
                          </li>
                        )
                      ))}
                    </ul>
                  </div>
                )}

                {/* Research/Projects */}
                {entry.research.length > 0 && (
                  <div className="mb-4">
                    <h5 className="font-medium text-foreground mb-2">Research/Projects:</h5>
                    <ul className="space-y-1">
                      {entry.research.map((research, researchIndex) => (
                        research && (
                          <li key={researchIndex} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <span className="text-vt-orange mt-1">•</span>
                            <span>{research}</span>
                          </li>
                        )
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

export default StudentProfileDisplay;
