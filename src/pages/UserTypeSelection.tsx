import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GraduationCap, User, Users } from "lucide-react";

const UserTypeSelection = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<"student" | "alumni" | null>(null);

  const handleContinue = () => {
    if (selectedType === "student") {
      navigate("/student-profile");
    } else if (selectedType === "alumni") {
      navigate("/alumni-profile");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-vt-maroon via-vt-maroon-light to-vt-orange flex flex-col">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 rounded-full bg-white/20"></div>
        <div className="absolute top-40 right-32 w-24 h-24 rounded-full bg-white/15"></div>
        <div className="absolute bottom-32 left-1/3 w-40 h-40 rounded-full bg-white/10"></div>
        <div className="absolute bottom-20 right-20 w-28 h-28 rounded-full bg-white/20"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 text-center">
        <div className="max-w-2xl mx-auto">
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-white/20 rounded-full blur-xl"></div>
              <div className="relative bg-white/10 backdrop-blur-sm rounded-full p-6 border border-white/20">
                <GraduationCap className="h-16 w-16 text-white" />
              </div>
            </div>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Welcome to
            <span className="block text-vt-orange-light">Hokies Connect</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-white/90 mb-12 max-w-xl mx-auto leading-relaxed">
            Let's get to know you better. Are you a current student or an alumnus?
          </p>

          {/* User Type Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 max-w-2xl mx-auto">
            {/* Student Option */}
            <button
              onClick={() => setSelectedType("student")}
              className={`p-8 rounded-2xl border-2 transition-all duration-300 hover:scale-105 ${
                selectedType === "student"
                  ? "bg-white/20 border-white/40 shadow-2xl"
                  : "bg-white/10 border-white/20 hover:bg-white/15"
              }`}
            >
              <div className="flex flex-col items-center space-y-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 border border-white/20">
                  <User className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">Current Student</h3>
                <p className="text-white/80 text-center">
                  I'm currently enrolled at Virginia Tech and want to connect with alumni
                </p>
              </div>
            </button>

            {/* Alumni Option */}
            <button
              onClick={() => setSelectedType("alumni")}
              className={`p-8 rounded-2xl border-2 transition-all duration-300 hover:scale-105 ${
                selectedType === "alumni"
                  ? "bg-white/20 border-white/40 shadow-2xl"
                  : "bg-white/10 border-white/20 hover:bg-white/15"
              }`}
            >
              <div className="flex flex-col items-center space-y-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 border border-white/20">
                  <Users className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">Alumnus</h3>
                <p className="text-white/80 text-center">
                  I'm a Virginia Tech graduate and want to mentor students
                </p>
              </div>
            </button>
          </div>

          {/* Continue Button */}
          <Button
            onClick={handleContinue}
            disabled={!selectedType}
            size="lg"
            className="bg-white text-vt-maroon hover:bg-white/90 hover:text-vt-maroon-light font-semibold px-8 py-4 text-lg rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            Continue
            <GraduationCap className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 pb-8 text-center">
        <p className="text-white/60 text-sm">
          Virginia Tech Alumni Network • Est. 1872
        </p>
      </div>
    </div>
  );
};

export default UserTypeSelection;
