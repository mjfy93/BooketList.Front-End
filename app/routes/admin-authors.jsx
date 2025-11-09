// routes/admin-authors.jsx
import { useState, useEffect } from 'react'
import { Link, Navigate } from 'react-router'
import { useAuth } from '../context/AuthContext.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import SessionBlocker from '../components/SessionBlocker'

export default function AdminAuthors() {
  const { adminFetch, isAdminLoggedIn, adminLogout, loading: authLoading, isInitialized } = useAuth()
  const [authors, setAuthors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (isAdminLoggedIn()) {
      loadAuthors()
    }
  }, [isAdminLoggedIn])

  if (authLoading || !isInitialized) {
    return <LoadingSpinner />
  }

  if (!isAdminLoggedIn()) {
    return <Navigate to="/admin/login" replace />
  }

  const loadAuthors = async () => {
    try {
      setLoading(true)
      const response = await adminFetch('/admin/authors/list')
      
      if (response.ok) {
        const data = await response.json()
        setAuthors(data)
      } else {
        setError('Error al cargar autores')
      }
    } catch (error) {
      setError('Error de conexión: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const deleteAuthor = async (authorId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este autor?')) {
      try {
        const response = await adminFetch(`/admin/authors/${authorId}/delete`, {
          method: 'DELETE'
        })
        
        if (response.ok) {
          setAuthors(authors.filter(author => author.id_autor !== authorId))
          alert('Autor eliminado correctamente')
        } else {
          const errorData = await response.json()
          alert(errorData.message || 'Error al eliminar autor')
        }
      } catch (error) {
        alert('Error de conexión: ' + error.message)
      }
    }
  }

  const handleLogout = () => {
    if (window.confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      adminLogout()
    }
  }

  const filteredAuthors = authors.filter(author =>
    author.nombre_autor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    author.apellido_autor?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <SessionBlocker requiredRole="admin">
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
                <h1 className="text-center w-100">Gestión de Autores</h1>
                <div>
                  <Link to="/admin/authors/new" className="btn btn-primary me-2">
                    <i className="fas fa-plus me-2"></i>Nuevo Autor
                  </Link>
                  <Link to="/admin" className="btn btn-outline-secondary">
                    <i className="fas fa-arrow-left me-2"></i>Volver al Dashboard
                  </Link>
                </div>
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
                        placeholder="Buscar autores por nombre o apellido..."
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
                          <th>Autor</th>
                          <th>Biografía</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredAuthors.map(author => (
                          <tr key={author.id_autor}>
                            <td>{author.id_autor}</td>
                            <td>
                              <div className="d-flex align-items-center">
                                <div className="avatar bg-info text-white rounded-circle me-3 d-flex align-items-center justify-content-center" style={{width: '40px', height: '40px'}}>
                                  {author.nombre_autor?.charAt(0) || 'A'}
                                </div>
                                <div>
                                  <strong>{author.nombre_autor} {author.apellido_autor}</strong>
                                </div>
                              </div>
                            </td>
                            <td>
                              <small className="text-muted">
                                {author.biografia_autor ? 
                                  author.biografia_autor.substring(0, 100) + '...' : 
                                  'Sin biografía'
                                }
                              </small>
                            </td>
                            <td>
                              <div className="d-flex gap-1 flex-nowrap">
                                <Link 
                                  to={`/admin/authors/${author.id_autor}`}
                                  className="btn btn-sm btn-outline-primary"
                                  title="Ver detalles"
                                >
                                  <i className="fas fa-eye"></i>
                                </Link>
                                <Link 
                                  to={`/admin/authors/${author.id_autor}/edit`}
                                  className="btn btn-sm btn-outline-warning"
                                  title="Editar autor"
                                >
                                  <i className="fas fa-edit"></i>
                                </Link>
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => deleteAuthor(author.id_autor)}
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

              <div className="row mt-4">
                <div className="col-md-4">
                  <div className="card bg-light">
                    <div className="card-body text-center">
                      <h3 className="text-primary">{authors.length}</h3>
                      <p className="mb-0">Total Autores</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SessionBlocker>
  )
}