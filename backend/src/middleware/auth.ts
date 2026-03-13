import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { AuthService } from '../services/AuthService'

interface JwtPayload {
  id: string
  email: string
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '')

    if (!token) {
      throw new Error()
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'secret'
    ) as JwtPayload

    const authService = new AuthService()
    const user = await authService.getUserById(decoded.id)

    req.userId = user.id
    req.user = user
    next()
  } catch (error) {
    res.status(401).json({ error: 'Por favor, autentique-se' })
  }
}