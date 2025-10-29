// routes/admin-dashboard.jsx
import { Link } from 'react-router'

export default function AdminDashboard() {
  const stats = {
    totalUsers: 1.234,
    totalBooks: 8.765,
    blockedUsers: 23,
    pendingReviews: 45
  }

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar */}
        <div className="col-md-3 col-lg-2 bg-dark text-white vh-100 position-fixed">
          <div className="p-3">
            <h4 className="text-center mb-4">BooketList Admin</h4>
            <nav className="nav flex-column">
              <Link to="/admin/users" className="nav-link text-white mb-2">
                <i className="fas fa-users me-2"></i>Gestión de Usuarios
              </Link>
              <Link to="/admin/books" className="nav-link text-white mb-2">
                <i className="fas fa-book me-2"></i>Gestión de Libros
              </Link>
              <Link to="/admin/authors" className="nav-link text-white mb-2">
                <i className="fas fa-pen-fancy me-2"></i>Gestión de Autores
              </Link>
              <Link to="/" className="nav-link text-warning mt-4">
                <i className="fas fa-sign-out-alt me-2"></i>Volver al Sitio
              </Link>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-md-9 col-lg-10 ms-auto">
          <div className="p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h1>Dashboard de Administración</h1>
              <div className="d-flex align-items-center">
                <span className="me-3">Admin User</span>
                <div className="dropdown">
                  <button className="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                    <i className="fas fa-user-circle"></i>
                  </button>
                  <ul className="dropdown-menu">
                    <li><a className="dropdown-item" href="#">Mi Perfil</a></li>
                    <li><a className="dropdown-item" href="#">Cerrar Sesión</a></li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="row mb-4">
              <div className="col-md-3 mb-3">
                <div className="card bg-primary text-white">
                  <div className="card-body">
                    <h5 className="card-title">Total Usuarios</h5>
                    <h2>{stats.totalUsers.toLocaleString()}</h2>
                  </div>
                </div>
              </div>
              <div className="col-md-3 mb-3">
                <div className="card bg-success text-white">
                  <div className="card-body">
                    <h5 className="card-title">Total Libros</h5>
                    <h2>{stats.totalBooks.toLocaleString()}</h2>
                  </div>
                </div>
              </div>
              <div className="col-md-3 mb-3">
                <div className="card bg-warning text-dark">
                  <div className="card-body">
                    <h5 className="card-title">Usuarios Bloqueados</h5>
                    <h2>{stats.blockedUsers}</h2>
                  </div>
                </div>
              </div>
              <div className="col-md-3 mb-3">
                <div className="card bg-info text-white">
                  <div className="card-body">
                    <h5 className="card-title">Reseñas Pendientes</h5>
                    <h2>{stats.pendingReviews}</h2>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="row">
              <div className="col-12">
                <div className="card">
                  <div className="card-header">
                    <h5 className="card-title mb-0">Acciones Rápidas</h5>
                  </div>
                  <div className="card-body">
                    <div className="d-flex gap-2 flex-wrap">
                      <Link to="/admin/users" className="btn btn-outline-primary">
                        <i className="fas fa-user-plus me-2"></i>Gestionar Usuarios
                      </Link>
                      <Link to="/admin/books" className="btn btn-outline-success">
                        <i className="fas fa-book-medical me-2"></i>Gestionar Libros
                      </Link>
                      <Link to="/admin/authors" className="btn btn-outline-info">
                        <i className="fas fa-user-edit me-2"></i>Gestionar Autores
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}