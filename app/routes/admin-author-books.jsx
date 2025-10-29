// routes/admin-author-books.jsx
import { Link, useParams } from 'react-router'

export default function AdminAuthorBooks() {
  const { id } = useParams()
  
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-3 col-lg-2 bg-dark text-white vh-100 position-fixed">
          <div className="p-3">
            <h4 className="text-center mb-4">BooketList Admin</h4>
            <nav className="nav flex-column">
              <Link to="/admin" className="nav-link text-white mb-2">
                <i className="fas fa-tachometer-alt me-2"></i>Dashboard
              </Link>
              <Link to="/admin/users" className="nav-link text-white mb-2">
                <i className="fas fa-users me-2"></i>Gestión de Usuarios
              </Link>
              <Link to="/admin/books" className="nav-link text-white mb-2">
                <i className="fas fa-book me-2"></i>Gestión de Libros
              </Link>
              <Link to="/admin/authors" className="nav-link text-white mb-2 active">
                <i className="fas fa-pen-fancy me-2"></i>Gestión de Autores
              </Link>
              <Link to="/" className="nav-link text-warning mt-4">
                <i className="fas fa-sign-out-alt me-2"></i>Volver al Sitio
              </Link>
            </nav>
          </div>
        </div>

        <div className="col-md-9 col-lg-10 ms-auto">
          <div className="p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h1>Libros del Autor #{id}</h1>
              <Link to="/admin/authors" className="btn btn-outline-secondary">
                <i className="fas fa-arrow-left me-2"></i>Volver a Autores
              </Link>
            </div>
            <div className="alert alert-info">
              Página en desarrollo - Mostrando libros del autor con ID: {id}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}