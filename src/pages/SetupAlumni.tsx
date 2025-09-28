import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Users, CheckCircle, AlertCircle, Database, Brain, Target } from 'lucide-react'
import { populateAlumniProfiles, checkAlumniProfilesExist } from '@/lib/populateAlumni'

const SetupAlumni = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [isPopulated, setIsPopulated] = useState(false)
  const [error, setError] = useState('')

  const handlePopulate = async () => {
    setIsLoading(true)
    setError('')

    try {
      // Check if alumni already exist
      const alreadyExists = await checkAlumniProfilesExist()
      
      if (alreadyExists) {
        setError('Alumni profiles already exist in the database.')
        setIsLoading(false)
        return
      }

      // Populate alumni profiles
      const success = await populateAlumniProfiles()
      
      if (success) {
        setIsPopulated(true)
      } else {
        setError('Failed to populate alumni profiles. Please try again.')
      }
    } catch (err) {
      setError('An error occurred while populating alumni profiles.')
      console.error('Population error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-6 w-6" />
            Smart AI Matching System Setup
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <Users className="h-16 w-16 text-vt-maroon mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-vt-maroon mb-2">
              Populate Alumni Database
            </h2>
            <p className="text-muted-foreground mb-6">
              This will add 30 pre-configured alumni profiles to your database for smart AI matching.
              These profiles are based on real Virginia Tech alumni data across various majors and industries.
            </p>
          </div>

          {/* Smart Matching Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="h-5 w-5 text-vt-maroon" />
                <h3 className="font-semibold">Cross-Disciplinary Matching</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Computer Science students matched with Mechanical, Electrical, and other Engineering alumni
              </p>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-5 w-5 text-vt-maroon" />
                <h3 className="font-semibold">Industry Relevance</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Matches based on industry alignment, skill transferability, and career progression
              </p>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-5 w-5 text-vt-maroon" />
                <h3 className="font-semibold">30 Alumni Profiles</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Complete dataset with diverse majors, companies, and career paths for comprehensive matching
              </p>
            </Card>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {isPopulated && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Successfully populated 30 alumni profiles! The smart AI matching system is now ready with cross-disciplinary matching capabilities.
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <h3 className="font-semibold">What this will add:</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• 30 alumni profiles across different majors and industries</li>
              <li>• Real companies: Microsoft, Google, Tesla, JPMorgan, etc.</li>
              <li>• Various industries: Software, Finance, Automotive, Cybersecurity</li>
              <li>• Graduation years from 2018-2022</li>
              <li>• Contact information and LinkedIn profiles</li>
              <li>• Smart cross-disciplinary matching algorithms</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Smart Matching Examples:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <h4 className="font-medium text-vt-maroon">Engineering Cross-Matching:</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Computer Science → Software Engineers, Data Analysts</li>
                  <li>• Mechanical → Automotive, Aerospace, Manufacturing</li>
                  <li>• Electrical → Computer Engineering, Telecommunications</li>
                  <li>• Civil → Environmental, Construction, Urban Planning</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-vt-maroon">Industry Alignment:</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Tech majors → Software, Data, Cybersecurity roles</li>
                  <li>• Business majors → Finance, Consulting, Management</li>
                  <li>• Engineering → Product Development, R&D, Manufacturing</li>
                  <li>• Science majors → Research, Academia, Government</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              onClick={handlePopulate}
              disabled={isLoading || isPopulated}
              className="bg-vt-maroon hover:bg-vt-maroon-light text-white"
            >
              {isLoading ? 'Populating...' : isPopulated ? 'Already Populated' : 'Populate Alumni Database'}
            </Button>
            
            {isPopulated && (
              <Button
                onClick={() => window.location.href = '/'}
                variant="outline"
              >
                Go to App
              </Button>
            )}
          </div>

          <div className="text-xs text-muted-foreground">
            <p><strong>Note:</strong> This only needs to be run once. The alumni profiles will be used for smart AI matching with student profiles.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default SetupAlumni