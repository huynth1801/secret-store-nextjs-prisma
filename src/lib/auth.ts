import { NextApiRequest, NextApiResponse } from "next"
import { sign, verify } from "jsonwebtoken"
import { hash, compare } from "bcrypt"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export const hashPassword = (password: string) => hash(password, 10)

export const comparePassword = (password: string, hashedPassword: string) =>
  compare(password, hashedPassword)

export const generateToken = (userId: string) =>
  sign({ userId }, JWT_SECRET, { expiresIn: "1h" })

export const verifyToken = (token: string) => {
  try {
    return verify(token, JWT_SECRET) as { userId: string }
  } catch (error) {
    console.error("Error when verifying token", error)
    return null
  }
}

export const authenticated =
  (
    handler: (
      req: NextApiRequest,
      res: NextApiResponse,
      userId: string
    ) => Promise<void>
  ) =>
  async (req: NextApiRequest, res: NextApiResponse) => {
    const token = req.headers.authorization?.split(" ")[1]
    if (!token)
      return res.status(401).json({ message: "Authentication required" })

    const decoded = verifyToken(token)
    if (!decoded) return res.status(401).json({ message: "Invalid token" })

    return handler(req, res, decoded.userId)
  }
