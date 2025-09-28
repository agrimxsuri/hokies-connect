import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { callRequestAPI } from '@/lib/callRequestAPI'
import { supabase } from '@/lib/supabase'

const CallRequestDebug = () => {
  const [allRequests, setAllRequests] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const loadAllRequests = async () => {
    setIsLoading(true)
    try {
      console.log('🔍 Debug: Loading all call requests from database...')
      
      const { data, error } = await supabase
        .from('call_requests')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('❌ Debug: Error loading all requests:', error)
        return
      }

      console.log('✅ Debug: All call requests loaded:', data)
      setAllRequests(data || [])
    } catch (err) {
      console.error('❌ Debug: Error in loadAllRequests:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const testCreateRequest = async () => {
    try {
      console.log('🧪 Debug: Creating test call request...')
      
      const testRequest = {
        student_user_id: 'test_student_123',
        alumni_user_id: 'test_alumni_456',
        scheduled_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
        message: 'Test call request from debug component',
        status: 'pending'
      }

      const result = await callRequestAPI.createRequest(testRequest)
      console.log('✅ Debug: Test request created:', result)
      
      // Reload all requests
      await loadAllRequests()
    } catch (err) {
      console.error('❌ Debug: Error creating test request:', err)
    }
  }

  useEffect(() => {
    loadAllRequests()
  }, [])

  return (
    <Card className="w-full max-w-4xl mx-auto mb-8">
      <CardHeader>
        <CardTitle>Call Request Debug</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-4">
          <Button onClick={loadAllRequests} disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Refresh All Requests'}
          </Button>
          <Button onClick={testCreateRequest} variant="outline">
            Create Test Request
          </Button>
        </div>

        <div>
          <h3 className="font-semibold mb-2">All Call Requests in Database ({allRequests.length})</h3>
          {allRequests.length === 0 ? (
            <p className="text-muted-foreground">No call requests found in database</p>
          ) : (
            <div className="space-y-2">
              {allRequests.map((request, index) => (
                <div key={request.id || index} className="p-3 bg-gray-50 rounded text-sm">
                  <div><strong>ID:</strong> {request.id}</div>
                  <div><strong>Student:</strong> {request.student_user_id}</div>
                  <div><strong>Alumni:</strong> {request.alumni_user_id}</div>
                  <div><strong>Status:</strong> {request.status}</div>
                  <div><strong>Message:</strong> {request.message}</div>
                  <div><strong>Created:</strong> {new Date(request.created_at).toLocaleString()}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default CallRequestDebug
