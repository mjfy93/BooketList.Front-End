import { useLoaderData, Link } from "react-router";

export async function loader() {
    // Fetch all authors
    const responseAuthors = await fetch('http://127.0.0.1:5000/api/authors');
    const authors = await responseAuthors.json();

    // Fetch books for each author
    const authorsWithBooks = await Promise.all(
        authors.map(async (author) => {
            const booksResponse = await fetch(
                `http://127.0.0.1:5000/api/authors/${author.id_autor}/profile`
            );
            const authorData = await booksResponse.json();
            return authorData;
        })
    );

    return authorsWithBooks;
}

export default function Autores() {
    const data = useLoaderData();
    console.log(data);

    return (
        <div className="containerAutores">
            <h1>Autores</h1>
            <h3>Descubre todos los autores en nuestro catálogo y todas sus obras.</h3>
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-4 g-4">
                {data.map((authorProfile) => (
                    <div className="col" key={authorProfile.author.id_autor}>
                        <div className="card h-100">
                            <div className="card-body">
                                <h5 className="card-title">
                                    {authorProfile.author.nombre_completo}
                                </h5>


                                <ul className="list-group list-group-flush">
                                    {authorProfile.books.slice(0, 3).map((libro) => (
                                        <li
                                            className="list-group-item d-flex justify-content-between align-items-center p-2"
                                            key={libro.id_libros}
                                        >
                                            <span className="text-truncate" style={{ maxWidth: '150px' }}>
                                                {libro.titulo_libro}
                                            </span>
                                            <Link
                                                to={`/detalle/${libro.id_libros}`}
                                                className="btn btn-light btn-sm p-1"
                                            >
                                                Ver
                                            </Link>
                                        </li>
                                    ))}
                                    {authorProfile.books.length > 3 && (
                                        <li className="list-group-item text-center">
                                            <small className="text-muted">
                                                +{authorProfile.books.length - 3} más
                                            </small>
                                        </li>
                                    )}
                                </ul>
                                {/* 
                                <Link
                                    to={`/autor/${authorProfile.author.id_autor}`}
                                    className="btn btn-primary btn-sm mt-3 w-100"
                                >
                                    Ver perfil completo
                                </Link> */}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}