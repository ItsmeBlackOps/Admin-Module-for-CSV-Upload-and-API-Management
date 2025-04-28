import React, { createContext, useState, useContext, useEffect } from 'react';

interface User {
  id: string;
  username: string;
  role: 'admin' | 'user';
  apiKey?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  updateApiKey: (apiKey: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('adminUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock user database
      const users = [
        { id: '1', username: 'admin', password: 'password', role: 'admin' as const },
        { id: '2', username: 'user1', password: 'user123', role: 'user' as const },
        { id: '3', username: 'user2', password: 'user123', role: 'user' as const }
      ];
      
      const foundUser = users.find(u => u.username === username && u.password === password);
      
      if (foundUser) {
        const userData: User = {
          id: foundUser.id,
          username: foundUser.username,
          role: foundUser.role,
          apiKey: localStorage.getItem('graphApiKey') || undefined
        };
        
        setUser(userData);
        localStorage.setItem('adminUser', JSON.stringify(userData));
        setIsLoading(false);
        return true;
      }
      
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const updateApiKey = (apiKey: string) => {
    if (user) {
      const updatedUser = { ...user, apiKey };
      setUser(updatedUser);
      localStorage.setItem('adminUser', JSON.stringify(updatedUser));
      localStorage.setItem('graphApiKey', apiKey);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('adminUser');
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated: !!user, 
        login, 
        logout,
        isLoading,
        updateApiKey
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};