import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GraduationCap, ArrowRight, Users, Calendar, Network, Mail, Check } from "lucide-react";

const LandingPage = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [emailError, setEmailError] = useState("");

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const validateEmail = (email: string) => {
    const vtEmailRegex = /^[^\s@]+@vt\.edu$/;
    return vtEmailRegex.test(email);
  };

  const handleGetStarted = () => {
    setShowEmailForm(true);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError("");

    if (!email.trim()) {
      setEmailError("Please enter your email address");
      return;
    }

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid @vt.edu email address");
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitted(true);
    setIsSubmitting(false);
    
    // Navigate to user type selection after a brief delay
    setTimeout(() => {
      navigate("/user-type");
    }, 2000);
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
        {!showEmailForm ? (
          <div className={`max-w-4xl mx-auto transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
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
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Hokies
              <span className="block text-vt-orange-light">Connect</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-2xl mx-auto leading-relaxed">
              Reconnect with your Virginia Tech family. 
              <br className="hidden md:block" />
              Build lasting relationships that extend beyond campus.
            </p>

            {/* Feature Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 max-w-3xl mx-auto">
              <div className="flex flex-col items-center text-white/80">
                <div className="bg-white/10 backdrop-blur-sm rounded-full p-4 mb-4 border border-white/20">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Alumni Network</h3>
                <p className="text-sm text-center">Connect with fellow Hokies worldwide</p>
              </div>
              
              <div className="flex flex-col items-center text-white/80">
                <div className="bg-white/10 backdrop-blur-sm rounded-full p-4 mb-4 border border-white/20">
                  <Network className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Smart Matching</h3>
                <p className="text-sm text-center">Find alumni with shared interests</p>
              </div>
              
              <div className="flex flex-col items-center text-white/80">
                <div className="bg-white/10 backdrop-blur-sm rounded-full p-4 mb-4 border border-white/20">
                  <Calendar className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Events</h3>
                <p className="text-sm text-center">Stay updated on alumni gatherings</p>
              </div>
            </div>

            {/* CTA Button */}
            <div className={`transition-all duration-1000 delay-500 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <Button
                onClick={handleGetStarted}
                size="lg"
                className="bg-white text-vt-maroon hover:bg-white/90 hover:text-vt-maroon-light font-semibold px-8 py-4 text-lg rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 group"
              >
                Enter the Network
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        ) : (
          <div className={`max-w-md mx-auto transition-all duration-1000 ${
            showEmailForm ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            {/* Logo */}
            <div className="mb-8 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-white/20 rounded-full blur-xl"></div>
                <div className="relative bg-white/10 backdrop-blur-sm rounded-full p-6 border border-white/20">
                  <GraduationCap className="h-16 w-16 text-white" />
                </div>
              </div>
            </div>

            {/* Email Form */}
            {!isSubmitted ? (
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Join the Network
                </h2>
                <p className="text-lg text-white/90 mb-8">
                  Enter your email to access the Virginia Tech Alumni Network
                </p>

                <form onSubmit={handleEmailSubmit} className="space-y-6">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-white/60" />
                    </div>
                    <Input
                      type="email"
                      placeholder="Enter your @vt.edu email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-12 h-14 text-lg bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-white/60 focus:bg-white/20 focus:border-white/40 rounded-full"
                      disabled={isSubmitting}
                    />
                  </div>
                  
                  {emailError && (
                    <p className="text-red-200 text-sm text-center">{emailError}</p>
                  )}

                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting}
                    className="w-full h-14 bg-white text-vt-maroon hover:bg-white/90 hover:text-vt-maroon-light font-semibold text-lg rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-vt-maroon border-t-transparent rounded-full animate-spin"></div>
                        Joining Network...
                      </div>
                    ) : (
                      <>
                        Join the Network
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>
                </form>
              </div>
            ) : (
              <div className="text-center">
                <div className="mb-6 flex justify-center">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-6 border border-white/20">
                    <Check className="h-16 w-16 text-white" />
                  </div>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Welcome to the Network!
                </h2>
                <p className="text-lg text-white/90 mb-6">
                  You're now part of the Virginia Tech Alumni Network
                </p>
                <div className="flex items-center justify-center gap-2 text-white/80">
                  <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  <span className="ml-2">Redirecting...</span>
                </div>
              </div>
            )}
          </div>
        )}
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

export default LandingPage;
