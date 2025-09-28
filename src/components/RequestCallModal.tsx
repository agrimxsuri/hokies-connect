import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, MessageCircle, Video } from "lucide-react";
import { callRequestManager, studentDataManager } from "@/lib/dataManager";

interface RequestCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  alumniId: string;
  alumniName: string;
  alumniCompany: string;
}

const RequestCallModal = ({ isOpen, onClose, alumniId, alumniName, alumniCompany }: RequestCallModalProps) => {
  const [formData, setFormData] = useState({
    date: "",
    description: "",
    meetingLink: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.date || !formData.description) {
      alert("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const studentProfile = studentDataManager.getCurrentProfile();
      if (!studentProfile) {
        alert("Student profile not found. Please create your profile first.");
        return;
      }

      // Send call request
      console.log('🔍 DEBUG - Sending call request with:', {
        studentId: studentProfile.id,
        alumniId,
        date: formData.date,
        description: formData.description,
        meetingLink: formData.meetingLink
      });
      
      const callRequest = callRequestManager.sendRequest(
        studentProfile.id,
        alumniId,
        formData.date,
        formData.description,
        formData.meetingLink || undefined
      );

      console.log('🔍 DEBUG - Call request sent:', callRequest);
      console.log('🔍 DEBUG - All call requests after sending:', callRequestManager.getAllRequests());
      
      // Reset form
      setFormData({
        date: "",
        description: "",
        meetingLink: ""
      });

      alert(`Call request sent successfully! ${alumniName} will be notified and can accept or reject your request.`);
      onClose();
    } catch (error) {
      console.error('Error sending call request:', error);
      alert("Error sending call request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isFormValid = formData.date && formData.description;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-vt-maroon" />
            Request a Call with {alumniName}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            {alumniCompany} • Send a request for a call and they can accept or reject it
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="date">Preferred Date *</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange("date", e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">What would you like to discuss? *</Label>
            <Textarea
              id="description"
              placeholder="Please describe what you'd like to discuss during the call. This helps the alumni prepare and understand your needs."
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="meetingLink">Meeting Link (Optional)</Label>
            <div className="relative">
              <Video className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="meetingLink"
                placeholder="https://meet.google.com/abc-defg-hij"
                value={formData.meetingLink}
                onChange={(e) => handleInputChange("meetingLink", e.target.value)}
                className="pl-10"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Google Meet, Zoom, Teams, or other video platform (optional)
            </p>
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!isFormValid || isSubmitting}
              className="bg-vt-maroon hover:bg-vt-maroon-dark text-white"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Sending Request...
                </>
              ) : (
                <>
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Send Request
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RequestCallModal;
