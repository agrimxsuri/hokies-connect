import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import UserTypeSelection from "./pages/UserTypeSelection";
import StudentProfile from "./pages/StudentProfile";
import AlumniProfile from "./components/AlumniProfile";
import AlumniProfilePage from "./pages/AlumniProfilePage";
import AlumniProfileTest from "./pages/AlumniProfileTest";
import AlumniProfileSimple from "./pages/AlumniProfileSimple";
import AlumniDashboard from "./components/AlumniDashboard";
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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/user-type" element={<UserTypeSelection />} />
          <Route path="/student-profile" element={<StudentProfile />} />
          <Route path="/alumni-profile" element={<ErrorBoundary><AlumniProfilePage /></ErrorBoundary>} />
          <Route path="/alumni-profile-edit" element={<ErrorBoundary><AlumniProfile /></ErrorBoundary>} />
          <Route path="/alumni-profile-test" element={<ErrorBoundary><AlumniProfileTest /></ErrorBoundary>} />
          <Route path="/alumni-profile-simple" element={<ErrorBoundary><AlumniProfileSimple /></ErrorBoundary>} />
          <Route path="/data-manager-test" element={<ErrorBoundary><DataManagerTest /></ErrorBoundary>} />
          <Route path="/quick-nav" element={<QuickNav />} />
          <Route path="/setup-test-data" element={<SetupTestData />} />
          <Route path="/test-alumni-manager" element={<TestAlumniDataManager />} />
          <Route path="/alumni-dashboard" element={<ErrorBoundary><AlumniDashboard /></ErrorBoundary>} />
          <Route path="/alumni-requests" element={<ErrorBoundary><AlumniRequests /></ErrorBoundary>} />
          <Route path="/call-requests" element={<ErrorBoundary><CallRequestsPanel /></ErrorBoundary>} />
          <Route path="/alumni/:id" element={<AlumniProfileView />} />
          <Route path="/home" element={<Index />} />
          <Route path="/connect" element={<Connect />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/profile" element={<Profile />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
