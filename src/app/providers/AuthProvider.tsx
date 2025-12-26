import { createContext, useContext, useState } from 'react';
import { IAuthContext, IContextProvider } from '../../types/Context.interface';
import React from 'react';

const AuthContext = createContext<IAuthContext | null>(null);

export const AuthProvider = ({ children }: IContextProvider) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
