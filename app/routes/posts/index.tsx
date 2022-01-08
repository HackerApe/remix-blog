import { useLoaderData, Link } from "remix"
import type { LoaderFunction } from "remix"
import { db } from "~/utils/db.server"
import { getUser } from "~/utils/session.server"

interface iPostData {
  id: any
  title: string
  body: string
  createdAt: Date
}

export const loader: LoaderFunction = async ({ request }) => {
  const data = {
    posts: await db.post.findMany({
      take: 20,
      select: { id: true, title: true, createdAt: true },
      orderBy: { createdAt: "desc" }
    }),
    user: await getUser(request)
  }
  return data
}

export default function PostList() {
  const { posts, user } = useLoaderData()

  return (
    <div>
      <div className='page-header'>
        <h1>Posts</h1>
        {user && (
          <Link to='/posts/new' className='btn'>
            New Post
          </Link>
        )}
      </div>

      <ul className='posts-list'>
        {posts.map((post: iPostData) => (
          <li key={post.id}>
            <Link to={post.id}>
              <h3>{post.title}</h3>
              {new Date(post.createdAt).toLocaleString()}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
