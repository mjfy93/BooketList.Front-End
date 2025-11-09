import { Link, Navigate } from 'react-router'
import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import SessionBlocker from '../components/SessionBlocker'

export default function AdminDashboard() {
  const { adminFetch, isAdminLoggedIn, adminLogout, loading: authLoading, isInitialized } = useAuth()
  const [stats, setStats] = useState({
    totals: {
      total_users: 0,
      total_books: 0,
      total_authors: 0,
      total_reviews: 0,
      active_users: 0,
      blocked_users: 0
    }
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isAdminLoggedIn()) {
      loadDashboardStats()
    }
  }, [isAdminLoggedIn])

  if (authLoading || !isInitialized) {
    return <LoadingSpinner />
  }

  if (!isAdminLoggedIn()) {
    return <Navigate to="/admin/login" replace />
  }

  const loadDashboardStats = async () => {
    try {
      setLoading(true)
      console.log('Loading dashboard stats...')
      
      const response = await adminFetch('/admin/dashboard/overview')
      
      if (response.ok) {
        const data = await response.json()
        console.log('Dashboard stats loaded:', data)
        setStats(data)
      } else {
        const errorText = await response.text()
        setError(`Error al cargar estadísticas: ${errorText}`)
      }
    } catch (error) {
      console.error('Error loading dashboard:', error)
      setError('Error de conexión: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    if (window.confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      adminLogout()
    }
  }

  return (
    <SessionBlocker requiredRole="admin">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-3 col-lg-2 vh-100 position-fixed">
            <div className="p-3">
              <h4 className="text-center mb-4">BooketList Admin</h4>
              <nav className="nav flex-column">
                <Link to="/admin" className="nav-link mb-2 active">
                  <i className="fas fa-tachometer-alt me-2"></i>Dashboard
                </Link>
                <Link to="/admin/users" className="nav-link mb-2">
                  <i className="fas fa-users me-2"></i>Gestión de Usuarios
                </Link>
                <Link to="/admin/books" className="nav-link mb-2">
                  <i className="fas fa-book me-2"></i>Gestión de Libros
                </Link>
                <Link to="/admin/authors" className="nav-link mb-2">
                  <i className="fas fa-pen-fancy me-2"></i>Gestión de Autores
                </Link>
                <button onClick={handleLogout} className="nav-link mt-4 text-start border-0 bg-transparent">
                  <i className="fas fa-sign-out-alt me-2"></i>Cerrar Sesión
                </button>
              </nav>
            </div>
          </div>

          <div className="col-md-9 col-lg-10 ms-auto">
            <div className="p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="text-center w-100">Dashboard de Administración</h1>
                <div className="d-flex align-items-center">
                  <span className="me-3">Administrador</span>
                  <div className="dropdown">
                    <button className="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                      <i className="fas fa-user-circle"></i>
                    </button>
                    <ul className="dropdown-menu">
                      <li><button className="dropdown-item" onClick={handleLogout}>Cerrar Sesión</button></li>
                    </ul>
                  </div>
                </div>
              </div>

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                  <button 
                    className="btn btn-sm btn-outline-secondary ms-2" 
                    onClick={loadDashboardStats}
                  >
                    Reintentar
                  </button>
                </div>
              )}

              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando estadísticas...</span>
                  </div>
                </div>
              ) : (
                <>
                  <div className="row mb-4">
                    <div className="col-md-4 mb-3">
                      <div className="card bg-primary text-white">
                        <div className="card-body">
                          <h5 className="card-title">Total Usuarios</h5>
                          <h2>{stats.totals?.total_users?.toLocaleString() ?? '0'}</h2>
                          <small>Activos: {stats.totals?.active_users ?? '0'} | Bloqueados: {stats.totals?.blocked_users ?? '0'}</small>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4 mb-3">
                      <div className="card bg-success text-white">
                        <div className="card-body">
                          <h5 className="card-title">Total Libros</h5>
                          <h2>{stats.totals?.total_books?.toLocaleString() ?? '0'}</h2>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4 mb-3">
                      <div className="card bg-info text-white">
                        <div className="card-body">
                          <h5 className="card-title">Total Autores</h5>
                          <h2>{stats.totals?.total_authors?.toLocaleString() ?? '0'}</h2>
                        </div>
                      </div>
                    </div>
                  </div>

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
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </SessionBlocker>
  )
}