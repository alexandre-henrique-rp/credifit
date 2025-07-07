import { createContext, useContext, useState, useEffect, type ReactNode, useCallback } from 'react';
import axios from 'axios';

// Define the shape of the user object
interface User {
  id: string;
  name: string;
  email: string;
  userType: 'employee' | 'company';
}

// Define the shape of the AuthContext
interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  signIn: (data: any) => Promise<void>;
  signOut: () => void;
  loading: boolean;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// API client setup (can be in a separate file)
const apiClient = axios.create({
  baseURL: 'http://localhost:3001/api', // Adjust this to your backend URL
});

// AuthProvider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // Here you would typically fetch the user profile
      // For now, we'll assume the token is valid and decode it or fetch user
      // This part needs to be adapted to your backend logic
      // e.g., fetch('/api/profile').then(setUserFromResponse);
    }
    setLoading(false);
  }, []);

  const signIn = useCallback(async (data: any) => {
    const { email, password, userType } = data;
    // The endpoint might vary based on userType
    const response = await apiClient.post(`/auth/login`, { email, password, userType });
    const { token, user: userData } = response.data;

    localStorage.setItem('authToken', token);
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(userData);
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
    localStorage.removeItem('authToken');
    delete apiClient.defaults.headers.common['Authorization'];
  }, []);

  const value = {
    isAuthenticated: !!user,
    user,
    signIn,
    signOut,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
