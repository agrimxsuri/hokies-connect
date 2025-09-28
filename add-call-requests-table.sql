-- Add call_requests table for managing call requests between students and alumni

-- Create call_requests table
CREATE TABLE IF NOT EXISTS call_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_user_id TEXT NOT NULL,
  alumni_user_id TEXT NOT NULL,
  scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
  description TEXT NOT NULL,
  meeting_link TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_call_requests_student ON call_requests(student_user_id);
CREATE INDEX IF NOT EXISTS idx_call_requests_alumni ON call_requests(alumni_user_id);
CREATE INDEX IF NOT EXISTS idx_call_requests_status ON call_requests(status);
CREATE INDEX IF NOT EXISTS idx_call_requests_date ON call_requests(scheduled_date);

-- Disable RLS for call_requests table (since we're not using auth)
ALTER TABLE call_requests DISABLE ROW LEVEL SECURITY;

-- Add trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for call_requests
DROP TRIGGER IF EXISTS update_call_requests_updated_at ON call_requests;
CREATE TRIGGER update_call_requests_updated_at
    BEFORE UPDATE ON call_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
