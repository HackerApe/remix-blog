import { useActionData, json, redirect } from "remix"
import { db } from "~/utils/db.server"
import { login, createUserSession, signup } from "~/utils/session.server"

const badRequest = (data: object) => json(data, { status: 400 })
const validateUsername = (username: string) => {
  if (typeof username !== "string" || username.length < 3)
    return "Username must be at least 3 characters long"
}
const validatePassword = (password: string) => {
  if (typeof password !== "string" || password.length < 6)
    return "Password must be at least 3 characters long"
}

export async function action({ request }) {
  const form = await request.formData()

  const loginType = form.get("loginType")
  const username = form.get("username")
  const password = form.get("password")

  const fields = { loginType, username, password }
  const fieldErrors = {
    username: validateUsername(username),
    password: validatePassword(password)
  }

  if (Object.values(fieldErrors).some(Boolean))
    return badRequest({ fieldErrors, fields })

  switch (loginType) {
    case "login": {
      console.log("login type")

      // Find user
      const user = await login({ username, password })

      // Check user
      if (!user)
        return badRequest({
          fields,
          fieldErrors: { username: "Invalid credentials" }
        })

      // Create user session
      return createUserSession(user.id, "/posts")
    }

    case "signUp": {
      // Check if the user exists
      const userExists = await db.user.findFirst({ where: { username } })
      if (userExists)
        return badRequest({
          fields,
          fieldErrors: { username: `${username} already exists` }
        })

      // Create the user
      const user = await signup({ username, password })
      if (!user)
        return badRequest({
          fields,
          fieldErrors: { username: "Something went wrong..." }
        })

      // Create the user session
      return createUserSession(user.id, "/posts")
    }

    default: {
      return badRequest({ fields, formError: "Login type is not valid" })
    }
  }
}

export default function Login() {
  const actionData = useActionData()

  return (
    <div className='auth-container'>
      <div className='page-header'>
        <h1>Login</h1>
      </div>
      <div className='page-content'>
        <form method='POST'>
          <fieldset>
            <legend>Login or Sign up</legend>
            <label>
              <input
                type='radio'
                name='loginType'
                value='login'
                defaultChecked={
                  !actionData?.fields?.loginType ||
                  actionData?.fields?.loginType === "login"
                }
              />{" "}
              Login
            </label>
            <label>
              <input type='radio' name='loginType' value='signUp' /> Sign up
            </label>
          </fieldset>
          <div className='form-control'>
            <label htmlFor='username'>Username</label>
            <input
              type='text'
              name='username'
              id='username'
              autoComplete='new-password'
              defaultValue={actionData?.fields?.username}
            />
            <div className='error'>
              <p>
                {actionData?.fieldErrors?.username &&
                  actionData.fieldErrors.username}
              </p>
            </div>
          </div>
          <div className='form-control'>
            <label htmlFor='password'>Password</label>
            <input
              type='password'
              name='password'
              id='password'
              autoComplete='new-password'
              defaultValue={actionData?.fields?.password}
            />
            <div className='error'>
              <p>
                {actionData?.fieldErrors?.password &&
                  actionData.fieldErrors.password}
              </p>
            </div>
          </div>
          <button className='btn btn-block' type='submit'>
            Submit
          </button>
        </form>
      </div>
    </div>
  )
}
