import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GraduationCap } from "lucide-react";

const Header = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Connect", path: "/connect" },
    { name: "Alumni", path: "/alumni" },
    { name: "Schedule", path: "/schedule" },
  ];

  return (
    <header className="bg-card border-b shadow-subtle sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo and Brand */}
        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <GraduationCap className="h-8 w-8 text-primary" />
          <div className="flex flex-col">
            <span className="font-heading font-bold text-lg leading-none text-primary">
              Virginia Tech
            </span>
            <span className="font-heading font-medium text-sm text-muted-foreground leading-none">
              Alumni Network
            </span>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`font-medium transition-colors hover:text-primary ${
                isActive(item.path) 
                  ? "text-primary border-b-2 border-primary pb-1" 
                  : "text-muted-foreground"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* CTA Button */}
        <Button variant="vt" size="sm" asChild>
          <Link to="/connect">Get Started</Link>
        </Button>
      </div>
    </header>
  );
};

export default Header;