import { useActionData, json, redirect } from "remix"
import { db } from "~/utils/db.server"

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
}

export default function Login() {
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
              <input type='radio' name='loginType' value='login' /> Login
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
            />
            {/* @todo - add an error */}
            <div className='error'></div>
          </div>
          <div className='form-control'>
            <label htmlFor='password'>Password</label>
            <input
              type='password'
              name='password'
              id='password'
              autoComplete='new-password'
            />
            {/* @todo - add an error */}
            <div className='error'></div>
          </div>
          <button className='btn btn-block' type='submit'>
            Submit
          </button>
        </form>
      </div>
    </div>
  )
}
