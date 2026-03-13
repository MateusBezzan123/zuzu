import { Request, Response, NextFunction } from 'express'
import { ProductService } from '../services/ProductService'
import { AppError } from '../utils/errors'

export class ProductController {
  private productService: ProductService

  constructor() {
    this.productService = new ProductService()
  }

 
  private extractStringFromQuery(param: unknown): string | undefined {
    if (typeof param === 'string') {
      return param
    }
    if (Array.isArray(param) && param.length > 0) {
      const firstItem = param[0]
      return typeof firstItem === 'string' ? firstItem : undefined
    }
    return undefined
  }

  private getRouteId(id: string | string[] | undefined): string {
    if (!id) {
      throw new AppError('ID não fornecido', 400)
    }
    if (Array.isArray(id)) {
      return id[0]
    }
    return id
  }

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, description, price } = req.body
      const userId = req.userId

      if (!userId) {
        throw new AppError('Usuário não autenticado', 401)
      }


      if (!name || !description || !price) {
        throw new AppError('Nome, descrição e preço são obrigatórios', 400)
      }

  
      const priceNumber = parseFloat(String(price))
      if (isNaN(priceNumber) || priceNumber <= 0) {
        throw new AppError('Preço deve ser um número maior que zero', 400)
      }

      const product = await this.productService.createProduct({
        name: String(name),
        description: String(description),
        price: priceNumber,
        userId
      })

      res.status(201).json(product)
    } catch (error) {
      next(error)
    }
  }

  findAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const searchTerm = this.extractStringFromQuery(req.query.search)
      const products = await this.productService.getAllProducts(searchTerm)
      res.json(products)
    } catch (error) {
      next(error)
    }
  }

  findOne = async (req: Request, res: Response, next: NextFunction) => {
    try {

      const id = this.getRouteId(req.params.id)
      
      const product = await this.productService.getProductById(id)
      res.json(product)
    } catch (error) {
      next(error)
    }
  }

  findMyProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId
      
      if (!userId) {
        throw new AppError('Usuário não autenticado', 401)
      }

      const products = await this.productService.getUserProducts(userId)
      res.json(products)
    } catch (error) {
      next(error)
    }
  }

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = this.getRouteId(req.params.id)
      const { name, description, price } = req.body
      const userId = req.userId

      if (!userId) {
        throw new AppError('Usuário não autenticado', 401)
      }

      const updateData: { name?: string; description?: string; price?: number } = {}
      
      if (name !== undefined && name !== null) {
        updateData.name = String(name)
      }
      
      if (description !== undefined && description !== null) {
        updateData.description = String(description)
      }
      
      if (price !== undefined && price !== null) {
        const priceNumber = parseFloat(String(price))
        if (isNaN(priceNumber) || priceNumber <= 0) {
          throw new AppError('Preço deve ser um número maior que zero', 400)
        }
        updateData.price = priceNumber
      }

      if (Object.keys(updateData).length === 0) {
        throw new AppError('Nenhum dado fornecido para atualização', 400)
      }

      const product = await this.productService.updateProduct(id, userId, updateData)
      res.json(product)
    } catch (error) {
      next(error)
    }
  }

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = this.getRouteId(req.params.id)
      const userId = req.userId

      if (!userId) {
        throw new AppError('Usuário não autenticado', 401)
      }

      await this.productService.deleteProduct(id, userId)
      res.status(204).send()
    } catch (error) {
      next(error)
    }
  }
}