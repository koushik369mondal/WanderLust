import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '@api/endpoints';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const data = await authAPI.getCurrentUser();
                setUser(data.user);
                setIsAuthenticated(true);
            }
        } catch (error) {
            localStorage.removeItem('token');
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    };

    const login = async (credentials) => {
        try {
            const data = await authAPI.login(credentials);
            localStorage.setItem('token', data.token);
            setUser(data.user);
            setIsAuthenticated(true);
            toast.success('Welcome back!');
            return data;
        } catch (error) {
            toast.error(error.message || 'Login failed');
            throw error;
        }
    };

    const register = async (userData) => {
        try {
            const data = await authAPI.register(userData);
            localStorage.setItem('token', data.token);
            setUser(data.user);
            setIsAuthenticated(true);
            toast.success('Account created successfully!');
            return data;
        } catch (error) {
            toast.error(error.message || 'Registration failed');
            throw error;
        }
    };

    const logout = async () => {
        try {
            await authAPI.logout();
            localStorage.removeItem('token');
            setUser(null);
            setIsAuthenticated(false);
            toast.success('Logged out successfully');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const updateUser = (updatedData) => {
        setUser((prev) => ({ ...prev, ...updatedData }));
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                isAuthenticated,
                login,
                register,
                logout,
                updateUser,
                checkAuth,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export default AuthContext;
