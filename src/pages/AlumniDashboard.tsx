import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, User, Building, MapPin, GraduationCap, Edit, Clock, Users } from "lucide-react";
import { userDataManager } from "@/lib/userDataManager";
import { alumniDataManager, AlumniProfile } from "@/lib/alumniDataManager";
import AlumniSchedule from "@/components/AlumniSchedule";
import CallRequestDebug from "@/components/CallRequestDebug";
import { useParams } from "react-router-dom";

const AlumniDashboard = () => {
  const [activeTab, setActiveTab] = useState("schedule");
  const [profile, setProfile] = useState<AlumniProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { userId: routeUserId } = useParams();

  useEffect(() => {
    loadProfile();
  }, [routeUserId]);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      
      // Prefer userId from route to survive refresh; fallback to in-memory user
      const effectiveUserId = routeUserId || userDataManager.getUserId();
      console.log('🔍 Loading alumni profile for userId:', effectiveUserId);
      if (!effectiveUserId) {
        setProfile(null);
        return;
      }
      const alumniProfile = await alumniDataManager.getProfileById(effectiveUserId);
      console.log('🔍 Found alumni profile:', alumniProfile);
      setProfile(alumniProfile);
    } catch (error) {
      console.error('Error loading alumni profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vt-maroon mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-vt-maroon mb-2">
            Alumni Dashboard
          </h1>
          <p className="text-lg text-gray-600">
            Manage your schedule and maintain your profile
          </p>
        </div>

        {/* Profile Summary Card */}
        {profile && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Welcome Back, {profile.name}
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
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {profile.currentPosition} at {profile.company}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{profile.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Class of {profile.graduationYear} • {profile.majors.join(', ')}
                      </span>
                    </div>
                  </div>
                </div>
                <Button 
                  onClick={() => window.location.href = '/alumni-profile'}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Edit Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="schedule" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Schedule
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
          </TabsList>

          {/* Schedule Tab */}
          <TabsContent value="schedule" className="space-y-6">
            <CallRequestDebug />
            <AlumniSchedule />
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            {profile ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl text-vt-maroon">Your Profile</CardTitle>
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

                    {/* Profile Information */}
                    <div className="flex-1 space-y-4">
                      <div>
                        <h3 className="text-2xl font-bold text-vt-maroon mb-2">{profile.name}</h3>
                        <p className="text-muted-foreground">Alumni at Virginia Tech</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold text-vt-maroon mb-2">Current Position</h4>
                          <p className="text-muted-foreground">{profile.currentPosition}</p>
                        </div>

                        <div>
                          <h4 className="font-semibold text-vt-maroon mb-2">Company</h4>
                          <p className="text-muted-foreground">{profile.company}</p>
                        </div>

                        <div>
                          <h4 className="font-semibold text-vt-maroon mb-2">Location</h4>
                          <p className="text-muted-foreground">{profile.location}</p>
                        </div>

                        <div>
                          <h4 className="font-semibold text-vt-maroon mb-2">Graduation Year</h4>
                          <p className="text-muted-foreground">Class of {profile.graduationYear}</p>
                        </div>

                        <div>
                          <h4 className="font-semibold text-vt-maroon mb-2">Major(s)</h4>
                          <div className="flex flex-wrap gap-1">
                            {profile.majors.map((major, index) => (
                              <Badge key={index} variant="secondary" className="bg-vt-maroon/10 text-vt-maroon">
                                {major}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {profile.contact.linkedin && (
                          <div>
                            <h4 className="font-semibold text-vt-maroon mb-2">LinkedIn</h4>
                            <a 
                              href={`https://${profile.contact.linkedin}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-vt-maroon hover:underline"
                            >
                              {profile.contact.linkedin}
                            </a>
                          </div>
                        )}
                      </div>

                      <div className="pt-4">
                        <Button 
                          onClick={() => window.location.href = '/alumni-profile'}
                          className="bg-vt-maroon hover:bg-vt-maroon-light text-white"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Profile
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="pt-6 text-center">
                  <User className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Profile Not Found</h3>
                  <p className="text-muted-foreground mb-4">
                    We couldn't find your profile. Please create one to get started.
                  </p>
                  <Button 
                    onClick={() => window.location.href = '/alumni-profile'}
                    className="bg-vt-maroon hover:bg-vt-maroon-light text-white"
                  >
                    Create Profile
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AlumniDashboard;