import { useLoaderData, Link, useParams } from "react-router";




export async function loader() {
    const response = await fetch('http://127.0.0.1:5000/api/books')



    return response.json()
}



export default function Libros() {
    const data = useLoaderData();

    console.log(data);




    return (
        <div className="containerLibros">
            <h1>Biblioteca</h1>
            <h3>Acá podrás explorar todos los libros en nuestra colección</h3>

            <div className="container text-center" >
                <div className="row row-cols-1 row-cols-sm-2 row-cols-md-4 g-2">
                    {data.map((item) => (
                        <div className="col" key={item.id_libros}>
                            <div className="card h-100 ">
                                <img src={item.enlace_portada_libro}
                                    className="card-img-top"
                                    alt="portada"
                                    style={{ height: '400px', objectFit: 'contain' }} />
                                <div className="card-body d-flex flex-column">
                                    <h5 className="card-title">{item.titulo_libro} </h5>
                                    <p className="card-text">{item.autor.nombre_autor} {item.autor.apellido_autor}</p>
                                    <button className="btn btn-light mt-auto">
                                        <Link to={`/detalle/${item.id_libros}`}
                                            className="link-dark link-underline link-underline-opacity-0">
                                            Más información
                                        </Link>
                                    </button>


                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}