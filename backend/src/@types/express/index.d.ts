import 'express'

declare module 'express' {
  export interface Request {
    userId?: string
    user?: {
      id?: string
      email?: string
      username?: string
    }
  }
}