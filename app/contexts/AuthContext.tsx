// contexts/AuthContext.tsx
import React, { createContext, useContext, useState } from 'react';

// Define the shape of your auth context state
interface AuthContextType {
  user: any; // You can replace 'any' with your user type
  signIn: (email: string, password: string) => void;
  signUp: (email: string, password: string) => void;
}

interface AuthProviderProps {
    children: React.ReactNode;
}

// Initialize the context
const AuthContext = createContext<AuthContextType>({
  user: null,
  signIn: () => {},
  signUp: () => {},
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Auth context provider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<any>(null); // Replace 'any' with your user type

  const signIn = (email: string, password: string) => {
    // Your authentication logic here
  };

  const signUp = (email: string, password: string) => {
    // Your registration logic here
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signUp }}>
      {children}
    </AuthContext.Provider>
  );
};
