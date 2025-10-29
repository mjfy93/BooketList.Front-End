// routes/admin-authors.jsx
import { useState } from 'react'
import { Link } from 'react-router'

export default function AdminAuthors() {
  const [authors, setAuthors] = useState([
    {
      id: 1,
      name: 'Gabriel García Márquez',
      email: 'gabriel@autor.com',
      status: 'active',
      booksCount: 24,
      joinDate: '2023-05-15',
      verified: true
    },
    {
      id: 2,
      name: 'Isabel Allende',
      email: 'isabel@autor.com',
      status: 'active',
      booksCount: 18,
      joinDate: '2023-07-22',
      verified: true
    }
  ])

  const [searchTerm, setSearchTerm] = useState('')

  const deleteAuthor = (authorId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este autor y todas sus obras?')) {
      setAuthors(authors.filter(author => author.id !== authorId))
    }
  }

  const toggleVerification = (authorId) => {
    setAuthors(authors.map(author => 
      author.id === authorId 
        ? { ...author, verified: !author.verified }
        : author
    ))
  }

  const filteredAuthors = authors.filter(author =>
    author.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    author.email.toLowerCase().includes(searchTerm.toLowerCase())
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

        {/* Main Content */}
        <div className="col-md-9 col-lg-10 ms-auto">
          <div className="p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h1>Gestión de Autores</h1>
              <div>
                <Link to="/admin/authors/new" className="btn btn-primary me-2">
                  <i className="fas fa-plus me-2"></i>Nuevo Autor
                </Link>
                <Link to="/admin" className="btn btn-outline-secondary">
                  <i className="fas fa-arrow-left me-2"></i>Volver al Dashboard
                </Link>
              </div>
            </div>

            {/* Search Bar */}
            <div className="card mb-4">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Buscar autores por nombre o email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="col-md-6">
                    <div className="d-flex gap-2 justify-content-end">
                      <select className="form-select w-auto">
                        <option>Todos los estados</option>
                        <option>Activos</option>
                        <option>Pendientes</option>
                        <option>Verificados</option>
                      </select>
                      <button className="btn btn-outline-primary">
                        <i className="fas fa-download me-2"></i>Exportar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Authors Table */}
            <div className="card">
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-striped table-hover">
                    <thead>
                      <tr>
                        <th>Autor</th>
                        <th>Email</th>
                        <th>Estado</th>
                        <th>Verificación</th>
                        <th>Libros Publicados</th>
                        <th>Fecha Registro</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAuthors.map(author => (
                        <tr key={author.id}>
                          <td>
                            <div className="d-flex align-items-center">
                              <Link 
                                to={`/admin/authors/${author.id}`}
                                className="text-decoration-none d-flex align-items-center"
                              >
                                <div className="avatar bg-info text-white rounded-circle me-3 d-flex align-items-center justify-content-center" style={{width: '40px', height: '40px'}}>
                                  {author.name.charAt(0)}
                                </div>
                                <div>
                                  <strong>{author.name}</strong>
                                </div>
                              </Link>
                            </div>
                          </td>
                          <td>
                            <a 
                              href={`mailto:${author.email}`}
                              className="text-decoration-none"
                            >
                              {author.email}
                            </a>
                          </td>
                          <td>
                            <span className={`badge ${author.status === 'active' ? 'bg-success' : 'bg-warning'}`}>
                              {author.status === 'active' ? 'Activo' : 'Pendiente'}
                            </span>
                          </td>
                          <td>
                            <span className={`badge ${author.verified ? 'bg-success' : 'bg-secondary'}`}>
                              {author.verified ? 'Verificado' : 'No Verificado'}
                            </span>
                          </td>
                          <td>
                            <Link 
                              to={`/admin/authors/${author.id}/books`}
                              className="text-decoration-none"
                            >
                              <span className="badge bg-primary">{author.booksCount} libros</span>
                            </Link>
                          </td>
                          <td>{author.joinDate}</td>
                          <td>
                            <div className="d-flex gap-1 flex-nowrap">
                              <Link 
                                to={`/admin/authors/${author.id}`}
                                className="btn btn-sm btn-outline-primary"
                                title="Ver detalles"
                              >
                                <i className="fas fa-eye"></i>
                              </Link>
                              <Link 
                                to={`/admin/authors/${author.id}/books`}
                                className="btn btn-sm btn-outline-info"
                                title="Ver libros"
                              >
                                <i className="fas fa-book"></i>
                              </Link>
                              <button
                                className={`btn btn-sm ${author.verified ? 'btn-warning' : 'btn-success'}`}
                                onClick={() => toggleVerification(author.id)}
                                title={author.verified ? 'Quitar verificación' : 'Verificar autor'}
                              >
                                <i className={`fas ${author.verified ? 'fa-times' : 'fa-check'}`}></i>
                              </button>
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => deleteAuthor(author.id)}
                                title="Eliminar autor"
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

            {/* Stats Section */}
            <div className="row mt-4">
              <div className="col-md-4">
                <div className="card bg-light">
                  <div className="card-body text-center">
                    <h3 className="text-primary">{authors.length}</h3>
                    <p className="mb-0">Total Autores</p>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card bg-light">
                  <div className="card-body text-center">
                    <h3 className="text-success">{authors.filter(a => a.verified).length}</h3>
                    <p className="mb-0">Autores Verificados</p>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card bg-light">
                  <div className="card-body text-center">
                    <h3 className="text-warning">{authors.filter(a => a.status === 'pending').length}</h3>
                    <p className="mb-0">Pendientes de Revisión</p>
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