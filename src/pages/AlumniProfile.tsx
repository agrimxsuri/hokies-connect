import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GraduationCap, Camera, Plus, Trash2, Save, X, FileText, Upload, Wand2 } from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { alumniDataManager, userDataManager, AlumniProfile, JourneyEntry, ProfessionalEntry } from "@/lib/dataManager";


const AlumniProfile = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Initialize Gemini AI (you'll need to add your API key to environment variables)
  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyAtHuLFZy1cAetnG6lruXBxjjaakinXzjA');
  
  const [profileData, setProfileData] = useState({
    name: "",
    majors: [] as string[],
    graduationYear: "",
    currentPosition: "",
    company: "",
    location: "",
    profilePicture: "",
    resume: "",
  });
  
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  const [isSaving, setIsSaving] = useState(false);
  const [isProcessingResume, setIsProcessingResume] = useState(false);
  const resumeInputRef = useRef<HTMLInputElement>(null);

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

  // Complete Hokie Journey for alumni (all 4 years)
  const [journeyEntries, setJourneyEntries] = useState<JourneyEntry[]>([
    { id: "1", year: "Freshman", courses: [], gpa: "", clubs: [], internships: [], research: [] },
    { id: "2", year: "Sophomore", courses: [], gpa: "", clubs: [], internships: [], research: [] },
    { id: "3", year: "Junior", courses: [], gpa: "", clubs: [], internships: [], research: [] },
    { id: "4", year: "Senior", courses: [], gpa: "", clubs: [], internships: [], research: [] },
  ]);

  // Professional journey entries
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

  const handleResumeUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setResumeFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileData(prev => ({ ...prev, resume: e.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAutofillFromResume = async () => {
    if (!resumeFile) return;
    
    setIsProcessingResume(true);
    
    try {
      // Extract text from PDF using pdf-parse
      const pdfParse = (await import('pdf-parse')).default;
      const arrayBuffer = await resumeFile.arrayBuffer();
      const pdfData = await pdfParse(Buffer.from(arrayBuffer));
      const resumeText = pdfData.text;
      
      console.log('Extracted resume text:', resumeText);
      
      // Use Gemini AI to process the resume
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const prompt = `
        Please analyze this resume and extract the following information in JSON format:
        
        Resume Text:
        ${resumeText}
        
        Please return a JSON object with the following structure:
        {
          "profile": {
            "name": "Full Name",
            "currentPosition": "Current Job Title",
            "company": "Current Company",
            "location": "Current Location"
          },
          "professionalEntries": [
            {
              "company": "Company Name",
              "position": "Job Title",
              "startDate": "YYYY-MM",
              "endDate": "YYYY-MM or 'Present'",
              "description": "Job description",
              "achievements": ["Achievement 1", "Achievement 2", "Achievement 3"]
            }
          ]
        }
        
        Extract all work experience entries from the resume. For dates, use YYYY-MM format. 
        If a job is current, use "Present" for endDate. 
        Include 3-5 key achievements for each position.
        Be accurate to the resume content and don't make up information.
      `;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const aiText = response.text();
      
      console.log('AI Response:', aiText);
      
      // Parse the AI response
      let parsedData;
      try {
        // Extract JSON from the response (AI might include extra text)
        const jsonMatch = aiText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsedData = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('No JSON found in AI response');
        }
      } catch (parseError) {
        console.error('Error parsing AI response:', parseError);
        // Fallback to a simple text-based extraction
        parsedData = await extractBasicInfo(resumeText);
      }
      
      // Update profile data
      if (parsedData.profile) {
        setProfileData(prev => ({
          ...prev,
          name: parsedData.profile.name || prev.name,
          currentPosition: parsedData.profile.currentPosition || prev.currentPosition,
          company: parsedData.profile.company || prev.company,
          location: parsedData.profile.location || prev.location
        }));
      }
      
      // Update professional entries
      if (parsedData.professionalEntries && Array.isArray(parsedData.professionalEntries)) {
        const professionalEntries: ProfessionalEntry[] = parsedData.professionalEntries.map((entry: any, index: number) => ({
          id: (Date.now() + index).toString(),
          company: entry.company || `Company ${index + 1}`,
          position: entry.position || `Position ${index + 1}`,
          startDate: entry.startDate || "2020-01",
          endDate: entry.endDate === "Present" ? "Present" : (entry.endDate || "2023-12"),
          description: entry.description || "No description available",
          achievements: Array.isArray(entry.achievements) ? entry.achievements : ["No achievements listed"]
        }));
        
        setProfessionalEntries(professionalEntries);
      }
      
    } catch (error) {
      console.error('Error processing resume:', error);
      alert('Error processing resume. Please try again or fill in the information manually.');
    } finally {
      setIsProcessingResume(false);
    }
  };

  // Fallback function for basic text extraction if AI parsing fails
  const extractBasicInfo = async (resumeText: string) => {
    const lines = resumeText.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    
    // Simple extraction logic
    const name = lines[0] || "";
    const emailMatch = resumeText.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
    const phoneMatch = resumeText.match(/(\+?1?[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/);
    
    return {
      profile: {
        name: name,
        currentPosition: "Software Engineer", // Default fallback
        company: "Company Name", // Default fallback
        location: "Location" // Default fallback
      },
      professionalEntries: [
        {
          company: "Previous Company",
          position: "Previous Position",
          startDate: "2020-01",
          endDate: "2023-12",
          description: "Worked on various projects and responsibilities",
          achievements: ["Key achievement 1", "Key achievement 2", "Key achievement 3"]
        }
      ]
    };
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

  // Professional journey handlers
  const addProfessionalEntry = () => {
    const newEntry: ProfessionalEntry = {
      id: Date.now().toString(),
      company: "",
      position: "",
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

  const removeProfessionalEntry = (id: string) => {
    setProfessionalEntries(prev => prev.filter(entry => entry.id !== id));
  };

  const addAchievement = (entryId: string) => {
    setProfessionalEntries(prev =>
      prev.map(entry =>
        entry.id === entryId
          ? { ...entry, achievements: [...entry.achievements, ""] }
          : entry
      )
    );
  };

  const updateAchievement = (entryId: string, achievementIndex: number, value: string) => {
    setProfessionalEntries(prev =>
      prev.map(entry =>
        entry.id === entryId
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

  const removeAchievement = (entryId: string, achievementIndex: number) => {
    setProfessionalEntries(prev =>
      prev.map(entry =>
        entry.id === entryId
          ? {
              ...entry,
              achievements: entry.achievements.filter((_, index) => index !== achievementIndex)
            }
          : entry
      )
    );
  };

  const handleSaveProfile = async () => {
    console.log('🔍 DEBUG - Save profile clicked');
    console.log('🔍 DEBUG - Form valid:', isFormValid);
    console.log('🔍 DEBUG - Profile data:', profileData);
    
    if (!isFormValid) {
      console.log('🔍 DEBUG - Form is not valid, returning');
      alert('Please fill in all required fields: Name, Majors, and Graduation Year');
      return;
    }

    setIsSaving(true);
    
    try {
      // Create the alumni profile object
      const alumniProfile = {
        name: profileData.name,
        majors: profileData.majors,
        graduationYear: profileData.graduationYear,
        currentPosition: profileData.currentPosition,
        company: profileData.company,
        location: profileData.location,
        profilePicture: profileData.profilePicture,
        resume: profileData.resume,
        journeyEntries: journeyEntries,
        professionalEntries: professionalEntries
      };
      
      // Save profile using centralized data manager
      console.log('🔍 DEBUG - Saving alumni profile:', alumniProfile);
      const savedProfile = alumniDataManager.saveProfile(alumniProfile);
      console.log('🔍 DEBUG - Saved profile:', savedProfile);
      
      // Set current user
      console.log('🔍 DEBUG - Setting current user:', savedProfile.id, 'alumni');
      userDataManager.setCurrentUser(savedProfile.id, 'alumni');
      console.log('🔍 DEBUG - Current user after setting:', userDataManager.getCurrentUser());
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('🔍 DEBUG - Navigating to /alumni-dashboard');
      alert('Profile saved successfully!');
      
      // Try navigation with a small delay
      setTimeout(() => {
        console.log('🔍 DEBUG - Executing navigation');
        navigate("/alumni-dashboard");
      }, 100);
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Error saving profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const isFormValid = profileData.name && profileData.majors.length > 0 && profileData.graduationYear;

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
            Share your Virginia Tech journey and professional experience to help mentor students
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Graduation Year *
                    </label>
                    <Input
                      type="number"
                      value={profileData.graduationYear}
                      onChange={(e) => handleInputChange("graduationYear", e.target.value)}
                      placeholder="e.g., 2020"
                      min="1950"
                      max="2024"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Current Position
                    </label>
                    <Input
                      value={profileData.currentPosition}
                      onChange={(e) => handleInputChange("currentPosition", e.target.value)}
                      placeholder="e.g., Senior Software Engineer"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Company
                    </label>
                    <Input
                      value={profileData.company}
                      onChange={(e) => handleInputChange("company", e.target.value)}
                      placeholder="e.g., Google"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Location
                    </label>
                    <Input
                      value={profileData.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                      placeholder="e.g., Mountain View, CA"
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resume Upload Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-vt-maroon">Resume Upload</CardTitle>
            <p className="text-muted-foreground">
              Upload your resume to automatically fill in your professional experience using AI
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <input
                  ref={resumeInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeUpload}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  onClick={() => resumeInputRef.current?.click()}
                  className="gap-2"
                >
                  <Upload className="h-4 w-4" />
                  {profileData.resume ? "Change Resume" : "Upload Resume"}
                </Button>
                
                {profileData.resume && (
                  <Button
                    onClick={handleAutofillFromResume}
                    disabled={isProcessingResume}
                    className="gap-2 bg-vt-orange hover:bg-vt-orange-light text-white"
                  >
                    {isProcessingResume ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Processing with AI...
                      </>
                    ) : (
                      <>
                        <Wand2 className="h-4 w-4" />
                        Autofill with AI
                      </>
                    )}
                  </Button>
                )}
              </div>
              
              {profileData.resume && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  <span>Resume uploaded successfully - Ready for AI processing</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Hokie Journey Section - Always Show */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-vt-maroon">Your Hokie Journey</CardTitle>
            <p className="text-muted-foreground">
              Share your complete Virginia Tech experience from all four years
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

        {/* Professional Journey Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-vt-maroon">Professional Journey</CardTitle>
              <p className="text-muted-foreground">
              Share your career progression and professional achievements
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {professionalEntries.map((entry, index) => (
                <div key={entry.id} className="border rounded-lg p-6 bg-muted/30">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="bg-vt-orange text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <h3 className="text-xl font-semibold text-vt-maroon">Position {index + 1}</h3>
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
                          Company *
                        </label>
                        <Input
                          value={entry.company}
                          onChange={(e) => updateProfessionalEntry(entry.id, "company", e.target.value)}
                          placeholder="e.g., Google"
                        />
                      </div>
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
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Start Date *
                        </label>
                        <Input
                          type="month"
                          value={entry.startDate}
                          onChange={(e) => updateProfessionalEntry(entry.id, "startDate", e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          End Date
                        </label>
                        <Input
                          type="month"
                          value={entry.endDate}
                          onChange={(e) => updateProfessionalEntry(entry.id, "endDate", e.target.value)}
                          placeholder="Leave empty if current"
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
                              placeholder="Enter an achievement..."
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
                Add Professional Position
              </Button>
            </div>
          </CardContent>
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
          
          {/* Debug Test Button */}
          <Button
            onClick={() => {
              console.log('🔍 DEBUG - Test navigation to alumni dashboard');
              navigate("/alumni-dashboard");
            }}
            variant="outline"
            className="px-8 gap-2"
          >
            Test Navigate to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AlumniProfile;