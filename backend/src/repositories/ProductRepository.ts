import { BaseRepository } from './BaseRepository'
import { Product, Prisma } from '@prisma/client'

export class ProductRepository extends BaseRepository {
  async create(data: Prisma.ProductCreateInput): Promise<Product> {
    return this.prisma.product.create({
      data,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true
          }
        }
      }
    })
  }

  async findAll(filters?: {
    search?: string
    userId?: string
  }): Promise<Product[]> {
    const where: Prisma.ProductWhereInput = {}

    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
        { price: { equals: parseFloat(filters.search) || undefined } }
      ]
    }

    if (filters?.userId) {
      where.userId = filters.userId
    }

    return this.prisma.product.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
  }

  async findById(id: string): Promise<Product | null> {
    return this.prisma.product.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true
          }
        }
      }
    })
  }

  async findByUser(userId: string): Promise<Product[]> {
    return this.prisma.product.findMany({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
  }

  async update(id: string, data: Prisma.ProductUpdateInput): Promise<Product> {
    return this.prisma.product.update({
      where: { id },
      data,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true
          }
        }
      }
    })
  }

  async delete(id: string): Promise<Product> {
    return this.prisma.product.delete({
      where: { id }
    })
  }

  async verifyOwnership(productId: string, userId: string): Promise<boolean> {
    const product = await this.prisma.product.findFirst({
      where: {
        id: productId,
        userId
      }
    })
    return !!product
  }
}