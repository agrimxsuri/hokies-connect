import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, MessageCircle, Star, MapPin, Briefcase, GraduationCap, Wand2 } from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { alumniData, AlumniProfile } from "@/data/alumniData";
import { studentDataManager, connectionDataManager, alumniDataManager } from "@/lib/dataManager";

interface StudentProfile {
  name: string;
  majors: string[];
  currentStanding: string;
  journeyEntries: any[];
  clubPositions: string[];
  minors: string[];
}

interface MatchedAlumni extends AlumniProfile {
  matchScore: number;
  compatibility: string[];
  matchReasons: string[];
}

const StudentConnect = () => {
  const navigate = useNavigate();
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
  const [matchedAlumni, setMatchedAlumni] = useState<MatchedAlumni[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMajor, setFilterMajor] = useState("all");
  const [filterField, setFilterField] = useState("all");
  const [isAIMatching, setIsAIMatching] = useState(false);

  // Initialize Gemini AI
  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || 'your-api-key-here');

  // Combine static alumni data with user-created profiles
  const getAllAlumniProfiles = (): AlumniProfile[] => {
    const staticAlumni = alumniData;
    const dynamicAlumni = alumniDataManager.getAllProfiles();
    
    // Convert dynamic alumni to the same format as static alumni
    const convertedDynamicAlumni: AlumniProfile[] = dynamicAlumni.map(alumni => ({
      id: alumni.id,
      name: alumni.name,
      major: alumni.majors.join(', '), // Convert array to string
      club: alumni.journeyEntries?.[0]?.clubs?.join(', ') || 'Various clubs',
      field: alumni.currentPosition || 'Professional',
      company: alumni.company,
      graduationYear: alumni.graduationYear,
      currentPosition: alumni.currentPosition,
      location: alumni.location,
      bio: `Virginia Tech ${alumni.majors.join(' and ')} graduate working as ${alumni.currentPosition} at ${alumni.company}.`,
      interests: alumni.professionalEntries?.map(entry => entry.position) || [alumni.currentPosition],
      profilePicture: alumni.profilePicture
    }));
    
    return [...staticAlumni, ...convertedDynamicAlumni];
  };

  useEffect(() => {
    // Load student profile using centralized data manager
    const savedProfile = studentDataManager.getCurrentProfile();
    if (savedProfile) {
      setStudentProfile(savedProfile);
    }
  }, []);

  const performAIMatching = async () => {
    if (!studentProfile) return;

    setIsAIMatching(true);
    
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      // Get combined alumni data (static + dynamic)
      const allAlumniProfiles = getAllAlumniProfiles();
      
      // Create a detailed prompt for AI matching
      const prompt = `
        You are an AI matching system for Virginia Tech students and alumni. 
        
        Student Profile:
        - Name: ${studentProfile.name}
        - Majors: ${studentProfile.majors.join(", ")}
        - Current Standing: ${studentProfile.currentStanding}
        - Club Positions: ${studentProfile.clubPositions.join(", ")}
        - Minors: ${studentProfile.minors.join(", ")}
        - Academic Journey: ${JSON.stringify(studentProfile.journeyEntries, null, 2)}
        
        Available Alumni (${allAlumniProfiles.length} profiles - includes both database alumni and user-created profiles):
        ${allAlumniProfiles.map(alumni => `
          - ${alumni.name}: ${alumni.major} → ${alumni.field} at ${alumni.company}
            Club: ${alumni.club}
            Interests: ${alumni.interests?.join(", ") || "Not specified"}
            Location: ${alumni.location || "Not specified"}
            Bio: ${alumni.bio || "Not specified"}
        `).join("\n")}
        
        Please analyze and match this student with the most relevant alumni based on:
        1. Major alignment (exact match gets highest score)
        2. Field/career path compatibility
        3. Club/organization involvement
        4. Academic interests and journey
        5. Career goals and aspirations
        6. Location preferences (if applicable)
        7. Professional experience relevance
        
        Return a JSON array of the top 10 matches with this structure:
        [
          {
            "alumniId": "1",
            "matchScore": 95,
            "compatibility": ["Same major", "Similar career path", "Shared interests"],
            "matchReasons": ["Both Computer Science majors", "Both interested in software engineering", "Similar club involvement"]
          }
        ]
        
        Match scores should be 0-100, with 90+ being excellent matches, 80-89 good matches, 70-79 decent matches.
        Be specific about why each alumni is a good match.
        Consider both static database alumni and user-created profiles equally.
      `;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const aiText = response.text();
      
      console.log('AI Matching Response:', aiText);
      
      // Parse AI response
      let matches;
      try {
        const jsonMatch = aiText.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          matches = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('No JSON array found in AI response');
        }
      } catch (parseError) {
        console.error('Error parsing AI response:', parseError);
        // Fallback to basic matching
        matches = performBasicMatching();
      }
      
      // Combine AI matches with alumni data (both static and dynamic)
      const matchedAlumniData: MatchedAlumni[] = matches.map((match: any) => {
        const alumni = allAlumniProfiles.find(a => a.id === match.alumniId);
        if (alumni) {
          return {
            ...alumni,
            matchScore: match.matchScore,
            compatibility: match.compatibility || [],
            matchReasons: match.matchReasons || []
          };
        }
        return null;
      }).filter(Boolean);
      
      setMatchedAlumni(matchedAlumniData);
      
    } catch (error) {
      console.error('Error in AI matching:', error);
      // Fallback to basic matching
      const basicMatches = performBasicMatching();
      setMatchedAlumni(basicMatches);
    } finally {
      setIsAIMatching(false);
    }
  };

  const performBasicMatching = (): MatchedAlumni[] => {
    if (!studentProfile) return [];
    
    const allAlumniProfiles = getAllAlumniProfiles();
    
    return allAlumniProfiles.map(alumni => {
      let score = 0;
      const compatibility: string[] = [];
      const matchReasons: string[] = [];
      
      // Major matching
      const majorMatch = studentProfile.majors.some(major => 
        alumni.major.toLowerCase().includes(major.toLowerCase()) ||
        major.toLowerCase().includes(alumni.major.toLowerCase())
      );
      
      if (majorMatch) {
        score += 40;
        compatibility.push("Same major");
        matchReasons.push(`Both ${alumni.major} majors`);
      }
      
      // Field matching
      if (alumni.field && studentProfile.majors.some(major => 
        alumni.field.toLowerCase().includes(major.toLowerCase())
      )) {
        score += 30;
        compatibility.push("Career path alignment");
        matchReasons.push(`Career path in ${alumni.field}`);
      }
      
      // Club matching
      if (alumni.club && studentProfile.clubPositions.some(club => 
        alumni.club.toLowerCase().includes(club.toLowerCase())
      )) {
        score += 20;
        compatibility.push("Shared club involvement");
        matchReasons.push(`Both involved in ${alumni.club}`);
      }
      
      // Random bonus for variety
      score += Math.random() * 10;
      
      return {
        ...alumni,
        matchScore: Math.min(Math.round(score), 100),
        compatibility,
        matchReasons
      };
    }).sort((a, b) => b.matchScore - a.matchScore).slice(0, 10);
  };

  const handleConnect = (alumniId: string) => {
    if (!studentProfile) return;
    
    try {
      // Send connection request using centralized data manager
      const connectionRequest = connectionDataManager.sendRequest(
        studentProfile.id,
        alumniId,
        `Hi! I'm ${studentProfile.name}, a ${studentProfile.currentStanding} ${studentProfile.majors.join(' and ')} student. I'd love to connect and learn about your career path!`
      );
      
      console.log('Connection request sent:', connectionRequest);
      alert("Connection request sent! The alumni will be notified.");
    } catch (error) {
      console.error('Error sending connection request:', error);
      alert("Error sending connection request. Please try again.");
    }
  };

  const filteredAlumni = matchedAlumni.filter(alumni => {
    const matchesSearch = alumni.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alumni.major.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alumni.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMajor = filterMajor === "all" || alumni.major.toLowerCase().includes(filterMajor.toLowerCase());
    const matchesField = filterField === "all" || alumni.field.toLowerCase().includes(filterField.toLowerCase());
    
    return matchesSearch && matchesMajor && matchesField;
  });

  if (!studentProfile) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Complete your profile first</h3>
          <p className="text-gray-500">
            You need to create your student profile before we can find matching alumni.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-vt-maroon">AI-Powered Alumni Matching</CardTitle>
          <p className="text-muted-foreground">
            Find alumni who match your academic background, interests, and career goals
          </p>
        </CardHeader>
      </Card>

      {/* AI Matching Button */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <Button
              onClick={performAIMatching}
              disabled={isAIMatching}
              className="bg-vt-orange hover:bg-vt-orange-light text-white px-8 py-3 text-lg"
            >
              {isAIMatching ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  AI is analyzing your profile...
                </>
              ) : (
                <>
                  <Wand2 className="h-5 w-5 mr-2" />
                  Find My Alumni Matches
                </>
              )}
            </Button>
            <p className="text-sm text-gray-500 mt-2">
              Our AI will analyze your profile and find the best alumni matches
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filters */}
      {matchedAlumni.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search alumni by name, major, or company..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={filterMajor} onValueChange={setFilterMajor}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by major" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Majors</SelectItem>
                  <SelectItem value="computer science">Computer Science</SelectItem>
                  <SelectItem value="computer engineering">Computer Engineering</SelectItem>
                  <SelectItem value="mechanical engineering">Mechanical Engineering</SelectItem>
                  <SelectItem value="electrical engineering">Electrical Engineering</SelectItem>
                  <SelectItem value="industrial">Industrial Engineering</SelectItem>
                  <SelectItem value="civil engineering">Civil Engineering</SelectItem>
                  <SelectItem value="statistics">Statistics</SelectItem>
                  <SelectItem value="cmda">CMDA</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="bit">BIT</SelectItem>
                  <SelectItem value="economics">Economics</SelectItem>
                  <SelectItem value="management">Management</SelectItem>
                  <SelectItem value="cybersecurity">Cybersecurity</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterField} onValueChange={setFilterField}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by field" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Fields</SelectItem>
                  <SelectItem value="software engineering">Software Engineering</SelectItem>
                  <SelectItem value="data analytics">Data Analytics</SelectItem>
                  <SelectItem value="financial services">Financial Services</SelectItem>
                  <SelectItem value="cybersecurity">Cybersecurity</SelectItem>
                  <SelectItem value="automotive engineering">Automotive Engineering</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Matched Alumni */}
      {matchedAlumni.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredAlumni.map((alumni) => (
            <Card key={alumni.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={alumni.profilePicture} />
                      <AvatarFallback className="bg-vt-maroon text-white">
                        {alumni.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-lg">{alumni.name}</h3>
                      <p className="text-sm text-muted-foreground">{alumni.major}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-vt-orange">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="font-semibold">{alumni.matchScore}%</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Match Score</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Career Info */}
                <div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                    <Briefcase className="h-4 w-4" />
                    <span>{alumni.currentPosition} at {alumni.company}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{alumni.location}</span>
                  </div>
                </div>

                {/* Bio */}
                <p className="text-sm text-gray-600 line-clamp-3">{alumni.bio}</p>

                {/* Compatibility */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Why we matched you</h4>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {alumni.matchReasons.slice(0, 3).map((reason, index) => (
                      <li key={index} className="flex items-center gap-1">
                        <div className="w-1 h-1 bg-vt-orange rounded-full"></div>
                        {reason}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Interests */}
                {alumni.interests && alumni.interests.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Interests</h4>
                    <div className="flex flex-wrap gap-1">
                      {alumni.interests.slice(0, 3).map((interest, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button 
                    onClick={() => handleConnect(alumni.id)}
                    className="flex-1 bg-vt-maroon hover:bg-vt-maroon-dark text-white"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Connect
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate(`/alumni/${alumni.id}`)}
                  >
                    View Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {matchedAlumni.length === 0 && !isAIMatching && (
        <Card>
          <CardContent className="text-center py-12">
            <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Ready to find your matches?</h3>
            <p className="text-gray-500">
              Click "Find My Alumni Matches" to discover alumni who share your interests and career goals.
            </p>
          </CardContent>
        </Card>
      )}

      {filteredAlumni.length === 0 && matchedAlumni.length > 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No matches found</h3>
            <p className="text-gray-500">
              Try adjusting your search criteria or check back later for new matches.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StudentConnect;
