import { useLoaderData, Link } from "react-router";
import { API_BASE_URL } from "../utils/api";

export async function loader() {
    const responseAuthors = await fetch(`${API_BASE_URL}/api/authors`);
    const authors = await responseAuthors.json();

    // Sort by first name
    const sorted = authors.sort((a, b) =>
        a.nombre_autor.localeCompare(b.nombre_autor)
    );

    // Group by first letter of first name
    const grouped = sorted.reduce((acc, author) => {
        // Handle empty or undefined first name
        const firstName = author.nombre_autor || 'Desconocido';
        const letter = firstName[0].toUpperCase();

        if (!acc[letter]) {
            acc[letter] = [];
        }
        acc[letter].push(author);
        return acc;
    }, {});

    return grouped;
}

export default function Autores() {
    const authorsByLetter = useLoaderData();
    const letters = Object.keys(authorsByLetter).sort();

    return (
        <div className="container my-4" id="top">
            <h1>Autores</h1>
            <h3>Descubre todos los autores en nuestro catálogo y todas sus obras.</h3>


            <div className="my-4">
                {letters.map(letter => (
                    <a
                        key={letter}
                        href={`#letter-${letter}`}
                        className="btn btn-sm btn-outline-light me-1 mb-1"
                    >
                        {letter}
                    </a>
                ))}
            </div>


            {letters.map(letter => (
                <div key={letter} id={`letter-${letter}`} className="mb-5">
                    <h2 className="border-bottom pb-2">{letter}</h2>
                    <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4 mt-2">
                        {authorsByLetter[letter].map((author) => (
                            <div className="col" key={author.id_autor}>
                                <div className="card h-100 text-center">
                                    <div className="card-body d-flex flex-column">
                                        <h5 className="card-title">
                                            {author.nombre_autor}
                                            {author.apellido_autor && ` ${author.apellido_autor}`}
                                        </h5>
                                        {author.biografia_autor && (
                                            <p className="card-text text-muted small flex-grow-1">
                                                {author.biografia_autor.substring(0, 100)}
                                                {author.biografia_autor.length > 100 && '...'}
                                            </p>
                                        )}
                                        <Link
                                            to={`/autores/${author.id_autor}`}
                                            className="btn btn-light btn-sm mt-auto"
                                        >
                                            Ver perfil y libros
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <a href="#top" style={{ color: "white" }}>Volver al inicio</a>
                </div>
            ))}
        </div>
    );
}