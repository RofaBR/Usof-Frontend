import { createContext, useState, useEffect } from 'react';
import {
    refreshAccessToken,
    loginUser,
    registerUser,
    logoutUser,
    fetchUserData,
} from '../api/authApi';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [accessToken, setAccessToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            const data = await refreshAccessToken();
            if (data) {
                setAccessToken(data.accessToken);
                setUser(data.user);
            }
            setLoading(false);
        };
        initAuth();
    }, []);

    const login = async (credentials) => {
        try {
            const data = await loginUser(credentials);
            setAccessToken(data.accessToken);
            setUser(data.user);
            return data;
        } catch (err) {
            console.error('Login error:', err);
            throw err;
        }
    };

    const register = async (credentials) => {
        try {
            return await registerUser(credentials);
        } catch (err) {
            console.error('Registration error:', err);
            throw err;
        }
    };

    const logout = async () => {
        try {
            await logoutUser();
        } catch (err) {
            console.error('Logout error:', err);
        } finally {
            setAccessToken(null);
            setUser(null);
        }
    };

    const fetchUser = async (userId) => {
        try {
            const data = await fetchUserData(userId, accessToken);
            if (data) {
                setUser(data.user);
            }
            return data.user;
        } catch (err) {
            console.error('Failed to fetch user data:', err);
            return null;
        }
    };

    return (
        <AuthContext.Provider value={{ user, accessToken, loading, login, register, logout, fetchUser }}>
            {children}
        </AuthContext.Provider>
    );
}