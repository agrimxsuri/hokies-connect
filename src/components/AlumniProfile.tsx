import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  MapPin, 
  Building, 
  GraduationCap, 
  Briefcase, 
  Award, 
  Calendar,
  Edit,
  Save,
  X,
  Plus,
  Link,
  Phone,
  Mail,
  Globe
} from "lucide-react";
import { alumniDataManager, userDataManager, type AlumniProfile, JourneyEntry, ProfessionalEntry } from "@/lib/dataManager";
import HokieJourney from "./HokieJourney";

const AlumniProfile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<AlumniProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    website: "",
    currentPosition: "",
    company: "",
    graduationYear: "",
    majors: [] as string[],
    profilePicture: ""
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const currentUser = userDataManager.getCurrentUser();
      if (currentUser?.userType === 'alumni') {
        const alumniProfile = alumniDataManager.getProfileById(currentUser.userId);
        if (alumniProfile) {
          setProfile(alumniProfile);
          setFormData({
            name: alumniProfile.name,
            email: "", // Not stored in current model
            phone: "", // Not stored in current model
            location: alumniProfile.location,
            linkedin: "", // Not stored in current model
            website: "", // Not stored in current model
            currentPosition: alumniProfile.currentPosition,
            company: alumniProfile.company,
            graduationYear: alumniProfile.graduationYear,
            majors: alumniProfile.majors,
            profilePicture: alumniProfile.profilePicture
          });
        }
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (!profile) return;

      const updatedProfile: AlumniProfile = {
        ...profile,
        name: formData.name,
        location: formData.location,
        currentPosition: formData.currentPosition,
        company: formData.company,
        graduationYear: formData.graduationYear,
        majors: formData.majors,
        profilePicture: formData.profilePicture
      };

      alumniDataManager.saveProfile(updatedProfile);
      setProfile(updatedProfile);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        name: profile.name,
        email: "",
        phone: "",
        location: profile.location,
        linkedin: "",
        website: "",
        currentPosition: profile.currentPosition,
        company: profile.company,
        graduationYear: profile.graduationYear,
        majors: profile.majors,
        profilePicture: profile.profilePicture
      });
    }
    setIsEditing(false);
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
                onClick={() => navigate('/alumni-dashboard')}
                className="bg-vt-maroon hover:bg-vt-maroon-light text-white"
              >
                Back to Dashboard
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
              <Button
                onClick={() => navigate('/alumni-dashboard')}
                variant="outline"
                size="sm"
              >
                ← Back to Dashboard
              </Button>
              <h1 className="text-2xl font-bold text-vt-maroon">Alumni Profile</h1>
            </div>
            <div className="flex items-center space-x-2">
              {isEditing ? (
                <>
                  <Button onClick={handleSave} size="sm" className="bg-vt-maroon hover:bg-vt-maroon-light text-white">
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                  <Button onClick={handleCancel} variant="outline" size="sm">
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
            <TabsTrigger value="hokie-journey">Hokie Journey</TabsTrigger>
            <TabsTrigger value="professional">Professional</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="volunteer">Volunteer</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start space-x-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={profile.profilePicture} />
                    <AvatarFallback className="bg-vt-maroon text-white text-2xl">
                      {profile.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    {isEditing ? (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Name</label>
                          <Input
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Full name"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">Current Position</label>
                            <Input
                              value={formData.currentPosition}
                              onChange={(e) => setFormData(prev => ({ ...prev, currentPosition: e.target.value }))}
                              placeholder="Job title"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">Company</label>
                            <Input
                              value={formData.company}
                              onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                              placeholder="Company name"
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h2 className="text-2xl font-bold text-vt-maroon">{profile.name}</h2>
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
                            <Badge key={index} variant="secondary">
                              {major}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contact Tab */}
          <TabsContent value="contact" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <Input
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="email@example.com"
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone</label>
                    <Input
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="(555) 123-4567"
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Location</label>
                    <Input
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="City, State"
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">LinkedIn</label>
                    <Input
                      value={formData.linkedin}
                      onChange={(e) => setFormData(prev => ({ ...prev, linkedin: e.target.value }))}
                      placeholder="linkedin.com/in/username"
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Website</label>
                    <Input
                      value={formData.website}
                      onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                      placeholder="https://yourwebsite.com"
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Hokie Journey Tab */}
          <TabsContent value="hokie-journey" className="space-y-6">
            <HokieJourney 
              profile={profile}
              onUpdate={loadProfile}
              editable={isEditing}
            />
          </TabsContent>

          {/* Professional Journey Tab */}
          <TabsContent value="professional" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Professional Journey</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {profile.professionalEntries.map((entry, index) => (
                    <div key={entry.id} className="border-l-4 border-vt-maroon pl-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-vt-maroon">{entry.position}</h3>
                          <div className="flex items-center gap-2 text-gray-600 mt-1">
                            <Building className="h-4 w-4" />
                            <span>{entry.company}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600 mt-1">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {new Date(entry.startDate).toLocaleDateString()} - 
                              {entry.endDate ? new Date(entry.endDate).toLocaleDateString() : 'Present'}
                            </span>
                          </div>
                          {entry.description && (
                            <p className="text-gray-600 mt-2">{entry.description}</p>
                          )}
                          {entry.achievements.length > 0 && (
                            <div className="mt-3">
                              <h4 className="text-sm font-medium text-gray-700 mb-2">Key Achievements</h4>
                              <ul className="text-sm text-gray-600 space-y-1">
                                {entry.achievements.map((achievement, i) => (
                                  <li key={i} className="flex items-center gap-2">
                                    <Award className="h-3 w-3 text-vt-orange" />
                                    {achievement}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Education Tab */}
          <TabsContent value="education" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Education</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-vt-maroon">Virginia Tech</h3>
                    <div className="flex items-center gap-2 text-gray-600 mt-1">
                      <GraduationCap className="h-4 w-4" />
                      <span>Class of {profile.graduationYear}</span>
                    </div>
                    <div className="mt-2">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Majors</h4>
                      <div className="flex flex-wrap gap-2">
                        {profile.majors.map((major, index) => (
                          <Badge key={index} variant="secondary">
                            {major}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Volunteer/Mentoring Tab */}
          <TabsContent value="volunteer" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Volunteer & Mentoring</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No volunteer activities recorded yet.</p>
                  {isEditing && (
                    <Button className="mt-4" variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Volunteer Activity
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AlumniProfile;
