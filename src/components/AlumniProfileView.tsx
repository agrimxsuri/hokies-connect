import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  X, 
  Building, 
  MapPin, 
  GraduationCap, 
  Mail, 
  ExternalLink, 
  Phone,
  Calendar,
  Star
} from 'lucide-react'
import { alumniDataManager, AlumniProfile } from '@/lib/alumniDataManager'

interface AlumniProfileViewProps {
  alumniId: string
  onClose: () => void
}

const AlumniProfileView = ({ alumniId, onClose }: AlumniProfileViewProps) => {
  const [profile, setProfile] = useState<AlumniProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadProfile()
  }, [alumniId])

  const loadProfile = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const alumniProfile = await alumniDataManager.getProfileById(alumniId)
      if (alumniProfile) {
        setProfile(alumniProfile)
      } else {
        setError('Alumni profile not found')
      }
    } catch (err) {
      console.error('Error loading alumni profile:', err)
      setError('Error loading profile')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <CardContent className="pt-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vt-maroon mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading profile...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Profile Not Found</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-4">{error || 'Profile not found'}</p>
            <Button onClick={onClose} variant="outline">
              Close
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl text-vt-maroon">Alumni Profile</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Profile Header */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col items-center">
              <Avatar className="h-32 w-32 mb-4">
                <AvatarImage src={profile.profilePicture} />
                <AvatarFallback className="bg-vt-maroon text-white text-2xl">
                  {profile.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
            </div>
            
            <div className="flex-1 space-y-4">
              <div>
                <h2 className="text-3xl font-bold text-vt-maroon mb-2">{profile.name}</h2>
                <p className="text-lg text-muted-foreground">Virginia Tech Alumni</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Building className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{profile.currentPosition}</p>
                    <p className="text-sm text-muted-foreground">{profile.company}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-sm text-muted-foreground">{profile.location}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Graduation Year</p>
                    <p className="text-sm text-muted-foreground">Class of {profile.graduationYear}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Major(s)</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {profile.majors.map((major, index) => (
                        <Badge key={index} variant="secondary" className="bg-vt-maroon/10 text-vt-maroon">
                          {major}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-xl font-semibold text-vt-maroon mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profile.contact.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{profile.contact.email}</span>
                </div>
              )}
              
              {profile.contact.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{profile.contact.phone}</span>
                </div>
              )}
              
              {profile.contact.linkedin && (
                <div className="flex items-center gap-2">
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  <a 
                    href={`https://${profile.contact.linkedin}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-vt-maroon hover:underline"
                  >
                    LinkedIn Profile
                  </a>
                </div>
              )}
              
              {profile.contact.website && (
                <div className="flex items-center gap-2">
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  <a 
                    href={profile.contact.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-vt-maroon hover:underline"
                  >
                    Personal Website
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Professional Experience */}
          <div>
            <h3 className="text-xl font-semibold text-vt-maroon mb-4">Professional Experience</h3>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-lg">{profile.currentPosition}</h4>
                <p className="text-vt-maroon font-medium">{profile.company}</p>
                <p className="text-sm text-muted-foreground">{profile.location}</p>
              </div>
            </div>
          </div>

          {/* Education */}
          <div>
            <h3 className="text-xl font-semibold text-vt-maroon mb-4">Education</h3>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-lg">Virginia Tech</h4>
                <p className="text-vt-maroon font-medium">
                  {profile.majors.join(', ')} • Class of {profile.graduationYear}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6 border-t">
            <Button 
              onClick={onClose} 
              variant="outline" 
              className="flex-1"
            >
              Close
            </Button>
            <Button 
              className="flex-1 bg-vt-maroon hover:bg-vt-maroon-light text-white"
              onClick={() => {
                // Here you could add logic to request a call or send a message
                alert('This would initiate a connection request with the alumni.')
              }}
            >
              Request Connection
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AlumniProfileView