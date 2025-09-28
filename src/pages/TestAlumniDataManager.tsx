import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { alumniDataManager, userDataManager } from "@/lib/dataManager";

const TestAlumniDataManager = () => {
  const [testResult, setTestResult] = useState<string>("Testing...");
  const [isWorking, setIsWorking] = useState<boolean>(false);

  useEffect(() => {
    try {
      console.log('🔍 DEBUG - Testing alumniDataManager import...');
      
      // Test if alumniDataManager is available
      if (alumniDataManager) {
        console.log('🔍 DEBUG - alumniDataManager found:', alumniDataManager);
        
        // Test basic functionality
        const allProfiles = alumniDataManager.getAllProfiles();
        console.log('🔍 DEBUG - getAllProfiles works:', allProfiles);
        
        // Test creating a profile
        const testProfile = {
          name: "Test Alumni",
          majors: ["Computer Science"],
          graduationYear: "2020",
          currentPosition: "Software Engineer",
          company: "Test Company",
          location: "Test City",
          profilePicture: "",
          resume: "",
          journeyEntries: [],
          professionalEntries: []
        };
        
        const savedProfile = alumniDataManager.saveProfile(testProfile);
        console.log('🔍 DEBUG - saveProfile works:', savedProfile);
        
        // Test getting current profile
        userDataManager.setCurrentUser(savedProfile.id, 'alumni');
        const currentProfile = alumniDataManager.getCurrentProfile();
        console.log('🔍 DEBUG - getCurrentProfile works:', currentProfile);
        
        setTestResult("✅ All tests passed! alumniDataManager is working correctly.");
        setIsWorking(true);
      } else {
        setTestResult("❌ alumniDataManager is undefined");
        setIsWorking(false);
      }
    } catch (error) {
      console.error('🔍 DEBUG - Error testing alumniDataManager:', error);
      setTestResult(`❌ Error: ${error instanceof Error ? error.message : String(error)}`);
      setIsWorking(false);
    }
  }, []);

  const goToAlumniDashboard = () => {
    window.location.href = '/alumni-dashboard';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full">
        <CardHeader>
          <CardTitle className="text-center text-2xl text-vt-maroon">
            AlumniDataManager Test
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`p-4 rounded ${isWorking ? 'bg-green-100 border border-green-400' : 'bg-red-100 border border-red-400'}`}>
            <p className={`font-semibold ${isWorking ? 'text-green-800' : 'text-red-800'}`}>
              {testResult}
            </p>
          </div>
          
          <div className="bg-gray-100 p-4 rounded">
            <h3 className="font-semibold mb-2">What was tested:</h3>
            <ul className="text-sm space-y-1">
              <li>• alumniDataManager import</li>
              <li>• getAllProfiles() method</li>
              <li>• saveProfile() method</li>
              <li>• getCurrentProfile() method</li>
              <li>• userDataManager integration</li>
            </ul>
          </div>
          
          {isWorking && (
            <div className="pt-4">
              <Button
                onClick={goToAlumniDashboard}
                className="w-full bg-vt-maroon hover:bg-vt-maroon-light text-white"
              >
                Go to Alumni Dashboard
              </Button>
            </div>
          )}
          
          <div className="pt-4 border-t">
            <p className="text-sm text-gray-600 text-center">
              Check the browser console for detailed debug information.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestAlumniDataManager;
