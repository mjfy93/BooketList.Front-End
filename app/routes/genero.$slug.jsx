import { useLoaderData, Link } from "react-router";

export async function loader({ params }) {
    const { slug } = params;


    const response = await fetch(`http://127.0.0.1:5000/api/books/genre/${slug}`);
    const books = await response.json();


    const genreName = books.length > 0
        ? books[0].genre
        : slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

    return { books, genreName, slug };
}

export default function Genero() {
    const { books, genreName } = useLoaderData();

    return (
        <div className="container text-start">
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                        <Link to="/">Inicio</Link>
                    </li>
                    <li className="breadcrumb-item">
                        <Link to="/generosTodos">Géneros</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                        {genreName}
                    </li>
                </ol>
            </nav>

            <h1 className="m-1"> {genreName}</h1>
            <p className="text-muted">
                {books.length} {books.length === 1 ? 'libro encontrado' : 'libros encontrados'}
            </p>

            <div className="row g-4 mt-3">
                {books.length > 0 ? (
                    books.map((book) => (
                        <div className="col-md-3 col-sm-6" key={book.id}>
                            <div className="card h-100">
                                <img
                                    src={book.cover_url || "https://placehold.co/150x200"}
                                    className="card-img-top"
                                    alt={book.title}
                                    style={{ height: '300px', objectFit: 'cover' }}
                                />
                                <div className="card-body d-flex flex-column">
                                    <h5 className="card-title">{book.title}</h5>
                                    <p className="card-text text-muted">{book.author}</p>
                                    <Link
                                        to={`/detalle/${book.id}`}
                                        className="btn btn-light mt-auto"
                                    >
                                        Ver detalles
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-12">
                        <div className="alert alert-info">
                            No se encontraron libros para este género.
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}