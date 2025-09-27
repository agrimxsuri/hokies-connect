import Header from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Users } from "lucide-react";

const Schedule = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <Calendar className="h-16 w-16 text-primary mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Schedule Management
            </h1>
            <p className="text-xl text-muted-foreground">
              Manage your mentorship sessions and networking calls
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="shadow-card hover:shadow-elevated transition-shadow duration-300">
              <CardContent className="p-6 text-center">
                <Clock className="h-12 w-12 text-accent mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Upcoming Sessions</h3>
                <p className="text-muted-foreground mb-4">
                  View and manage your scheduled calls with alumni
                </p>
                <Button variant="outline" className="w-full">
                  View Calendar
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-card hover:shadow-elevated transition-shadow duration-300">
              <CardContent className="p-6 text-center">
                <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Find Mentors</h3>
                <p className="text-muted-foreground mb-4">
                  Browse available alumni and schedule new sessions
                </p>
                <Button variant="vt" className="w-full">
                  Browse Alumni
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-8 shadow-card">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
                  <div className="text-left">
                    <p className="font-medium">Call with Sarah Chen</p>
                    <p className="text-sm text-muted-foreground">Software Engineering Career Path</p>
                  </div>
                  <span className="text-sm text-muted-foreground">Yesterday, 2:00 PM</span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
                  <div className="text-left">
                    <p className="font-medium">Upcoming: Call with Michael Rodriguez</p>
                    <p className="text-sm text-muted-foreground">Product Management Insights</p>
                  </div>
                  <span className="text-sm text-accent font-medium">Tomorrow, 3:30 PM</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Schedule;