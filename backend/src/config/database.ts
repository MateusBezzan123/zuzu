import { PrismaClient } from '@prisma/client'

class Database {
  private static instance: Database
  public prisma: PrismaClient

  private constructor() {
    this.prisma = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    })
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database()
    }
    return Database.instance
  }

  async connect(): Promise<void> {
    try {
      await this.prisma.$connect()
      console.log('📦 Banco de dados conectado com sucesso')
    } catch (error) {
      console.error('Erro ao conectar ao banco de dados:', error)
      process.exit(1)
    }
  }

  async disconnect(): Promise<void> {
    await this.prisma.$disconnect()
    console.log('📦 Conexão com banco de dados fechada')
  }
}

export default Database.getInstance()