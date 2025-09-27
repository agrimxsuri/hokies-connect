import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import TimelineComponent from "@/components/TimelineComponent";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Calendar, MapPin, Building2, Users, Mail, Phone } from "lucide-react";

// Mock alumni profile data
const mockAlumniProfile = {
  "1": {
    id: "1",
    name: "Sarah Chen",
    company: "Google",
    role: "Senior Software Engineer",
    major: "Computer Science",
    graduationYear: "2018",
    location: "Mountain View, CA",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b789?w=400&h=400&fit=crop&crop=face",
    bio: "Passionate software engineer with 6+ years of experience building scalable web applications. Love mentoring students and helping them navigate their career journey in tech.",
    email: "sarah.chen@vt.edu",
    phone: "+1 (555) 123-4567",
    timeline: [
      {
        year: "2014-2018",
        title: "Bachelor of Science in Computer Science",
        description: "Virginia Tech",
        type: "education" as const,
        details: [
          "Graduated Magna Cum Laude with 3.8 GPA",
          "President of ACM Student Chapter",
          "Teaching Assistant for Data Structures",
        ],
      },
      {
        year: "2017",
        title: "Software Engineering Intern",
        description: "Google",
        type: "work" as const,
        details: [
          "Developed features for Google Search using Java and Python",
          "Improved search result relevance by 15%",
          "Collaborated with cross-functional teams of 12+ members",
        ],
      },
      {
        year: "2018",
        title: "Software Engineer I",
        description: "Google",
        type: "work" as const,
        details: [
          "Built and maintained microservices handling 1M+ requests/day",
          "Led migration from monolith to microservices architecture",
          "Mentored 3 junior engineers",
        ],
      },
      {
        year: "2020",
        title: "Promotion to Software Engineer II",
        description: "Google",
        type: "achievement" as const,
        details: [
          "Recognized for outstanding technical leadership",
          "Led design and implementation of new payment system",
          "Reduced system latency by 40%",
        ],
      },
      {
        year: "2022",
        title: "Senior Software Engineer",
        description: "Google",
        type: "work" as const,
        details: [
          "Technical lead for team of 8 engineers",
          "Architected new ML-powered recommendation engine",
          "Increased user engagement by 25%",
        ],
      },
    ],
  },
};

const AlumniProfile = () => {
  const { id } = useParams<{ id: string }>();
  
  if (!id || !mockAlumniProfile[id as keyof typeof mockAlumniProfile]) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Alumni Not Found</h1>
          <Button asChild>
            <Link to="/alumni">Back to Alumni</Link>
          </Button>
        </div>
      </div>
    );
  }

  const alumni = mockAlumniProfile[id as keyof typeof mockAlumniProfile];
  const initials = alumni.name.split(" ").map(n => n[0]).join("");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button variant="ghost" className="mb-6" asChild>
          <Link to="/alumni">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Alumni
          </Link>
        </Button>

        {/* Profile Header */}
        <Card className="mb-8 shadow-card">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Avatar and Basic Info */}
              <div className="flex flex-col items-center md:items-start">
                <Avatar className="h-32 w-32 mb-4 shadow-elevated">
                  <AvatarImage src={alumni.avatar} alt={alumni.name} />
                  <AvatarFallback className="bg-gradient-vt text-primary-foreground text-2xl font-bold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                
                <div className="text-center md:text-left">
                  <Badge variant="secondary" className="mb-2">
                    Class of {alumni.graduationYear}
                  </Badge>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <MapPin className="h-4 w-4" />
                    {alumni.location}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Building2 className="h-4 w-4" />
                    {alumni.major}
                  </div>
                </div>
              </div>

              {/* Main Info */}
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-foreground mb-2">{alumni.name}</h1>
                <div className="flex items-center gap-2 mb-4">
                  <h2 className="text-xl text-muted-foreground">{alumni.role}</h2>
                  <span className="text-muted-foreground">at</span>
                  <span className="text-xl font-semibold text-foreground">{alumni.company}</span>
                </div>
                
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {alumni.bio}
                </p>

                {/* Contact Info */}
                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    {alumni.email}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    {alumni.phone}
                  </div>
                </div>

                {/* CTA Button */}
                <Button variant="vt" size="lg" className="w-full md:w-auto">
                  <Calendar className="h-5 w-5 mr-2" />
                  Schedule a Call
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Timeline Section */}
        <Card className="shadow-card">
          <CardContent className="p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">Professional Journey</h2>
              <p className="text-muted-foreground">
                Follow {alumni.name.split(" ")[0]}'s path from Virginia Tech to their current role
              </p>
            </div>

            <TimelineComponent entries={alumni.timeline} />
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AlumniProfile;