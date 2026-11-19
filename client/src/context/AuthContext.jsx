import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const DEMO_USER = {
  id: 'usr_demo_402',
  name: 'Alex Rivera',
  email: 'alex.rivera@codepulse.ai',
  avatarUrl: null,
  role: 'Student (Demo)',
  isDemo: true,
  joinedDate: 'October 2024',
  problemsSolved: 14,
  streakDays: 5,
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('codepulse_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('codepulse_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('codepulse_user');
    }
  }, [user]);

  // Demo Login
  const login = async (email, password, rememberMe = false) => {
    setLoading(true);
    // Simulate slight network delay for realistic UI state
    await new Promise((resolve) => setTimeout(resolve, 600));

    // Simulated student user
    const newUser = {
      id: 'usr_' + Math.random().toString(36).substring(2, 9),
      name: email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) || 'Demo Student',
      email: email,
      avatarUrl: null,
      role: 'Student (Frontend Demo)',
      isDemo: true,
      joinedDate: 'November 2026',
      problemsSolved: 8,
      streakDays: 3,
      rememberMe,
    };

    setUser(newUser);
    setLoading(false);
    return { success: true, user: newUser };
  };

  // Demo Signup
  const signup = async (fullName, email, password) => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 600));

    const newUser = {
      id: 'usr_' + Math.random().toString(36).substring(2, 9),
      name: fullName.trim(),
      email: email.trim(),
      avatarUrl: null,
      role: 'Student (Frontend Demo)',
      isDemo: true,
      joinedDate: 'November 2026',
      problemsSolved: 0,
      streakDays: 1,
    };

    setUser(newUser);
    setLoading(false);
    return { success: true, user: newUser };
  };

  // Instant 1-Click Explore Demo
  const exploreDemo = () => {
    setUser(DEMO_USER);
    return DEMO_USER;
  };

  // Logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem('codepulse_user');
  };

  const updateProfile = (updates) => {
    setUser((prev) => (prev ? { ...prev, ...updates } : null));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        signup,
        exploreDemo,
        logout,
        updateProfile,
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
