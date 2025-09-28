// Centralized data management for all profiles and data persistence

export interface StudentProfile {
  id: string;
  name: string;
  majors: string[];
  currentStanding: string;
  clubPositions: string[];
  minors: string[];
  profilePicture: string;
  journeyEntries: JourneyEntry[];
  createdAt: string;
  updatedAt: string;
}

export interface JourneyEntry {
  id: string;
  year: string;
  courses: string[];
  gpa: string;
  clubs: string[];
  internships: string[];
  research: string[];
}

export interface AlumniProfile {
  id: string;
  name: string;
  majors: string[];
  graduationYear: string;
  currentPosition: string;
  company: string;
  location: string;
  profilePicture: string;
  journeyEntries: JourneyEntry[];
  professionalEntries: ProfessionalEntry[];
  resume: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProfessionalEntry {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
  achievements: string[];
}

export interface ConnectionRequest {
  id: string;
  studentId: string;
  alumniId: string;
  status: 'pending' | 'accepted' | 'declined';
  message?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CallRequest {
  id: string;
  studentId: string;
  alumniId: string;
  date: string;
  description: string;
  meetingLink?: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface ScheduledCall {
  id: string;
  studentId: string;
  alumniId: string;
  date: string;
  startTime: string;
  endTime: string;
  meetingType: string;
  meetingLink?: string;
  notes?: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

// Storage keys
const STORAGE_KEYS = {
  STUDENT_PROFILES: 'hokies_connect_student_profiles',
  ALUMNI_PROFILES: 'hokies_connect_alumni_profiles',
  CONNECTION_REQUESTS: 'hokies_connect_connection_requests',
  CALL_REQUESTS: 'hokies_connect_call_requests',
  SCHEDULED_CALLS: 'hokies_connect_scheduled_calls',
  CURRENT_USER: 'hokies_connect_current_user'
} as const;

// Generate unique ID
const generateId = (): string => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

// Get current timestamp
const getCurrentTimestamp = (): string => {
  return new Date().toISOString();
};

// Student Profile Management
export const studentDataManager = {
  // Save student profile
  saveProfile: (profile: Omit<StudentProfile, 'id' | 'createdAt' | 'updatedAt'>): StudentProfile => {
    const data = localStorage.getItem(STORAGE_KEYS.STUDENT_PROFILES);
    const profiles = data ? JSON.parse(data) : [];
    const existingProfile = profiles.find(p => p.name === profile.name);
    
    const studentProfile: StudentProfile = {
      ...profile,
      id: existingProfile?.id || generateId(),
      createdAt: existingProfile?.createdAt || getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp()
    };
    
    const updatedProfiles = existingProfile 
      ? profiles.map(p => p.id === existingProfile.id ? studentProfile : p)
      : [...profiles, studentProfile];
    
    localStorage.setItem(STORAGE_KEYS.STUDENT_PROFILES, JSON.stringify(updatedProfiles));
    return studentProfile;
  },

  // Get all student profiles
  getAllProfiles: (): StudentProfile[] => {
    const data = localStorage.getItem(STORAGE_KEYS.STUDENT_PROFILES);
    return data ? JSON.parse(data) : [];
  },

  // Get student profile by ID
  getProfileById: (id: string): StudentProfile | null => {
    const data = localStorage.getItem(STORAGE_KEYS.STUDENT_PROFILES);
    const profiles = data ? JSON.parse(data) : [];
    return profiles.find(p => p.id === id) || null;
  },

  // Get current student profile by user ID
  getCurrentProfile: (): StudentProfile | null => {
    const currentUser = userDataManager.getCurrentUser();
    if (!currentUser || currentUser.userType !== 'student') {
      return null;
    }
    const data = localStorage.getItem(STORAGE_KEYS.STUDENT_PROFILES);
    const profiles = data ? JSON.parse(data) : [];
    return profiles.find(p => p.id === currentUser.userId) || null;
  },

  // Delete student profile
  deleteProfile: (id: string): boolean => {
    const data = localStorage.getItem(STORAGE_KEYS.STUDENT_PROFILES);
    const profiles = data ? JSON.parse(data) : [];
    const updatedProfiles = profiles.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.STUDENT_PROFILES, JSON.stringify(updatedProfiles));
    return updatedProfiles.length < profiles.length;
  }
};

// Alumni Profile Management
export const alumniDataManager = {
  // Save alumni profile
  saveProfile: (profile: Omit<AlumniProfile, 'id' | 'createdAt' | 'updatedAt'>): AlumniProfile => {
    const data = localStorage.getItem(STORAGE_KEYS.ALUMNI_PROFILES);
    const profiles = data ? JSON.parse(data) : [];
    const existingProfile = profiles.find(p => p.name === profile.name);
    
    const alumniProfile: AlumniProfile = {
      ...profile,
      id: existingProfile?.id || generateId(),
      createdAt: existingProfile?.createdAt || getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp()
    };
    
    const updatedProfiles = existingProfile 
      ? profiles.map(p => p.id === existingProfile.id ? alumniProfile : p)
      : [...profiles, alumniProfile];
    
    localStorage.setItem(STORAGE_KEYS.ALUMNI_PROFILES, JSON.stringify(updatedProfiles));
    return alumniProfile;
  },

  // Get all alumni profiles
  getAllProfiles: (): AlumniProfile[] => {
    const data = localStorage.getItem(STORAGE_KEYS.ALUMNI_PROFILES);
    return data ? JSON.parse(data) : [];
  },

  // Get alumni profile by ID
  getProfileById: (id: string): AlumniProfile | null => {
    const data = localStorage.getItem(STORAGE_KEYS.ALUMNI_PROFILES);
    const profiles = data ? JSON.parse(data) : [];
    return profiles.find(p => p.id === id) || null;
  },

  // Get current alumni profile by user ID
  getCurrentProfile: (): AlumniProfile | null => {
    const currentUser = userDataManager.getCurrentUser();
    if (!currentUser || currentUser.userType !== 'alumni') {
      return null;
    }
    const data = localStorage.getItem(STORAGE_KEYS.ALUMNI_PROFILES);
    const profiles = data ? JSON.parse(data) : [];
    return profiles.find(p => p.id === currentUser.userId) || null;
  },

  // Delete alumni profile
  deleteProfile: (id: string): boolean => {
    const data = localStorage.getItem(STORAGE_KEYS.ALUMNI_PROFILES);
    const profiles = data ? JSON.parse(data) : [];
    const updatedProfiles = profiles.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.ALUMNI_PROFILES, JSON.stringify(updatedProfiles));
    return updatedProfiles.length < profiles.length;
  }
};

// Connection Request Management
export const connectionDataManager = {
  // Send connection request
  sendRequest: (studentId: string, alumniId: string, message?: string): ConnectionRequest => {
    const data = localStorage.getItem(STORAGE_KEYS.CONNECTION_REQUESTS);
    const requests = data ? JSON.parse(data) : [];
    const connectionRequest: ConnectionRequest = {
      id: generateId(),
      studentId,
      alumniId,
      status: 'pending',
      message,
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp()
    };
    
    const updatedRequests = [...requests, connectionRequest];
    localStorage.setItem(STORAGE_KEYS.CONNECTION_REQUESTS, JSON.stringify(updatedRequests));
    return connectionRequest;
  },

  // Get all connection requests
  getAllRequests: (): ConnectionRequest[] => {
    const data = localStorage.getItem(STORAGE_KEYS.CONNECTION_REQUESTS);
    return data ? JSON.parse(data) : [];
  },

  // Get requests by alumni ID
  getRequestsByAlumni: (alumniId: string): ConnectionRequest[] => {
    const data = localStorage.getItem(STORAGE_KEYS.CONNECTION_REQUESTS);
    const requests = data ? JSON.parse(data) : [];
    return requests.filter(r => r.alumniId === alumniId);
  },

  // Get requests by student ID
  getRequestsByStudent: (studentId: string): ConnectionRequest[] => {
    const data = localStorage.getItem(STORAGE_KEYS.CONNECTION_REQUESTS);
    const requests = data ? JSON.parse(data) : [];
    return requests.filter(r => r.studentId === studentId);
  },

  // Update request status
  updateRequestStatus: (id: string, status: 'accepted' | 'declined'): boolean => {
    const data = localStorage.getItem(STORAGE_KEYS.CONNECTION_REQUESTS);
    const requests = data ? JSON.parse(data) : [];
    const request = requests.find(r => r.id === id);
    if (!request) return false;
    
    const updatedRequest = { ...request, status, updatedAt: getCurrentTimestamp() };
    const updatedRequests = requests.map(r => r.id === id ? updatedRequest : r);
    localStorage.setItem(STORAGE_KEYS.CONNECTION_REQUESTS, JSON.stringify(updatedRequests));
    return true;
  }
};

// Call Request Management
export const callRequestManager = {
  // Send call request
  sendRequest: (studentId: string, alumniId: string, date: string, description: string, meetingLink?: string): CallRequest => {
    const requests = callRequestManager.getAllRequests();
    const callRequest: CallRequest = {
      id: generateId(),
      studentId,
      alumniId,
      date,
      description,
      meetingLink,
      status: 'pending',
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp()
    };
    
    const updatedRequests = [...requests, callRequest];
    localStorage.setItem(STORAGE_KEYS.CALL_REQUESTS, JSON.stringify(updatedRequests));
    return callRequest;
  },

  // Get all call requests
  getAllRequests: (): CallRequest[] => {
    const data = localStorage.getItem(STORAGE_KEYS.CALL_REQUESTS);
    return data ? JSON.parse(data) : [];
  },

  // Get requests by alumni ID
  getRequestsByAlumni: (alumniId: string): CallRequest[] => {
    const requests = callRequestManager.getAllRequests();
    return requests.filter(r => r.alumniId === alumniId);
  },

  // Get requests by student ID
  getRequestsByStudent: (studentId: string): CallRequest[] => {
    const requests = callRequestManager.getAllRequests();
    return requests.filter(r => r.studentId === studentId);
  },

  // Update request status
  updateRequestStatus: (id: string, status: 'accepted' | 'rejected'): boolean => {
    const requests = callRequestManager.getAllRequests();
    const request = requests.find(r => r.id === id);
    if (!request) return false;
    
    const updatedRequest = { ...request, status, updatedAt: getCurrentTimestamp() };
    const updatedRequests = requests.map(r => r.id === id ? updatedRequest : r);
    localStorage.setItem(STORAGE_KEYS.CALL_REQUESTS, JSON.stringify(updatedRequests));
    return true;
  },

  // Delete request
  deleteRequest: (id: string): boolean => {
    const data = localStorage.getItem(STORAGE_KEYS.CALL_REQUESTS);
    const requests = data ? JSON.parse(data) : [];
    const updatedRequests = requests.filter(r => r.id !== id);
    localStorage.setItem(STORAGE_KEYS.CALL_REQUESTS, JSON.stringify(updatedRequests));
    return updatedRequests.length < requests.length;
  }
};

// Scheduled Call Management
export const callDataManager = {
  // Schedule a call
  scheduleCall: (studentId: string, alumniId: string, date: string, startTime: string, endTime: string, meetingType: string, meetingLink?: string, notes?: string): ScheduledCall => {
    const data = localStorage.getItem(STORAGE_KEYS.SCHEDULED_CALLS);
    const calls = data ? JSON.parse(data) : [];
    const scheduledCall: ScheduledCall = {
      id: generateId(),
      studentId,
      alumniId,
      date,
      startTime,
      endTime,
      meetingType,
      meetingLink,
      notes,
      status: 'upcoming',
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp()
    };
    
    const updatedCalls = [...calls, scheduledCall];
    localStorage.setItem(STORAGE_KEYS.SCHEDULED_CALLS, JSON.stringify(updatedCalls));
    return scheduledCall;
  },

  // Get all scheduled calls
  getAllCalls: (): ScheduledCall[] => {
    const data = localStorage.getItem(STORAGE_KEYS.SCHEDULED_CALLS);
    return data ? JSON.parse(data) : [];
  },

  // Get calls by alumni ID
  getCallsByAlumni: (alumniId: string): ScheduledCall[] => {
    const data = localStorage.getItem(STORAGE_KEYS.SCHEDULED_CALLS);
    const calls = data ? JSON.parse(data) : [];
    return calls.filter(c => c.alumniId === alumniId);
  },

  // Get calls by student ID
  getCallsByStudent: (studentId: string): ScheduledCall[] => {
    const data = localStorage.getItem(STORAGE_KEYS.SCHEDULED_CALLS);
    const calls = data ? JSON.parse(data) : [];
    return calls.filter(c => c.studentId === studentId);
  },

  // Update call status
  updateCallStatus: (id: string, status: 'upcoming' | 'completed' | 'cancelled'): boolean => {
    const data = localStorage.getItem(STORAGE_KEYS.SCHEDULED_CALLS);
    const calls = data ? JSON.parse(data) : [];
    const call = calls.find(c => c.id === id);
    if (!call) return false;
    
    const updatedCall = { ...call, status, updatedAt: getCurrentTimestamp() };
    const updatedCalls = calls.map(c => c.id === id ? updatedCall : c);
    localStorage.setItem(STORAGE_KEYS.SCHEDULED_CALLS, JSON.stringify(updatedCalls));
    return true;
  },

  // Delete call
  deleteCall: (id: string): boolean => {
    const data = localStorage.getItem(STORAGE_KEYS.SCHEDULED_CALLS);
    const calls = data ? JSON.parse(data) : [];
    const updatedCalls = calls.filter(c => c.id !== id);
    localStorage.setItem(STORAGE_KEYS.SCHEDULED_CALLS, JSON.stringify(updatedCalls));
    return updatedCalls.length < calls.length;
  }
};

// Current User Management
export const userDataManager = {
  // Set current user
  setCurrentUser: (userId: string, userType: 'student' | 'alumni'): void => {
    const userData = { userId, userType, loginTime: getCurrentTimestamp() };
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(userData));
  },

