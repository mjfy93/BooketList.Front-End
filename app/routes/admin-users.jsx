// routes/admin-users.jsx
import { useState, useEffect } from 'react'
import { Link, Navigate } from 'react-router'
import { useAdmin } from '../context/AdminContext.jsx'

export default function AdminUsers() {
  const { adminFetch, isAdminLoggedIn, adminLogout } = useAdmin()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  // Redirigir si no está logueado
  if (!isAdminLoggedIn()) {
    return <Navigate to="/admin/login" replace />
  }

  useEffect(() => {
    if (isAdminLoggedIn()) {
      loadUsers()
    }
  }, [isAdminLoggedIn])

  const loadUsers = async () => {
    try {
      setLoading(true)
      const response = await adminFetch('/admin/users/all')
      
      if (response.ok) {
        const data = await response.json()
        setUsers(data)
      } else {
        setError('Error al cargar usuarios')
      }
    } catch (error) {
      setError('Error de conexión: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const toggleUserStatus = async (userId) => {
    try {
      const response = await adminFetch(`/admin/users/${userId}/status`, {
        method: 'PUT'
      })
      
      if (response.ok) {
        const updatedUser = await response.json()
        setUsers(users.map(user => 
          user.id_usuario === userId ? updatedUser.user : user
        ))
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

  const filteredUsers = users.filter(user =>
    user.nombre_usuario?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.apellido_usuario?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email_usuario?.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
              <h1 className="text-center w-100">Gestión de Usuarios</h1>
              <Link to="/admin" className="btn btn-outline-secondary">
                <i className="fas fa-arrow-left me-2"></i>Volver al Dashboard
              </Link>
            </div>

            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            <div className="card mb-4">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Buscar usuarios por nombre, apellido o email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-striped table-hover">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Usuario</th>
                        <th>Email</th>
                        <th>Estado</th>
                        <th>Fecha Registro</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map(user => (
                        <tr key={user.id_usuario}>
                          <td>{user.id_usuario}</td>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="avatar bg-primary text-white rounded-circle me-3 d-flex align-items-center justify-content-center" style={{width: '40px', height: '40px'}}>
                                {user.nombre_usuario?.charAt(0) || 'U'}
                              </div>
                              <div>
                                <strong>{user.nombre_usuario} {user.apellido_usuario}</strong>
                              </div>
                            </div>
                          </td>
                          <td>{user.email_usuario}</td>
                          <td>
                            <span className={`badge ${user.is_active ? 'bg-success' : 'bg-danger'}`}>
                              {user.is_active ? 'Activo' : 'Bloqueado'}
                            </span>
                          </td>
                          <td>{user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</td>
                          <td>
                            <div className="d-flex gap-1 flex-nowrap">
                              <button
                                className={`btn btn-sm ${user.is_active ? 'btn-warning' : 'btn-success'}`}
                                onClick={() => toggleUserStatus(user.id_usuario)}
                                title={user.is_active ? 'Bloquear usuario' : 'Desbloquear usuario'}
                              >
                                <i className={`fas ${user.is_active ? 'fa-lock' : 'fa-unlock'}`}></i>
                              </button>
                              <Link 
                                to={`/admin/users/${user.id_usuario}`}
                                className="btn btn-sm btn-outline-primary"
                                title="Ver detalles"
                              >
                                <i className="fas fa-eye"></i>
                              </Link>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="row mt-4">
              <div className="col-md-3">
                <div className="card bg-primary text-white">
                  <div className="card-body text-center">
                    <h3>{users.length}</h3>
                    <p className="mb-0">Total Usuarios</p>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card bg-success text-white">
                  <div className="card-body text-center">
                    <h3>{users.filter(u => u.is_active).length}</h3>
                    <p className="mb-0">Usuarios Activos</p>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card bg-warning text-dark">
                  <div className="card-body text-center">
                    <h3>{users.filter(u => !u.is_active).length}</h3>
                    <p className="mb-0">Usuarios Bloqueados</p>
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