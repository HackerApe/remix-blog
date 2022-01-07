import { PropsWithChildren } from "react"
import { Outlet, LiveReload, Link, Links, Meta, useLoaderData } from "remix"
import globalStylesUrl from "~/styles/global.css"
import { getUser } from "./utils/session.server"

interface AppProps {
  title: string
}

export const links = () => [{ rel: "stylesheet", href: globalStylesUrl }]
export const meta = () => {
  const description = "A simple blog built with REMIX"
  const keywords = "remix,react,javascript"

  return { description, keywords }
}

export const loader = async ({ request }): LoaderFunction => {
  const user = await getUser(request)
  const data = { user }
  return data
}

export default function App() {
  return (
    <Document>
      <Layout>
        <Outlet />
      </Layout>
    </Document>
  )
}

function Document({ children, title }: PropsWithChildren<AppProps>) {
  return (
    <html lang='en'>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width' />
        <Meta />
        <Links />
        <title>{title ? title : "Remix Blog"}</title>
      </head>
      <body>{children}</body>
      {process.env.NODE_ENV === "development" ? <LiveReload /> : null}
    </html>
  )
}

function Layout({ children }) {
  const { user } = useLoaderData()

  return (
    <>
      <nav className='navbar'>
        <Link to='/' className='logo'>
          Remix
        </Link>
        <ul>
          <li>
            <Link to='/posts'>Posts</Link>
          </li>

          {user ? (
            <li>
              <form action='/auth/logout' method='POST'>
                <button type='submit' className='btn'>
                  Logout {user.username}
                </button>
              </form>
            </li>
          ) : (
            <li>
              <Link to='/auth/login'>Login</Link>
            </li>
          )}
        </ul>
      </nav>

      <div className='container'>{children}</div>
    </>
  )
}

export function ErrorBoundary({ error }) {
  return (
    <Document>
      <Layout>
        <h1>Error</h1>
        <p>
          <i>{error.message}</i>
        </p>
      </Layout>
    </Document>
  )
}
