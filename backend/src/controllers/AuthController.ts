import { Request, Response, NextFunction } from 'express'
import { AuthService } from '../services/AuthService'
import { validateEmail, validatePassword, validateUsername } from '../utils/validators'
import { AppError } from '../utils/errors'


declare module 'express-serve-static-core' {
  interface Request {
    userId?: string
    user?: {
      id?: string
      email?: string
      username?: string
    }
  }
}

export class AuthController {
  private authService: AuthService

  constructor() {
    this.authService = new AuthService()
  }

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username, email, password } = req.body

      // Validações
      if (!username || !email || !password) {
        throw new AppError('Todos os campos são obrigatórios', 400)
      }

      if (!validateUsername(username)) {
        throw new AppError('Username deve ter entre 3 e 30 caracteres', 400)
      }

      if (!validateEmail(email)) {
        throw new AppError('Email inválido', 400)
      }

      if (!validatePassword(password)) {
        throw new AppError('Senha deve ter no mínimo 6 caracteres', 400)
      }

      const result = await this.authService.register({ 
        username: String(username), 
        email: String(email), 
        password: String(password) 
      })
      
      res.status(201).json(result)
    } catch (error) {
      next(error)
    }
  }

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body

      if (!email || !password) {
        throw new AppError('Email e senha são obrigatórios', 400)
      }

      const result = await this.authService.login({ 
        email: String(email), 
        password: String(password) 
      })
      
      res.json(result)
    } catch (error) {
      next(error)
    }
  }

  me = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Verificar se o usuário está autenticado
      if (!req.user) {
        throw new AppError('Usuário não autenticado', 401)
      }

      res.json({ user: req.user })
    } catch (error) {
      next(error)
    }
  }
}