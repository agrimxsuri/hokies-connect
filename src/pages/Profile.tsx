import Header from "@/components/Header";
import StudentProfileDisplay from "@/components/StudentProfileDisplay";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();

  const handleEditProfile = () => {
    navigate("/student-profile");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="bg-vt-maroon text-white rounded-full p-3">
                <User className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-vt-maroon">My Profile</h1>
                <p className="text-muted-foreground">View and manage your student profile</p>
              </div>
            </div>
            <Button onClick={handleEditProfile} className="gap-2">
              <Edit className="h-4 w-4" />
              Edit Profile
            </Button>
          </div>

          {/* Profile Display */}
          <StudentProfileDisplay />
        </div>
      </main>
    </div>
  );
};

export default Profile;
