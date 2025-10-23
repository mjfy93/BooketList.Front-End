
import { useLoaderData } from 'react-router'

export async function loader({ params }) {
  const response = await fetch('http://127.0.0.1:5000/users')
  const json = response.json()

  return json
}

export default function Users() {
  const users = useLoaderData()

  return (
    <>
      <h1>Users</h1>
      {users.map(e => (
        <>
          <span>
            <b>Username: </b>
            {e.username}
          </span>
          <br />
          <span>
            <b>Email: </b>
            {e.email}
          </span>
        </>
      ))}
    </>
  )
}
