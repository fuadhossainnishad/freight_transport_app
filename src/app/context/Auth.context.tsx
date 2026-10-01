import axiosClient from '../../shared/config/axios.config';
import { requestUserPermission, getFCMToken, sendTokenToBackend } from '../../shared/utils/pushNotifications';
import { createContext, useContext, useEffect, useState } from "react";
import { AuthContextType, User } from './Auth.type';
import { logout as clearAuthStorage } from "../../shared/utils/auth";
import { getAccessToken } from "../../shared/storage/authStorage";
import { decodeAccessToken } from "../../shared/utils/jwt";
import { logger } from "../../shared/utils/logger";

const AuthContext = createContext<AuthContextType | null>(null)


export const AuthProvider = ({ children }: { children: React.ReactNode }) => {

    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getAccessToken().then((token) => {
            if (token) {
                try {
                    const decoded = decodeAccessToken(token);
                    setUser({
                        id: decoded._id,
                        role: decoded.role,
                        shipper_id: decoded.shipper_id,
                        transporter_id: decoded.transporter_id,
                        driver_id: decoded.driver_id,
                    });
                } catch {
                    clearAuthStorage().catch(() => {});
                }
            }
        }).finally(() => setIsLoading(false));
    }, []);

    const login = (userData: User) => {
        setUser(userData);
        
        // Request notification permission and send token to backend in the background
        requestUserPermission()
            .then((hasPermission) => {
                if (hasPermission) {
                    return getFCMToken().then((token) => {
                        if (token) {
                            sendTokenToBackend(token);
                        }
                    });
                }
            })
            .catch((err) => logger.error("FCM setup failed:", err));
    };

    const logout = () => {
        // Unregister FCM token on the backend before logging out locally
        axiosClient.patch('/user/fcm-token', { fcmToken: null }).catch(() => {});
        
        setUser(null);
        clearAuthStorage().catch((err) =>
            logger.error("Failed to clear auth storage on logout:", err)
        );
    };

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated: !!user,
                isLoading,
                user,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}