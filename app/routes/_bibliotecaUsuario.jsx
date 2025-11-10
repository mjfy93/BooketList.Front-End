import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../context/AuthContext.jsx'
import { API_BASE_URL } from "../utils/api"
import SessionBlocker from '../components/SessionBlocker'

export default function BibliotecaUsuario() {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()

  const [libraryData, setLibraryData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchLibrary = async () => {
      if (!isAuthenticated || !user?.token) {
        navigate('/login')
        return
      }

      try {
        const response = await fetch(`${API_BASE_URL}/api/my-library`, {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        })

        if (!response.ok) {
          throw new Error('Error al cargar la biblioteca')
        }

        const data = await response.json()
        console.log('Library data received:', data)
        setLibraryData(data)
      } catch (err) {
        console.error('Error fetching library:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchLibrary()
  }, [isAuthenticated, user?.token, navigate])

  // Helper function to combine books with consistent structure
  const combineBooksWithState = (booksArray, state) => {
    return booksArray.map(item => ({
      ...item,
      reading_state: state,
      book: {
        ...item.book,
        autor: item.book.autor
          ? (typeof item.book.autor === 'object'
            ? `${item.book.autor.nombre_autor} ${item.book.autor.apellido_autor}`
            : item.book.autor)
          : 'Autor desconocido'
      }
    }))
  }

  const quieroLeerBooks = combineBooksWithState(libraryData?.quiero_leer || [], 'quiero_leer')
  const leyendoBooks = combineBooksWithState(libraryData?.leyendo || [], 'leyendo')
  const leidoBooks = combineBooksWithState(libraryData?.leido || [], 'leido')

  // Combine all books for "Todos los Libros" tab
  const allBooks = [...quieroLeerBooks, ...leyendoBooks, ...leidoBooks]

  // Get unique authors from the combined books
  const authors = [...new Set(allBooks
    .map(item => item.book.autor)
    .filter(autor => autor && autor !== 'Autor desconocido')
  )].sort()

  // Helper function to get display text for reading state
  const getReadingStateText = (state) => {
    switch (state) {
      case 'leido': return 'Leído'
      case 'leyendo': return 'Leyendo'
      case 'quiero_leer': return 'Por Leer'
      default: return state
    }
  }

  // Helper function to get badge class for reading state
  const getReadingStateBadgeClass = (state) => {
    switch (state) {
      case 'leido': return 'bg-success'
      case 'leyendo': return 'bg-warning'
      case 'quiero_leer': return 'bg-info'
      default: return 'bg-secondary'
    }
  }

  if (loading) {
    return (
      <SessionBlocker requiredRole="user">
        <div className="container mt-5 text-center">
          <div className="spinner-border text-light" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3">Cargando biblioteca...</p>
        </div>
      </SessionBlocker>
    )
  }

  if (error) {
    return (
      <SessionBlocker requiredRole="user">
        <div className="container mt-5">
          <div className="alert alert-danger" role="alert">
            <h4 className="alert-heading">Error</h4>
            <p>{error}</p>
          </div>
        </div>
      </SessionBlocker>
    )
  }
  const tabStyles = `
  .bibliotecaUsuarioContainer .nav-tabs .nav-link {
    
    color: #ffc107;
    border: none;
  }
  .bibliotecaUsuarioContainer .nav-tabs .nav-link.active {
   
    color: #ffffff;
  }
`;

  return (
    <SessionBlocker requiredRole="user">
      <style>{tabStyles}</style>
      <div className="bibliotecaUsuarioContainer">
        <ul className="nav nav-tabs" id="myTab" role="tablist">
          <li className="nav-item" role="presentation">
            <button className="nav-link active" id="librosTodos-tab" data-bs-toggle="tab"
              data-bs-target="#todosLibros-pane" type="button" role="tab"
              aria-controls="todosLibros-pane" aria-selected="true" >
              Biblioteca ({allBooks.length})
              
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button className="nav-link" id="autores-tab" data-bs-toggle="tab"
              data-bs-target="#autores-pane" type="button" role="tab"
              aria-controls="autores-pane" aria-selected="false">
              Autores ({authors.length})
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button className="nav-link" id="leyendo-tab" data-bs-toggle="tab"
              data-bs-target="#leyendo-pane" type="button" role="tab"
              aria-controls="leyendo-pane" aria-selected="false">
              Leyendo ({leyendoBooks.length})
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button className="nav-link" id="leido-tab" data-bs-toggle="tab"
              data-bs-target="#leido-pane" type="button" role="tab"
              aria-controls="leido-pane" aria-selected="false">
              Leídos ({leidoBooks.length})
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button className="nav-link" id="porLeer-tab" data-bs-toggle="tab"
              data-bs-target="#porLeer-pane" type="button" role="tab"
              aria-controls="porLeer-pane" aria-selected="false">
              Por Leer ({quieroLeerBooks.length})
            </button>
          </li>
        </ul>

        <div className="tab-content p-4" id="myTabContent">
          {/* Todos los Libros */}
          <div className="tab-pane fade show active" id="todosLibros-pane" role="tabpanel"
            aria-labelledby="librosTodos-tab">
            {allBooks.length > 0 ? (
              <div className="row">
                {allBooks.map(item => (
                  <div key={item.library_id || item.rating_id} className="col-md-3 mb-4">
                    <div className="card h-100">
                      <Link to={`/detalle/${item.book.id_libros}`}>
                        <img src={item.book.enlace_portada_libro || 'https://placehold.co/300x450'}
                          className="card-img-top" alt={item.book.titulo_libro}
                          style={{ height: '300px', objectFit: 'contain' }} />
                      </Link>
                      <div className="card-body">
                        <h6 className="card-title">{item.book.titulo_libro}</h6>
                        <p className="card-text text-muted small">{item.book.autor}</p>
                        <span className={`badge ${getReadingStateBadgeClass(item.reading_state)}`}>
                          {getReadingStateText(item.reading_state)}
                        </span>
                        {/* Show rating for read books */}
                        {item.reading_state === 'leido' && item.calificacion && (
                          <div className="mt-2">
                            <small className="text-warning">
                              {'★'.repeat(item.calificacion)}
                              {'☆'.repeat(5 - item.calificacion)}
                              <span className="text-muted ms-1">({item.calificacion}/5)</span>
                            </small>
                          </div>
                        )}
                      </div>
                      <div className="card-footer">
                        <Link to={`/detalle/${item.book.id_libros}`}
                          className="btn btn-sm btn-light w-100">
                          Ver Detalles
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No tienes libros en tu biblioteca. ¡Agrega un libro! <Link to='/libros'>Explora nuestra biblioteca</Link></p>
            )}
          </div>

          {/* Autores */}
          <div className="tab-pane fade" id="autores-pane" role="tabpanel"
            aria-labelledby="autores-tab">
            {authors.length > 0 ? (
              <div className="list-group">
                {authors.map(author => {
                  const authorBooks = allBooks.filter(item => item.book.autor === author)
                  return (
                    <div key={author} className="list-group-item">
                      <div className="d-flex justify-content-between align-items-center">
                        <h5 className="mb-1">{author}</h5>
                        <span className="badge bg-light rounded-pill text-dark">
                          {authorBooks.length} libro{authorBooks.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                      <div className="row mt-2">
                        {authorBooks.map(item => (
                          <div key={item.library_id || item.rating_id} className="col-md-2 mb-2">
                            <Link to={`/detalle/${item.book.id_libros}`}>
                              <img src={item.book.enlace_portada_libro || 'https://placehold.co/100x150'}
                                className="img-fluid rounded"
                                alt={item.book.titulo_libro}
                                title={item.book.titulo_libro}
                                style={{ height: '150px', objectFit: 'contain' }} />
                            </Link>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <p>No tienes autores en tu biblioteca. ¡Agrega un libro! <Link to='/libros'>Explora nuestra biblioteca</Link></p>
            )}
          </div>

          {/* Leyendo */}
          <div className="tab-pane fade" id="leyendo-pane" role="tabpanel"
            aria-labelledby="leyendo-tab">
            {leyendoBooks.length > 0 ? (
              <div className="row">
                {leyendoBooks.map(item => (
                  <div key={item.library_id} className="col-md-3 mb-4">
                    <div className="card h-100">
                      <Link to={`/detalle/${item.book.id_libros}`}>
                        <img src={item.book.enlace_portada_libro || 'https://placehold.co/300x450'}
                          className="card-img-top" alt={item.book.titulo_libro}
                          style={{ height: '300px', objectFit: 'contain' }} />
                      </Link>
                      <div className="card-body">
                        <h6 className="card-title">{item.book.titulo_libro}</h6>
                        <p className="card-text text-muted small">{item.book.autor}</p>
                      </div>
                      <div className="card-footer">
                        <Link to={`/detalle/${item.book.id_libros}`}
                          className="btn btn-sm btn-light w-100">
                          Ver Detalles
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No estás leyendo ningún libro en este momento. ¡Agrega un libro! <Link to='/libros'>Explora nuestra biblioteca</Link></p>
            )}
          </div>

          {/* Leídos */}
          <div className="tab-pane fade" id="leido-pane" role="tabpanel"
            aria-labelledby="leido-tab">
            {leidoBooks.length > 0 ? (
              <div className="row">
                {leidoBooks.map(item => (
                  <div key={item.rating_id} className="col-md-3 mb-4">
                    <div className="card h-100">
                      <Link to={`/detalle/${item.book.id_libros}`}>
                        <img src={item.book.enlace_portada_libro || 'https://placehold.co/300x450'}
                          className="card-img-top" alt={item.book.titulo_libro}
                          style={{ height: '300px', objectFit: 'contain' }} />
                      </Link>
                      <div className="card-body">
                        <h6 className="card-title">{item.book.titulo_libro}</h6>
                        <p className="card-text text-muted small">{item.book.autor}</p>
                        {/* Show rating for read books */}
                        {item.calificacion && (
                          <div className="mt-2">
                            <small className="text-warning">
                              {'★'.repeat(item.calificacion)}
                              {'☆'.repeat(5 - item.calificacion)}
                              <span className="text-muted ms-1">({item.calificacion}/5)</span>
                            </small>
                          </div>
                        )}
                        {item.resena && (
                          <div className="mt-2">
                            <small className="text-muted">
                              {item.resena.length > 100
                                ? `${item.resena.substring(0, 100)}...`
                                : item.resena}
                            </small>
                          </div>
                        )}
                      </div>
                      <div className="card-footer">
                        <Link to={`/detalle/${item.book.id_libros}`}
                          className="btn btn-sm btn-light w-100 mb-2">
                          Ver Detalles
                        </Link>
                        <Link to={`/libros/${item.book.id_libros}/resena`}
                          className="btn btn-sm btn-outline-light w-100">
                          {item.calificacion || item.resena ? 'Editar Reseña' : 'Agregar Reseña'}
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No tienes libros leídos en tu biblioteca. ¡Agrega un libro! <Link to='/libros'>Explora nuestra biblioteca</Link></p>
            )}
          </div>

          {/* Por Leer */}
          <div className="tab-pane fade" id="porLeer-pane" role="tabpanel"
            aria-labelledby="porLeer-tab">
            {quieroLeerBooks.length > 0 ? (
              <div className="row">
                {quieroLeerBooks.map(item => (
                  <div key={item.library_id} className="col-md-3 mb-4">
                    <div className="card h-100">
                      <Link to={`/detalle/${item.book.id_libros}`}>
                        <img src={item.book.enlace_portada_libro || 'https://placehold.co/300x450'}
                          className="card-img-top" alt={item.book.titulo_libro}
                          style={{ height: '300px', objectFit: 'contain' }} />
                      </Link>
                      <div className="card-body">
                        <h6 className="card-title">{item.book.titulo_libro}</h6>
                        <p className="card-text text-muted small">{item.book.autor}</p>
                      </div>
                      <div className="card-footer">
                        <Link to={`/detalle/${item.book.id_libros}`}
                          className="btn btn-sm btn-light w-100">
                          Ver Detalles
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No tienes libros por leer en tu biblioteca. ¡Agrega un libro! <Link to='/libros'>Explora nuestra biblioteca</Link></p>
            )}
          </div>
        </div>
      </div>
    </SessionBlocker>
  )
}