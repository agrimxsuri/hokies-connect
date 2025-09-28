import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap } from "lucide-react";
import { alumniDataManager, userDataManager } from "@/lib/dataManager";

const AlumniProfileTest = () => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({
    name: "",
    majors: [] as string[],
    graduationYear: "",
    currentPosition: "",
    company: "",
    location: "",
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveProfile = async () => {
    console.log('🔍 DEBUG - Save profile clicked');
    console.log('🔍 DEBUG - Profile data:', profileData);
    
    if (!profileData.name || !profileData.graduationYear) {
      alert('Please fill in Name and Graduation Year');
      return;
    }

    setIsSaving(true);
    
    try {
      const alumniProfile = {
        name: profileData.name,
        majors: profileData.majors,
        graduationYear: profileData.graduationYear,
        currentPosition: profileData.currentPosition,
        company: profileData.company,
        location: profileData.location,
        profilePicture: "",
        resume: "",
        journeyEntries: [],
        professionalEntries: []
      };
      
      console.log('🔍 DEBUG - Saving alumni profile:', alumniProfile);
      const savedProfile = alumniDataManager.saveProfile(alumniProfile);
      console.log('🔍 DEBUG - Saved profile:', savedProfile);
      
      userDataManager.setCurrentUser(savedProfile.id, 'alumni');
      console.log('🔍 DEBUG - Current user after setting:', userDataManager.getCurrentUser());
      
      alert('Profile saved successfully!');
      navigate("/alumni-dashboard");
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Error saving profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-r from-vt-maroon to-vt-orange text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-4">
            <GraduationCap className="h-8 w-8" />
            <h1 className="text-3xl font-bold">Alumni Profile Test</h1>
          </div>
          <p className="text-white/90">
            Simplified test version to debug the issue
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Name *</label>
              <Input
                value={profileData.name}
                onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter your full name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Graduation Year *</label>
              <Input
                type="number"
                value={profileData.graduationYear}
                onChange={(e) => setProfileData(prev => ({ ...prev, graduationYear: e.target.value }))}
                placeholder="e.g., 2020"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Current Position</label>
              <Input
                value={profileData.currentPosition}
                onChange={(e) => setProfileData(prev => ({ ...prev, currentPosition: e.target.value }))}
                placeholder="e.g., Software Engineer"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Company</label>
              <Input
                value={profileData.company}
                onChange={(e) => setProfileData(prev => ({ ...prev, company: e.target.value }))}
                placeholder="e.g., Google"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Location</label>
              <Input
                value={profileData.location}
                onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="e.g., San Francisco, CA"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4 mt-8">
          <Button
            onClick={() => navigate("/user-type")}
            variant="outline"
          >
            Back
          </Button>
          <Button
            onClick={() => navigate("/alumni-dashboard")}
            variant="outline"
            className="border-blue-500 text-blue-500"
          >
            Test Dashboard
          </Button>
          <Button
            onClick={handleSaveProfile}
            disabled={isSaving}
            className="bg-vt-maroon hover:bg-vt-maroon-light text-white"
          >
            {isSaving ? "Saving..." : "Save Profile"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AlumniProfileTest;
