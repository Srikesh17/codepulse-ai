import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/authApi';

const AuthContext = createContext(null);

const DEMO_USER = {
  id: 'usr_demo_guest',
  name: 'Alex Rivera (Guest Demo)',
  fullName: 'Alex Rivera (Guest Demo)',
  email: 'alex.rivera@codepulse.ai',
  avatarUrl: null,
  role: 'Guest Student (Demo Preview)',
  isDemo: true,
  preferredLanguage: 'python',
  learningGoal: 'Explore Socratic Guidance (Demo)',
  bio: 'Exploring CodePulse AI frontend features.',
  problemsSolved: 14,
  streakDays: 5,
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [sessionExpiredNotice, setSessionExpiredNotice] = useState(false);

  // Check active session on initial page load / refresh via GET /api/auth/me
  useEffect(() => {
    let isMounted = true;

    async function checkCurrentSession() {
      // Check if user was in guest demo mode
      const demoFlag = localStorage.getItem('codepulse_demo_mode');
      if (demoFlag === 'true') {
        if (isMounted) {
          setUser(DEMO_USER);
          setInitialLoading(false);
        }
        return;
      }

      try {
        const response = await authApi.getMe();
        if (isMounted && response?.user) {
          setUser({
            ...response.user,
            name: response.user.fullName || response.user.name,
            isDemo: false,
          });
        }
      } catch (err) {
        // Unauthenticated or backend offline - user remains null
        if (isMounted) {
          setUser(null);
          localStorage.removeItem('codepulse_token');
        }
      } finally {
        if (isMounted) {
          setInitialLoading(false);
        }
      }
    }

    checkCurrentSession();

    // Listen for 401 events emitted by the API client
    const handleSessionExpired = () => {
      if (isMounted) {
        setUser((currentUser) => {
          if (currentUser && !currentUser.isDemo) {
            setSessionExpiredNotice(true);
          }
          return null;
        });
        localStorage.removeItem('codepulse_demo_mode');
        localStorage.removeItem('codepulse_token');
      }
    };
    window.addEventListener('codepulse:session-expired', handleSessionExpired);

    return () => {
      isMounted = false;
      window.removeEventListener('codepulse:session-expired', handleSessionExpired);
    };
  }, []);

  // Real Backend Registration
  const signup = async (fullName, email, password) => {
    setLoading(true);
    localStorage.removeItem('codepulse_demo_mode');
    try {
      const response = await authApi.register({ fullName, email, password });
      if (response?.token) {
        localStorage.setItem('codepulse_token', response.token);
      }
      const authenticatedUser = {
        ...response.user,
        name: response.user.fullName,
        isDemo: false,
      };
      setUser(authenticatedUser);
      setSessionExpiredNotice(false);
      setLoading(false);
      return { success: true, user: authenticatedUser };
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  // Real Backend Login
  const login = async (email, password) => {
    setLoading(true);
    localStorage.removeItem('codepulse_demo_mode');
    try {
      const response = await authApi.login({ email, password });
      if (response?.token) {
        localStorage.setItem('codepulse_token', response.token);
      }
      const authenticatedUser = {
        ...response.user,
        name: response.user.fullName,
        isDemo: false,
      };
      setUser(authenticatedUser);
      setSessionExpiredNotice(false);
      setLoading(false);
      return { success: true, user: authenticatedUser };
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  // Instant Guest Demo Mode (explicitly marked isDemo: true)
  // BUG FIX: Do NOT overwrite a real authenticated user with the demo account.
  const exploreDemo = () => {
    if (user && !user.isDemo) {
      // Real user is already logged in — redirect them to their dashboard instead
      return user;
    }
    localStorage.setItem('codepulse_demo_mode', 'true');
    setUser(DEMO_USER);
    return DEMO_USER;
  };

  // Real Backend Logout
  const logout = async () => {
    setLoading(true);
    localStorage.removeItem('codepulse_demo_mode');
    localStorage.removeItem('codepulse_token');
    try {
      if (user && !user.isDemo) {
        await authApi.logout();
      }
    } catch (err) {
      // Even if backend fails, clear client state
      console.warn('Logout network notice:', err.message);
    } finally {
      setUser(null);
      setLoading(false);
    }
  };

  const updateProfile = (updates) => {
    setUser((prev) => (prev ? { ...prev, ...updates, name: updates.fullName || prev.name } : null));
  };

  const triggerSessionExpired = () => {
    setUser(null);
    localStorage.removeItem('codepulse_demo_mode');
    setSessionExpiredNotice(true);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isDemo: !!user?.isDemo,
        initialLoading,
        loading,
        login,
        signup,
        exploreDemo,
        logout,
        updateProfile,
        sessionExpiredNotice,
        setSessionExpiredNotice,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
