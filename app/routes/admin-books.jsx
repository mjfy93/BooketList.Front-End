// routes/admin-books.jsx
import { useState, useEffect } from 'react'
import { Link, Navigate } from 'react-router'
import { useAuth } from '../context/AuthContext.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import SessionBlocker from '../components/SessionBlocker'

export default function AdminBooks() {
  const { adminFetch, isAdminLoggedIn, adminLogout, loading: authLoading, isInitialized } = useAuth()
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (isAdminLoggedIn()) {
      loadBooks()
    }
  }, [isAdminLoggedIn])

  if (authLoading || !isInitialized) {
    return <LoadingSpinner />
  }

  if (!isAdminLoggedIn()) {
    return <Navigate to="/admin/login" replace />
  }

  const loadBooks = async () => {
    try {
      setLoading(true)
      const response = await adminFetch('/admin/books/list')
      
      if (response.ok) {
        const data = await response.json()
        setBooks(data)
      } else {
        setError('Error al cargar libros')
      }
    } catch (error) {
      setError('Error de conexión: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const deleteBook = async (bookId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este libro?')) {
      try {
        const response = await adminFetch(`/admin/books/${bookId}/delete`, {
          method: 'DELETE'
        })
        
        if (response.ok) {
          setBooks(books.filter(book => book.id_libros !== bookId))
          alert('Libro eliminado correctamente')
        } else {
          const errorData = await response.json()
          alert(errorData.message || 'Error al eliminar libro')
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

  const filteredBooks = books.filter(book =>
    book.titulo_libro?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (book.autor && (
      book.autor.nombre_autor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.autor.apellido_autor?.toLowerCase().includes(searchTerm.toLowerCase())
    ))
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
                <h1 className="text-center w-100">Gestión de Libros</h1>
                <div>
                  <Link to="/admin/books/new" className="btn btn-primary me-2">
                    <i className="fas fa-plus me-2"></i>Nuevo Libro
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
                        placeholder="Buscar libros por título o autor..."
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
                          <th>Portada</th>
                          <th>Título</th>
                          <th>Autor</th>
                          <th>Género</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredBooks.map(book => (
                          <tr key={book.id_libros}>
                            <td>{book.id_libros}</td>
                            <td>
                              <img 
                                src={book.enlace_portada_libro || 'https://via.placeholder.com/50x70'} 
                                alt={`Portada de ${book.titulo_libro}`}
                                className="rounded"
                                style={{width: '50px', height: '70px', objectFit: 'cover'}}
                                onError={(e) => {
                                  e.target.src = 'https://via.placeholder.com/50x70'
                                }}
                              />
                            </td>
                            <td>
                              <strong>{book.titulo_libro}</strong>
                            </td>
                            <td>
                              {book.autor ? 
                                `${book.autor.nombre_autor} ${book.autor.apellido_autor}` : 
                                'Sin autor'
                              }
                            </td>
                            <td>
                              <span className="badge bg-secondary">{book.genero_libro}</span>
                            </td>
                            <td>
                              <div className="d-flex gap-1 flex-nowrap">
                                <Link 
                                  to={`/admin/books/edit/${book.id_libros}`}
                                  className="btn btn-sm btn-outline-primary"
                                  title="Editar libro"
                                >
                                  <i className="fas fa-edit"></i>
                                </Link>
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => deleteBook(book.id_libros)}
                                  title="Eliminar libro"
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
                  <div className="card bg-primary text-white">
                    <div className="card-body text-center">
                      <h3>{books.length}</h3>
                      <p className="mb-0">Total Libros</p>
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