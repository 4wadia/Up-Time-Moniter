import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { useToast } from './ToastContext';

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    signup: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Initialize auth state from localStorage
    useEffect(() => {
        const storedUser = localStorage.getItem('sentinel_user_session');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Failed to parse user session", e);
                localStorage.removeItem('sentinel_user_session');
            }
        }
        setIsLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        return new Promise<void>((resolve, reject) => {
            setTimeout(() => {
                const users = JSON.parse(localStorage.getItem('sentinel_users') || '[]');
                const foundUser = users.find((u: any) => u.email === email && u.password === password);

                if (foundUser) {
                    const sessionUser = {
                        name: foundUser.name,
                        email: foundUser.email,
                        initials: foundUser.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()
                    };
                    setUser(sessionUser);
                    localStorage.setItem('sentinel_user_session', JSON.stringify(sessionUser));
                    resolve();
                } else {
                    reject(new Error('Invalid email or password'));
                }
            }, 800); // Simulate network delay
        });
    };

    const signup = async (name: string, email: string, password: string) => {
        return new Promise<void>((resolve, reject) => {
            setTimeout(() => {
                const users = JSON.parse(localStorage.getItem('sentinel_users') || '[]');

                if (users.find((u: any) => u.email === email)) {
                    reject(new Error('Email already exists'));
                    return;
                }

                const newUser = { name, email, password };
                users.push(newUser);
                localStorage.setItem('sentinel_users', JSON.stringify(users));

                // Auto login after signup
                const sessionUser = {
                    name: newUser.name,
                    email: newUser.email,
                    initials: newUser.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()
                };
                setUser(sessionUser);
                localStorage.setItem('sentinel_user_session', JSON.stringify(sessionUser));
                resolve();
            }, 800);
        });
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('sentinel_user_session');
    };

    return (
        <AuthContext.Provider value={{
            user,
            login,
            signup,
            logout,
            isLoading,
            isAuthenticated: !!user
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
