import { Link, redirect } from "remix"
import { db } from "~/utils/db.server"

export const action = async ({ request }) => {
  const form = await request.formData()

  const title = form.get("title")
  const body = form.get("body")

  const fields = { title, body }
  const post = await db.post.create({ data: fields })

  return redirect(`/posts/${post.id}`)
}

export default function NewPost() {
  return (
    <>
      <div className='page-header'>
        <h1>New post</h1>
        <Link to='/posts' className='btn btn-reverse'>
          Back
        </Link>
      </div>

      <div className='page-content'>
        <form method='POST'>
          <div className='form-control'>
            <label htmlFor='title'>Title</label>
            <input
              id='title'
              type='text'
              name='title'
              placeholder='Post Title'
            />
          </div>
          <div className='form-control'>
            <label htmlFor='title'>Title</label>
            <textarea id='body' name='body'></textarea>
          </div>
          <button className='btn btn-block' type='submit'>
            Add Post
          </button>
        </form>
      </div>
    </>
  )
}
