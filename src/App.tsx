import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import UserTypeSelection from "./pages/UserTypeSelection";
import StudentProfile from "./pages/StudentProfile";
import StudentDashboard from "./pages/StudentDashboard";
import AlumniProfile from "./components/AlumniProfile";
import AlumniProfilePage from "./pages/AlumniProfilePage";
import AlumniProfileTest from "./pages/AlumniProfileTest";
import AlumniProfileSimple from "./pages/AlumniProfileSimple";
import AlumniDashboard from "./pages/AlumniDashboard";
import AlumniRequests from "./pages/AlumniRequests";
import DataManagerTest from "./pages/DataManagerTest";
import QuickNav from "./pages/QuickNav";
import SetupTestData from "./pages/SetupTestData";
import TestAlumniDataManager from "./pages/TestAlumniDataManager";
import CallRequestsPanel from "./components/CallRequestsPanel";
import ErrorBoundary from "./components/ErrorBoundary";
import AlumniProfileView from "./components/AlumniProfileView";
import Index from "./pages/Index";
import Connect from "./pages/Connect";
import Schedule from "./pages/Schedule";
import Profile from "./pages/Profile";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Settings from "./pages/Settings";
import SetupAlumni from "./pages/SetupAlumni";
import NotFound from "./pages/NotFound";
import { RouteGuard } from "./components/RouteGuard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/user-type" element={<UserTypeSelection />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/setup-alumni" element={<SetupAlumni />} />
          
          {/* Protected Routes */}
          <Route path="/student-profile" element={<ErrorBoundary><StudentProfile /></ErrorBoundary>} />
          <Route path="/student-dashboard" element={<ErrorBoundary><StudentDashboard /></ErrorBoundary>} />
          <Route path="/alumni-profile" element={<ErrorBoundary><AlumniProfilePage /></ErrorBoundary>} />
          <Route path="/alumni-profile-edit" element={<ErrorBoundary><AlumniProfile /></ErrorBoundary>} />
          <Route path="/alumni-dashboard" element={<ErrorBoundary><AlumniDashboard /></ErrorBoundary>} />
          <Route path="/alumni-requests" element={<ErrorBoundary><AlumniRequests /></ErrorBoundary>} />
          <Route path="/home" element={<Index />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          
          {/* Development/Test Routes */}
          <Route path="/alumni-profile-test" element={<ErrorBoundary><AlumniProfileTest /></ErrorBoundary>} />
          <Route path="/alumni-profile-simple" element={<ErrorBoundary><AlumniProfileSimple /></ErrorBoundary>} />
          <Route path="/data-manager-test" element={<ErrorBoundary><DataManagerTest /></ErrorBoundary>} />
          <Route path="/quick-nav" element={<QuickNav />} />
          <Route path="/setup-test-data" element={<SetupTestData />} />
          <Route path="/test-alumni-manager" element={<TestAlumniDataManager />} />
          <Route path="/call-requests" element={<ErrorBoundary><CallRequestsPanel /></ErrorBoundary>} />
          <Route path="/alumni/:id" element={<AlumniProfileView />} />
          <Route path="/connect" element={<Connect />} />
          
          {/* Catch-all Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
