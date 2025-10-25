import React from "react";
import { Link } from 'react-router-dom';
import './Login.css';

const Login = () => {
    return (
        <div className="login-container">
            <div className="login-card">
                <h2>Iniciar Sesión</h2>
                <p>Accede a tu biblioteca personal</p>
                <form>
                    <div className="form-group">
                        <label>Correo Electrónico</label>
                        <input type="email" required />
                    </div>
                    <div className="form-group">
                        <label>Contraseña</label>
                        <input type="password" required />
                    </div>
                    <button type="submit" className="btn-login">
                        Iniciar Sesión
                    </button>
                </form>
                <div className="register-link">
                    <p>¿No tienes cuenta? <Link to="/register">Regístrate</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Login;