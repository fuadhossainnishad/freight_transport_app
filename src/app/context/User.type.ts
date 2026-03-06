export interface UserType {
    id?: string
    role: 'SHIPPER' | 'TRANSPORTER';
}

export interface UserContextType {
    user: UserType | null;
    setUser: (user: UserType | null) => void;
}