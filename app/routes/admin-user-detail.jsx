// routes/admin-user-detail.jsx
import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate, Navigate } from 'react-router'
import { useAdmin } from '../context/AdminContext.jsx'

export default function AdminUserDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { adminFetch, isAdminLoggedIn, adminLogout } = useAdmin()
  
  // Redirigir si no está logueado
  if (!isAdminLoggedIn()) {
    return <Navigate to="api/admin/login" replace />
  }

  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isAdminLoggedIn()) {
      loadUserDetail()
    }
  }, [isAdminLoggedIn, id])

  const loadUserDetail = async () => {
    try {
      setLoading(true)
      const response = await adminFetch(`/admin/users/${id}`)
      
      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
      } else {
        setError('Error al cargar usuario')
      }
    } catch (error) {
      setError('Error de conexión: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const toggleUserStatus = async () => {
    try {
      const response = await adminFetch(`/admin/users/${id}/status`, {
        method: 'PUT'
      })
      
      if (response.ok) {
        const updatedUser = await response.json()
        setUser(updatedUser.user)
        alert(updatedUser.message)
      } else {
        const errorData = await response.json()
        alert(errorData.message || 'Error al cambiar estado')
      }
    } catch (error) {
      alert('Error de conexión: ' + error.message)
    }
  }

  const handleLogout = () => {
    if (window.confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      adminLogout()
    }
  }

  if (loading) {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-12 d-flex justify-content-center align-items-center min-vh-100">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-12 text-center py-5">
            <h3>Usuario no encontrado</h3>
            <Link to="/admin/users" className="btn btn-primary mt-3">
              Volver a Usuarios
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-3 col-lg-2 vh-100 position-fixed">
          <div className="p-3">
            <h4 className="text-center mb-4">BooketList Admin</h4>
            <nav className="nav flex-column">
              <Link to="/admin" className="nav-link mb-2">
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
              <h1>Perfil de Usuario</h1>
              <Link to="/admin/users" className="btn btn-outline-secondary">
                <i className="fas fa-arrow-left me-2"></i>Volver a Usuarios
              </Link>
            </div>

            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            {/* Información Básica del Usuario */}
            <div className="card mb-4">
              <div className="card-body">
                <div className="row align-items-center">
                  <div className="col-md-8">
                    <div className="d-flex align-items-center">
                      <div className="avatar bg-primary text-white rounded-circle me-3 d-flex align-items-center justify-content-center" 
                           style={{width: '80px', height: '80px', fontSize: '2rem'}}>
                        {user.nombre_usuario?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <h3 className="mb-1">{user.nombre_usuario} {user.apellido_usuario}</h3>
                        <p className="text-muted mb-2">{user.email_usuario}</p>
                        <div className="d-flex gap-2 mb-2">
                          <span className={`badge ${user.is_active ? 'bg-success' : 'bg-danger'}`}>
                            {user.is_active ? 'Activo' : 'Bloqueado'}
                          </span>
                        </div>
                        <div className="text-muted">
                          <small>Miembro desde: {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</small>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 text-end">
                    <div className="mb-3">
                      <button 
                        className={`btn ${user.is_active ? 'btn-warning' : 'btn-success'} btn-lg`}
                        onClick={toggleUserStatus}
                      >
                        <i className={`fas ${user.is_active ? 'fa-lock' : 'fa-unlock'} me-2`}></i>
                        {user.is_active ? 'Bloquear Usuario' : 'Desbloquear Usuario'}
                      </button>
                    </div>
                    <div className="row text-center">
                      <div className="col-6">
                        <h4 className="text-primary mb-0">{user.total_books || 0}</h4>
                        <small className="text-muted">Libros</small>
                      </div>
                      <div className="col-6">
                        <h4 className="text-success mb-0">{user.total_reviews || 0}</h4>
                        <small className="text-muted">Reseñas</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="card">
                  <div className="card-header">
                    <h5 className="card-title mb-0">Información Adicional</h5>
                  </div>
                  <div className="card-body">
                    <div className="mb-3">
                      <strong>ID Usuario:</strong> {user.id_usuario}
                    </div>
                    <div className="mb-3">
                      <strong>Email:</strong> {user.email_usuario}
                    </div>
                    <div className="mb-3">
                      <strong>Estado:</strong> 
                      <span className={`badge ${user.is_active ? 'bg-success' : 'bg-danger'} ms-2`}>
                        {user.is_active ? 'Activo' : 'Bloqueado'}
                      </span>
                    </div>
                    <div className="mb-3">
                      <strong>Fecha Registro:</strong> {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="col-md-6">
                <div className="card">
                  <div className="card-header">
                    <h5 className="card-title mb-0">Actividad</h5>
                  </div>
                  <div className="card-body">
                    <p className="text-muted">
                      La información detallada de libros, reseñas y listas de lectura del usuario 
                      se mostrará aquí cuando implementes los endpoints correspondientes en el backend.
                    </p>
                    <div className="alert alert-info">
                      <i className="fas fa-info-circle me-2"></i>
                      Funcionalidad en desarrollo
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
