// context/AuthContext.jsx
import React, { useState, useEffect, useContext, createContext } from 'react';
import { useNavigate } from 'react-router';
import { API_BASE_URL } from "../utils/api";

export const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined || context === null) {
        console.warn('useAuth debe estar dentro de un AuthProvider');
        return {
            user: null,
            admin: null,
            login: async () => ({ success: false, error: 'Auth not initialized' }),
            adminLogin: async () => ({ success: false, error: 'Auth not initialized' }),
            register: async () => ({ success: false, error: 'Auth not initialized' }),
            logout: () => {},
            adminLogout: () => {},
            loading: false,
            isAuthenticated: false,
            isAdmin: false,
            authFetch: async (url, options) => fetch(url, options),
            adminFetch: async (url, options) => fetch(url, options)
        };
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isInitialized, setIsInitialized] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = () => {
            try {
                if (typeof window !== 'undefined') {
                    // Verificar usuario normal
                    const token = localStorage.getItem('token');
                    const user_id = localStorage.getItem('user_id');
                    const username = localStorage.getItem('username');
                    const nombre = localStorage.getItem('nombre_usuario');
                    const apellido = localStorage.getItem('apellido_usuario');

                    if (token && user_id && username) {
                        setUser({
                            id: user_id,
                            token,
                            username,
                            nombre_usuario: nombre,
                            apellido_usuario: apellido
                        });
                    }

                    // Verificar admin
                    const adminToken = localStorage.getItem('adminToken');
                    const adminData = localStorage.getItem('adminData');
                    
                    if (adminToken && adminData) {
                        setAdmin(JSON.parse(adminData));
                    }
                }
            } catch (error) {
                console.error('Error loading auth state:', error);
                // Limpiar datos corruptos
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user_id');
                    localStorage.removeItem('username');
                    localStorage.removeItem('nombre_usuario');
                    localStorage.removeItem('apellido_usuario');
                    localStorage.removeItem('adminToken');
                    localStorage.removeItem('adminData');
                }
            } finally {
                setLoading(false);
                setIsInitialized(true);
            }
        };

        checkAuth();
    }, []);

    // Funciones de usuario normal
 const login = async (email_usuario, password_usuario) => {
    try {
        setLoading(true);
        
        const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email_usuario: email_usuario,
                password_usuario: password_usuario
            })
        });

        const data = await response.json();

        if (!response.ok) {
            // Usar el mensaje específico del backend
            const errorMessage = data.error || data.message || 'Error al iniciar sesión';
            throw new Error(errorMessage);
        }

        const userData = {
            id: data.user.id_usuario,
            token: data.access_token,
            username: data.user.email_usuario,
            nombre_usuario: data.user.nombre_usuario,
            apellido_usuario: data.user.apellido_usuario
        };

        setUser(userData);
        setAdmin(null);

        if (typeof window !== 'undefined') {
            localStorage.setItem('token', data.access_token);
            localStorage.setItem('user_id', data.user.id_usuario);
            localStorage.setItem('username', data.user.email_usuario);
            localStorage.setItem('nombre_usuario', data.user.nombre_usuario);
            localStorage.setItem('apellido_usuario', data.user.apellido_usuario);
            
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminData');
        }

        return { success: true };

    } catch (error) {
        console.error('Login error:', error);
        return { success: false, error: error.message };
    } finally {
        setLoading(false);
    }
};

    const register = async (nombre, apellido, email, password) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nombre_usuario: nombre,
                    apellido_usuario: apellido,
                    email_usuario: email,
                    password_usuario: password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error al crear la cuenta');
            }

            const userData = {
                id: data.user.id_usuario,
                token: data.access_token,
                username: data.user.email_usuario,
                nombre_usuario: data.user.nombre_usuario,
                apellido_usuario: data.user.apellido_usuario
            };

            setUser(userData);
            setAdmin(null);

            if (typeof window !== 'undefined') {
                localStorage.setItem('token', data.access_token);
                localStorage.setItem('user_id', data.user.id_usuario);
                localStorage.setItem('username', data.user.email_usuario);
                localStorage.setItem('nombre_usuario', data.user.nombre_usuario);
                localStorage.setItem('apellido_usuario', data.user.apellido_usuario);
                
                // Limpiar datos de admin
                localStorage.removeItem('adminToken');
                localStorage.removeItem('adminData');
            }

            return { success: true };

        } catch (error) {
            console.error('Register error:', error);
            return { success: false, error: error.message };
        }
    };

    const logout = () => {
        setUser(null);
        if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            localStorage.removeItem('user_id');
            localStorage.removeItem('username');
            localStorage.removeItem('nombre_usuario');
            localStorage.removeItem('apellido_usuario');
        }
        navigate('/');
    };

    // Funciones de admin
    const adminLogin = async (email, password) => {
        try {
            setLoading(true);
            
            const response = await fetch(`${API_BASE_URL}/api/admin/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email_admin: email,
                    password_admin: password
                })
            });

            if (response.ok) {
                const data = await response.json();
                
                if (typeof window !== 'undefined') {
                    localStorage.setItem('adminToken', data.access_token);
                    localStorage.setItem('adminData', JSON.stringify(data.admin));
                }
                
                setAdmin(data.admin);
                setUser(null); // Cerrar sesión de usuario si existe
                
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user_id');
                    localStorage.removeItem('username');
                    localStorage.removeItem('nombre_usuario');
                    localStorage.removeItem('apellido_usuario');
                }
                
                return { success: true };
            } else {
                const errorData = await response.json();
                return { success: false, error: errorData.message || 'Error en el login' };
            }
        } catch (error) {
            console.error('Admin login error:', error);
            return { success: false, error: 'Error de conexión: ' + error.message };
        } finally {
            setLoading(false);
        }
    };

    const adminLogout = () => {
        setAdmin(null);
        if (typeof window !== 'undefined') {
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminData');
        }
        navigate('/admin/login');
    };

    const adminFetch = async (url, options = {}) => {
        let token = null;
        if (typeof window !== 'undefined') {
            token = localStorage.getItem('adminToken');
        }
        
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` }),
                ...options.headers,
            },
        };

        try {
            const response = await fetch(`${API_BASE_URL}/api${url}`, {
                ...defaultOptions,
                ...options,
                headers: {
                    ...defaultOptions.headers,
                    ...options.headers,
                },
            });

            if (response.status === 401) {
                adminLogout();
                throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
            }

            return response;
        } catch (error) {
            console.error('Admin fetch error:', error);
            throw error;
        }
    };

    const authFetch = async (url, options = {}) => {
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
        };

        if (user && user.token) {
            headers['Authorization'] = `Bearer ${user.token}`;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api${url}`, {
                ...options,
                headers,
            });

            if (response.status === 401) {
                logout();
            }

            return response;
        } catch (error) {
            console.error('authFetch error:', error);
            throw error;
        }
    };

    // Función segura para verificar si es admin
    const isAdminLoggedIn = () => {
        if (!isInitialized) return false;
        return !!admin;
    };

    const value = {
        user,
        admin,
        login,
        adminLogin,
        register,
        logout,
        adminLogout,
        loading,
        isAuthenticated: !!user && !!user.token,
        isAdmin: !!admin,
        isAdminLoggedIn,
        isInitialized,
        authFetch,
        adminFetch
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};