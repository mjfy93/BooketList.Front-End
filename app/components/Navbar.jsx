import { Link } from 'react-router'
import { faLightbulb, faBook } from '../utils/faIcons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";

export async function loader() {
  const response = await fetch('http://127.0.0.1:5000/api/books');
  return response.json();
}

export default function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const { user, isAuthenticated, logout, authFetch } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [currentReadings, setCurrentReadings] = useState([]);

  useEffect(() => {
    if (isAuthenticated) {
      authFetch('http://127.0.0.1:5000/api/my-library')
        .then(response => {
          if (response.ok) {
            return response.json();
          }
          throw new Error('Error fetching biblioteca');
        })
        .then(data => {
          // Fixed: Access the books array from the data object
          if (data && data.books) {
            setCurrentReadings(data.books.slice(0, 4));
          }
        })
        .catch(err => console.error('Error fetching biblioteca:', err));
    }
  }, [isAuthenticated, authFetch]);

  const handleLogout = () => {
    logout();
  };

  if (!isAuthenticated) {
    return (
      <nav className={`navbar navbar-expand bg-${theme}`}>
        <div className='container-fluid'>
          <ul className='navbar-nav m-auto align-items-center d-flex'>
            <a className="navbar-brand justify-content-start" href="/">
              BooketList
            </a>
            <li className='nav-item me-auto p-2'>
              <Link to='/libros' className='nav-link'>
                Todos los Libros
              </Link>
            </li>
            <li className='nav-item p-2'>
              <Link to='/generosTodos' className='nav-link'>
                Géneros
              </Link>
            </li>
            <li className='nav-item p-2'>
              <Link to='/autores' className='nav-link'>
                Autores
              </Link>
            </li>
            <li className='nav-item p-2'>
              <div className="dropdown">
                <button className="nav-item dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Accede a tu cuenta
                </button>
                <ul className="dropdown-menu">
                  <li><Link className="dropdown-item" to="/login">Iniciar Sesión</Link></li>
                  <li><Link className="dropdown-item" to="/register">Crear Sesión</Link></li>
                </ul>
              </div>
            </li>
            <li className='nav-item p-2'>
              <form className="d-flex" role="search">
                <input className="form-control me-2" type="search" placeholder="Buscar" aria-label="Search" />
                <button className="btn btn-outline-light" type="submit">Buscar</button>
              </form>
            </li>
            <li className='nav-item p-2'>
              <button
                className={`btn btn-outline-${theme === 'dark' ? 'light' : 'dark'} border-0 p-1 mx-2`}
                onClick={toggleTheme}
              >
                <FontAwesomeIcon icon={faLightbulb} />
              </button>
            </li>
          </ul>
        </div>
      </nav>
    )
  }

  return (
    <nav className={`navbar navbar-expand bg-${theme}`}>
      <div className='container-fluid'>
        <ul className='navbar-nav m-auto align-items-center d-flex'>
          <a className="navbar-brand justify-content-start" href="/">
            BooketList
          </a>
          <li className='nav-item me-auto p-2'>
            <Link to='/libros' className='nav-link'>
              Todos los Libros
            </Link>
          </li>
          <li className='nav-item p-2'>
            <Link to='/generosTodos' className='nav-link'>
              Géneros
            </Link>
          </li>
          <li className='nav-item p-2'>
            <Link to='/autores' className='nav-link'>
              Autores
            </Link>
          </li>
          <li className='nav-item p-2'>
            <div className="dropdown">
              <button className="nav-item dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                {user?.nombre_usuario}
              </button>
              <ul className="dropdown-menu">
                <li><Link className="dropdown-item" to="/profile">Mi perfil</Link></li>
                <li><Link className="dropdown-item" to="/biblioteca">Mi Biblioteca</Link></li>
                <li><button className="dropdown-item" onClick={handleLogout}>Cerrar Sesión</button></li>
              </ul>
            </div>
          </li>
          <li className='nav-item p-2'>
            <form className="d-flex" role="search">
              <input className="form-control me-2" type="search" placeholder="Buscar" aria-label="Search" />
              <button className="btn btn-outline-light" type="submit">Buscar</button>
            </form>
          </li>
          <li className='nav-item p-2'>
            <button
              className={`btn btn-outline-${theme === 'dark' ? 'light' : 'dark'} border-0 p-1 mx-2`}
              onClick={toggleTheme}
            >
              <FontAwesomeIcon icon={faLightbulb} />
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}