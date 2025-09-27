import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Sparkles } from "lucide-react";

interface FilterSectionProps {
  onMatch: (filters: FilterData) => void;
  isLoading?: boolean;
}

interface FilterData {
  major: string;
  clubs: string;
  fields: string;
  company: string;
}

const FilterSection = ({ onMatch, isLoading = false }: FilterSectionProps) => {
  const [filters, setFilters] = useState<FilterData>({
    major: "",
    clubs: "",
    fields: "",
    company: "",
  });

  const majors = [
    "Computer Science",
    "Engineering",
    "Business",
    "Liberal Arts",
    "Agriculture",
    "Architecture",
    "Natural Resources",
  ];

  const clubs = [
    "ACM",
    "IEEE",
    "Student Government",
    "Greek Life",
    "Athletics",
    "Honor Society",
    "Debate Team",
    "Volunteering",
  ];

  const fields = [
    "Technology",
    "Finance",
    "Healthcare",
    "Education",
    "Government",
    "Consulting",
    "Startup",
    "Non-profit",
  ];

  const companies = [
    "Google",
    "Microsoft",
    "Amazon",
    "Apple",
    "Meta",
    "Tesla",
    "Boeing",
    "Lockheed Martin",
  ];

  const updateFilter = (key: keyof FilterData, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleMatch = () => {
    onMatch(filters);
  };

  const isFormComplete = Object.values(filters).some(value => value !== "");

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-card">
      <CardContent className="p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-3">
            Find the Right Alumni Mentor
          </h2>
          <p className="text-muted-foreground text-lg">
            Select your preferences and let our AI match you with the perfect mentors
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Major Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Major</label>
            <Select value={filters.major} onValueChange={(value) => updateFilter("major", value)}>
              <SelectTrigger className="h-12 rounded-xl">
                <SelectValue placeholder="Select your major" />
              </SelectTrigger>
              <SelectContent>
                {majors.map((major) => (
                  <SelectItem key={major} value={major}>
                    {major}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Clubs Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Clubs</label>
            <Select value={filters.clubs} onValueChange={(value) => updateFilter("clubs", value)}>
              <SelectTrigger className="h-12 rounded-xl">
                <SelectValue placeholder="Select clubs" />
              </SelectTrigger>
              <SelectContent>
                {clubs.map((club) => (
                  <SelectItem key={club} value={club}>
                    {club}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Fields Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Industry</label>
            <Select value={filters.fields} onValueChange={(value) => updateFilter("fields", value)}>
              <SelectTrigger className="h-12 rounded-xl">
                <SelectValue placeholder="Select field" />
              </SelectTrigger>
              <SelectContent>
                {fields.map((field) => (
                  <SelectItem key={field} value={field}>
                    {field}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Company Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Company</label>
            <Select value={filters.company} onValueChange={(value) => updateFilter("company", value)}>
              <SelectTrigger className="h-12 rounded-xl">
                <SelectValue placeholder="Select company" />
              </SelectTrigger>
              <SelectContent>
                {companies.map((company) => (
                  <SelectItem key={company} value={company}>
                    {company}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="text-center">
          <Button 
            variant="vt" 
            size="lg" 
            onClick={handleMatch}
            disabled={!isFormComplete || isLoading}
            className="px-12 py-6 text-lg font-semibold rounded-xl"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Matching...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-5 w-5" />
                Match Me
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FilterSection;