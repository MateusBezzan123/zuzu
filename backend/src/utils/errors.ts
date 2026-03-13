export class AppError extends Error {
  public readonly statusCode: number

  constructor(message: string, statusCode = 400) {
    super(message)
    this.statusCode = statusCode
    this.name = 'AppError'
  }
}

export const errorHandler = (error: any, req: any, res: any, next: any) => {
  console.error(error)

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      error: error.message
    })
  }

  return res.status(500).json({
    error: 'Erro interno do servidor'
  })
}