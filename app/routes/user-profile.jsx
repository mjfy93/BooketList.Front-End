import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext.jsx';

export default function UserProfile() {
  const navigate = useNavigate();
  const auth = useAuth();

  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!auth.isAuthenticated || !auth.user?.token) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch('http://127.0.0.1:5000/api/profile', {
          headers: {
            'Authorization': `Bearer ${auth.user.token}`
          }
        });

        if (!response.ok) {
          throw new Error('Error al cargar el perfil');
        }

        const data = await response.json();
        setProfileData(data);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [auth.isAuthenticated, auth.user?.token, navigate]);

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-3">Cargando perfil...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error</h4>
          <p>{error}</p>
          <hr />
          <Link to="/" className="btn btn-primary">Volver al inicio</Link>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return null;
  }

  const { user, statistics, readingLists, topAuthors, recentReviews } = profileData;

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Header */}
        <div className="col-12 bg-primary text-white p-3 mb-4">
          <div className="d-flex justify-content-between align-items-center">
            <h4 className="mb-0">BooketList</h4>
            <div className="d-flex align-items-center">
              <span className="me-3">{user.name}</span>
              <div className="dropdown">
                <button className="btn btn-outline-light dropdown-toggle" type="button" data-bs-toggle="dropdown">
                  <i className="fas fa-user-circle"></i>
                </button>
                <ul className="dropdown-menu">
                  <li><Link className="dropdown-item" to="/profile">Mi Perfil</Link></li>
                  <li><button className="dropdown-item" onClick={() => {
                    auth.logout();
                    navigate('/login');
                  }}>Cerrar Sesión</button></li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12">
          <div className="p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h1>Mi Perfil</h1>
              <Link to="/" className="btn btn-outline-secondary">
                <i className="fas fa-arrow-left me-2"></i>Volver al Inicio
              </Link>
            </div>

            {/* Información Básica */}
            <div className="card mb-4">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-8">
                    <div className="d-flex align-items-center">
                      <div className="avatar bg-primary text-white rounded-circle me-3 d-flex align-items-center justify-content-center"
                        style={{ width: '60px', height: '60px', fontSize: '1.5rem' }}>
                        {user.firstName.charAt(0)}
                      </div>
                      <div>
                        <h4 className="mb-1">{user.name}</h4>
                        <p className="text-muted mb-1">{user.email}</p>
                        <div className="d-flex gap-2">
                          <span className="badge bg-secondary">Usuario</span>
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
                      Libros Leídos ({statistics.totalBooksRead})
                    </h5>
                  </div>
                  <div className="card-body">
                    {readingLists.read.length > 0 ? (
                      <div className="list-group list-group-flush">
                        {readingLists.read.map(book => (
                          <div key={book.id} className="list-group-item px-0">
                            <div className="d-flex justify-content-between align-items-start">
                              <div>
                                <h6 className="mb-1">{book.title}</h6>
                                <small className="text-muted">{book.author}</small>
                              </div>
                              {book.rating && (
                                <div className="text-warning">
                                  {'★'.repeat(book.rating)}{'☆'.repeat(5 - book.rating)}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted text-center">No has terminado ningún libro aún</p>
                    )}
                  </div>
                </div>

                {/* Leyendo Actualmente */}
                <div className="card mb-4">
                  <div className="card-header bg-warning text-dark">
                    <h5 className="card-title mb-0">
                      <i className="fas fa-book-open me-2"></i>
                      Leyendo Actualmente ({statistics.totalBooksReading})
                    </h5>
                  </div>
                  <div className="card-body">
                    {readingLists.reading.length > 0 ? (
                      <div className="list-group list-group-flush">
                        {readingLists.reading.map(book => (
                          <div key={book.id} className="list-group-item px-0">
                            <h6 className="mb-1">{book.title}</h6>
                            <small className="text-muted">{book.author}</small>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted text-center">No estás leyendo ningún libro actualmente</p>
                    )}
                  </div>
                </div>

                {/* Por Leer */}
                <div className="card mb-4">
                  <div className="card-header bg-info text-white">
                    <h5 className="card-title mb-0">
                      <i className="fas fa-bookmark me-2"></i>
                      Por Leer ({statistics.totalBooksToRead})
                    </h5>
                  </div>
                  <div className="card-body">
                    {readingLists.toRead.length > 0 ? (
                      <div className="list-group list-group-flush">
                        {readingLists.toRead.map(book => (
                          <div key={book.id} className="list-group-item px-0">
                            <h6 className="mb-1">{book.title}</h6>
                            <small className="text-muted">{book.author}</small>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted text-center">No tienes libros en tu lista para leer</p>
                    )}
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
                    {topAuthors.length > 0 ? (
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
                    ) : (
                      <p className="text-muted text-center">No hay datos de autores aún</p>
                    )}
                  </div>
                </div>

                {/* Reseñas Recientes */}
                <div className="card">
                  <div className="card-header" style={{ backgroundColor: '#6f42c1', color: 'white' }}>
                    <h5 className="card-title mb-0">
                      <i className="fas fa-star me-2"></i>
                      Reseñas Recientes ({statistics.totalReviews})
                    </h5>
                  </div>
                  <div className="card-body">
                    {recentReviews.length > 0 ? (
                      <div className="list-group list-group-flush">
                        {recentReviews.map(review => (
                          <div key={review.id} className="list-group-item px-0 mb-3">
                            <div className="d-flex justify-content-between align-items-start mb-2">
                              <h6 className="mb-0">{review.bookTitle}</h6>
                              <div className="text-warning">
                                {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                              </div>
                            </div>
                            <p className="mb-2" style={{ fontSize: '0.9rem' }}>
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
                    ) : (
                      <p className="text-muted text-center">No has escrito ninguna reseña aún</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}