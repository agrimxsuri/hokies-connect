import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GraduationCap, Camera, Plus, Trash2, Save, X, ChevronDown } from "lucide-react";
import { studentDataManager, userDataManager, StudentProfile, JourneyEntry } from "@/lib/dataManager";
import { upsertProfile as saveToSupabase } from "@/lib/api/studentAPI";
import { generateMatchesForStudent, saveMatches } from "@/lib/matching";

const StudentProfile = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [profileData, setProfileData] = useState({
    name: "",
    majors: [] as string[],
    currentStanding: "",
    clubPositions: [] as string[],
    minors: [] as string[],
    profilePicture: "",
  });

  const [newClubPosition, setNewClubPosition] = useState("");
  const [newMinor, setNewMinor] = useState("");
  const [isSaving, setIsSaving] = useState(false);

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

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => {
      const newData = { ...prev, [field]: value };
      
      // Update journey entries when current standing changes
      if (field === "currentStanding") {
        const journeyYears = [];
        
        // Show only years up to and including the current standing
        if (value === "Freshman") {
          journeyYears.push("Freshman");
        } else if (value === "Sophomore") {
          journeyYears.push("Freshman", "Sophomore");
        } else if (value === "Junior") {
          journeyYears.push("Freshman", "Sophomore", "Junior");
        } else if (value === "Senior") {
          journeyYears.push("Freshman", "Sophomore", "Junior", "Senior");
        }
        
        const newJourneyEntries = journeyYears.map((year, index) => ({
          id: (index + 1).toString(),
          year,
          courses: [],
          gpa: "",
          clubs: [],
          internships: [],
          research: []
        }));
        
        setJourneyEntries(newJourneyEntries);
      }
      
      return newData;
    });
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


  const addClubPosition = () => {
    if (newClubPosition.trim()) {
      setProfileData(prev => ({
        ...prev,
        clubPositions: [...prev.clubPositions, newClubPosition.trim()]
      }));
      setNewClubPosition("");
    }
  };

  const removeClubPosition = (index: number) => {
    setProfileData(prev => ({
      ...prev,
      clubPositions: prev.clubPositions.filter((_, i) => i !== index)
    }));
  };

  const addMinor = () => {
    if (newMinor.trim()) {
      setProfileData(prev => ({
        ...prev,
        minors: [...prev.minors, newMinor.trim()]
      }));
      setNewMinor("");
    }
  };

  const removeMinor = (index: number) => {
    setProfileData(prev => ({
      ...prev,
      minors: prev.minors.filter((_, i) => i !== index)
    }));
  };

  const handleJourneyChange = (id: string, field: string, value: string) => {
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

  const handleSaveProfile = async () => {
    if (!isFormValid) return;
    
    setIsSaving(true);
    
    try {
      // Create the student profile object for Supabase
      const studentProfileData = {
        name: profileData.name,
        majors: profileData.majors,
        currentStanding: profileData.currentStanding,
        clubPositions: profileData.clubPositions,
        minors: profileData.minors,
        profilePicture: profileData.profilePicture,
        journeyEntries: journeyEntries
      };
      
      // Save profile to Supabase
      const savedProfile = await saveToSupabase(studentProfileData);
      
      // Also save to localStorage as backup
      const localStorageProfile = {
        id: savedProfile.user_id, // Use user_id for consistency
        name: profileData.name,
        majors: profileData.majors,
        currentStanding: profileData.currentStanding,
        clubPositions: profileData.clubPositions,
        minors: profileData.minors,
        profilePicture: profileData.profilePicture,
        journeyEntries: journeyEntries,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Save to localStorage as backup
      console.log('Saving to localStorage:', localStorageProfile);
      studentDataManager.saveProfile(localStorageProfile);
      userDataManager.setCurrentUser(savedProfile.user_id, 'student');
      console.log('Profile saved to localStorage with user_id:', savedProfile.user_id);
      
      // Generate AI matches for this student
      let matchCount = 0;
      try {
        console.log('Generating AI matches for student...');
        const matches = await generateMatchesForStudent(savedProfile.user_id);
        console.log('Generated matches:', matches);
        matchCount = matches.length;
        
        if (matches.length > 0) {
          await saveMatches(matches);
          console.log('Matches saved to database');
        }
      } catch (matchError) {
        console.error('Error generating matches:', matchError);
        // Don't fail the profile save if matching fails
      }
      
      alert('Profile saved successfully! AI matching system will find suitable alumni for you.');
      navigate("/student-dashboard");
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Error saving profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const isFormValid = profileData.name && profileData.majors.length > 0 && profileData.currentStanding;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-vt-maroon to-vt-orange text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-4">
            <GraduationCap className="h-8 w-8" />
            <h1 className="text-3xl font-bold">Create Your Student Profile</h1>
          </div>
          <p className="text-white/90">
            Help us understand your journey so we can connect you with the best alumni mentors
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

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Major(s) *
                  </label>
                  <Select onValueChange={(value) => {
                    if (value && !profileData.majors.includes(value)) {
                      setProfileData(prev => ({
                        ...prev,
                        majors: [...prev.majors, value]
                      }));
                    }
                  }}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a major to add..." />
                    </SelectTrigger>
                    <SelectContent>
                      {availableMajors.map((major) => (
                        <SelectItem 
                          key={major} 
                          value={major}
                          disabled={profileData.majors.includes(major)}
                        >
                          {major}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {profileData.majors.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {profileData.majors.map((major) => (
                        <Badge key={major} variant="secondary" className="bg-vt-maroon/10 text-vt-maroon gap-1">
                          {major}
                          <X 
                            className="h-3 w-3 cursor-pointer" 
                            onClick={() => setProfileData(prev => ({
                              ...prev,
                              majors: prev.majors.filter(m => m !== major)
                            }))}
                          />
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Current Standing *
                  </label>
                  <Select onValueChange={(value) => handleInputChange("currentStanding", value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select your current standing..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Freshman">Freshman</SelectItem>
                      <SelectItem value="Sophomore">Sophomore</SelectItem>
                      <SelectItem value="Junior">Junior</SelectItem>
                      <SelectItem value="Senior">Senior</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Club Positions */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Club Positions (Optional)
                  </label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={newClubPosition}
                      onChange={(e) => setNewClubPosition(e.target.value)}
                      placeholder="e.g., President of ACM"
                      onKeyPress={(e) => e.key === 'Enter' && addClubPosition()}
                    />
                    <Button type="button" onClick={addClubPosition} size="sm" className="gap-2">
                      <Plus className="h-4 w-4" />
                      Add
                    </Button>
                  </div>
                  {profileData.clubPositions.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {profileData.clubPositions.map((position, index) => (
                        <Badge key={index} variant="outline" className="gap-1">
                          {position}
                          <X 
                            className="h-3 w-3 cursor-pointer" 
                            onClick={() => removeClubPosition(index)}
                          />
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Minors */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Minors (Optional)
                  </label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={newMinor}
                      onChange={(e) => setNewMinor(e.target.value)}
                      placeholder="e.g., Mathematics"
                      onKeyPress={(e) => e.key === 'Enter' && addMinor()}
                    />
                    <Button type="button" onClick={addMinor} size="sm" className="gap-2">
                      <Plus className="h-4 w-4" />
                      Add
                    </Button>
                  </div>
                  {profileData.minors.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {profileData.minors.map((minor, index) => (
                        <Badge key={index} variant="outline" className="gap-1">
                          {minor}
                          <X 
                            className="h-3 w-3 cursor-pointer" 
                            onClick={() => removeMinor(index)}
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
        {journeyEntries.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl text-vt-maroon">Your Hokie Journey</CardTitle>
              <p className="text-muted-foreground">
                Share your experiences and achievements from each year at Virginia Tech
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {journeyEntries.map((entry, index) => (
                <div key={entry.id} className="border rounded-lg p-6 bg-muted/30">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-vt-maroon text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <h3 className="text-xl font-semibold text-vt-maroon">{entry.year} Year</h3>
                  </div>

                  <div className="space-y-6">
                    {/* Courses (Required) */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Courses <span className="text-red-500">*</span>
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

                    {/* GPA (Optional) */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        GPA (Optional)
                      </label>
                      <Input
                        value={entry.gpa}
                        onChange={(e) => handleJourneyChange(entry.id, "gpa", e.target.value)}
                        placeholder="e.g., 3.75"
                        type="number"
                        step="0.01"
                        min="0"
                        max="4"
                      />
                    </div>

                    {/* Clubs (Optional) */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Clubs (Optional)
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

                    {/* Internships/Jobs (Optional) */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Internships/Jobs (Optional)
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

                    {/* Research/Projects (Optional) */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Research/Projects (Optional)
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
            </div>
          </CardContent>
        </Card>
        )}

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

export default StudentProfile;
