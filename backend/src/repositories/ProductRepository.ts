import { BaseRepository } from './BaseRepository'
import { Product, Prisma } from '@prisma/client'

interface FindAllFilters {
  search?: string
  userId?: string
}

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

  async findAll(filters?: FindAllFilters): Promise<Product[]> {
    const where: Prisma.ProductWhereInput = {}

    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' as Prisma.QueryMode } },
        { description: { contains: filters.search, mode: 'insensitive' as Prisma.QueryMode } }
      ]
      
      // Tentar converter search para número para buscar por preço
      const priceNumber = parseFloat(filters.search)
      if (!isNaN(priceNumber)) {
        where.OR = [
          ...(where.OR as any[]),
          { price: priceNumber }
        ]
      }
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

  async update(id: string, data: Prisma.ProductUpdateInput): Promise<Product | null> {
    try {
      return await this.prisma.product.update({
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
    } catch (error) {

      return null
    }
  }

  async delete(id: string): Promise<Product | null> {
    try {
      return await this.prisma.product.delete({
        where: { id }
      })
    } catch (error) {

      return null
    }
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