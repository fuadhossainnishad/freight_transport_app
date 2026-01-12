export interface UserType {
    id?: string
    role: 'shipper' | 'transporter';
}

export interface UserContextType {
    user: UserType | null;
    setUser: (user: UserType | null) => void;
}