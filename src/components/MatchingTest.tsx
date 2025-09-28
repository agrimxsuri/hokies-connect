import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { generateMatchesForStudent, getAllProfiles } from '@/lib/matching'
import { supabase } from '@/lib/supabase'

const MatchingTest = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<any>(null)

  const testMatching = async () => {
    setIsLoading(true)
    try {
      console.log('Testing matching system...')
      
      // Get all profiles
      const { students, alumni } = await getAllProfiles()
      console.log('Students:', students.length)
      console.log('Alumni:', alumni.length)
      
      if (students.length === 0) {
        setResults({ error: 'No students found' })
        return
      }
      
      if (alumni.length === 0) {
        setResults({ error: 'No alumni found' })
        return
      }
      
      // Test matching for first student
      const firstStudent = students[0]
      console.log('Testing matches for student:', firstStudent.name)
      
      const matches = await generateMatchesForStudent(firstStudent.user_id)
      console.log('Generated matches:', matches)
      
      setResults({
        student: firstStudent,
        alumniCount: alumni.length,
        matchCount: matches.length,
        matches: matches.slice(0, 5) // Show top 5 matches
      })
      
    } catch (error) {
      console.error('Error testing matching:', error)
      setResults({ error: error.message })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Matching System Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={testMatching} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? 'Testing...' : 'Test Matching System'}
        </Button>
        
        {results && (
          <div className="space-y-4">
            {results.error ? (
              <div className="text-red-600 p-4 bg-red-50 rounded">
                Error: {results.error}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded">
                  <h3 className="font-semibold text-green-800">Test Results:</h3>
                  <p>Student: {results.student.name}</p>
                  <p>Alumni in database: {results.alumniCount}</p>
                  <p>Matches generated: {results.matchCount}</p>
                </div>
                
                {results.matches.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Top Matches:</h4>
                    <div className="space-y-2">
                      {results.matches.map((match: any, index: number) => (
                        <div key={index} className="p-2 bg-gray-50 rounded text-sm">
                          <p>Alumni ID: {match.alumniId}</p>
                          <p>Score: {match.score}%</p>
                          <p>Reasons: {match.reasons.join(', ')}</p>
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

export default MatchingTest
