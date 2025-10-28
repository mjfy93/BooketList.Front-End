import React, { useState, useEffect } from 'react';
import { AuthContext } from './auth-context.js';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const user_id = localStorage.getItem('user_id');
        const username = localStorage.getItem('username');
        
        if (token && user_id && username) {
            setUser({ 
                id: user_id, 
                token,
                username 
            });
        }
        setLoading(false);
    }, []);

    const login = (userData) => {
        setUser({
            id: userData.user_id,
            token: userData.token,
            username: userData.username
        });
        localStorage.setItem('token', userData.token);
        localStorage.setItem('user_id', userData.user_id);
        localStorage.setItem('username', userData.username);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user_id');
        localStorage.removeItem('username');
    };

    const value = {
        user,
        login,
        logout,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};