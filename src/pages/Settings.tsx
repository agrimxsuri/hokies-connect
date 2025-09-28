import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Database, Download, Trash2, CheckCircle, AlertCircle } from 'lucide-react'
import { migrateLocalData } from '@/lib/migration'
import { signOut } from '@/lib/auth'

const Settings = () => {
  const [isMigrating, setIsMigrating] = useState(false)
  const [migrationResult, setMigrationResult] = useState<{
    success: boolean
    message: string
    migrated: {
      studentProfiles: number
      alumniProfiles: number
      callRequests: number
    }
  } | null>(null)
  
  const navigate = useNavigate()

  const handleMigration = async () => {
    setIsMigrating(true)
    setMigrationResult(null)
    
    try {
      const result = await migrateLocalData()
      setMigrationResult(result)
    } catch (error) {
      setMigrationResult({
        success: false,
        message: error instanceof Error ? error.message : 'Migration failed',
        migrated: { studentProfiles: 0, alumniProfiles: 0, callRequests: 0 }
      })
    } finally {
      setIsMigrating(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate('/sign-in')
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => navigate(-1)}
                variant="outline"
                size="sm"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <h1 className="text-2xl font-bold text-vt-maroon">Settings</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Migration Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Data Migration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                If you have existing data stored locally in your browser, you can migrate it to the new database system.
              </p>
              
              {migrationResult && (
                <Alert variant={migrationResult.success ? "default" : "destructive"}>
                  <div className="flex items-center gap-2">
                    {migrationResult.success ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <AlertCircle className="h-4 w-4" />
                    )}
                    <AlertDescription>
                      {migrationResult.message}
                    </AlertDescription>
                  </div>
                </Alert>
              )}

              {migrationResult?.success && (
                <div className="space-y-2">
                  <h4 className="font-medium">Migration Summary:</h4>
                  <div className="flex gap-2">
                    {migrationResult.migrated.studentProfiles > 0 && (
                      <Badge variant="secondary">
                        {migrationResult.migrated.studentProfiles} Student Profile(s)
                      </Badge>
                    )}
                    {migrationResult.migrated.alumniProfiles > 0 && (
                      <Badge variant="secondary">
                        {migrationResult.migrated.alumniProfiles} Alumni Profile(s)
                      </Badge>
                    )}
                    {migrationResult.migrated.callRequests > 0 && (
                      <Badge variant="secondary">
                        {migrationResult.migrated.callRequests} Call Request(s)
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              <Button
                onClick={handleMigration}
                disabled={isMigrating}
                className="bg-vt-maroon hover:bg-vt-maroon-light text-white"
              >
                <Download className="h-4 w-4 mr-2" />
                {isMigrating ? 'Migrating...' : 'Import My Local Data'}
              </Button>
            </CardContent>
          </Card>

          {/* Account Section */}
          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                onClick={handleSignOut}
                variant="outline"
                className="text-red-600 hover:text-red-700 border-red-300"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </CardContent>
          </Card>

          {/* System Information */}
          <Card>
            <CardHeader>
              <CardTitle>System Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Database:</span>
                <Badge variant="outline">Supabase PostgreSQL</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Authentication:</span>
                <Badge variant="outline">Supabase Auth</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Storage:</span>
                <Badge variant="outline">Supabase Storage</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Settings
