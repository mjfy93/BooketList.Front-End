import React from "react";
import { Link } from 'resct-router-dom';
import './Navbar.css';

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="nav-container">
                <Link to="/" className="nav-logo">
                    📚 Biblioteca
                </Link>
                <div className="nav-menu">
                    <Link to="/" className="nav-link">Inicio</Link>
                    <Link to="/register" className="nav-link">Registrarse</Link>
                    <Link to="/login" className="nav-link">Iniciar Sesión</Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;