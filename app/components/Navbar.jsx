import { Link } from 'react-router'
import { faLightbulb, faBook } from '../utils/faIcons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useTheme } from '../context/ThemeContext'

export default function Navbar() {
  const { theme, toggleTheme } = useTheme()

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
                Iniciar Sesión || #NombreDeUsuario
              </button>
              <ul className="dropdown-menu">
                <li><a className="dropdown-item" href="#">Iniciar Sesión || Mi perfil</a></li>
                <li><a className="dropdown-item" href="#">Crear Sesión || Mi Bibilioteca</a></li>
                <li><a className="dropdown-item" href="#">Cerrar Sesion</a></li>
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
              className={`btn btn-outline-${
                theme === 'dark' ? 'light' : 'dark'
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