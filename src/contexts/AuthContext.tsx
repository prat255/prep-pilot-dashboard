
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

type User = {
  email: string;
  name: string;
  isAuthenticated: boolean;
} | null;

type AuthContextType = {
  user: User;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check if user is logged in on page load
    const storedUser = localStorage.getItem('jeeTrackerCurrentUser');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user:', error);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        const users = JSON.parse(localStorage.getItem('jeeTrackerUsers') || '[]');
        const foundUser = users.find((u: any) => u.email === email && u.password === password);
        
        if (foundUser) {
          const userInfo = {
            email: foundUser.email,
            name: foundUser.name || `${foundUser.firstName} ${foundUser.lastName}`,
            isAuthenticated: true
          };
          
          setUser(userInfo);
          localStorage.setItem('jeeTrackerCurrentUser', JSON.stringify(userInfo));
          setIsLoading(false);
          resolve(true);
        } else {
          setIsLoading(false);
          resolve(false);
        }
      }, 1000);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('jeeTrackerCurrentUser');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
