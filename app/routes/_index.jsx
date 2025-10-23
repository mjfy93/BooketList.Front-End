import { useLoaderData, Link, useParams } from "react-router";
// import './styles/stylesHome.css'


// export async function loader() {
//   const response = await fetch('https://jsonplaceholder.typicode.com/posts')



//   return response.json()
// }

export default function Home() {
  //   const data = useLoaderData().slice(0, 10);

  //  console.log(data);






  return (

    <div className="home-container">
      <div className="container">
        <h2>Genero</h2>
        <div className="bookstand">
          <div className="overflow-auto h-25">
            <div className="d-flex flex-nowrap gap-4 pb-3 ">
              {/* {data.map((item, index) => ( */}
              <div className="flex-shrink-1" >
                <img src={`https://picsum.photos/75/100?random=1`} className="img-fluid img-thumbnail" alt="Book" />
                <h5>Título libro</h5>
                <p className="text-wrap">Autor Libro</p>
                <Link to={'/detalle'} className="link-underline link-underline-opacity-0 ">
                  <button type="button" className="btn btn-secondary">Más información</button>
                </Link>
              </div>
              {/* ))} */}
              <Link to={'/genero'} className="link-underline link-underline-opacity-0 object-fit-sacle">
                <button type="button" className="btn btn-outline-secondary d-flex align-self-center flex-nowrap">Más libros de #este género </button>
              </Link>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}