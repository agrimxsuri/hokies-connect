import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/lib/supabase'

const DatabaseDebug = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<any>(null)

  const checkDatabase = async () => {
    setIsLoading(true)
    try {
      console.log('Checking database...')
      
      // Check students
      const { data: students, error: studentsError } = await supabase
        .from('student_profiles')
        .select('*')
        .limit(5)

      // Check alumni
      const { data: alumni, error: alumniError } = await supabase
        .from('alumni_profiles')
        .select('*')
        .limit(5)

      // Check matches
      const { data: matches, error: matchesError } = await supabase
        .from('matches')
        .select('*')
        .limit(5)

      setResults({
        students: {
          count: students?.length || 0,
          data: students,
          error: studentsError
        },
        alumni: {
          count: alumni?.length || 0,
          data: alumni,
          error: alumniError
        },
        matches: {
          count: matches?.length || 0,
          data: matches,
          error: matchesError
        }
      })

    } catch (error) {
      console.error('Error checking database:', error)
      setResults({ error: error.message })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Database Debug</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={checkDatabase} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? 'Checking...' : 'Check Database Status'}
        </Button>
        
        {results && (
          <div className="space-y-4">
            {results.error ? (
              <div className="text-red-600 p-4 bg-red-50 rounded">
                Error: {results.error}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-blue-50 rounded">
                    <h3 className="font-semibold text-blue-800">Students</h3>
                    <p className="text-2xl font-bold text-blue-600">{results.students.count}</p>
                    {results.students.error && (
                      <p className="text-red-600 text-sm">Error: {results.students.error.message}</p>
                    )}
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded">
                    <h3 className="font-semibold text-green-800">Alumni</h3>
                    <p className="text-2xl font-bold text-green-600">{results.alumni.count}</p>
                    {results.alumni.error && (
                      <p className="text-red-600 text-sm">Error: {results.alumni.error.message}</p>
                    )}
                  </div>
                  
                  <div className="p-4 bg-purple-50 rounded">
                    <h3 className="font-semibold text-purple-800">Matches</h3>
                    <p className="text-2xl font-bold text-purple-600">{results.matches.count}</p>
                    {results.matches.error && (
                      <p className="text-red-600 text-sm">Error: {results.matches.error.message}</p>
                    )}
                  </div>
                </div>

                {results.alumni.data && results.alumni.data.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Sample Alumni Data:</h4>
                    <div className="space-y-2">
                      {results.alumni.data.slice(0, 3).map((alumni: any, index: number) => (
                        <div key={index} className="p-2 bg-gray-50 rounded text-sm">
                          <p><strong>Name:</strong> {alumni.name}</p>
                          <p><strong>Company:</strong> {alumni.company}</p>
                          <p><strong>Position:</strong> {alumni.current_position}</p>
                          <p><strong>User ID:</strong> {alumni.user_id}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {results.students.data && results.students.data.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Sample Student Data:</h4>
                    <div className="space-y-2">
                      {results.students.data.slice(0, 2).map((student: any, index: number) => (
                        <div key={index} className="p-2 bg-gray-50 rounded text-sm">
                          <p><strong>Name:</strong> {student.name}</p>
                          <p><strong>Majors:</strong> {student.majors?.join(', ')}</p>
                          <p><strong>User ID:</strong> {student.user_id}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default DatabaseDebug
