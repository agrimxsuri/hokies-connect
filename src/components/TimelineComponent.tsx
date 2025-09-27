import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Briefcase, Trophy, Users } from "lucide-react";

interface TimelineEntry {
  year: string;
  title: string;
  description: string;
  type: "education" | "work" | "achievement" | "activity";
  details?: string[];
}

interface TimelineComponentProps {
  entries: TimelineEntry[];
}

const TimelineComponent = ({ entries }: TimelineComponentProps) => {
  const getIcon = (type: string) => {
    switch (type) {
      case "education":
        return <GraduationCap className="h-5 w-5" />;
      case "work":
        return <Briefcase className="h-5 w-5" />;
      case "achievement":
        return <Trophy className="h-5 w-5" />;
      case "activity":
        return <Users className="h-5 w-5" />;
      default:
        return <Briefcase className="h-5 w-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "education":
        return "bg-primary";
      case "work":
        return "bg-accent";
      case "achievement":
        return "bg-vt-orange";
      case "activity":
        return "bg-secondary";
      default:
        return "bg-primary";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "education":
        return "Education";
      case "work":
        return "Career";
      case "achievement":
        return "Achievement";
      case "activity":
        return "Activity";
      default:
        return "Experience";
    }
  };

  return (
    <div className="relative">
      {/* Vertical Timeline Line */}
      <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border"></div>

      <div className="space-y-8">
        {entries.map((entry, index) => (
          <div key={index} className="relative">
            {/* Timeline Node */}
            <div className={`absolute left-3 w-6 h-6 rounded-full ${getTypeColor(entry.type)} flex items-center justify-center text-white shadow-lg z-10`}>
              {getIcon(entry.type)}
            </div>

            {/* Timeline Card */}
            <div className="ml-16">
              <Card className="shadow-card hover:shadow-elevated transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary" className="text-xs">
                          {getTypeLabel(entry.type)}
                        </Badge>
                        <span className="text-sm font-medium text-muted-foreground">
                          {entry.year}
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        {entry.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {entry.description}
                      </p>
                    </div>
                  </div>

                  {/* Additional Details */}
                  {entry.details && entry.details.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm text-foreground">Key Highlights:</h4>
                      <ul className="space-y-1">
                        {entry.details.map((detail, detailIndex) => (
                          <li key={detailIndex} className="text-sm text-muted-foreground flex items-start">
                            <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimelineComponent;