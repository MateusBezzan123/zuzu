import { PrismaClient } from '@prisma/client'
import database from '../config/database'

export abstract class BaseRepository {
  protected prisma: PrismaClient

  constructor() {
    this.prisma = database
  }
}