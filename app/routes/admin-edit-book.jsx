// routes/admin-edit-book.jsx
import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate, Navigate } from 'react-router'
import { useAuth } from '../context/AuthContext.jsx' // CAMBIADO
import LoadingSpinner from '../components/LoadingSpinner.jsx'

export default function AdminEditBook() {
  const { id } = useParams()
  const navigate = useNavigate()
  // CAMBIADO: useAdmin -> useAuth
  const { adminFetch, isAdminLoggedIn, adminLogout, loading: authLoading, isInitialized } = useAuth()
  
  // Resto del código igual...
  const [book, setBook] = useState(null)
  const [authors, setAuthors] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isAdminLoggedIn()) {
      loadBookAndAuthors()
    }
  }, [isAdminLoggedIn, id])

  // Condicionales DESPUÉS de todos los hooks
  if (authLoading || !isInitialized) {
    return <LoadingSpinner />
  }

  if (!isAdminLoggedIn()) {
    return <Navigate to="/admin/login" replace />
  }

  const loadBookAndAuthors = async () => {
    try {
      setLoading(true)
      
      // Cargar libro
      const bookResponse = await adminFetch(`/admin/books/${id}`)
      if (!bookResponse.ok) {
        setError('Libro no encontrado')
        return
      }
      const bookData = await bookResponse.json()
      setBook(bookData)

      // Cargar autores
      const authorsResponse = await adminFetch('/admin/authors/list')
      if (authorsResponse.ok) {
        const authorsData = await authorsResponse.json()
        setAuthors(authorsData)
      }
    } catch (error) {
      setError('Error de conexión: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!book.titulo_libro || !book.id_autor || !book.genero_libro) {
      alert('Por favor, completa los campos obligatorios')
      return
    }

    setSaving(true)
    try {
      const response = await adminFetch(`/admin/books/${id}/update`, {
        method: 'PUT',
        body: JSON.stringify({
          titulo_libro: book.titulo_libro,
          id_autor: book.id_autor,
          genero_libro: book.genero_libro,
          descripcion_libros: book.descripcion_libros,
          enlace_portada_libro: book.enlace_portada_libro,
          enlace_asin_libro: book.enlace_asin_libro
        })
      })

      if (response.ok) {
        alert('Libro actualizado correctamente')
        navigate('/admin/books')
      } else {
        const errorData = await response.json()
        alert(errorData.message || 'Error al actualizar libro')
      }
    } catch (error) {
      alert('Error de conexión: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field, value) => {
    setBook({...book, [field]: value})
  }

  const handleLogout = () => {
    if (window.confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      adminLogout()
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (!book) {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-12 text-center py-5">
            <h3>Libro no encontrado</h3>
            <Link to="/admin/books" className="btn btn-primary mt-3">
              Volver a Libros
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const currentAuthor = authors.find(a => a.id_autor === book.id_autor)

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
              <h1>Editar Libro</h1>
              <Link to="/admin/books" className="btn btn-outline-secondary">
                <i className="fas fa-arrow-left me-2"></i>Volver a Libros
              </Link>
            </div>

            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            <div className="row">
              <div className="col-md-8">
                <div className="card">
                  <div className="card-header">
                    <h5 className="card-title mb-0">Información del Libro</h5>
                  </div>
                  <div className="card-body">
                    <form onSubmit={(e) => e.preventDefault()}>
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Título *</label>
                          <input
                            type="text"
                            className="form-control"
                            value={book.titulo_libro}
                            onChange={(e) => handleInputChange('titulo_libro', e.target.value)}
                            required
                          />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Autor *</label>
                          <select
                            className="form-select"
                            value={book.id_autor}
                            onChange={(e) => handleInputChange('id_autor', parseInt(e.target.value))}
                            required
                          >
                            <option value="">Seleccionar autor</option>
                            {authors.map(author => (
                              <option key={author.id_autor} value={author.id_autor}>
                                {author.nombre_autor} {author.apellido_autor}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Género *</label>
                          <select 
                            className="form-select"
                            value={book.genero_libro}
                            onChange={(e) => handleInputChange('genero_libro', e.target.value)}
                            required
                          >
                            <option value="Ficción">Ficción</option>
                            <option value="Ciencia Ficción">Ciencia Ficción</option>
                            <option value="Fantasia">Fantasia</option>
                            <option value="Romance">Romance</option>
                            <option value="Misterio">Misterio</option>
                            <option value="Biografía">Biografía</option>
                          </select>
                        </div>
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Portada del Libro (URL)</label>
                        <input
                          type="url"
                          className="form-control"
                          placeholder="https://ejemplo.com/portada.jpg"
                          value={book.enlace_portada_libro || ''}
                          onChange={(e) => handleInputChange('enlace_portada_libro', e.target.value)}
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Enlace de Amazon</label>
                        <input
                          type="url"
                          className="form-control"
                          placeholder="https://www.amazon.com/..."
                          value={book.enlace_asin_libro || ''}
                          onChange={(e) => handleInputChange('enlace_asin_libro', e.target.value)}
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Descripción</label>
                        <textarea
                          className="form-control"
                          rows="4"
                          value={book.descripcion_libros || ''}
                          onChange={(e) => handleInputChange('descripcion_libros', e.target.value)}
                        ></textarea>
                      </div>

                      <div className="d-flex gap-2">
                        <button 
                          type="button" 
                          className="btn btn-primary" 
                          onClick={handleSave}
                          disabled={saving}
                        >
                          {saving ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                              Guardando...
                            </>
                          ) : (
                            <>
                              <i className="fas fa-save me-2"></i>Guardar Cambios
                            </>
                          )}
                        </button>
                        <Link to="/admin/books" className="btn btn-outline-secondary">
                          Cancelar
                        </Link>
                      </div>
                    </form>
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="card">
                  <div className="card-header">
                    <h5 className="card-title mb-0">Vista Previa</h5>
                  </div>
                  <div className="card-body text-center">
                    {book.enlace_portada_libro ? (
                      <img 
                        src={book.enlace_portada_libro} 
                        alt="Portada del libro"
                        className="rounded mb-3"
                        style={{width: '150px', height: '200px', objectFit: 'cover'}}
                        onError={(e) => {
                          e.target.style.display = 'none'
                        }}
                      />
                    ) : (
                      <div className="bg-light rounded d-flex align-items-center justify-content-center mb-3" 
                           style={{width: '150px', height: '200px', margin: '0 auto'}}>
                        <i className="fas fa-book fa-3x text-muted"></i>
                      </div>
                    )}
                    <h5>{book.titulo_libro}</h5>
                    <p className="text-muted">
                      {currentAuthor ? `${currentAuthor.nombre_autor} ${currentAuthor.apellido_autor}` : 'Autor no encontrado'}
                    </p>
                    <span className="badge bg-secondary">{book.genero_libro}</span>
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