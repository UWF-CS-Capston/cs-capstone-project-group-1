import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import storage from '../utils/storage';

interface AuthContextType {
  token: string | null;
  role: string | null;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load token from storage on app start
    const loadToken = async () => {
      try {
        const storedToken = await storage.getItem('token');
        if (storedToken) {
          try {
            const decoded: any = jwtDecode(storedToken);
            setToken(storedToken);
            setRole(decoded.role);
          } catch (error) {
            console.error('Invalid token', error);
            await storage.removeItem('token');
          }
        }
      } catch (error) {
        console.error('Error loading token', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadToken();
  }, []);

  const login = async (newToken: string) => {
    try {
      await storage.setItem('token', newToken);
      const decoded: any = jwtDecode(newToken);
      setToken(newToken);
      setRole(decoded.role);
    } catch (error) {
      console.error('Error saving token', error);
    }
  };

  const logout = async () => {
    try {
      await storage.removeItem('token');
      setToken(null);
      setRole(null);
    } catch (error) {
      console.error('Error removing token', error);
    }
  };

  return (
    <AuthContext.Provider value={{ token, role, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};