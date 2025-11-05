import { Link } from 'react-router'
import { faLightbulb, faBook } from '../utils/faIcons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from "../context/useAuth";
import { useState, useEffect } from "react";

export async function loader() {
  const response = await fetch('https://backend-gold-alpha-80.vercel.app/api/books');
  return response.json();
}

export default function Navbar() {
  const { theme, toggleTheme } = useTheme()

  const { user, isAuthenticated, login, logout, authFetch, loading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [currentReadings, setCurrentReadings] = useState([]);

  useEffect(() => {
    if (isAuthenticated()) {
      authFetch('https://backend-gold-alpha-80.vercel.app/api/biblioteca')
        .then(response => {
          if (response.ok) {
            return response.json();
          }
          throw new Error('Error fetching biblioteca');
        })
        .then(data => setCurrentReadings(data.slice(0, 4)))
        .catch(err => console.error('Error fetching biblioteca:', err));
    }
  }, [isAuthenticated, authFetch]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    const result = await login(email, password);

    if (!result.success) {
      setError(result.error);
    } else {
      setEmail('');
      setPassword('');
    }
  };

  const handleLogout = () => {
    logout();
  };
  if (!isAuthenticated()) {
    return (
      <nav className={`navbar navbar-expand bg-${theme}`}>
        <div className='container-fluid'>
          <ul className='navbar-nav m-auto align-items-center d-flex'>
            <a className="navbar-brand justify-content-start" href="/">
              BooketList
            </a>
            <li className='nav-item me-auto p-2'>

              <Link
                to='/libros'
                className='nav-link'
              >
                Todos los Libros
              </Link>
            </li>
            <li className='nav-item p-2'>
              <Link
                to='/generosTodos'
                className='nav-link'
              >
                Géneros
              </Link>
            </li>
            <li className='nav-item p-2'>
              <Link
                to='/autores'
                className='nav-link'
              >
                Autores
              </Link>
            </li>
            <li className='nav-item p-2'>
              <div className="dropdown">
                <button className="nav-item dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Accede a tu cuenta
                </button>
                <ul className="dropdown-menu">
                  <li><a className="dropdown-item" href="/login">Iniciar Sesión</a></li>
                  <li><a className="dropdown-item" href="/register">Crear Sesión </a></li>
                  
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
                className={`btn btn-outline-${theme === 'dark' ? 'light' : 'dark'
                  } border-0 p-1 mx-2`}
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

            <Link
              to='/libros'
              className='nav-link'
            >
              Todos los Libros
            </Link>
          </li>
          <li className='nav-item p-2'>
            <Link
              to='/generosTodos'
              className='nav-link'
            >
              Géneros
            </Link>
          </li>
          <li className='nav-item p-2'>
            <Link
              to='/autores'
              className='nav-link'
            >
              Autores
            </Link>
          </li>
          <li className='nav-item p-2'>
            <div className="dropdown">
              <button className="nav-item dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                {user?.nombre_usuario}
              </button>
              <ul className="dropdown-menu">
                <li><a className="dropdown-item" href="#PerfilUsuario">Mi perfil</a></li>
                <li><a className="dropdown-item" href="#Biblioteca Usuario">Mi Bibilioteca</a></li>
                <li><button className="dropdown-item" onClick={handleLogout}>Cerrar Sesion</button></li>
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
              className={`btn btn-outline-${theme === 'dark' ? 'light' : 'dark'
                } border-0 p-1 mx-2`}
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
  
