import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { X, Calendar, MessageSquare, Send } from 'lucide-react'
import { callRequestAPI, CallRequestInsert } from '@/lib/callRequestAPI'

interface RequestCallModalProps {
  alumniId: string
  alumniName: string
  onClose: () => void
  onSuccess: () => void
}

const RequestCallModal = ({ alumniId, alumniName, onClose, onSuccess }: RequestCallModalProps) => {
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
      // Get current student user
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}')
      if (!currentUser.userId) {
        throw new Error('Student user not found')
      }

      const requestData: CallRequestInsert = {
        student_user_id: currentUser.userId,
        alumni_user_id: alumniId,
        scheduled_date: scheduledDate,
        description: description.trim(),
        status: 'pending'
      }

      await callRequestAPI.createRequest(requestData)
      
      alert('Call request sent successfully! The alumni will be notified.')
      onSuccess()
      onClose()
    } catch (err) {
      console.error('Error creating call request:', err)
      setError('Failed to send call request. Please try again.')
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