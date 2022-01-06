import { useLoaderData, Link } from "remix"

interface iPostData {
  id: any
  title: string
  body: string
}

export const loader = () => {
  const data = {
    posts: [
      { id: 1, title: "First post", body: "This is a test post" },
      { id: 2, title: "Second post", body: "This is a test post" },
      { id: 3, title: "Third post", body: "This is a test post" },
      { id: 4, title: "Fourth post", body: "This is a test post" }
    ]
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
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
