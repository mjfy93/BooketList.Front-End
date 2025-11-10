import { useLoaderData, Link } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { API_BASE_URL } from "../utils/api";
import { faBook } from '../utils/faIcons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export async function loader() {
  const response = await fetch(`${API_BASE_URL}/api/books`);
  return response.json();
}

export default function Home() {
  const allBooks = useLoaderData();
  const { user, isAuthenticated, login, logout, loading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [userBooks, setUserBooks] = useState([]);

  useEffect(() => {
    if (isAuthenticated && user?.token) {
      fetch(`${API_BASE_URL}/api/my-library`, {
        headers: { 'Authorization': `Bearer ${user.token}` }
      })
        .then(async response => {
          if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          // Add reading_state property to each book
          const combined = [
            ...(data.leyendo || []).map(item => ({ ...item, reading_state: 'leyendo' })),
            ...(data.quiero_leer || []).map(item => ({ ...item, reading_state: 'quiero_leer' })),
            ...(data.leido || []).map(item => ({ ...item, reading_state: 'leido' }))
          ].slice(0, 5);
          setUserBooks(combined);
        })
        .catch(err => console.error('Error:', err));
    }
  }, [isAuthenticated, user?.token]);

  const getBookStatus = (readingState) => {
    if (!readingState) return null;

    if (readingState === 'quiero_leer')
      return { icon: 'heart', color: 'info', label: 'Quiero Leer' };
    if (readingState === 'leyendo')
      return { icon: 'book-open', color: 'warning', label: 'Leyendo' };
    if (readingState === 'leido')
      return { icon: 'check-circle', color: 'success', label: 'Leído' };

    return null;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    const result = await login(email, password);
    if (response.status === 401) {
      // Token expired - logout user
      logout();
      throw new Error('Sesión expirada');
    }

    if (!result.success) {
      if (result.error && result.error.includes('bloqueada')) {
        setError(result.error);
      } else {
        setError(result.error || 'Credenciales inválidas');
      }
    } else {
      setEmail('');
      setPassword('');
    }
  };

  const handleLogout = () => {
    logout();
  };

  if (loading) {
    return (
      <div className="text-center my-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  const booksToShow = isAuthenticated ? userBooks : allBooks.slice(0, 5);

  if (!isAuthenticated) {
    return (
      <div className="row mt-2">
        <div className="welcomeContainer col-8 text-center">
          <h1><FontAwesomeIcon icon={faBook} />BooketList </h1>
          <h2>Encuentra tu próximo libro favorito</h2>
          <h3>¡Bienvenidos!</h3>
          <div className="m-3">
            <h5 className="py-2">BooketList es el lugar de encuentro para todos los que alguna vez se preguntaron "¿Qué libros debería leer antes de morir?".</h5>
            <h5>Encontrarás un compendio de libros de todos los géneros y para todos los gustos. Guarda tus favoritos, agrega reseñas y calificaciones y comparte tus opiniones sobre los mejores libros de la historia. </h5>
          </div>

          <div className="mt-4">
            <h5>Algunos de nuestros títulos:</h5>
            <div className="row row-cols-5 g-3 justify-content-center">
              {booksToShow.map((book) => (
                <div className="col" key={book.id_libros}>
                  <Link to={`/detalle/${book.id_libros}`}>
                    <img
                      src={book.enlace_portada_libro || "https://placehold.co/100x150"}
                      className="img-fluid rounded shadow-sm"
                      alt={book.titulo_libro}
                      style={{ height: '150px', objectFit: 'cover' }}
                    />
                  </Link>
                </div>
              ))}
            </div>
            <h4 className="my-2">¡Crea tu usuario y comienza a explorar!</h4>
          </div>
        </div>

        <div className="loginContainer col-4">
          <form onSubmit={handleLogin}>
            <h2>Iniciar sesión</h2>

            {error && (
              <div className="alert alert-danger" role="alert">
                <strong>Error:</strong> {error}
                {error.includes('bloqueada') && (
                  <div className="mt-2">
                    <small>
                      Si crees que esto es un error, contacta a:
                      <a href="mailto:soporte@booketlist.com" className="text-danger ms-1">
                        soporte@booketlist.com
                      </a>
                    </small>
                  </div>
                )}
              </div>
            )}

            <div className="mb-3">
              <label htmlFor="correoElectrónico" className="form-label">
                Correo electrónico
              </label>
              <input
                type="email"
                className="form-control"
                id="correoElectrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="contraseña" className="form-label">
                Contraseña
              </label>
              <input
                type="password"
                className="form-control"
                id="contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-light">
              Iniciar sesión
            </button>

            <p className="mt-2">
              ¿No tienes una cuenta? <Link to="/register" className="text-warning">Crea una cuenta.</Link>
            </p>
            <p className="mt-2">
              <Link to="/admin" className="text-warning">Ingresa como Administrador.</Link>
            </p>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="homeContainer text-start my-5 px-4">
      <div className="card">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h5 className="card-title"><FontAwesomeIcon icon={faBook} />BooketList</h5>
              <h6 className="card-subtitle mb-2 text-body-secondary">
                ¡Que bueno verte de nuevo {user?.nombre_usuario}!
              </h6>
            </div>
            <button
              onClick={handleLogout}
              className="btn btn-outline-danger btn-sm"
            >
              Cerrar sesión
            </button>
          </div>

          <p className="card-text">¡Agrega más libros a tu biblioteca!</p>

          <h6 className="mt-4">Tu biblioteca:</h6>
          <div className="container text-center">
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-5 g-3">
              {booksToShow.length > 0 ? (
                booksToShow.map((item) => {
                  const status = getBookStatus(item.reading_state);
                  return (
                    <div className="col" key={item.library_id || item.rating_id}>
                      <div className="card h-100">
                        <div className="position-relative">
                          <img
                            src={item.book.enlace_portada_libro || "https://placehold.co/100"}
                            className="card-img-top"
                            alt={item.book.titulo_libro}
                            style={{ height: '150px', objectFit: 'contain' }}
                          />
                          {status && (
                            <span
                              className={`position-absolute top-0 end-0 m-2 badge bg-${status.color} border border-light`}
                              title={status.label}
                            >
                              <i className={`fas fa-${status.icon} fs-6 p-1`}></i>
                            </span>
                          )}
                        </div>
                        <div className="card-body align-items-center">

                          <Link
                            to={`/detalle/${item.book.id_libros}`}
                            className="btn btn-light btn-sm"
                          >
                            Más información
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="col-12">
                  <p className="text-muted">No tienes libros en tu biblioteca aún.</p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4">
            <Link to="/biblioteca" className="card-link me-3 text-warning">
              Mi Biblioteca
            </Link>
            <Link to="/generosTodos" className="card-link text-warning">
              Encuentra tu siguiente libro favorito
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}