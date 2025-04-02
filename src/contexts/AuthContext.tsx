import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import DecodedToken from "../models/decodeToken.model";
import { jwtDecode } from "jwt-decode";
import profileService from "../services/profile.service";
import Profile from "../models/profile.model";

interface AuthContextType {
    token: string | null;
    login: (token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
    const [profileId, setProfileId] = useState<string>();

    useEffect(() => {
        if (token) {
            localStorage.setItem("token", token);
        } else {
            localStorage.removeItem("token");
        }
    }, [token]);

    const login = async (token: string) => {
        try {
            setToken(token);
            localStorage.setItem("token", token);

            const decoded: DecodedToken = await jwtDecode(token);
            localStorage.setItem("username", decoded.sub);
            localStorage.setItem("userId", decoded.userId);

            const profileResponse = await profileService.getProfileByUserId(decoded.userId) as { result: Profile };
            console.log("AuthContext - profileID: ", profileResponse);

            if (profileResponse?.result) {
                const profileId = profileResponse.result.id!;
                localStorage.setItem("profileId", profileId);
                setProfileId(profileId);
            }
        } catch (error) {
            logout();
        }
    };

    const logout = () => {
        setToken(null);
        localStorage.clear();
    };

    return (
        <AuthContext.Provider value={{ token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
