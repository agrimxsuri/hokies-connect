import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, User, Home } from "lucide-react";
import { userDataManager } from "@/lib/dataManager";

const QuickNav = () => {
  const navigate = useNavigate();

  const goToAlumniDashboard = () => {
    // Set a test alumni user session
    userDataManager.setCurrentUser('test-alumni-123', 'alumni');
    console.log('🔍 DEBUG - Set test alumni user:', userDataManager.getCurrentUser());
    navigate('/alumni-dashboard');
  };

  const goToStudentDashboard = () => {
    // Set a test student user session
    userDataManager.setCurrentUser('test-student-123', 'student');
    console.log('🔍 DEBUG - Set test student user:', userDataManager.getCurrentUser());
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full">
        <CardHeader>
          <CardTitle className="text-center text-2xl text-vt-maroon">
            Quick Navigation
          </CardTitle>
          <p className="text-center text-gray-600">
            Choose where you want to go
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              onClick={goToAlumniDashboard}
              className="h-20 flex flex-col items-center gap-2 bg-vt-maroon hover:bg-vt-maroon-light text-white"
            >
              <GraduationCap className="h-8 w-8" />
              <span className="text-lg font-semibold">Alumni Dashboard</span>
              <span className="text-sm opacity-90">Manage calls & profile</span>
            </Button>
            
            <Button
              onClick={goToStudentDashboard}
              className="h-20 flex flex-col items-center gap-2 bg-vt-orange hover:bg-vt-orange-light text-white"
            >
              <User className="h-8 w-8" />
              <span className="text-lg font-semibold">Student Dashboard</span>
              <span className="text-sm opacity-90">Connect with alumni</span>
            </Button>
          </div>
          
          <div className="pt-4 border-t">
            <Button
              onClick={() => navigate('/')}
              variant="outline"
              className="w-full flex items-center gap-2"
            >
              <Home className="h-4 w-4" />
              Back to Landing Page
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuickNav;
