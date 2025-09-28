import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Users, CheckCircle, AlertCircle, Database } from 'lucide-react'
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
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-6 w-6" />
            Alumni Database Setup
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <Users className="h-16 w-16 text-vt-maroon mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-vt-maroon mb-2">
              Populate Alumni Database
            </h2>
            <p className="text-muted-foreground mb-6">
              This will add 30 pre-configured alumni profiles to your database for AI matching.
              These profiles are based on real Virginia Tech alumni data across various majors and industries.
            </p>
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
                Successfully populated 30 alumni profiles! The AI matching system is now ready.
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <h3 className="font-semibold">What this will add:</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• 30 alumni profiles across different majors</li>
              <li>• Real companies: Microsoft, Google, Tesla, JPMorgan, etc.</li>
              <li>• Various industries: Software, Finance, Automotive, Cybersecurity</li>
              <li>• Graduation years from 2018-2022</li>
              <li>• Contact information and LinkedIn profiles</li>
            </ul>
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
            <p><strong>Note:</strong> This only needs to be run once. The alumni profiles will be used for AI matching with student profiles.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default SetupAlumni
