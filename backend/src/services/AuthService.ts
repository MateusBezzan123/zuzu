import { UserRepository } from '../repositories/UserRepository'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { AppError } from '../utils/errors'

interface RegisterDTO {
  username: string
  email: string
  password: string
}

interface LoginDTO {
  email: string
  password: string
}

interface AuthResponse {
  user: {
    id: string
    username: string
    email: string
  }
  token: string
}

export class AuthService {
  private userRepository: UserRepository

  constructor() {
    this.userRepository = new UserRepository()
  }

  async register(data: RegisterDTO): Promise<AuthResponse> {
    const { username, email, password } = data

    const existingUser = await this.userRepository.findByEmailOrUsername(email, username)
    if (existingUser) {
      throw new AppError('Usuário ou email já existe', 400)
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await this.userRepository.create({
      username,
      email,
      password: hashedPassword
    })

    const token = this.generateToken(user.id, user.email)

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      },
      token
    }
  }

  async login(data: LoginDTO): Promise<AuthResponse> {
    const { email, password } = data

    const user = await this.userRepository.findByEmail(email)
    if (!user) {
      throw new AppError('Credenciais inválidas', 401)
    }

    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      throw new AppError('Credenciais inválidas', 401)
    }


    const token = this.generateToken(user.id, user.email)

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      },
      token
    }
  }

  async getUserById(id: string) {
    const user = await this.userRepository.findById(id)
    if (!user) {
      throw new AppError('Usuário não encontrado', 404)
    }
    return user
  }

  private generateToken(id: string, email: string): string {
    return jwt.sign(
      { id, email },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1d' }
    )
  }
}