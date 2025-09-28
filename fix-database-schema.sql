-- Fix database schema to use TEXT for user_id instead of UUID
-- Run this in Supabase SQL Editor

-- Drop existing tables if they exist
DROP TABLE IF EXISTS student_profiles CASCADE;
DROP TABLE IF EXISTS alumni_profiles CASCADE;
DROP TABLE IF EXISTS hokie_journey CASCADE;
DROP TABLE IF EXISTS professional_experiences CASCADE;
DROP TABLE IF EXISTS call_requests CASCADE;
DROP TABLE IF EXISTS user_meta CASCADE;

-- Recreate tables with TEXT user_id
CREATE TABLE student_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  majors TEXT[] DEFAULT '{}',
  current_standing TEXT,
  club_positions TEXT[] DEFAULT '{}',
  minors TEXT[] DEFAULT '{}',
  profile_picture TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE alumni_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
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

CREATE TABLE hokie_journey (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('education', 'club', 'internship', 'research')),
  year_label TEXT NOT NULL,
  title TEXT NOT NULL,
  details TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE professional_experiences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  position TEXT NOT NULL,
  company TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  description TEXT,
  achievements TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE call_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_user_id TEXT NOT NULL,
  alumni_user_id TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  scheduled_time TIMESTAMP WITH TIME ZONE,
  response_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE user_meta (
  id TEXT PRIMARY KEY,
  role TEXT NOT NULL CHECK (role IN ('student', 'alumni')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_student_profiles_user_id ON student_profiles(user_id);
CREATE INDEX idx_alumni_profiles_user_id ON alumni_profiles(user_id);
CREATE INDEX idx_hokie_journey_user_id ON hokie_journey(user_id);
CREATE INDEX idx_professional_experiences_user_id ON professional_experiences(user_id);
CREATE INDEX idx_call_requests_student ON call_requests(student_user_id);
CREATE INDEX idx_call_requests_alumni ON call_requests(alumni_user_id);

-- Disable RLS for all tables
ALTER TABLE student_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE alumni_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE hokie_journey DISABLE ROW LEVEL SECURITY;
ALTER TABLE professional_experiences DISABLE ROW LEVEL SECURITY;
ALTER TABLE call_requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_meta DISABLE ROW LEVEL SECURITY;

-- Create storage bucket for avatars
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true) ON CONFLICT (id) DO NOTHING;
