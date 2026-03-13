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

    // Validações básicas
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
    try {
      // Se search for undefined, passa undefined, se for string, passa a string
      const filters = search ? { search } : undefined
      return await this.productRepository.findAll(filters)
    } catch (error) {
      console.error('Erro ao buscar produtos:', error)
      throw new AppError('Erro ao buscar produtos', 500)
    }
  }

  async getProductById(id: string) {
    try {
      const product = await this.productRepository.findById(id)
      
      if (!product) {
        throw new AppError('Produto não encontrado', 404)
      }
      
      return product
    } catch (error) {
      if (error instanceof AppError) throw error
      console.error('Erro ao buscar produto:', error)
      throw new AppError('Erro ao buscar produto', 500)
    }
  }

  async getUserProducts(userId: string) {
    try {
      return await this.productRepository.findByUser(userId)
    } catch (error) {
      console.error('Erro ao buscar produtos do usuário:', error)
      throw new AppError('Erro ao buscar produtos', 500)
    }
  }

  async updateProduct(id: string, userId: string, data: UpdateProductDTO) {
    try {
      // Verificar propriedade
      const isOwner = await this.productRepository.verifyOwnership(id, userId)
      
      if (!isOwner) {
        throw new AppError('Você não tem permissão para editar este produto', 403)
      }

      // Validar preço se fornecido
      if (data.price !== undefined && data.price <= 0) {
        throw new AppError('O preço deve ser maior que zero', 400)
      }

      const product = await this.productRepository.update(id, data)
      
      if (!product) {
        throw new AppError('Produto não encontrado', 404)
      }
      
      return product
    } catch (error) {
      if (error instanceof AppError) throw error
      console.error('Erro ao atualizar produto:', error)
      throw new AppError('Erro ao atualizar produto', 500)
    }
  }

  async deleteProduct(id: string, userId: string) {
    try {
      // Verificar propriedade
      const isOwner = await this.productRepository.verifyOwnership(id, userId)
      
      if (!isOwner) {
        throw new AppError('Você não tem permissão para excluir este produto', 403)
      }

      await this.productRepository.delete(id)
    } catch (error) {
      if (error instanceof AppError) throw error
      console.error('Erro ao deletar produto:', error)
      throw new AppError('Erro ao deletar produto', 500)
    }
  }
}