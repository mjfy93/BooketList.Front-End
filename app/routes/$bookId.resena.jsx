import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext.jsx';
import { API_BASE_URL } from "../utils/api";

export default function Reseña() {
    const { bookId } = useParams();
    const navigate = useNavigate();
    const auth = useAuth();

    const [book, setBook] = useState(null);
    const [rating, setRating] = useState(0);
    const [hoveredStar, setHoveredStar] = useState(0);
    const [resena, setResena] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [existingRating, setExistingRating] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!auth?.isAuthenticated) {
                navigate('/login');
                return;
            }

            try {
                // Fetch book data
                const bookRes = await fetch(`${API_BASE_URL}/api/books/${bookId}`);
                const bookData = await bookRes.json();
                setBook(bookData);

                // Fetch user's library to check for existing rating
                const libRes = await fetch(`${API_BASE_URL}/api/my-library`, {
                    headers: { 'Authorization': `Bearer ${auth.user.token}` }
                });
                const library = await libRes.json();

                // Find book in leido array
                const readBook = library.leido?.find(item => item.book.id_libros === parseInt(bookId));

                if (readBook) {
                    setExistingRating(readBook);
                    setRating(readBook.calificacion || 0);
                    setResena(readBook.resena || '');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Error al cargar datos');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [bookId, auth, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const response = await fetch(
                `${API_BASE_URL}/api/my-library/books/${bookId}/rating`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${auth.user.token}`
                    },
                    body: JSON.stringify({
                        calificacion: rating || null,
                        resena: resena || null
                    })
                }
            );

            if (response.ok) {
                alert('Reseña guardada exitosamente');
                navigate('/biblioteca');
            } else {
                const error = await response.json();
                alert(error.message || 'Error al guardar reseña');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al guardar reseña');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <div className="container mt-5 text-center">Cargando...</div>;
    }

    if (!book) {
        return <div className="container mt-5">Libro no encontrado</div>;
    }

    return (
        <div className="containerResena">
            <div className="libro">
                <div className="card-body d-flex">
                    <img src={book.cover_url || "https://placehold.co/100"} alt={book.title} style={{ width: '100px', height: '150px', objectFit: 'cover' }} />
                    <div className='ms-2'>
                        <h5 className="card-title">{book.title}</h5>
                        <p className="card-text">{book.author}</p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className='resena text-center'>
                <h6>Calificación</h6>
                <div className="mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            className="btn btn-link p-0 border-0"
                            style={{ fontSize: '32px', textDecoration: 'none' }}
                            onMouseEnter={() => setHoveredStar(star)}
                            onMouseLeave={() => setHoveredStar(0)}
                            onClick={() => setRating(star)}
                        >
                            <span style={{ color: (hoveredStar >= star || rating >= star) ? '#ffc107' : '#e0e0e0' }}>
                                ★
                            </span>
                        </button>
                    ))}
                </div>

                <div className="mb-3">
                    <label htmlFor="textoResena" className="form-label">¿Qué pensaste de este libro?</label>
                    <textarea
                        className="form-control"
                        id="textoResena"
                        rows="5"
                        maxLength="300"
                        placeholder="Máximo 300 caracteres."
                        value={resena}
                        onChange={(e) => setResena(e.target.value)}
                    />
                </div>

                <button type="submit" className="btn btn-light" disabled={submitting}>
                    {submitting ? 'Guardando...' : existingRating ? 'Actualizar Reseña' : 'Guardar Reseña'}
                </button>
            </form>
        </div>
    );
}