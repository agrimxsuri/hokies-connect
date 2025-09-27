import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import AlumniCard from "@/components/AlumniCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Filter } from "lucide-react";
import { Link } from "react-router-dom";

// Mock alumni data
const mockAlumni = [
  {
    id: "1",
    name: "Sarah Chen",
    company: "Google",
    role: "Senior Software Engineer",
    major: "Computer Science",
    graduationYear: "2018",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b789?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: "2",
    name: "Michael Rodriguez",
    company: "Microsoft",
    role: "Product Manager",
    major: "Engineering",
    graduationYear: "2016",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: "3",
    name: "Emily Johnson",
    company: "Tesla",
    role: "Mechanical Engineer",
    major: "Engineering",
    graduationYear: "2019",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: "4",
    name: "David Park",
    company: "Amazon",
    role: "Data Scientist",
    major: "Computer Science",
    graduationYear: "2017",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: "5",
    name: "Lisa Thompson",
    company: "Apple",
    role: "UX Designer",
    major: "Liberal Arts",
    graduationYear: "2020",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: "6",
    name: "James Wilson",
    company: "Meta",
    role: "Research Scientist",
    major: "Computer Science",
    graduationYear: "2015",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
  },
];

const Alumni = () => {
  const [searchParams] = useSearchParams();
  
  // Get filter values from URL params
  const filters = {
    major: searchParams.get("major") || "",
    clubs: searchParams.get("clubs") || "",
    fields: searchParams.get("fields") || "",
    company: searchParams.get("company") || "",
  };

  // Filter alumni based on search params (mock filtering)
  const filteredAlumni = mockAlumni.filter((alumni) => {
    if (filters.major && !alumni.major.toLowerCase().includes(filters.major.toLowerCase())) {
      return false;
    }
    if (filters.company && !alumni.company.toLowerCase().includes(filters.company.toLowerCase())) {
      return false;
    }
    return true;
  });

  const hasFilters = Object.values(filters).some(value => value !== "");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/connect">
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back to Filters
                </Link>
              </Button>
            </div>
            <h1 className="text-3xl font-bold text-foreground">
              {hasFilters ? "Matched Alumni" : "All Alumni"}
            </h1>
            <p className="text-muted-foreground mt-1">
              {filteredAlumni.length} {filteredAlumni.length === 1 ? "alumni found" : "alumni found"}
            </p>
          </div>

          <Button variant="outline" asChild>
            <Link to="/connect">
              <Filter className="h-4 w-4 mr-2" />
              Refine Filters
            </Link>
          </Button>
        </div>

        {/* Active Filters */}
        {hasFilters && (
          <div className="mb-8 p-4 bg-secondary/50 rounded-lg">
            <h3 className="font-medium text-sm text-foreground mb-2">Active Filters:</h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(filters).map(([key, value]) => 
                value && (
                  <span key={key} className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                    {key}: {value}
                  </span>
                )
              )}
            </div>
          </div>
        )}

        {/* Alumni Grid */}
        {filteredAlumni.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAlumni.map((alumni) => (
              <AlumniCard
                key={alumni.id}
                {...alumni}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              No alumni found
            </h2>
            <p className="text-muted-foreground mb-6">
              Try adjusting your filters to find more matches
            </p>
            <Button variant="vt" asChild>
              <Link to="/connect">Update Filters</Link>
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Alumni;