// components/Navbar.jsx
import { Link, NavLink, useNavigate } from 'react-router'
import { faLightbulb } from '../utils/faIcons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from "../context/AuthContext";
import { useState, useEffect, useRef } from "react";
import { API_BASE_URL } from "../utils/api";

// Search Component
function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const [booksRes, authorsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/books/search?q=${query}`),
          fetch(`${API_BASE_URL}/api/authors/search/simple?q=${query}`)
        ]);

        const books = await booksRes.json();
        const authors = await authorsRes.json();

        setResults([
          ...books.slice(0, 5).map(b => ({ type: 'book', id: b.id, title: b.title, author: b.author })),
          ...authors.slice(0, 3).map(a => ({ type: 'author', id: a.id_autor, name: a.nombre_completo }))
        ]);
        setShowDropdown(true);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (result) => {
    if (result.type === 'book') {
      navigate(`/detalle/${result.id}`);
    } else {
      navigate(`/autores/${result.id}`);
    }
    setQuery('');
    setShowDropdown(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (results.length > 0) {
      handleSelect(results[0]);
    } else {
      alert('No se encontraron resultados');
      navigate('/libros');
    }
  };

  return (
    <div className="position-relative" ref={searchRef}>
      <form onSubmit={handleSubmit} className="d-flex">
        <input
          className="form-control me-2"
          type="search"
          placeholder="Buscar libros o autores..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="btn btn-outline-light" type="submit">
          <i className="fas fa-search"></i>
        </button>
      </form>

      {showDropdown && results.length > 0 && (
        <div className="dropdown-menu show position-absolute w-100" style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {results.map((result, idx) => (
            <button
              key={`${result.type}-${result.id}`}
              className="dropdown-item"
              onClick={() => handleSelect(result)}
            >
              {result.type === 'book' ? (
                <>
                  <i className="fas fa-book me-2 text-warning"></i>
                  <strong>{result.title}</strong>
                  <small className="text-muted d-block ms-4">{result.author}</small>
                </>
              ) : (
                <>
                  <i className="fas fa-user me-2 text-success"></i>
                  <strong>{result.name}</strong>
                  <small className="text-muted d-block ms-4">Autor</small>
                </>
              )}
            </button>
          ))}
        </div>
      )}

      {showDropdown && query.length >= 2 && results.length === 0 && !loading && (
        <div className="dropdown-menu show position-absolute w-100">
          <div className="dropdown-item-text text-muted">No se encontraron resultados</div>
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const { user, admin, isAuthenticated, isAdmin, logout, adminLogout } = useAuth();

  const handleUserLogout = () => {
    logout();
  };

  const handleAdminLogout = () => {
    adminLogout();
  };

  // Admin navbar (keep as is, just add SearchBar)
  if (isAdmin) {
    return (
      <nav className={`navbar navbar-expand-lg bg-${theme} shadow-sm`}>
        <div className='container-fluid'>
          <Link to="/admin" className="navbar-brand fw-bold">
            <i className="fas fa-crown me-2 text-warning"></i>
            BooketList Admin
          </Link>

          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#adminNavbar">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="adminNavbar">
            <ul className='navbar-nav me-auto mb-2 mb-lg-0'>
              <li className='nav-item'>
                <NavLink to='/admin' className='nav-link' style={({ isActive }) => ({ color: isActive ? '#ffc107' : 'inherit', fontWeight: isActive ? 'bold' : 'normal' })}>
                  <i className="fas fa-tachometer-alt me-1"></i>Dashboard
                </NavLink>
              </li>
              <li className='nav-item'>
                <NavLink to='/admin/users' className='nav-link' style={({ isActive }) => ({ color: isActive ? '#ffc107' : 'inherit', fontWeight: isActive ? 'bold' : 'normal' })}>
                  <i className="fas fa-users me-1"></i>Usuarios
                </NavLink>
              </li>
              <li className='nav-item'>
                <NavLink to='/admin/books' className='nav-link' style={({ isActive }) => ({ color: isActive ? '#ffc107' : 'inherit', fontWeight: isActive ? 'bold' : 'normal' })}>
                  <i className="fas fa-book me-1"></i>Libros
                </NavLink>
              </li>
              <li className='nav-item'>
                <NavLink to='/admin/authors' className='nav-link' style={({ isActive }) => ({ color: isActive ? '#ffc107' : 'inherit', fontWeight: isActive ? 'bold' : 'normal' })}>
                  <i className="fas fa-pen-fancy me-1"></i>Autores
                </NavLink>
              </li>
            </ul>

            <ul className='navbar-nav ms-auto align-items-center'>
              <li className='nav-item dropdown'>
                <button className="btn btn-outline-light dropdown-toggle" type="button" data-bs-toggle="dropdown">
                  <i className="fas fa-user-shield me-2"></i>{admin?.nombre_admin || 'Administrador'}
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li><span className="dropdown-item-text small text-muted">Rol: Administrador</span></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><Link className="dropdown-item" to="/"><i className="fas fa-external-link-alt me-2"></i>Ir al Sitio Principal</Link></li>
                  <li><button className="dropdown-item text-danger" onClick={handleAdminLogout}><i className="fas fa-sign-out-alt me-2"></i>Cerrar Sesión Admin</button></li>
                </ul>
              </li>
              <li className='nav-item ms-2'>
                <button className={`btn btn-outline-${theme === 'dark' ? 'light' : 'dark'} border-0`} onClick={toggleTheme}>
                  <FontAwesomeIcon icon={faLightbulb} />
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }

  // Public navbar
  if (!isAuthenticated) {
    return (
      <nav className={`navbar navbar-expand-lg bg-${theme} shadow-sm`}>
        <div className='container-fluid'>
          <Link to="/" className="navbar-brand fw-bold"><i className="fas fa-book me-2 text-warning"></i>BooketList</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#publicNavbar">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="publicNavbar">
            <ul className='navbar-nav me-auto mb-2 mb-lg-0'>
              <li className='nav-item'><NavLink to='/libros' className='nav-link' style={({ isActive }) => ({ color: isActive ? '#ffc107' : 'inherit', fontWeight: isActive ? 'bold' : 'normal' })}>Todos los Libros</NavLink></li>
              <li className='nav-item'><NavLink to='/generosTodos' className='nav-link' style={({ isActive }) => ({ color: isActive ? '#ffc107' : 'inherit', fontWeight: isActive ? 'bold' : 'normal' })}>Géneros</NavLink></li>
              <li className='nav-item'><NavLink to='/autores' className='nav-link' style={({ isActive }) => ({ color: isActive ? '#ffc107' : 'inherit', fontWeight: isActive ? 'bold' : 'normal' })}>Autores</NavLink></li>
            </ul>

            <ul className='navbar-nav ms-auto align-items-center'>
              <li className='nav-item dropdown'>
                <button className="btn btn-outline dropdown-toggle" type="button" data-bs-toggle="dropdown"><i className="fas fa-user me-2"></i>Acceder a tu cuenta</button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li><Link className="dropdown-item" to="/login"><i className="fas fa-sign-in-alt me-2"></i>Iniciar Sesión</Link></li>
                  <li><Link className="dropdown-item" to="/register"><i className="fas fa-user-plus me-2"></i>Crear Cuenta</Link></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><Link className="dropdown-item text-warning" to="/admin/login"><i className="fas fa-user-shield me-2"></i>Acceso Administradores</Link></li>
                </ul>
              </li>
              <li className='nav-item ms-2'><SearchBar /></li>
              <li className='nav-item ms-2'><button className={`btn btn-outline-${theme === 'dark' ? 'light' : 'dark'} border-0`} onClick={toggleTheme}><FontAwesomeIcon icon={faLightbulb} /></button></li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }

  // Authenticated user navbar
  return (
    <nav className={`navbar navbar-expand-lg bg-${theme} shadow-sm`}>
      <div className='container-fluid'>
        <Link to="/" className="navbar-brand fw-bold"><i className="fas fa-book me-2 text-warning"></i>BooketList</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#userNavbar">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="userNavbar">
          <ul className='navbar-nav me-auto mb-2 mb-lg-0'>
            <li className='nav-item'><NavLink to='/libros' className='nav-link' style={({ isActive }) => ({ color: isActive ? '#ffc107' : 'inherit', fontWeight: isActive ? 'bold' : 'normal' })}>Todos los Libros</NavLink></li>
            <li className='nav-item'><NavLink to='/generosTodos' className='nav-link' style={({ isActive }) => ({ color: isActive ? '#ffc107' : 'inherit', fontWeight: isActive ? 'bold' : 'normal' })}>Géneros</NavLink></li>
            <li className='nav-item'><NavLink to='/autores' className='nav-link' style={({ isActive }) => ({ color: isActive ? '#ffc107' : 'inherit', fontWeight: isActive ? 'bold' : 'normal' })}>Autores</NavLink></li>
          </ul>

          <ul className='navbar-nav ms-auto align-items-center'>
            <li className='nav-item dropdown'>
              <button className="btn btn-outline-light dropdown-toggle" type="button" data-bs-toggle="dropdown"><i className="fas fa-user-circle me-2"></i>{user?.nombre_usuario || 'Usuario'}</button>
              <ul className="dropdown-menu dropdown-menu-end">
                <li><span className="dropdown-item-text small">Hola, <strong>{user?.nombre_usuario} {user?.apellido_usuario}</strong></span></li>
                <li><hr className="dropdown-divider" /></li>
                <li><Link className="dropdown-item" to="/profile"><i className="fas fa-user me-2"></i>Mi Perfil</Link></li>
                <li><Link className="dropdown-item" to="/biblioteca"><i className="fas fa-bookmark me-2"></i>Mi Biblioteca</Link></li>
                <li><hr className="dropdown-divider" /></li>
                <li><button className="dropdown-item text-danger" onClick={handleUserLogout}><i className="fas fa-sign-out-alt me-2"></i>Cerrar Sesión</button></li>
              </ul>
            </li>
            <li className='nav-item ms-2'><SearchBar /></li>
            <li className='nav-item ms-2'><button className={`btn btn-outline-${theme === 'dark' ? 'light' : 'dark'} border-0`} onClick={toggleTheme}><FontAwesomeIcon icon={faLightbulb} /></button></li>
          </ul>
        </div>
      </div>
    </nav>
  );
}