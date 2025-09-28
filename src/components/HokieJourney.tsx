import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Calendar,
  GraduationCap,
  Award,
  Users,
  Briefcase,
  BookOpen
} from "lucide-react";
import { AlumniProfile, JourneyEntry } from "@/lib/dataManager";

interface HokieJourneyProps {
  profile: AlumniProfile;
  onUpdate: () => void;
  editable?: boolean;
}

interface JourneyEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  type: 'student-life' | 'event' | 'award' | 'academic' | 'leadership';
  mediaUrl?: string;
  visibility: 'public' | 'private';
}

const HokieJourney = ({ profile, onUpdate, editable = false }: HokieJourneyProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newEvent, setNewEvent] = useState<Partial<JourneyEvent>>({
    date: '',
    title: '',
    description: '',
    type: 'student-life',
    visibility: 'public'
  });

  const eventTypes = [
    { value: 'student-life', label: 'Student Life', icon: Users },
    { value: 'event', label: 'Event', icon: Calendar },
    { value: 'award', label: 'Award', icon: Award },
    { value: 'academic', label: 'Academic', icon: BookOpen },
    { value: 'leadership', label: 'Leadership', icon: Briefcase }
  ];

  const handleAddEvent = () => {
    if (!newEvent.date || !newEvent.title) return;

    const event: JourneyEntry = {
      id: Date.now().toString(),
      year: new Date(newEvent.date).getFullYear().toString(),
      courses: [],
      gpa: '',
      clubs: [],
      internships: [],
      research: []
    };

    // Convert to the existing format
    const updatedProfile = {
      ...profile,
      journeyEntries: [...profile.journeyEntries, event]
    };

    // Save the updated profile
    // This would need to be implemented in the data manager
    console.log('Adding event:', event);
    setIsAdding(false);
    setNewEvent({
      date: '',
      title: '',
      description: '',
      type: 'student-life',
      visibility: 'public'
    });
  };

  const handleEditEvent = (eventId: string) => {
    setEditingId(eventId);
  };

  const handleSaveEvent = (eventId: string) => {
    // Save logic here
    setEditingId(null);
  };

  const handleDeleteEvent = (eventId: string) => {
    // Delete logic here
    console.log('Deleting event:', eventId);
  };

  const getEventIcon = (type: string) => {
    const eventType = eventTypes.find(et => et.value === type);
    return eventType ? eventType.icon : Calendar;
  };

  const getEventColor = (type: string) => {
    const colors = {
      'student-life': 'bg-blue-100 text-blue-800',
      'event': 'bg-green-100 text-green-800',
      'award': 'bg-yellow-100 text-yellow-800',
      'academic': 'bg-purple-100 text-purple-800',
      'leadership': 'bg-red-100 text-red-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Hokie Journey
          </CardTitle>
          {editable && (
            <Button
              onClick={() => setIsAdding(true)}
              size="sm"
              className="bg-vt-maroon hover:bg-vt-maroon-light text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Event
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Add Event Form */}
          {isAdding && (
            <Card className="border-2 border-dashed border-vt-orange">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Date *</label>
                      <Input
                        type="date"
                        value={newEvent.date}
                        onChange={(e) => setNewEvent(prev => ({ ...prev, date: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Type</label>
                      <Select
                        value={newEvent.type}
                        onValueChange={(value) => setNewEvent(prev => ({ ...prev, type: value as any }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {eventTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              <div className="flex items-center gap-2">
                                <type.icon className="h-4 w-4" />
                                {type.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Title *</label>
                    <Input
                      value={newEvent.title}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Event title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <Textarea
                      value={newEvent.description}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe the event or experience"
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Media URL (optional)</label>
                      <Input
                        value={newEvent.mediaUrl || ''}
                        onChange={(e) => setNewEvent(prev => ({ ...prev, mediaUrl: e.target.value }))}
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Visibility</label>
                      <Select
                        value={newEvent.visibility}
                        onValueChange={(value) => setNewEvent(prev => ({ ...prev, visibility: value as any }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">Public</SelectItem>
                          <SelectItem value="private">Private</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleAddEvent} size="sm" className="bg-vt-maroon hover:bg-vt-maroon-light text-white">
                      <Save className="h-4 w-4 mr-2" />
                      Save Event
                    </Button>
                    <Button 
                      onClick={() => setIsAdding(false)} 
                      variant="outline" 
                      size="sm"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Timeline Events */}
          <div className="space-y-4">
            {profile.journeyEntries.map((entry, index) => (
              <div key={entry.id} className="border-l-4 border-vt-orange pl-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-vt-maroon">{entry.year}</h3>
                      <Badge variant="secondary" className="text-xs">
                        Academic Year
                      </Badge>
                    </div>
                    
                    {/* Courses */}
                    {entry.courses.length > 0 && (
                      <div className="mb-3">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Courses</h4>
                        <div className="flex flex-wrap gap-1">
                          {entry.courses.map((course, i) => (
                            <Badge key={i} variant="default" className="bg-vt-maroon text-white text-xs">
                              {course}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* GPA */}
                    {entry.gpa && (
                      <div className="mb-3">
                        <h4 className="text-sm font-medium text-gray-700 mb-1">GPA</h4>
                        <p className="text-sm text-gray-600">{entry.gpa}</p>
                      </div>
                    )}

                    {/* Clubs */}
                    {entry.clubs.length > 0 && (
                      <div className="mb-3">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Clubs & Organizations</h4>
                        <div className="flex flex-wrap gap-1">
                          {entry.clubs.map((club, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {club}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Internships/Jobs */}
                    {entry.internships.length > 0 && (
                      <div className="mb-3">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Internships & Jobs</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {entry.internships.map((internship, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <div className="w-1 h-1 bg-vt-orange rounded-full"></div>
                              {internship}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Research/Projects */}
                    {entry.research.length > 0 && (
                      <div className="mb-3">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Research & Projects</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {entry.research.map((project, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <div className="w-1 h-1 bg-vt-orange rounded-full"></div>
                              {project}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  
                  {editable && (
                    <div className="flex gap-1 ml-4">
                      <Button
                        onClick={() => handleEditEvent(entry.id)}
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        onClick={() => handleDeleteEvent(entry.id)}
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {profile.journeyEntries.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <GraduationCap className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No journey entries yet.</p>
              {editable && (
                <Button
                  onClick={() => setIsAdding(true)}
                  className="mt-4"
                  variant="outline"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Event
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default HokieJourney;
