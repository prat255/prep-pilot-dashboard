
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

type User = {
  email: string;
  name: string;
  isAuthenticated: boolean;
  role?: 'user' | 'admin';
} | null;

type AuthContextType = {
  user: User;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
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
  const navigate = useNavigate();
  const location = useLocation();

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
            isAuthenticated: true,
            role: foundUser.role || 'user'
          };
          
          setUser(userInfo);
          localStorage.setItem('jeeTrackerCurrentUser', JSON.stringify(userInfo));
          
          // Initialize user data if it doesn't exist
          initializeUserData(foundUser.email);
          
          setIsLoading(false);
          
          // Redirect to dashboard after successful login
          const from = location.state?.from?.pathname || '/dashboard';
          navigate(from, { replace: true });
          
          toast({
            title: "Success",
            description: "Logged in successfully!",
          });
          
          resolve(true);
        } else {
          setIsLoading(false);
          resolve(false);
        }
      }, 1000);
    });
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    setIsLoading(true);
    
    // This is a mock implementation for Google login since we're not using a backend
    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        // Simulate successful Google login with mock data
        const googleUser = {
          email: 'google.user@example.com',
          name: 'Google User',
          isAuthenticated: true,
          role: 'user'
        };
        
        // Check if user already exists
        const users = JSON.parse(localStorage.getItem('jeeTrackerUsers') || '[]');
        let foundUser = users.find((u: any) => u.email === googleUser.email);
        
        if (!foundUser) {
          // Create a new user if not exists
          const newUser = {
            email: googleUser.email,
            name: googleUser.name,
            password: Math.random().toString(36).slice(-8), // Random password
            createdAt: new Date().toISOString(),
            role: 'user'
          };
          
          users.push(newUser);
          localStorage.setItem('jeeTrackerUsers', JSON.stringify(users));
          foundUser = newUser;
        }
        
        setUser(googleUser);
        localStorage.setItem('jeeTrackerCurrentUser', JSON.stringify(googleUser));
        
        // Initialize user data if it doesn't exist
        initializeUserData(googleUser.email);
        
        setIsLoading(false);
        
        // Redirect to dashboard after successful login
        const from = location.state?.from?.pathname || '/dashboard';
        navigate(from, { replace: true });
        
        toast({
          title: "Success",
          description: "Logged in with Google successfully!",
        });
        
        resolve(true);
      }, 1500);
    });
  };

  const initializeUserData = (email: string) => {
    // Check if user data exists, if not initialize with zeros
    const userDataKey = `jeeTracker_${email}_data`;
    if (!localStorage.getItem(userDataKey)) {
      const initialData = {
        subjects: [
          {
            id: '1',
            name: 'Physics',
            progress: 0,
            totalTopics: 15,
            completedTopics: 0,
            topics: []
          },
          {
            id: '2',
            name: 'Chemistry',
            progress: 0,
            totalTopics: 15,
            completedTopics: 0,
            topics: []
          },
          {
            id: '3',
            name: 'Mathematics',
            progress: 0,
            totalTopics: 15,
            completedTopics: 0,
            topics: []
          }
        ],
        mockTests: [],
        streaks: [],
        lastActive: new Date().toISOString(),
        createdAt: new Date().toISOString()
      };
      
      localStorage.setItem(userDataKey, JSON.stringify(initialData));
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('jeeTrackerCurrentUser');
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ user, login, loginWithGoogle, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
