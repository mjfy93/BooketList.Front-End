// import React, { useState, useEffect } from 'react';
// import { AuthContext } from './auth-context.js';

// export const AuthProvider = ({ children }) => {
//     const [user, setUser] = useState(null);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         if (typeof window === 'undefined') {
//             setLoading(false);
//             return;
//         }

//         try {
//             const token = localStorage.getItem('token');
//             const user_id = localStorage.getItem('user_id');
//             const username = localStorage.getItem('username');
//             const nombre = localStorage.getItem('nombre_usuario');
//             const apellido = localStorage.getItem('apellido_usuario');

//             if (token && user_id && username) {
//                 setUser({
//                     id: user_id,
//                     token,
//                     username,
//                     nombre_usuario: nombre,
//                     apellido_usuario: apellido
//                 });
//             }
//         } catch (error) {
//             console.error('Error loading auth state:', error);
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     const login = async (email_usuario, password_usuario) => {
//         try {
//             const response = await fetch('http://127.0.0.1:5000/api/auth/login', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     email_usuario: email_usuario,
//                     password_usuario: password_usuario
//                 })
//             });

//             const data = await response.json();

//             if (!response.ok) {
//                 throw new Error(data.error || data.message || 'Error al iniciar sesión');
//             }

//             const userData = {
//                 id: data.user.id_usuario,
//                 token: data.access_token,
//                 username: data.user.email_usuario,
//                 nombre_usuario: data.user.nombre_usuario,
//                 apellido_usuario: data.user.apellido_usuario
//             };

//             setUser(userData);

//             if (typeof window !== 'undefined') {
//                 localStorage.setItem('token', data.access_token);
//                 localStorage.setItem('user_id', data.user.id_usuario);
//                 localStorage.setItem('username', data.user.email_usuario);
//                 localStorage.setItem('nombre_usuario', data.user.nombre_usuario);
//                 localStorage.setItem('apellido_usuario', data.user.apellido_usuario);
//             }

//             return { success: true };

//         } catch (error) {
//             console.error('Login error:', error);
//             return { success: false, error: error.message };
//         }
//     };

//     const register = async (nombre, apellido, email, password) => {
//         try {
//             const response = await fetch('http://127.0.0.1:5000/api/auth/register', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     nombre_usuario: nombre,
//                     apellido_usuario: apellido,
//                     email_usuario: email,
//                     password_usuario: password
//                 })
//             });

//             const data = await response.json();

//             if (!response.ok) {
//                 throw new Error(data.error || 'Error al crear la cuenta');
//             }

//             const userData = {
//                 id: data.user.id_usuario,
//                 token: data.access_token,
//                 username: data.user.email_usuario,
//                 nombre_usuario: data.user.nombre_usuario,
//                 apellido_usuario: data.user.apellido_usuario
//             };

//             setUser(userData);

//             if (typeof window !== 'undefined') {
//                 localStorage.setItem('token', data.access_token);
//                 localStorage.setItem('user_id', data.user.id_usuario);
//                 localStorage.setItem('username', data.user.email_usuario);
//                 localStorage.setItem('nombre_usuario', data.user.nombre_usuario);
//                 localStorage.setItem('apellido_usuario', data.user.apellido_usuario);
//             }

//             return { success: true };

//         } catch (error) {
//             console.error('Register error:', error);
//             return { success: false, error: error.message };
//         }
//     };

//     const logout = () => {
//         setUser(null);

//         if (typeof window !== 'undefined') {
//             localStorage.removeItem('token');
//             localStorage.removeItem('user_id');
//             localStorage.removeItem('username');
//             localStorage.removeItem('nombre_usuario');
//             localStorage.removeItem('apellido_usuario');
//         }
//     };

//     const isAuthenticated =  !!user && !!user.token;


//     const authFetch = async (url, options = {}) => {
//         const headers = {
//             'Content-Type': 'application/json',
//             ...options.headers,
//         };

//         if (user && user.token) {
//             headers['Authorization'] = `Bearer ${user.token}`;
//         }

//         try {
//             const response = await fetch(url, {
//                 ...options,
//                 headers,
//             });

//             if (response.status === 401) {
//                 logout();
//             }

//             return response;
//         } catch (error) {
//             console.error('authFetch error:', error);
//             throw error;
//         }
//     };

//     const value = {
//         user,
//         login,
//         register,
//         logout,
//         loading,
//         isAuthenticated,
//         authFetch
//     };

//     return (
//         <AuthContext.Provider value={value}>
//             {children}
//         </AuthContext.Provider>
//     );
// };

import React, { useState, useEffect, useContext, createContext } from 'react';

// Create the context
export const AuthContext = createContext(null);

// Custom hook to use the auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined || context === null) {
        console.warn('useAuth debe estar dentro de un AuthProvider');
        return {
            user: null,
            login: async () => ({ success: false, error: 'Auth not initialized' }),
            register: async () => ({ success: false, error: 'Auth not initialized' }),
            logout: () => { },
            loading: false,
            isAuthenticated: false,
            authFetch: async (url, options) => fetch(url, options)
        };
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (typeof window === 'undefined') {
            setLoading(false);
            return;
        }

        try {
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
        } catch (error) {
            console.error('Error loading auth state:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    const login = async (email_usuario, password_usuario) => {
        try {
            const response = await fetch('http://127.0.0.1:5000/api/auth/login', {
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
                throw new Error(data.error || data.message || 'Error al iniciar sesión');
            }

            const userData = {
                id: data.user.id_usuario,
                token: data.access_token,
                username: data.user.email_usuario,
                nombre_usuario: data.user.nombre_usuario,
                apellido_usuario: data.user.apellido_usuario
            };

            setUser(userData);

            if (typeof window !== 'undefined') {
                localStorage.setItem('token', data.access_token);
                localStorage.setItem('user_id', data.user.id_usuario);
                localStorage.setItem('username', data.user.email_usuario);
                localStorage.setItem('nombre_usuario', data.user.nombre_usuario);
                localStorage.setItem('apellido_usuario', data.user.apellido_usuario);
            }

            return { success: true };

        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: error.message };
        }
    };

    const register = async (nombre, apellido, email, password) => {
        try {
            const response = await fetch('http://127.0.0.1:5000/api/auth/register', {
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

            if (typeof window !== 'undefined') {
                localStorage.setItem('token', data.access_token);
                localStorage.setItem('user_id', data.user.id_usuario);
                localStorage.setItem('username', data.user.email_usuario);
                localStorage.setItem('nombre_usuario', data.user.nombre_usuario);
                localStorage.setItem('apellido_usuario', data.user.apellido_usuario);
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
    };

    // Changed from function to boolean value
    const isAuthenticated = !!user && !!user.token;

    const authFetch = async (url, options = {}) => {
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
        };

        if (user && user.token) {
            headers['Authorization'] = `Bearer ${user.token}`;
        }

        try {
            const response = await fetch(url, {
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

    const value = {
        user,
        login,
        register,
        logout,
        loading,
        isAuthenticated,
        authFetch
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};