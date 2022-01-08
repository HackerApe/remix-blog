import bcrypt from "bcrypt"
import { createCookieSessionStorage, redirect } from "remix"
import { db } from "./db.server"

interface IAuth {
  username: string
  password: string
}

// Login user
export const login = async ({ username, password }: IAuth) => {
  const user = await db.user.findUnique({ where: { username } })

  if (!user) return null

  // Check the password
  const isCorrectPassword = await bcrypt.compare(password, user.passwordHash)

  if (!isCorrectPassword) return null
  return user
}

// Sign up user
export const signup = async ({ username, password }: IAuth) => {
  const hashedPassword = await bcrypt.hash(password, 10)
  return db.user.create({ data: { username, hashedPassword } })
}

// Get session secret
const sessionSecret = process.env.SESSION_SECRET
if (!sessionSecret) throw new Error("No Session Secret...")

// Create session storage
const storage = createCookieSessionStorage({
  cookie: {
    name: "remix-blog_session",
    secure: process.env.NODE_ENV === "production",
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 60,
    httpOnly: true
  }
})

// Create session
export const createUserSession = async (userId: string, redirectTo: string) => {
  const session = await storage.getSession()

  session.set("userId", userId)

  return redirect(redirectTo, {
    headers: { "Set-Cookie": await storage.commitSession(session) }
  })
}

// Get user session
export const getUserSession = (request: Request) =>
  storage.getSession(request.headers.get("Cookie"))

// Get logged in user
export const getUser = async (request: Request) => {
  const session = await getUserSession(request)
  const userId = session.get("userId")

  if (!userId || typeof userId !== "string") return null
  try {
    const user = await db.user.findUnique({ where: { id: userId } })
    return user
  } catch (e) {
    return null
  }
}

// Logout user and destroy session
export const logout = async (request: Request) => {
  const session = await storage.getSession(request.headers.get("Cookie"))

  return redirect("/auth/logout", {
    headers: { "Set-Cookie": await storage.destroySession(session) }
  })
}
