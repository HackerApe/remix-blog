import { useLoaderData, Link } from "remix"
import { db } from "~/utils/db.server"

interface iPostData {
  id: any
  title: string
  body: string
  createdAt: Date
}

export const loader = async () => {
  const data = {
    posts: await db.post.findMany({
      take: 20,
      select: { id: true, title: true, createdAt: true },
      orderBy: { createdAt: "desc" }
    })
  }
  return data
}

export default function PostList() {
  const { posts } = useLoaderData()

  return (
    <div>
      <div className='page-header'>
        <h1>Posts</h1>
        <Link to='/posts/new' className='btn'>
          New Post
        </Link>
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
