import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { GraduationCap, Camera, Plus, Trash2, Save, X, ChevronDown, Briefcase, Building, MapPin } from "lucide-react";
import { userDataManager } from "@/lib/userDataManager";
import { alumniDataManager, AlumniProfile } from "@/lib/alumniDataManager";
import { JourneyEntry, ProfessionalEntry } from "@/lib/dataManager";
import { upsertProfile as saveToSupabase } from "@/lib/api/alumniAPI";
import { generateAllMatches, saveMatches } from "@/lib/matching";
import TimelineComponent from "@/components/TimelineComponent";

const AlumniProfilePage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [profileData, setProfileData] = useState({
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
    profilePicture: "",
  });

  const [newMajor, setNewMajor] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [hokieJourneyCollapsed, setHokieJourneyCollapsed] = useState(false);
  const [professionalJourneyCollapsed, setProfessionalJourneyCollapsed] = useState(false);

  const availableMajors = [
    "Computer Science",
    "Computer Engineering", 
    "Mechanical Engineering",
    "Electrical Engineering",
    "Industrial Engineering",
    "Civil Engineering",
    "Statistics",
    "CMDA",
    "Finance",
    "BIT",
    "Economics",
    "Management",
    "Cybersecurity"
  ];

  const [journeyEntries, setJourneyEntries] = useState<JourneyEntry[]>([]);
  const [professionalEntries, setProfessionalEntries] = useState<ProfessionalEntry[]>([]);

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileData(prev => ({ ...prev, profilePicture: e.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addMajor = () => {
    if (newMajor.trim() && !profileData.majors.includes(newMajor.trim())) {
      setProfileData(prev => ({
        ...prev,
        majors: [...prev.majors, newMajor.trim()]
      }));
      setNewMajor("");
    }
  };

  const removeMajor = (index: number) => {
    setProfileData(prev => ({
      ...prev,
      majors: prev.majors.filter((_, i) => i !== index)
    }));
  };

  const addJourneyEntry = () => {
    const newEntry: JourneyEntry = {
      id: Date.now().toString(),
      year: "",
      courses: [],
      gpa: "",
      clubs: [],
      internships: [],
      research: []
    };
    setJourneyEntries(prev => [...prev, newEntry]);
  };

  const updateJourneyEntry = (id: string, field: string, value: string) => {
    setJourneyEntries(prev =>
      prev.map(entry =>
        entry.id === id ? { ...entry, [field]: value } : entry
      )
    );
  };

  const addArrayItem = (journeyId: string, field: string) => {
    setJourneyEntries(prev =>
      prev.map(entry =>
        entry.id === journeyId
          ? { ...entry, [field]: [...(entry[field as keyof JourneyEntry] as string[]), ""] }
          : entry
      )
    );
  };

  const updateArrayItem = (journeyId: string, field: string, itemIndex: number, value: string) => {
    setJourneyEntries(prev =>
      prev.map(entry =>
        entry.id === journeyId
          ? {
              ...entry,
              [field]: (entry[field as keyof JourneyEntry] as string[]).map((item, index) =>
                index === itemIndex ? value : item
              )
            }
          : entry
      )
    );
  };

  const removeArrayItem = (journeyId: string, field: string, itemIndex: number) => {
    setJourneyEntries(prev =>
      prev.map(entry =>
        entry.id === journeyId
          ? {
              ...entry,
              [field]: (entry[field as keyof JourneyEntry] as string[]).filter((_, index) => index !== itemIndex)
            }
          : entry
      )
    );
  };

  const removeJourneyEntry = (id: string) => {
    setJourneyEntries(prev => prev.filter(entry => entry.id !== id));
  };

  const addProfessionalEntry = () => {
    const newEntry: ProfessionalEntry = {
      id: Date.now().toString(),
      position: "",
      company: "",
      startDate: "",
      endDate: "",
      description: "",
      achievements: []
    };
    setProfessionalEntries(prev => [...prev, newEntry]);
  };

  const updateProfessionalEntry = (id: string, field: string, value: string) => {
    setProfessionalEntries(prev =>
      prev.map(entry =>
        entry.id === id ? { ...entry, [field]: value } : entry
      )
    );
  };

  const addAchievement = (professionalId: string) => {
    setProfessionalEntries(prev =>
      prev.map(entry =>
        entry.id === professionalId
          ? { ...entry, achievements: [...entry.achievements, ""] }
          : entry
      )
    );
  };

  const updateAchievement = (professionalId: string, achievementIndex: number, value: string) => {
    setProfessionalEntries(prev =>
      prev.map(entry =>
        entry.id === professionalId
          ? {
              ...entry,
              achievements: entry.achievements.map((achievement, index) =>
                index === achievementIndex ? value : achievement
              )
            }
          : entry
      )
    );
  };

  const removeAchievement = (professionalId: string, achievementIndex: number) => {
    setProfessionalEntries(prev =>
      prev.map(entry =>
        entry.id === professionalId
          ? {
              ...entry,
              achievements: entry.achievements.filter((_, index) => index !== achievementIndex)
            }
          : entry
      )
    );
  };

  const removeProfessionalEntry = (id: string) => {
    setProfessionalEntries(prev => prev.filter(entry => entry.id !== id));
  };

  const handleSaveProfile = async () => {
    if (!isFormValid) return;
    
    setIsSaving(true);
    
    try {
      // Create the alumni profile object for Supabase
      const alumniProfileData = {
        name: profileData.name,
        email: profileData.email,
        phone: profileData.phone,
        location: profileData.location,
        linkedin: profileData.linkedin,
        website: profileData.website,
        graduationYear: profileData.graduationYear,
        currentPosition: profileData.currentPosition,
        company: profileData.company,
        majors: profileData.majors,
        profilePicture: profileData.profilePicture,
        journeyEntries: journeyEntries,
        professionalEntries: professionalEntries
      };
      
      // Save profile to Supabase
      const savedProfile = await saveToSupabase(alumniProfileData);
      console.log('✅ Profile saved to Supabase:', savedProfile);
      
      // Set current user immediately
      userDataManager.setCurrentUser(savedProfile.user_id, 'alumni');
      console.log('✅ User set in memory');
      
      // Show success message and redirect
      alert('Profile saved successfully! Redirecting to dashboard...');
      console.log('✅ Redirecting to alumni dashboard');
      navigate("/alumni-dashboard");
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Error saving profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const isFormValid = profileData.name && profileData.majors.length > 0 && profileData.graduationYear && profileData.currentPosition && profileData.company;

  // Convert journey entries to timeline format for display
  const timelineEntries = journeyEntries.map(entry => ({
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-vt-maroon to-vt-orange text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-4">
            <GraduationCap className="h-8 w-8" />
            <h1 className="text-3xl font-bold">Create Your Alumni Profile</h1>
          </div>
          <p className="text-white/90">
            Help us understand your journey so we can connect you with students
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Profile Header Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-vt-maroon">Profile Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-8">
              {/* Profile Picture */}
              <div className="flex flex-col items-center">
                <Avatar className="h-32 w-32 mb-4 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  <AvatarImage src={profileData.profilePicture} />
                  <AvatarFallback className="bg-vt-maroon text-white text-2xl">
                    {profileData.name ? profileData.name.charAt(0).toUpperCase() : "?"}
                  </AvatarFallback>
                </Avatar>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-2"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera className="h-4 w-4" />
                  {profileData.profilePicture ? "Change Photo" : "Upload Photo"}
                </Button>
              </div>

              {/* Basic Information */}
              <div className="flex-1 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Full Name *
                  </label>
                  <Input
                    value={profileData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter your full name"
                    className="text-lg"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Graduation Year *
                    </label>
                    <Input
                      value={profileData.graduationYear}
                      onChange={(e) => handleInputChange("graduationYear", e.target.value)}
                      placeholder="e.g., 2020"
                      type="number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Current Position *
                    </label>
                    <Input
                      value={profileData.currentPosition}
                      onChange={(e) => handleInputChange("currentPosition", e.target.value)}
                      placeholder="e.g., Senior Software Engineer"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Company *
                  </label>
                  <Input
                    value={profileData.company}
                    onChange={(e) => handleInputChange("company", e.target.value)}
                    placeholder="e.g., Microsoft"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Location
                  </label>
                  <Input
                    value={profileData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    placeholder="e.g., Seattle, WA"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Major(s) *
                  </label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={newMajor}
                      onChange={(e) => setNewMajor(e.target.value)}
                      placeholder="e.g., Computer Science"
                      onKeyPress={(e) => e.key === 'Enter' && addMajor()}
                    />
                    <Button type="button" onClick={addMajor} size="sm" className="gap-2">
                      <Plus className="h-4 w-4" />
                      Add
                    </Button>
                  </div>
                  {profileData.majors.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {profileData.majors.map((major, index) => (
                        <Badge key={index} variant="secondary" className="bg-vt-maroon/10 text-vt-maroon gap-1">
                          {major}
                          <X 
                            className="h-3 w-3 cursor-pointer" 
                            onClick={() => removeMajor(index)}
                          />
                        </Badge>
                      ))}
                    </div>
                  )}
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
                  Share your experiences and achievements from your time at Virginia Tech
                </p>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent>
                <div className="space-y-6">
                  {journeyEntries.length > 0 && (
                    <div className="mb-6">
                      <TimelineComponent entries={timelineEntries} />
                    </div>
                  )}
                  
                  {journeyEntries.map((entry, index) => (
                    <div key={entry.id} className="border rounded-lg p-6 bg-muted/30">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="bg-vt-maroon text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <Input
                            value={entry.year}
                            onChange={(e) => updateJourneyEntry(entry.id, "year", e.target.value)}
                            placeholder="e.g., 2018-2019"
                            className="text-lg font-semibold"
                          />
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeJourneyEntry(entry.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="space-y-4">
                        {/* Courses */}
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            Courses
                          </label>
                          <div className="space-y-2">
                            {entry.courses.map((course, courseIndex) => (
                              <div key={courseIndex} className="flex gap-2">
                                <Input
                                  value={course}
                                  onChange={(e) => updateArrayItem(entry.id, "courses", courseIndex, e.target.value)}
                                  placeholder="e.g., CS 2114 - Software Design and Data Structures"
                                />
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => removeArrayItem(entry.id, "courses", courseIndex)}
                                  className="text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => addArrayItem(entry.id, "courses")}
                              className="gap-2"
                            >
                              <Plus className="h-4 w-4" />
                              Add Course
                            </Button>
                          </div>
                        </div>

                        {/* Clubs */}
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            Clubs & Organizations
                          </label>
                          <div className="space-y-2">
                            {entry.clubs.map((club, clubIndex) => (
                              <div key={clubIndex} className="flex gap-2">
                                <Input
                                  value={club}
                                  onChange={(e) => updateArrayItem(entry.id, "clubs", clubIndex, e.target.value)}
                                  placeholder="e.g., ACM, IEEE, Hokie Ambassadors"
                                />
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => removeArrayItem(entry.id, "clubs", clubIndex)}
                                  className="text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => addArrayItem(entry.id, "clubs")}
                              className="gap-2"
                            >
                              <Plus className="h-4 w-4" />
                              Add Club
                            </Button>
                          </div>
                        </div>

                        {/* Internships/Jobs */}
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            Internships/Jobs
                          </label>
                          <div className="space-y-2">
                            {entry.internships.map((internship, internshipIndex) => (
                              <div key={internshipIndex} className="flex gap-2">
                                <Input
                                  value={internship}
                                  onChange={(e) => updateArrayItem(entry.id, "internships", internshipIndex, e.target.value)}
                                  placeholder="e.g., Software Engineering Intern at Google"
                                />
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => removeArrayItem(entry.id, "internships", internshipIndex)}
                                  className="text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => addArrayItem(entry.id, "internships")}
                              className="gap-2"
                            >
                              <Plus className="h-4 w-4" />
                              Add Internship/Job
                            </Button>
                          </div>
                        </div>

                        {/* Research/Projects */}
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            Research/Projects
                          </label>
                          <div className="space-y-2">
                            {entry.research.map((research, researchIndex) => (
                              <div key={researchIndex} className="flex gap-2">
                                <Input
                                  value={research}
                                  onChange={(e) => updateArrayItem(entry.id, "research", researchIndex, e.target.value)}
                                  placeholder="e.g., Machine Learning Research with Dr. Smith"
                                />
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => removeArrayItem(entry.id, "research", researchIndex)}
                                  className="text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => addArrayItem(entry.id, "research")}
                              className="gap-2"
                            >
                              <Plus className="h-4 w-4" />
                              Add Research/Project
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  <Button
                    onClick={addJourneyEntry}
                    variant="outline"
                    className="w-full gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Academic Year
                  </Button>
                </div>
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
                  Share your work history, positions, companies, and achievements
                </p>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent>
                <div className="space-y-6">
                  {professionalEntries.map((entry, index) => (
                    <div key={entry.id} className="border rounded-lg p-6 bg-muted/30">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="bg-vt-orange text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-vt-maroon">Professional Experience</h3>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeProfessionalEntry(entry.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                              Position *
                            </label>
                            <Input
                              value={entry.position}
                              onChange={(e) => updateProfessionalEntry(entry.id, "position", e.target.value)}
                              placeholder="e.g., Senior Software Engineer"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                              Company *
                            </label>
                            <Input
                              value={entry.company}
                              onChange={(e) => updateProfessionalEntry(entry.id, "company", e.target.value)}
                              placeholder="e.g., Microsoft"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                              Start Date *
                            </label>
                            <Input
                              type="date"
                              value={entry.startDate}
                              onChange={(e) => updateProfessionalEntry(entry.id, "startDate", e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                              End Date
                            </label>
                            <Input
                              type="date"
                              value={entry.endDate}
                              onChange={(e) => updateProfessionalEntry(entry.id, "endDate", e.target.value)}
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            Description
                          </label>
                          <Textarea
                            value={entry.description}
                            onChange={(e) => updateProfessionalEntry(entry.id, "description", e.target.value)}
                            placeholder="Describe your role and responsibilities..."
                            rows={3}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            Key Achievements
                          </label>
                          <div className="space-y-2">
                            {entry.achievements.map((achievement, achievementIndex) => (
                              <div key={achievementIndex} className="flex gap-2">
                                <Input
                                  value={achievement}
                                  onChange={(e) => updateAchievement(entry.id, achievementIndex, e.target.value)}
                                  placeholder="e.g., Led team of 5 engineers to deliver major feature"
                                />
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => removeAchievement(entry.id, achievementIndex)}
                                  className="text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => addAchievement(entry.id)}
                              className="gap-2"
                            >
                              <Plus className="h-4 w-4" />
                              Add Achievement
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  <Button
                    onClick={addProfessionalEntry}
                    variant="outline"
                    className="w-full gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Professional Experience
                  </Button>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end gap-4">
          <Button
            variant="outline"
            onClick={() => navigate("/user-type")}
            className="px-8"
          >
            Back
          </Button>
          <Button
            onClick={handleSaveProfile}
            disabled={!isFormValid || isSaving}
            className="bg-vt-maroon hover:bg-vt-maroon-light text-white px-8 gap-2"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Saving Profile...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Profile
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AlumniProfilePage;
