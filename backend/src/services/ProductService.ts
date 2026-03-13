import { ProductRepository } from '../repositories/ProductRepository'
import { AppError } from '../utils/errors'

interface CreateProductDTO {
  name: string
  description: string
  price: number
  userId: string
}

interface UpdateProductDTO {
  name?: string
  description?: string
  price?: number
}

export class ProductService {
  private productRepository: ProductRepository

  constructor() {
    this.productRepository = new ProductRepository()
  }

  async createProduct(data: CreateProductDTO) {
    const { name, description, price, userId } = data

    if (!name || !description || !price) {
      throw new AppError('Todos os campos são obrigatórios', 400)
    }

    if (price <= 0) {
      throw new AppError('O preço deve ser maior que zero', 400)
    }

    const product = await this.productRepository.create({
      name,
      description,
      price,
      user: {
        connect: { id: userId }
      }
    })

    return product
  }

  async getAllProducts(search?: string) {
    return this.productRepository.findAll({ search })
  }

  async getProductById(id: string) {
    const product = await this.productRepository.findById(id)
    if (!product) {
      throw new AppError('Produto não encontrado', 404)
    }
    return product
  }

  async getUserProducts(userId: string) {
    return this.productRepository.findByUser(userId)
  }

  async updateProduct(id: string, userId: string, data: UpdateProductDTO) {
    const isOwner = await this.productRepository.verifyOwnership(id, userId)
    if (!isOwner) {
      throw new AppError('Você não tem permissão para editar este produto', 403)
    }

    if (data.price && data.price <= 0) {
      throw new AppError('O preço deve ser maior que zero', 400)
    }

    const product = await this.productRepository.update(id, data)
    return product
  }

  async deleteProduct(id: string, userId: string) {
    const isOwner = await this.productRepository.verifyOwnership(id, userId)
    if (!isOwner) {
      throw new AppError('Você não tem permissão para excluir este produto', 403)
    }

    await this.productRepository.delete(id)
  }
}