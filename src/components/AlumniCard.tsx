import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface AlumniCardProps {
  id: string;
  name: string;
  company: string;
  role: string;
  major: string;
  graduationYear: string;
  avatar?: string;
  companyLogo?: string;
}

const AlumniCard = ({ 
  id, 
  name, 
  company, 
  role, 
  major, 
  graduationYear, 
  avatar, 
  companyLogo 
}: AlumniCardProps) => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <Link to={`/alumni/${id}`}>
      <Card className="group cursor-pointer transition-all duration-300 hover:shadow-elevated hover:-translate-y-1">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <Avatar className="h-14 w-14 ring-2 ring-background shadow-card">
              <AvatarImage src={avatar} alt={name} />
              <AvatarFallback className="bg-gradient-vt text-primary-foreground font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg text-card-foreground mb-1 group-hover:text-primary transition-colors">
                {name}
              </h3>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {companyLogo && (
                    <img 
                      src={companyLogo} 
                      alt={`${company} logo`} 
                      className="h-4 w-4 object-contain"
                    />
                  )}
                  <span className="font-medium text-sm text-muted-foreground">
                    {company}
                  </span>
                </div>
                
                <p className="text-sm text-muted-foreground line-clamp-1">
                  {role}
                </p>
              </div>

              {/* Tags */}
              <div className="flex gap-2 mt-3">
                <Badge variant="secondary" className="text-xs">
                  {major}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  Class of {graduationYear}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default AlumniCard;