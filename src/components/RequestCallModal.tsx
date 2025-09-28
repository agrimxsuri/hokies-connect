import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { X, Calendar, MessageSquare, Send } from 'lucide-react'
import { callRequestAPI, CallRequestInsert } from '@/lib/callRequestAPI'
import { userDataManager } from '@/lib/userDataManager'

// ADDON: Interface for student request data
interface StudentRequestData {
  studentId: string
  alumniId: string
  alumniName: string
  scheduledDate: string
  message: string
  timestamp: string
}

// ADDON: Function to save student request data for schedule management display
const saveStudentRequestData = (data: StudentRequestData) => {
  try {
    // Get existing student requests from localStorage
    const existingRequests = JSON.parse(localStorage.getItem('student_request_data') || '[]')
    
    // Add new request data
    const newRequest = {
      id: `student_req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...data,
      status: 'pending',
      created_at: data.timestamp
    }
    
    // Save to localStorage
    existingRequests.unshift(newRequest)
    localStorage.setItem('student_request_data', JSON.stringify(existingRequests))
    
    console.log('✅ ADDON: Student request data saved:', newRequest)
  } catch (error) {
    console.error('❌ ADDON: Error saving student request data:', error)
  }
}

interface RequestCallModalProps {
  alumniId: string
  alumniName: string
  studentUserId: string
  onClose: () => void
  onSuccess: () => void
}

const RequestCallModal = ({ alumniId, alumniName, studentUserId, onClose, onSuccess }: RequestCallModalProps) => {
  const [scheduledDate, setScheduledDate] = useState('')
  const [description, setDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!scheduledDate || !description.trim()) {
      setError('Please fill in all required fields')
      return
    }

    // Validate date is in the future
    const selectedDate = new Date(scheduledDate)
    const now = new Date()
    if (selectedDate <= now) {
      setError('Please select a future date and time')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      if (!studentUserId) {
        throw new Error('Student user not found')
      }

      const requestData: CallRequestInsert = {
        student_user_id: studentUserId,
        alumni_user_id: alumniId,
        scheduled_time: scheduledDate,
        message: description.trim(),
        status: 'pending'
      }

      // Enhanced logging to verify all data
      console.log('🔄 RequestCallModal: Saving to database with full data:')
      console.log('  - Student ID:', studentUserId)
      console.log('  - Alumni ID:', alumniId)
      console.log('  - Alumni Name:', alumniName)
      console.log('  - Scheduled Time:', scheduledDate)
      console.log('  - Message:', description.trim())
      console.log('  - Full Request Data:', requestData)
      
      await callRequestAPI.createRequest(requestData)
      console.log('✅ RequestCallModal: Successfully saved to database')
      
      // ADDON: Save all student input data for schedule management display
      saveStudentRequestData({
        studentId: studentUserId,
        alumniId: alumniId,
        alumniName: alumniName,
        scheduledDate: scheduledDate,
        message: description.trim(),
        timestamp: new Date().toISOString()
      })
      
      alert('Call request sent successfully! The alumni will be notified.')
      onSuccess()
      onClose()
    } catch (err: any) {
      console.error('Error creating call request:', err)
      const errorMessage = err?.message || err?.error?.message || 'Failed to send call request. Please try again.'
      setError(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl text-vt-maroon">Request Call</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent>
          <div className="mb-4">
            <p className="text-sm text-muted-foreground">
              Request a call with <span className="font-semibold text-vt-maroon">{alumniName}</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="date">Preferred Date & Time *</Label>
              <div className="relative mt-1">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="date"
                  type="datetime-local"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <div className="relative mt-1">
                <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell the alumni what you'd like to discuss..."
                  className="pl-10 min-h-[100px]"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm bg-red-50 p-3 rounded">
                {error}
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                className="flex-1"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="flex-1 bg-vt-maroon hover:bg-vt-maroon-light text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Request
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default RequestCallModal