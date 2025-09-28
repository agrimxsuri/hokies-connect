import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, AlertCircle, Building } from "lucide-react";
import { callRequestAPI, type CallRequest } from "@/lib/callRequestAPI";
import { userDataManager } from "@/lib/userDataManager";

interface CallRequestWithAlumni extends CallRequest {
  alumni_profiles?: {
    name: string
    current_position: string
    company: string
    profile_picture: string
  }
}

const Schedule = () => {
  const [requests, setRequests] = useState<CallRequestWithAlumni[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    load()
  }, [])

  const load = async () => {
    try {
      setIsLoading(true)
      setError("")
      const current = userDataManager.getCurrentUser()
      if (!current || current.userType !== "student") {
        setError("Student not signed in")
        return
      }
      const data = await callRequestAPI.getRequestsForStudent(current.userId)
      setRequests(data)
    } catch (e) {
      setError("Failed to load schedule")
    } finally {
      setIsLoading(false)
    }
  }

  const fmt = (iso?: string | null) => {
    if (!iso) return "Not scheduled"
    const d = new Date(iso)
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
  }

  const statusBadge = (s: string) => {
    const base = "flex items-center gap-1"
    if (s === "accepted") return <Badge className={`${base} bg-green-100 text-green-800 border-green-200`}>Accepted</Badge>
    if (s === "declined") return <Badge className={`${base} bg-red-100 text-red-800 border-red-200`}>Declined</Badge>
    return <Badge className={`${base} bg-yellow-100 text-yellow-800 border-yellow-200`}>Pending</Badge>
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vt-maroon mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading your schedule...</p>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-vt-maroon mb-2">Schedule</h1>
          <p className="text-lg text-gray-600">Your requested calls with alumni</p>
        </div>

        {error && (
          <Card className="mb-6">
            <CardContent className="pt-6 text-center">
              <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-3" />
              <p className="text-red-600 mb-3">{error}</p>
              <Button variant="outline" onClick={load}>Try Again</Button>
            </CardContent>
          </Card>
        )}

        {requests.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No scheduled calls yet</h3>
              <p className="text-muted-foreground">Go to Connect and request a call with an alumni.</p>
              <div className="mt-4">
                <Button onClick={() => (window.location.href = "/student-dashboard")}>Go to Connect</Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Scheduled Calls ({requests.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {requests.map((r) => (
                  <div key={r.id} className="p-4 bg-gray-50 rounded-lg border">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={r.alumni_profiles?.profile_picture} />
                          <AvatarFallback className="bg-vt-maroon text-white">
                            {r.alumni_profiles?.name?.split(" ").map(n => n[0]).join("") || "A"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg">{r.alumni_profiles?.name || "Alumni Member"}</h4>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                            <Building className="h-4 w-4" />
                            <span>{r.alumni_profiles?.current_position} at {r.alumni_profiles?.company}</span>
                          </div>
                          <div className="bg-vt-maroon/10 p-3 rounded-lg mb-3">
                            <div className="flex items-center gap-2 text-vt-maroon font-medium mb-1">
                              <Clock className="h-4 w-4" />
                              <span>Scheduled Call</span>
                            </div>
                            <div className="text-sm text-vt-maroon">
                              <div className="font-medium">{fmt(r.scheduled_time)}</div>
                              <div className="text-muted-foreground mt-1">{r.message}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {statusBadge(r.status)}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default Schedule;