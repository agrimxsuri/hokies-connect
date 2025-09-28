-- Hokies Connect Database Schema
-- Run this in your Supabase SQL editor

-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create user_meta table
CREATE TABLE IF NOT EXISTS user_meta (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  role TEXT NOT NULL CHECK (role IN ('student', 'alumni')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create student_profiles table
CREATE TABLE IF NOT EXISTS student_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  name TEXT NOT NULL,
  majors TEXT[] DEFAULT '{}',
  current_standing TEXT,
  club_positions TEXT[] DEFAULT '{}',
  minors TEXT[] DEFAULT '{}',
  profile_picture TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create alumni_profiles table
CREATE TABLE IF NOT EXISTS alumni_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  name TEXT NOT NULL,
  graduation_year TEXT NOT NULL,
  current_position TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT NOT NULL,
  majors TEXT[] DEFAULT '{}',
  contact_info JSONB DEFAULT '{}',
  profile_picture TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create hokie_journey table
CREATE TABLE IF NOT EXISTS hokie_journey (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('education', 'club', 'internship', 'research')),
  year_label TEXT NOT NULL,
  title TEXT NOT NULL,
  details TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create professional_experiences table
CREATE TABLE IF NOT EXISTS professional_experiences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  position TEXT NOT NULL,
  company TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  description TEXT,
  achievements TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create call_requests table
CREATE TABLE IF NOT EXISTS call_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  alumni_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  scheduled_time TIMESTAMP WITH TIME ZONE,
  response_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_student_profiles_user_id ON student_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_alumni_profiles_user_id ON alumni_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_hokie_journey_user_id ON hokie_journey(user_id);
CREATE INDEX IF NOT EXISTS idx_professional_experiences_user_id ON professional_experiences(user_id);
CREATE INDEX IF NOT EXISTS idx_call_requests_student ON call_requests(student_user_id);
CREATE INDEX IF NOT EXISTS idx_call_requests_alumni ON call_requests(alumni_user_id);

-- Enable Row Level Security on all tables
ALTER TABLE user_meta ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE alumni_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE hokie_journey ENABLE ROW LEVEL SECURITY;
ALTER TABLE professional_experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE call_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_meta
CREATE POLICY "Users can view their own meta" ON user_meta
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert their own meta" ON user_meta
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own meta" ON user_meta
  FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for student_profiles
CREATE POLICY "Users can view their own student profile" ON student_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own student profile" ON student_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own student profile" ON student_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own student profile" ON student_profiles
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for alumni_profiles
CREATE POLICY "Users can view their own alumni profile" ON alumni_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own alumni profile" ON alumni_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own alumni profile" ON alumni_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own alumni profile" ON alumni_profiles
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for hokie_journey
CREATE POLICY "Users can view their own journey entries" ON hokie_journey
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own journey entries" ON hokie_journey
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own journey entries" ON hokie_journey
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own journey entries" ON hokie_journey
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for professional_experiences
CREATE POLICY "Users can view their own professional experiences" ON professional_experiences
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own professional experiences" ON professional_experiences
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own professional experiences" ON professional_experiences
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own professional experiences" ON professional_experiences
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for call_requests
-- Both student and alumni can read requests they're part of
CREATE POLICY "Users can view call requests they're part of" ON call_requests
  FOR SELECT USING (auth.uid() = student_user_id OR auth.uid() = alumni_user_id);

-- Students can create requests to alumni
CREATE POLICY "Students can create call requests" ON call_requests
  FOR INSERT WITH CHECK (auth.uid() = student_user_id);

-- Both parties can update the request (for status changes)
CREATE POLICY "Users can update call requests they're part of" ON call_requests
  FOR UPDATE USING (auth.uid() = student_user_id OR auth.uid() = alumni_user_id);

-- Both parties can delete the request
CREATE POLICY "Users can delete call requests they're part of" ON call_requests
  FOR DELETE USING (auth.uid() = student_user_id OR auth.uid() = alumni_user_id);

-- Create storage bucket for avatars
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);

-- Storage policies for avatars
CREATE POLICY "Users can upload their own avatars" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view all avatars" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Users can update their own avatars" ON storage.objects
  FOR UPDATE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own avatars" ON storage.objects
  FOR DELETE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_user_meta_updated_at BEFORE UPDATE ON user_meta
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_student_profiles_updated_at BEFORE UPDATE ON student_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_alumni_profiles_updated_at BEFORE UPDATE ON alumni_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hokie_journey_updated_at BEFORE UPDATE ON hokie_journey
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_professional_experiences_updated_at BEFORE UPDATE ON professional_experiences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_call_requests_updated_at BEFORE UPDATE ON call_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
