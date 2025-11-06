import { useLoaderData, Link } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";

export async function loader() {
  const response = await fetch('http://127.0.0.1:5000/api/books');
  return response.json();
}



export default function Home() {
  const data = useLoaderData();
  const { user, isAuthenticated, login, logout, authFetch, loading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [currentReadings, setCurrentReadings] = useState([]);


  useEffect(() => {
    if (isAuthenticated) {
      authFetch('http://127.0.0.1:5000/api/my-library')
        .then(response => {
          if (response.ok) {
            return response.json();
          }
          throw new Error('Error fetching biblioteca');
        })
        .then(data => setCurrentReadings(data.books.slice(0, 4)))
        .catch(err => console.error('Error fetching biblioteca:', err));
    }
  }, [isAuthenticated, authFetch]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    const result = await login(email, password);

    if (!result.success) {
      setError(result.error);
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


  if (!isAuthenticated) {
    return (
      <div className="row">
        <div className="welcomeContainer col-8">
          <h1>BooketList - Encuentra tu próximo libro</h1>
          <p>¡Bienvenidos y Bienvenidas!</p>
          <p>BooketList es el lugar de encuentro para todos los que alguna vez se dijeron a sí mismos: "No sé qué leer".</p>
          <p>Acá, encontrarás un compendio de todos los libros que toda persona amante de la literatura debe leer antes de morir. Tenemos libros para todos los gustos y de todos los géneros, guarda tus favoritos, agrega reseñas y calificaciones.</p>
        </div>

        <div className="loginContainer col-4">
          <form onSubmit={handleLogin}>
            <h2>Iniciar sesión</h2>

            {error && (
              <div className="alert alert-danger" role="alert">
                Credenciales incorrectas. Inténtalo de nuevo.
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
              ¿No tienes una cuenta? <Link to="/register">Crea una cuenta.</Link>
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
              <h5 className="card-title">BooketList</h5>
              <h6 className="card-subtitle mb-2 text-body-secondary">
                ¡Bienvenido/a {user?.nombre_usuario}!
              </h6>
            </div>
            <button
              onClick={handleLogout}
              className="btn btn-outline-danger btn-sm"
            >
              Cerrar sesión
            </button>
          </div>

          <p className="card-text">¡Comienza a explorar!</p>

          <h6 className="mt-4">Lecturas actuales:</h6>
          <div className="container text-center">
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-4 g-3">
              {currentReadings.length > 0 ? (
                currentReadings.map((item) => (
                  <div className="col" key={item.id_biblioteca}>
                    <div className="card h-100">
                      <img
                        src={item.libro?.enlace_portada_libro || "https://placehold.co/100"}
                        className="card-img-top"
                        alt={item.libro?.titulo_libro}
                        style={{ height: '200px', objectFit: 'cover' }}
                      />
                      <div className="card-body">
                        <h6 className="card-title text-truncate">
                          {item.libro?.titulo_libro || 'Título'}
                        </h6>
                        <p className="card-text small text-muted">
                          {item.libro?.autor ?
                            `${item.libro.autor.nombre_autor} ${item.libro.autor.apellido_autor}`
                            : 'Autor'}
                        </p>
                        <Link
                          to={`/detalle/${item.libro?.id_libros}`}
                          className="btn btn-light btn-sm"
                        >
                          Más información
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-12">
                  <p className="text-muted">No tienes libros en tu biblioteca aún.</p>
                </div>
              )}
            </div>

            <div className="mt-4">
              <Link to="/biblioteca" className="card-link me-3">
                Mi Biblioteca
              </Link>
              <Link to="/generosTodos" className="card-link">
                Encuentra tu siguiente libro favorito
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}