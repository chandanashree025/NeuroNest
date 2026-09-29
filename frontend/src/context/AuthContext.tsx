import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, PatientCard } from '../types';
import { authApi } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  activePatient: PatientCard | null;
  setActivePatient: (patient: PatientCard | null) => void;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  signup: (data: any) => Promise<{ message: string }>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('neuronest_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activePatient, setActivePatient] = useState<PatientCard | null>(() => {
    const saved = localStorage.getItem('neuronest_active_patient');
    return saved ? JSON.parse(saved) : null;
  });

  const refreshUser = async () => {
    const storedToken = localStorage.getItem('neuronest_token');
    if (!storedToken) {
      setUser(null);
      setIsLoading(false);
      return;
    }
    try {
      const me = await authApi.getMe();
      setUser(me);
    } catch (err) {
      console.error('Failed to load user profile:', err);
      localStorage.removeItem('neuronest_token');
      setToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (credentials: { email: string; password: string }) => {
    setIsLoading(true);
    try {
      const res = await authApi.login(credentials);
      localStorage.setItem('neuronest_token', res.access_token);
      setToken(res.access_token);
      setUser(res.user);
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (data: any) => {
    return authApi.signup(data);
  };

  const logout = () => {
    localStorage.removeItem('neuronest_token');
    localStorage.removeItem('neuronest_active_patient');
    setToken(null);
    setUser(null);
    setActivePatient(null);
  };

  const handleSetActivePatient = (patient: PatientCard | null) => {
    setActivePatient(patient);
    if (patient) {
      localStorage.setItem('neuronest_active_patient', JSON.stringify(patient));
    } else {
      localStorage.removeItem('neuronest_active_patient');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        isLoading,
        activePatient,
        setActivePatient: handleSetActivePatient,
        login,
        signup,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
