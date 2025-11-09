// components/Navbar.jsx
import { Link, NavLink } from 'react-router'
import { faLightbulb } from '../utils/faIcons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { API_BASE_URL } from "../utils/api";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const { user, admin, isAuthenticated, isAdmin, logout, adminLogout } = useAuth();

  const [currentReadings, setCurrentReadings] = useState([]);

  useEffect(() => {
    if (isAuthenticated) {
      // Código para cargar lecturas actuales del usuario
      // (puedes mantener tu lógica existente aquí)
    }
  }, [isAuthenticated]);

  const handleUserLogout = () => {
    logout();
  };

  const handleAdminLogout = () => {
    adminLogout();
  };

  // Navbar para ADMINISTRADORES
  if (isAdmin) {
    return (
      <nav className={`navbar navbar-expand-lg bg-${theme} shadow-sm`}>
        <div className='container-fluid'>
          <Link to="/admin" className="navbar-brand fw-bold">
            <i className="fas fa-crown me-2 text-warning"></i>
            BooketList Admin
          </Link>
          
          <button 
            className="navbar-toggler" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#adminNavbar"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="adminNavbar">
            <ul className='navbar-nav me-auto mb-2 mb-lg-0'>
              <li className='nav-item'>
                <NavLink 
                  to='/admin' 
                  className='nav-link'
                  style={({ isActive }) => ({
                    color: isActive ? '#ffc107' : 'inherit',
                    fontWeight: isActive ? 'bold' : 'normal'
                  })}
                >
                  <i className="fas fa-tachometer-alt me-1"></i>
                  Dashboard
                </NavLink>
              </li>
              
              <li className='nav-item'>
                <NavLink 
                  to='/admin/users' 
                  className='nav-link'
                  style={({ isActive }) => ({
                    color: isActive ? '#ffc107' : 'inherit',
                    fontWeight: isActive ? 'bold' : 'normal'
                  })}
                >
                  <i className="fas fa-users me-1"></i>
                  Usuarios
                </NavLink>
              </li>
              
              <li className='nav-item'>
                <NavLink 
                  to='/admin/books' 
                  className='nav-link'
                  style={({ isActive }) => ({
                    color: isActive ? '#ffc107' : 'inherit',
                    fontWeight: isActive ? 'bold' : 'normal'
                  })}
                >
                  <i className="fas fa-book me-1"></i>
                  Libros
                </NavLink>
              </li>
              
              <li className='nav-item'>
                <NavLink 
                  to='/admin/authors' 
                  className='nav-link'
                  style={({ isActive }) => ({
                    color: isActive ? '#ffc107' : 'inherit',
                    fontWeight: isActive ? 'bold' : 'normal'
                  })}
                >
                  <i className="fas fa-pen-fancy me-1"></i>
                  Autores
                </NavLink>
              </li>
            </ul>

            <ul className='navbar-nav ms-auto align-items-center'>
              <li className='nav-item dropdown'>
                <button 
                  className="btn btn-outline-light dropdown-toggle" 
                  type="button" 
                  data-bs-toggle="dropdown"
                >
                  <i className="fas fa-user-shield me-2"></i>
                  {admin?.nombre_admin || 'Administrador'}
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <span className="dropdown-item-text small text-muted">
                      Rol: Administrador
                    </span>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <Link className="dropdown-item" to="/">
                      <i className="fas fa-external-link-alt me-2"></i>
                      Ir al Sitio Principal
                    </Link>
                  </li>
                  <li>
                    <button className="dropdown-item text-danger" onClick={handleAdminLogout}>
                      <i className="fas fa-sign-out-alt me-2"></i>
                      Cerrar Sesión Admin
                    </button>
                  </li>
                </ul>
              </li>

              <li className='nav-item ms-2'>
                <button
                  className={`btn btn-outline-${theme === 'dark' ? 'light' : 'dark'} border-0`}
                  onClick={toggleTheme}
                  title={`Cambiar a modo ${theme === 'dark' ? 'claro' : 'oscuro'}`}
                >
                  <FontAwesomeIcon icon={faLightbulb} />
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }

  // Navbar para USUARIOS NO AUTENTICADOS
  if (!isAuthenticated) {
    return (
      <nav className={`navbar navbar-expand-lg bg-${theme} shadow-sm`}>
        <div className='container-fluid'>
          <Link to="/" className="navbar-brand fw-bold">
            <i className="fas fa-book me-2 text-primary"></i>
            BooketList
          </Link>
          
          <button 
            className="navbar-toggler" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#publicNavbar"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="publicNavbar">
            <ul className='navbar-nav me-auto mb-2 mb-lg-0'>
              <li className='nav-item'>
                <NavLink
                  to='/libros'
                  className='nav-link'
                  style={({ isActive }) => ({
                    color: isActive ? '#ffc107' : 'inherit',
                    fontWeight: isActive ? 'bold' : 'normal'
                  })}
                >
                  Todos los Libros
                </NavLink>
              </li>
              <li className='nav-item'>
                <NavLink
                  to='/generosTodos'
                  className='nav-link'
                  style={({ isActive }) => ({
                    color: isActive ? '#ffc107' : 'inherit',
                    fontWeight: isActive ? 'bold' : 'normal'
                  })}
                >
                  Géneros
                </NavLink>
              </li>
              <li className='nav-item'>
                <NavLink
                  to='/autores'
                  className='nav-link'
                  style={({ isActive }) => ({
                    color: isActive ? '#ffc107' : 'inherit',
                    fontWeight: isActive ? 'bold' : 'normal'
                  })}
                >
                  Autores
                </NavLink>
              </li>
            </ul>

            <ul className='navbar-nav ms-auto align-items-center'>
              <li className='nav-item dropdown'>
                <button className="btn btn-outline-light dropdown-toggle" type="button" data-bs-toggle="dropdown">
                  <i className="fas fa-user me-2"></i>
                  Acceder a tu cuenta
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <Link className="dropdown-item" to="/login">
                      <i className="fas fa-sign-in-alt me-2"></i>
                      Iniciar Sesión
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/register">
                      <i className="fas fa-user-plus me-2"></i>
                      Crear Cuenta
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <Link className="dropdown-item text-info" to="/admin/login">
                      <i className="fas fa-user-shield me-2"></i>
                      Acceso Administradores
                    </Link>
                  </li>
                </ul>
              </li>

              <li className='nav-item ms-2'>
                <div className="d-flex">
                  <input 
                    className="form-control me-2" 
                    type="search" 
                    placeholder="Buscar libros..." 
                    aria-label="Search" 
                  />
                  <button className="btn btn-outline-light" type="submit">
                    <i className="fas fa-search"></i>
                  </button>
                </div>
              </li>

              <li className='nav-item ms-2'>
                <button
                  className={`btn btn-outline-${theme === 'dark' ? 'light' : 'dark'} border-0`}
                  onClick={toggleTheme}
                >
                  <FontAwesomeIcon icon={faLightbulb} />
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }

  // Navbar para USUARIOS AUTENTICADOS (normales)
  return (
    <nav className={`navbar navbar-expand-lg bg-${theme} shadow-sm`}>
      <div className='container-fluid'>
        <Link to="/" className="navbar-brand fw-bold">
          <i className="fas fa-book me-2 text-primary"></i>
          BooketList
        </Link>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#userNavbar"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="userNavbar">
          <ul className='navbar-nav me-auto mb-2 mb-lg-0'>
            <li className='nav-item'>
              <NavLink
                to='/libros'
                className='nav-link'
                style={({ isActive }) => ({
                  color: isActive ? '#ffc107' : 'inherit',
                  fontWeight: isActive ? 'bold' : 'normal'
                })}
              >
                Todos los Libros
              </NavLink>
            </li>
            <li className='nav-item'>
              <NavLink
                to='/generosTodos'
                className='nav-link'
                style={({ isActive }) => ({
                  color: isActive ? '#ffc107' : 'inherit',
                  fontWeight: isActive ? 'bold' : 'normal'
                })}
              >
                Géneros
              </NavLink>
            </li>
            <li className='nav-item'>
              <NavLink
                to='/autores'
                className='nav-link'
                style={({ isActive }) => ({
                  color: isActive ? '#ffc107' : 'inherit',
                  fontWeight: isActive ? 'bold' : 'normal'
                })}
              >
                Autores
              </NavLink>
            </li>
          </ul>

          <ul className='navbar-nav ms-auto align-items-center'>
            <li className='nav-item dropdown'>
              <button className="btn btn-outline-light dropdown-toggle" type="button" data-bs-toggle="dropdown">
                <i className="fas fa-user-circle me-2"></i>
                {user?.nombre_usuario || 'Usuario'}
              </button>
              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <span className="dropdown-item-text small">
                    Hola, <strong>{user?.nombre_usuario} {user?.apellido_usuario}</strong>
                  </span>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <Link className="dropdown-item" to="/profile">
                    <i className="fas fa-user me-2"></i>
                    Mi Perfil
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/biblioteca">
                    <i className="fas fa-bookmark me-2"></i>
                    Mi Biblioteca
                  </Link>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <button className="dropdown-item text-danger" onClick={handleUserLogout}>
                    <i className="fas fa-sign-out-alt me-2"></i>
                    Cerrar Sesión
                  </button>
                </li>
              </ul>
            </li>

            <li className='nav-item ms-2'>
              <div className="d-flex">
                <input 
                  className="form-control me-2" 
                  type="search" 
                  placeholder="Buscar libros..." 
                  aria-label="Search" 
                />
                <button className="btn btn-outline-light" type="submit">
                  <i className="fas fa-search"></i>
                </button>
              </div>
            </li>

            <li className='nav-item ms-2'>
              <button
                className={`btn btn-outline-${theme === 'dark' ? 'light' : 'dark'} border-0`}
                onClick={toggleTheme}
              >
                <FontAwesomeIcon icon={faLightbulb} />
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}