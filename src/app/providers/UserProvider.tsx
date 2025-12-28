import { createContext, useContext, useState } from 'react';
import { IUser, IContextProvider } from '../../types/Context.interface';

const UserContext = createContext<IUser | null>(null);

export const UserProvider = ({ children }: IContextProvider) => {
  const [userData, setUserData] = useState<IUser>({
    _id: '1',
    name: '',
    role: 'shipper',
  });
  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
