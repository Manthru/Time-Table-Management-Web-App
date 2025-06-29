import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role?: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration - updated to include role-specific users
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Dr. Admin Kumar',
    email: 'admin@iiti.ac.in',
    role: 'admin',
    department: 'Administration'
  },
  {
    id: '2',
    name: 'Rahul Sharma',
    email: 'student@iiti.ac.in',
    role: 'student',
    department: 'Computer Science',
    semester: 6
  },
  {
    id: '3',
    name: 'Dr. Priya Singh',
    email: 'professor@iiti.ac.in',
    role: 'professor',
    department: 'Computer Science'
  }
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string, role?: string): Promise<boolean> => {
    setLoading(true);
    
    // Check if user exists with matching email and role
    let foundUser = mockUsers.find(u => u.email === email);
    
    // If role is specified, also check if the user has that role
    if (role && foundUser && foundUser.role !== role) {
      foundUser = undefined;
    }
    
    // Accept any non-empty password for demo purposes
    if (foundUser && password.trim()) {
      setUser(foundUser);
      localStorage.setItem('user', JSON.stringify(foundUser));
      setLoading(false);
      return true;
    }
    
    // If no exact match found but role is specified and password is provided, create a demo user for that role
    if (role && password.trim()) {
      const demoUser: User = {
        id: role === 'professor' ? '3' : Date.now().toString(), // Use ID '3' for professor to match course data
        name: role === 'professor' ? 'Dr. Priya Singh' : `Demo ${role.charAt(0).toUpperCase() + role.slice(1)}`,
        email: email,
        role: role as 'admin' | 'student' | 'professor',
        department: role === 'student' ? 'Computer Science' : role === 'professor' ? 'Computer Science' : 'Administration',
        ...(role === 'student' && { semester: 6 })
      };
      
      setUser(demoUser);
      localStorage.setItem('user', JSON.stringify(demoUser));
      setLoading(false);
      return true;
    }
    
    setLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}