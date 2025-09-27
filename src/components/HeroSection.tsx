import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, MapPin, Briefcase } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative bg-gradient-subtle py-20 px-4 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-vt rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-vt rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto max-w-4xl text-center relative z-10">
        {/* Main Heading */}
        <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
          Connect with{" "}
          <span className="bg-gradient-vt bg-clip-text text-transparent">
            Virginia Tech Alumni
          </span>
        </h1>

        {/* Subheading */}
        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
          Find and connect with Virginia Tech alumni who share your interests, 
          major, and career goals. Get mentorship, advice, and opportunities.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Button variant="vt" size="lg" className="text-lg px-8" asChild>
            <Link to="/connect">
              Start Connecting
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          
          <Button variant="outline" size="lg" className="text-lg px-8" asChild>
            <Link to="/alumni">Browse Alumni</Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
          <div className="flex flex-col items-center">
            <div className="bg-primary/10 p-4 rounded-full mb-4">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div className="text-2xl font-bold text-foreground">5,000+</div>
            <div className="text-sm text-muted-foreground">Alumni Network</div>
          </div>

          <div className="flex flex-col items-center">
            <div className="bg-accent/10 p-4 rounded-full mb-4">
              <MapPin className="h-6 w-6 text-accent" />
            </div>
            <div className="text-2xl font-bold text-foreground">50+</div>
            <div className="text-sm text-muted-foreground">Cities Worldwide</div>
          </div>

          <div className="flex flex-col items-center">
            <div className="bg-primary/10 p-4 rounded-full mb-4">
              <Briefcase className="h-6 w-6 text-primary" />
            </div>
            <div className="text-2xl font-bold text-foreground">200+</div>
            <div className="text-sm text-muted-foreground">Companies</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;