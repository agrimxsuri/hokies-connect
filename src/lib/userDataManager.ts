// Simple user data manager that works with Supabase
// This manages the current user session without localStorage dependency

export interface UserSession {
  userId: string;
  userType: 'student' | 'alumni';
  loginTime: string;
}

// In-memory storage for current user (resets on page refresh)
let currentUser: UserSession | null = null;

export const userDataManager = {
  // Set current user (in memory only)
  setCurrentUser: (userId: string, userType: 'student' | 'alumni'): void => {
    currentUser = {
      userId,
      userType,
      loginTime: new Date().toISOString()
    };
    console.log('✅ User set in memory:', currentUser);
  },

  // Get current user (from memory)
  getCurrentUser: (): UserSession | null => {
    console.log('🔍 Current user from memory:', currentUser);
    return currentUser;
  },

  // Clear current user
  clearCurrentUser: (): void => {
    currentUser = null;
    console.log('🗑️ User cleared from memory');
  },

  // Check if user is alumni
  isAlumni: (): boolean => {
    return currentUser?.userType === 'alumni';
  },

  // Check if user is student
  isStudent: (): boolean => {
    return currentUser?.userType === 'student';
  },

  // Get user ID
  getUserId: (): string | null => {
    return currentUser?.userId || null;
  }
};
