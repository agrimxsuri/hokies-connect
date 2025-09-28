# Call Requests API Documentation

## Overview
Call requests allow students to request calls with alumni. Alumni can accept or decline these requests.

## Database Schema

### call_requests table
```sql
CREATE TABLE call_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_user_id TEXT NOT NULL,
  alumni_user_id TEXT NOT NULL,
  scheduled_time TIMESTAMP WITH TIME ZONE,
  message TEXT NOT NULL,
  response_message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## API Endpoints

### Create Call Request
**POST** `/call_requests`

**Request Body:**
```typescript
{
  student_user_id: string,    // Required: ID of requesting student
  alumni_user_id: string,     // Required: ID of target alumni
  scheduled_time: string,     // Required: ISO 8601 datetime string (UTC)
  message: string,            // Required: Description of call purpose
  response_message?: string,  // Optional: Alumni's response message
  status?: 'pending' | 'accepted' | 'declined'  // Optional: defaults to 'pending'
}
```

**Response:**
```typescript
{
  id: string,
  student_user_id: string,
  alumni_user_id: string,
  scheduled_time: string,
  message: string,
  response_message: string | null,
  status: 'pending' | 'accepted' | 'declined',
  created_at: string,
  updated_at: string
}
```

### Get Requests for Alumni
**GET** `/call_requests?alumni_user_id={id}`

Returns all call requests where the specified user is the alumni.

### Get Requests for Student  
**GET** `/call_requests?student_user_id={id}`

Returns all call requests where the specified user is the student.

### Update Request Status
**PATCH** `/call_requests/{id}`

**Request Body:**
```typescript
{
  status: 'accepted' | 'declined',
  response_message?: string
}
```

## Field Naming Conventions

- **scheduled_time**: Always use this field name (not scheduled_date)
- **message**: Always use this field name (not description)  
- **response_message**: Alumni's optional response
- **status**: Always lowercase ('pending', 'accepted', 'declined')

## Error Handling

- All API calls return proper error messages
- Database errors are wrapped with descriptive messages
- Frontend shows specific error messages instead of generic failures

## Timezone Handling

- All scheduled_time values are stored as UTC in the database
- Frontend converts to local time for display
- ISO 8601 format is used for all datetime strings
