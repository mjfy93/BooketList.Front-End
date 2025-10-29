// routes/admin-users.jsx
import { useState } from 'react'
import { Link } from 'react-router'

export default function AdminUsers() {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'Juan Pérez',
      email: 'juan@email.com',
      status: 'active',
      role: 'user',
      joinDate: '2024-01-15',
      booksAdded: 12,
      totalReviews: 8
    },
    {
      id: 2,
      name: 'María García',
      email: 'maria@email.com',
      status: 'blocked',
      role: 'author',
      joinDate: '2024-02-20',
      booksAdded: 45,
      totalReviews: 23
    },
    {
      id: 3,
      name: 'Carlos López',
      email: 'carlos@email.com',
      status: 'active',
      role: 'user',
      joinDate: '2024-03-10',
      booksAdded: 3,
      totalReviews: 5
    }
  ])

  const [searchTerm, setSearchTerm] = useState('')

  const toggleUserStatus = (userId) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'active' ? 'blocked' : 'active' }
        : user
    ))
  }

  const deleteUser = (userId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      setUsers(users.filter(user => user.id !== userId))
    }
  }

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar */}
        <div className="col-md-3 col-lg-2 bg-dark text-white vh-100 position-fixed">
          <div className="p-3">
            <h4 className="text-center mb-4">BooketList Admin</h4>
            <nav className="nav flex-column">
              <Link to="/admin" className="nav-link text-white mb-2">
                <i className="fas fa-tachometer-alt me-2"></i>Dashboard
              </Link>
              <Link to="/admin/users" className="nav-link text-white mb-2 active">
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
              <h1>Gestión de Usuarios</h1>
              <Link to="/admin" className="btn btn-outline-secondary">
                <i className="fas fa-arrow-left me-2"></i>Volver al Dashboard
              </Link>
            </div>

            {/* Search Bar */}
            <div className="card mb-4">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Buscar usuarios por nombre o email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="col-md-6">
                    <div className="d-flex gap-2 justify-content-end">
                      <button className="btn btn-outline-primary">
                        <i className="fas fa-download me-2"></i>Exportar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Users Table */}
            <div className="card">
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-striped table-hover">
                    <thead>
                      <tr>
                        <th>Usuario</th>
                        <th>Email</th>
                        <th>Rol</th>
                        <th>Estado</th>
                        <th>Fecha Registro</th>
                        <th>Libros</th>
                        <th>Reseñas</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map(user => (
                        <tr key={user.id}>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="avatar bg-primary text-white rounded-circle me-3 d-flex align-items-center justify-content-center" style={{width: '40px', height: '40px'}}>
                                {user.name.charAt(0)}
                              </div>
                              <div>
                                <strong>{user.name}</strong>
                                <br />
                                <small className="text-muted">ID: {user.id}</small>
                              </div>
                            </div>
                          </td>
                          <td>{user.email}</td>
                          <td>
                            <span className={`badge ${user.role === 'author' ? 'bg-info' : 'bg-secondary'}`}>
                              {user.role === 'author' ? 'Autor' : 'Usuario'}
                            </span>
                          </td>
                          <td>
                            <span className={`badge ${user.status === 'active' ? 'bg-success' : 'bg-danger'}`}>
                              {user.status === 'active' ? 'Activo' : 'Bloqueado'}
                            </span>
                          </td>
                          <td>{user.joinDate}</td>
                          <td>
                            <span className="badge bg-primary">{user.booksAdded}</span>
                          </td>
                          <td>
                            <span className="badge bg-success">{user.totalReviews}</span>
                          </td>
                          <td>
                            <div className="d-flex gap-1 flex-nowrap">
                              <Link 
                                to={`/admin/users/${user.id}`}
                                className="btn btn-sm btn-outline-primary"
                                title="Ver perfil completo"
                              >
                                <i className="fas fa-eye"></i>
                              </Link>
                              <button
                                className={`btn btn-sm ${user.status === 'active' ? 'btn-warning' : 'btn-success'}`}
                                onClick={() => toggleUserStatus(user.id)}
                                title={user.status === 'active' ? 'Bloquear usuario' : 'Desbloquear usuario'}
                              >
                                <i className={`fas ${user.status === 'active' ? 'fa-lock' : 'fa-unlock'}`}></i>
                              </button>
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => deleteUser(user.id)}
                                title="Eliminar usuario"
                              >
                                <i className="fas fa-trash-alt"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Stats Summary */}
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
                    <h3>{users.filter(u => u.status === 'active').length}</h3>
                    <p className="mb-0">Usuarios Activos</p>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card bg-warning text-dark">
                  <div className="card-body text-center">
                    <h3>{users.filter(u => u.status === 'blocked').length}</h3>
                    <p className="mb-0">Usuarios Bloqueados</p>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card bg-info text-white">
                  <div className="card-body text-center">
                    <h3>{users.filter(u => u.role === 'author').length}</h3>
                    <p className="mb-0">Autores</p>
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