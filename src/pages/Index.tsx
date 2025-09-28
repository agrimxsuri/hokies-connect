import { useState, useEffect } from 'react'
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import StudentDashboard from "@/pages/StudentDashboard";
import { userDataManager } from "@/lib/userDataManager";

const Index = () => {
  const [currentUser, setCurrentUser] = useState<{ userId: string; userType: 'student' | 'alumni' } | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const getUser = () => {
      const user = userDataManager.getCurrentUser()
      console.log('Current user from localStorage:', user)
      console.log('User exists:', !!user)
      console.log('User type:', user?.userType)
      console.log('User ID:', user?.userId)
      if (user) {
        setCurrentUser({ userId: user.userId, userType: user.userType })
        console.log('Set current user:', { userId: user.userId, userType: user.userType })
      } else {
        console.log('No user found, showing landing page')
      }
      setIsLoading(false)
    }
    getUser()
  }, [])

  // Show loading spinner while checking user
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vt-maroon mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // If user is logged in, show their dashboard
  if (currentUser) {
    if (currentUser.userType === 'student') {
      return <StudentDashboard />
    }
    // For alumni, redirect to alumni dashboard
    if (currentUser.userType === 'alumni') {
      window.location.href = '/alumni-dashboard'
      return null
    }
  }

  // If no user logged in, show landing page
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
    </div>
  );
};

export default Index;
