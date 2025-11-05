
import { useContext } from 'react';
import { AuthContext } from './auth-context.js';

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error('useAuth debe estar dentro de un AuthProvider');
    }

    return context;
};