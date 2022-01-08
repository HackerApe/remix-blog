import { Link, redirect, useActionData, json } from "remix"
import type { ActionFunction } from "remix"
import { db } from "~/utils/db.server"
import { getUser } from "~/utils/session.server"

const badRequest = (data) => json(data, { status: 400 })

const validateTitle = (title: string) => {
  if (typeof title !== "string" || title.length < 3)
    return "Title should be at least 3 characters long"
}

const validateBody = (body: string) => {
  if (typeof body !== "string" || body.length < 10)
    return "Body should be at least 10 characters long"
}

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData()

  const title = form.get("title")
  const body = form.get("body")
  const user = await getUser(request)

  const fields = { title, body }
  const fieldErrors = { title: validateTitle(title), body: validateBody(body) }

  if (Object.values(fieldErrors).some(Boolean))
    return badRequest({ fields, fieldErrors })

  // Submitting to db
  const post = await db.post.create({ data: { ...fields, userId: user?.id } })

  return redirect(`/posts/${post.id}`)
}

const NewPost = () => {
  const actionData = useActionData()

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
              defaultValue={actionData?.fields?.title}
            />
            <div className='error'>
              <p>
                {actionData?.fieldErrors?.title && actionData.fieldErrors.title}
              </p>
            </div>
          </div>
          <div className='form-control'>
            <label htmlFor='title'>Body</label>
            <textarea
              id='body'
              name='body'
              defaultValue={actionData?.fields?.body}
            ></textarea>
            <div className='error'>
              <p>
                {actionData?.fieldErrors?.body && actionData.fieldErrors.body}
              </p>
            </div>
          </div>
          <button className='btn btn-block' type='submit'>
            Add Post
          </button>
        </form>
      </div>
    </>
  )
}

export default NewPost
