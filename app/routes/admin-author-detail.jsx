// routes/admin-author-detail.jsx
import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate, Navigate } from 'react-router'
import { useAdmin } from '../context/AdminContext.jsx'

export default function AdminAuthorDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { adminFetch, isAdminLoggedIn, adminLogout } = useAdmin()
  
  // Redirigir si no está logueado
  if (!isAdminLoggedIn()) {
    return <Navigate to="/admin/login" replace />
  }

  const [author, setAuthor] = useState(null)
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isAdminLoggedIn()) {
      loadAuthorDetail()
    }
  }, [isAdminLoggedIn, id])

  const loadAuthorDetail = async () => {
    try {
      setLoading(true)
      // Usamos el endpoint de listado para obtener los datos del autor específico
      const response = await adminFetch('/admin/authors/list')
      
      if (response.ok) {
        const authorsData = await response.json()
        const currentAuthor = authorsData.find(a => a.id_autor === parseInt(id))
        
        if (currentAuthor) {
          setAuthor(currentAuthor)
          // Aquí podrías cargar los libros del autor si tienes un endpoint
        } else {
          setError('Autor no encontrado')
        }
      } else {
        setError('Error al cargar autor')
      }
    } catch (error) {
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

  if (!author) {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-12 text-center py-5">
            <h3>Autor no encontrado</h3>
            <Link to="/admin/authors" className="btn btn-primary mt-3">
              Volver a Autores
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
              <h1>Detalle del Autor</h1>
              <Link to="/admin/authors" className="btn btn-outline-secondary">
                <i className="fas fa-arrow-left me-2"></i>Volver a Autores
              </Link>
            </div>

            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            <div className="row">
              <div className="col-md-4">
                <div className="card">
                  <div className="card-body text-center">
                    <div className="avatar bg-info text-white rounded-circle mx-auto d-flex align-items-center justify-content-center mb-3" 
                         style={{width: '100px', height: '100px', fontSize: '2rem'}}>
                      {author.nombre_autor?.charAt(0) || 'A'}
                    </div>
                    <h4>{author.nombre_autor} {author.apellido_autor}</h4>
                    
                    <div className="d-grid gap-2 mt-3">
                      <Link 
                        to={`api/admin/authors/${id}/update`}
                        className="btn btn-outline-primary"
                      >
                        <i className="fas fa-edit me-2"></i>Editar Autor
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="card mt-4">
                  <div className="card-header">
                    <h5 className="card-title mb-0">Información</h5>
                  </div>
                  <div className="card-body">
                    <div className="mb-3">
                      <strong>ID:</strong> {author.id_autor}
                    </div>
                    <div className="mb-3">
                      <strong>Fecha Creación:</strong> {author.created_at ? new Date(author.created_at).toLocaleDateString() : 'N/A'}
                    </div>
                    <div className="mb-3">
                      <strong>Última Actualización:</strong> {author.updated_at ? new Date(author.updated_at).toLocaleDateString() : 'N/A'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-8">
                <div className="card">
                  <div className="card-header">
                    <h5 className="card-title mb-0">Biografía</h5>
                  </div>
                  <div className="card-body">
                    <p>{author.biografia_autor || 'No hay biografía disponible.'}</p>
                  </div>
                </div>

                <div className="card mt-4">
                  <div className="card-header">
                    <h5 className="card-title mb-0">Libros del Autor ({books.length})</h5>
                  </div>
                  <div className="card-body">
                    {books.length > 0 ? (
                      <div className="table-responsive">
                        <table className="table table-striped">
                          <thead>
                            <tr>
                              <th>Título</th>
                              <th>Género</th>
                              <th>Acciones</th>
                            </tr>
                          </thead>
                          <tbody>
                            {books.map(book => (
                              <tr key={book.id_libros}>
                                <td>
                                  <strong>{book.titulo_libro}</strong>
                                </td>
                                <td>
                                  <span className="badge bg-secondary">{book.genero_libro}</span>
                                </td>
                                <td>
                                  <div className="d-flex gap-1">
                                    <Link 
                                      to={`/admin/books/edit/${book.id_libros}`}
                                      className="btn btn-sm btn-outline-primary"
                                      title="Editar libro"
                                    >
                                      <i className="fas fa-edit"></i>
                                    </Link>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-muted">Este autor no tiene libros registrados.</p>
                    )}
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