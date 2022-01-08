import { Link, useLoaderData } from "remix"
import type { LoaderFunction } from "remix"
import { getUser } from "~/utils/session.server"

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request)
  return { user }
}

const Home = () => {
  const { user } = useLoaderData()

  return (
    <div>
      <h1>Welcome to the Remix Blog application!</h1>
      {!user && (
        <>
          <p>Please login to create new posts</p>
          <Link to='/auth/login' className='btn'>
            Login
          </Link>
        </>
      )}
    </div>
  )
}

export default Home
