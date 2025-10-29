// routes/admin-books.jsx
import { useState } from 'react'
import { Link } from 'react-router'

export default function AdminBooks() {
  const [books, setBooks] = useState([
    {
      id: 1,
      title: 'Cien años de soledad',
      author: 'Gabriel García Márquez',
      authorId: 1,
      genre: 'Ficción',
      status: 'published',
      addedBy: 'María García',
      addedById: 2,
      addedDate: '2024-01-20',
      reviews: 156,
      rating: 4.8,
      coverImage: 'https://th.bing.com/th/id/OIF.Y2rN6VOb3ioE4J1sqv1huw?w=206&h=206&c=7&r=0&o=7&pid=1.7&rm=3'
    },
    {
      id: 2,
      title: '1984',
      author: 'George Orwell',
      authorId: 4,
      genre: 'Ciencia Ficción',
      status: 'published',
      addedBy: 'Juan Pérez',
      addedById: 1,
      addedDate: '2024-02-15',
      reviews: 89,
      rating: 4.5,
      coverImage: 'https://th.bing.com/th/id/OIP.0DsiL1Mk6k1pW1S-4xY8-gHaLH?w=115&h=180&c=7&r=0&o=5&pid=1.7'
    }
  ])

  const [searchTerm, setSearchTerm] = useState('')

  const deleteBook = (bookId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este libro?')) {
      setBooks(books.filter(book => book.id !== bookId))
    }
  }

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.genre.toLowerCase().includes(searchTerm.toLowerCase())
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
              <Link to="/admin/books" className="nav-link text-white mb-2 active">
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

        <div className="col-md-9 col-lg-10 ms-auto">
          <div className="p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h1>Gestión de Libros</h1>
              <div>
                <Link to="/admin/books/new" className="btn btn-primary me-2">
                  <i className="fas fa-plus me-2"></i>Nuevo Libro
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
                      placeholder="Buscar libros por título, autor o género..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="col-md-6">
                    <div className="d-flex gap-2 justify-content-end">
                      <select className="form-select w-auto">
                        <option>Todos los estados</option>
                        <option>Publicados</option>
                        <option>Borradores</option>
                        <option>Archivados</option>
                      </select>
                      <button className="btn btn-outline-primary">
                        <i className="fas fa-download me-2"></i>Exportar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Books Table */}
            <div className="card">
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-striped table-hover">
                    <thead>
                      <tr>
                        <th>Portada</th>
                        <th>Título</th>
                        <th>Autor</th>
                        <th>Género</th>
                        <th>Estado</th>
                        <th>Reseñas</th>
                        <th>Calificación</th>
                        <th>Agregado por</th>
                        <th>Fecha</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBooks.map(book => (
                        <tr key={book.id}>
                          <td>
                            <Link to={`/admin/books/edit/${book.id}`}>
                              <img 
                                src={book.coverImage} 
                                alt={`Portada de ${book.title}`}
                                className="rounded"
                                style={{width: '50px', height: '70px', objectFit: 'cover'}}
                              />
                            </Link>
                          </td>
                          <td>
                            <Link 
                              to={`/admin/books/edit/${book.id}`}
                              className="text-decoration-none fw-bold"
                            >
                              {book.title}
                            </Link>
                            <br />
                            <small className="text-muted">ID: {book.id}</small>
                          </td>
                          <td>
                            <Link 
                              to={`/admin/authors/${book.authorId}`}
                              className="text-decoration-none"
                            >
                              {book.author}
                            </Link>
                          </td>
                          <td>
                            <span className="badge bg-secondary">{book.genre}</span>
                          </td>
                          <td>
                            <span className="badge bg-success">Publicado</span>
                          </td>
                          <td>
                            <Link 
                              to={`/admin/books/reviews/${book.id}`}
                              className="text-decoration-none"
                            >
                              <span className="badge bg-info">{book.reviews}</span>
                            </Link>
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              <span className="text-warning me-1">
                                {'★'.repeat(Math.floor(book.rating))}
                              </span>
                              <small className="text-muted">({book.rating})</small>
                            </div>
                          </td>
                          <td>
                            <Link 
                              to={`/admin/users/${book.addedById}`}
                              className="text-decoration-none"
                            >
                              {book.addedBy}
                            </Link>
                          </td>
                          <td>{book.addedDate}</td>
                          <td>
                            <div className="d-flex gap-1 flex-nowrap">
                              <Link 
                                to={`/admin/books/edit/${book.id}`}
                                className="btn btn-sm btn-outline-primary"
                                title="Ver detalles"
                              >
                                <i className="fas fa-eye"></i>
                              </Link>
                              <Link 
                                to={`/admin/books/edit/${book.id}`}
                                className="btn btn-sm btn-outline-warning"
                                title="Editar libro"
                              >
                                <i className="fas fa-edit"></i>
                              </Link>
                              <Link 
                                to={`/admin/books/reviews/${book.id}`}
                                className="btn btn-sm btn-outline-info"
                                title="Ver reseñas"
                              >
                                <i className="fas fa-comments"></i>
                              </Link>
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => deleteBook(book.id)}
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

            {/* Stats Section */}
            <div className="row mt-4">
              <div className="col-md-3">
                <div className="card bg-primary text-white">
                  <div className="card-body text-center">
                    <h3>{books.length}</h3>
                    <p className="mb-0">Total Libros</p>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card bg-success text-white">
                  <div className="card-body text-center">
                    <h3>{books.filter(b => b.status === 'published').length}</h3>
                    <p className="mb-0">Publicados</p>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card bg-info text-white">
                  <div className="card-body text-center">
                    <h3>{books.reduce((total, book) => total + book.reviews, 0)}</h3>
                    <p className="mb-0">Total Reseñas</p>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card bg-warning text-dark">
                  <div className="card-body text-center">
                    <h3>{(books.reduce((total, book) => total + book.rating, 0) / books.length).toFixed(1)}</h3>
                    <p className="mb-0">Rating Promedio</p>
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