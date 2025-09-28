import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { alumniDataManager, userDataManager } from "@/lib/dataManager";

const SetupTestData = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Create a test alumni profile
    const testAlumniProfile = {
      name: "John Smith",
      majors: ["Computer Science", "Computer Engineering"],
      graduationYear: "2020",
      currentPosition: "Senior Software Engineer",
      company: "Google",
      location: "Mountain View, CA",
      profilePicture: "",
      resume: "",
      journeyEntries: [
        {
          id: "1",
          year: "Freshman",
          courses: ["CS 1114", "MATH 1225", "ENGL 1105"],
          gpa: "3.8",
          clubs: ["ACM", "HackVT"],
          internships: ["Summer Research Assistant"],
          research: ["Machine Learning Project"]
        },
        {
          id: "2", 
          year: "Sophomore",
          courses: ["CS 2114", "CS 2505", "MATH 2114"],
          gpa: "3.9",
          clubs: ["ACM", "HackVT", "VT Robotics"],
          internships: ["Google Summer of Code"],
          research: ["AI Research Lab"]
        },
        {
          id: "3",
          year: "Junior", 
          courses: ["CS 3114", "CS 3214", "CS 3304"],
          gpa: "3.95",
          clubs: ["ACM President", "HackVT"],
          internships: ["Microsoft Internship"],
          research: ["Published Paper on ML"]
        },
        {
          id: "4",
          year: "Senior",
          courses: ["CS 4104", "CS 4204", "CS 4304"],
          gpa: "3.9",
          clubs: ["ACM", "HackVT"],
          internships: ["Google Internship"],
          research: ["Senior Capstone Project"]
        }
      ],
      professionalEntries: [
        {
          id: "1",
          position: "Software Engineer",
          company: "Google",
          startDate: "2020-06-01",
          endDate: "2022-12-31",
          description: "Worked on Google Search infrastructure and machine learning systems.",
          achievements: [
            "Led development of new search algorithm",
            "Improved system performance by 40%",
            "Mentored 3 junior engineers"
          ]
        },
        {
          id: "2",
          position: "Senior Software Engineer", 
          company: "Google",
          startDate: "2023-01-01",
          endDate: "Present",
          description: "Leading a team of 5 engineers working on Google's core search systems.",
          achievements: [
            "Promoted to Senior Engineer",
            "Launched 3 major features",
            "Reduced system latency by 60%"
          ]
        }
      ]
    };

    // Save the test profile
    const savedProfile = alumniDataManager.saveProfile(testAlumniProfile);
    console.log('🔍 DEBUG - Created test alumni profile:', savedProfile);

    // Set current user
    userDataManager.setCurrentUser(savedProfile.id, 'alumni');
    console.log('🔍 DEBUG - Set current user:', userDataManager.getCurrentUser());

    // Navigate to alumni dashboard
    navigate('/alumni-dashboard');
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-vt-maroon mb-4">
          Setting up test data...
        </h1>
        <p className="text-gray-600">
          Creating test alumni profile and navigating to dashboard
        </p>
      </div>
    </div>
  );
};

export default SetupTestData;
