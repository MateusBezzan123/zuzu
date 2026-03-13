declare namespace Express {
  export interface Request {
    userId?: string
    user?: {
      id: string
      email: string
      username: string
    }
  }
}