  // Get current user
  getCurrentUser: (): { userId: string; userType: 'student' | 'alumni'; loginTime: string } | null => {
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return data ? JSON.parse(data) : null;
  },

  // Clear current user
  clearCurrentUser: (): void => {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
};

// Data Export/Import
export const dataExportManager = {
  // Export all data
  exportAllData: (): string => {
    const allData = {
      studentProfiles: JSON.parse(localStorage.getItem(STORAGE_KEYS.STUDENT_PROFILES) || '[]'),
      alumniProfiles: JSON.parse(localStorage.getItem(STORAGE_KEYS.ALUMNI_PROFILES) || '[]'),
      connectionRequests: JSON.parse(localStorage.getItem(STORAGE_KEYS.CONNECTION_REQUESTS) || '[]'),
      callRequests: JSON.parse(localStorage.getItem(STORAGE_KEYS.CALL_REQUESTS) || '[]'),
      scheduledCalls: JSON.parse(localStorage.getItem(STORAGE_KEYS.SCHEDULED_CALLS) || '[]'),
      exportDate: getCurrentTimestamp()
    };
    return JSON.stringify(allData, null, 2);
  },

  // Import data
  importData: (jsonData: string): boolean => {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.studentProfiles) {
        localStorage.setItem(STORAGE_KEYS.STUDENT_PROFILES, JSON.stringify(data.studentProfiles));
      }
      if (data.alumniProfiles) {
        localStorage.setItem(STORAGE_KEYS.ALUMNI_PROFILES, JSON.stringify(data.alumniProfiles));
      }
      if (data.connectionRequests) {
        localStorage.setItem(STORAGE_KEYS.CONNECTION_REQUESTS, JSON.stringify(data.connectionRequests));
      }
      if (data.callRequests) {
        localStorage.setItem(STORAGE_KEYS.CALL_REQUESTS, JSON.stringify(data.callRequests));
      }
      if (data.scheduledCalls) {
        localStorage.setItem(STORAGE_KEYS.SCHEDULED_CALLS, JSON.stringify(data.scheduledCalls));
      }
      
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  },

  // Clear all data
  clearAllData: (): void => {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }
};
