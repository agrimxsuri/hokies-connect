import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, User } from "lucide-react";
import CallRequestManagement from "@/components/CallRequestManagement";
import AlumniProfileDisplay from "@/components/AlumniProfileDisplay";
import { userDataManager } from "@/lib/dataManager";

const AlumniDashboard = () => {
  const [activeTab, setActiveTab] = useState("calls");

  // Debug: Check if component loads
  console.log('🔍 DEBUG - AlumniDashboard component loaded');
  console.log('🔍 DEBUG - Current user in AlumniDashboard:', userDataManager.getCurrentUser());

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-vt-maroon mb-2">
            Alumni Dashboard
          </h1>
          <p className="text-lg text-gray-600">
            Manage your schedule and maintain your profile
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="calls" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Call Requests
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
          </TabsList>

          {/* Call Requests Tab */}
          <TabsContent value="calls" className="space-y-6">
            <CallRequestManagement />
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <AlumniProfileDisplay />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AlumniDashboard;
