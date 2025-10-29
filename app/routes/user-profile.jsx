// routes/admin-user-detail.jsx
import { useState } from 'react'
import { Link, useParams } from 'react-router'

export default function AdminUserDetail() {
  const { id } = useParams()
  
  const [user] = useState({
    id: parseInt(id),
    name: 'Juan Pérez',
    email: 'juan@email.com',
    role: 'user',
    status: 'active',
    joinDate: '2024-01-15',
    lastLogin: '2024-10-24'
  })

  const [readingLists] = useState({
    read: [
      { id: 1, title: 'Cien años de soledad', author: 'Gabriel García Márquez', rating: 5 },
      { id: 2, title: '1984', author: 'George Orwell', rating: 4 },
      { id: 3, title: 'El principito', author: 'Antoine de Saint-Exupéry', rating: 5 }
    ],
    reading: [
      { id: 4, title: 'Don Quijote de la Mancha', author: 'Miguel de Cervantes', progress: 65 },
      { id: 5, title: 'Crimen y castigo', author: 'Fiódor Dostoievski', progress: 30 }
    ],
    toRead: [
      { id: 6, title: 'Orgullo y prejuicio', author: 'Jane Austen' },
      { id: 7, title: 'El hobbit', author: 'J.R.R. Tolkien' },
      { id: 8, title: 'Los miserables', author: 'Victor Hugo' }
    ]
  })

  const [topAuthors] = useState([
    { name: 'Gabriel García Márquez', booksCount: 5 },
    { name: 'George Orwell', booksCount: 3 },
    { name: 'Jane Austen', booksCount: 2 },
    { name: 'J.R.R. Tolkien', booksCount: 2 }
  ])

  const [reviews] = useState([
    { 
      id: 1, 
      bookTitle: 'Cien años de soledad', 
      rating: 5, 
      comment: 'Una obra maestra de la literatura latinoamericana. El realismo mágico en su máxima expresión.',
      date: '2024-08-15',
      likes: 24
    },
    { 
      id: 2, 
      bookTitle: '1984', 
      rating: 4, 
      comment: 'Increíblemente visionario y perturbador. Una lectura obligatoria para entender nuestro tiempo.',
      date: '2024-07-22',
      likes: 18
    },
    { 
      id: 3, 
      bookTitle: 'El principito', 
      rating: 5, 
      comment: 'Un libro que todo adulto debería releer. Lleno de sabiduría y sensibilidad.',
      date: '2024-06-10',
      likes: 32
    }
  ])

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

        <div className="col-md-9 col-lg-10 ms-auto">
          <div className="p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h1>Perfil de Usuario</h1>
              <Link to="/admin/users" className="btn btn-outline-secondary">
                <i className="fas fa-arrow-left me-2"></i>Volver a Usuarios
              </Link>
            </div>

            {/* Información Básica del Usuario */}
            <div className="card mb-4">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-8">
                    <div className="d-flex align-items-center">
                      <div className="avatar bg-primary text-white rounded-circle me-3 d-flex align-items-center justify-content-center" 
                           style={{width: '60px', height: '60px', fontSize: '1.5rem'}}>
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="mb-1">{user.name}</h4>
                        <p className="text-muted mb-1">{user.email}</p>
                        <div className="d-flex gap-2">
                          <span className={`badge ${user.role === 'author' ? 'bg-info' : 'bg-secondary'}`}>
                            {user.role === 'author' ? 'Autor' : 'Usuario'}
                          </span>
                          <span className={`badge ${user.status === 'active' ? 'bg-success' : 'bg-danger'}`}>
                            {user.status === 'active' ? 'Activo' : 'Bloqueado'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 text-end">
                    <div className="text-muted">
                      <small>Miembro desde: {user.joinDate}</small>
                      <br />
                      <small>Último acceso: {user.lastLogin}</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              {/* Listas de Lectura */}
              <div className="col-md-6">
                {/* Libros Leídos */}
                <div className="card mb-4">
                  <div className="card-header bg-success text-white">
                    <h5 className="card-title mb-0">
                      <i className="fas fa-check-circle me-2"></i>
                      Libros Leídos ({readingLists.read.length})
                    </h5>
                  </div>
                  <div className="card-body">
                    <div className="list-group list-group-flush">
                      {readingLists.read.map(book => (
                        <div key={book.id} className="list-group-item px-0">
                          <div className="d-flex justify-content-between align-items-start">
                            <div>
                              <h6 className="mb-1">{book.title}</h6>
                              <small className="text-muted">{book.author}</small>
                            </div>
                            <div className="text-warning">
                              {'★'.repeat(book.rating)}{'☆'.repeat(5-book.rating)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Leyendo Actualmente */}
                <div className="card mb-4">
                  <div className="card-header bg-warning text-dark">
                    <h5 className="card-title mb-0">
                      <i className="fas fa-book-open me-2"></i>
                      Leyendo Actualmente ({readingLists.reading.length})
                    </h5>
                  </div>
                  <div className="card-body">
                    <div className="list-group list-group-flush">
                      {readingLists.reading.map(book => (
                        <div key={book.id} className="list-group-item px-0">
                          <div className="d-flex justify-content-between align-items-start">
                            <div>
                              <h6 className="mb-1">{book.title}</h6>
                              <small className="text-muted">{book.author}</small>
                            </div>
                            <div className="text-primary">
                              <small>{book.progress}%</small>
                            </div>
                          </div>
                          <div className="progress mt-2" style={{height: '4px'}}>
                            <div 
                              className="progress-bar" 
                              style={{width: `${book.progress}%`}}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Por Leer */}
                <div className="card mb-4">
                  <div className="card-header bg-info text-white">
                    <h5 className="card-title mb-0">
                      <i className="fas fa-bookmark me-2"></i>
                      Por Leer ({readingLists.toRead.length})
                    </h5>
                  </div>
                  <div className="card-body">
                    <div className="list-group list-group-flush">
                      {readingLists.toRead.map(book => (
                        <div key={book.id} className="list-group-item px-0">
                          <h6 className="mb-1">{book.title}</h6>
                          <small className="text-muted">{book.author}</small>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                {/* Autores Más Leídos */}
                <div className="card mb-4">
                  <div className="card-header bg-primary text-white">
                    <h5 className="card-title mb-0">
                      <i className="fas fa-crown me-2"></i>
                      Autores Más Leídos
                    </h5>
                  </div>
                  <div className="card-body">
                    <div className="list-group list-group-flush">
                      {topAuthors.map((author, index) => (
                        <div key={author.name} className="list-group-item px-0">
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <span className="badge bg-secondary me-2">{index + 1}</span>
                              {author.name}
                            </div>
                            <span className="badge bg-light text-dark">
                              {author.booksCount} libro{author.booksCount > 1 ? 's' : ''}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Reseñas Recientes */}
                <div className="card">
                  <div className="card-header bg-purple text-white">
                    <h5 className="card-title mb-0">
                      <i className="fas fa-star me-2"></i>
                      Reseñas Recientes ({reviews.length})
                    </h5>
                  </div>
                  <div className="card-body">
                    <div className="list-group list-group-flush">
                      {reviews.map(review => (
                        <div key={review.id} className="list-group-item px-0 mb-3">
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <h6 className="mb-0">{review.bookTitle}</h6>
                            <div className="text-warning">
                              {'★'.repeat(review.rating)}{'☆'.repeat(5-review.rating)}
                            </div>
                          </div>
                          <p className="mb-2" style={{fontSize: '0.9rem'}}>
                            {review.comment}
                          </p>
                          <div className="d-flex justify-content-between align-items-center">
                            <small className="text-muted">{review.date}</small>
                            <small className="text-muted">
                              <i className="fas fa-heart text-danger me-1"></i>
                              {review.likes} likes
                            </small>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .bg-purple {
          background-color: #6f42c1 !important;
        }
      `}</style>
    </div>
  )
}