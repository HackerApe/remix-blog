import { Link, redirect } from "remix"

export const action = async ({ request }) => {
  const form = await request.formData()
  const title = form.get("title")
  const body = form.get("body")

  const fields = { title, body }
  // @todo - submit to database

  // return redirect("/posts")
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
