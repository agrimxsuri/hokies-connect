-- Create matches table for storing student-alumni connections
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS matches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_user_id TEXT NOT NULL,
  alumni_user_id TEXT NOT NULL,
  match_score INTEGER NOT NULL,
  match_reasons TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'connected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_matches_student ON matches(student_user_id);
CREATE INDEX IF NOT EXISTS idx_matches_alumni ON matches(alumni_user_id);
CREATE INDEX IF NOT EXISTS idx_matches_status ON matches(status);

-- Disable RLS for matches table (since we're not using auth)
ALTER TABLE matches DISABLE ROW LEVEL SECURITY;

-- Add trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for matches
DROP TRIGGER IF EXISTS update_matches_updated_at ON matches;
CREATE TRIGGER update_matches_updated_at
    BEFORE UPDATE ON matches
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
