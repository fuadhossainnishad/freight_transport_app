export type User = {
  id: string;
  role: "SHIPPER" | "TRANSPORTER";
  shipper_id?: string
  transporter_id?: string
};

export type AuthContextType = {
  isAuthenticated: boolean;
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
};
