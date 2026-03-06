export type User = {
  id: string;
  role: "SHIPPER" | "TRANSPORTER";
};

export type AuthContextType = {
    isAuthenticated: boolean;
    user: User | null;
    login: (user: User) => void;
    logout: () => void;
};
