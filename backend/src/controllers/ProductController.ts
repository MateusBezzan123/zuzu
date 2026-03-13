import { Request, Response, NextFunction } from 'express'
import { ProductService } from '../services/ProductService'
import { AppError } from '../utils/errors'

export class ProductController {
  private productService: ProductService

  constructor() {
    this.productService = new ProductService()
  }

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, description, price } = req.body
      const userId = req.userId

      if (!userId) {
        throw new AppError('Usuário não autenticado', 401)
      }

      const product = await this.productService.createProduct({
        name,
        description,
        price,
        userId
      })

      res.status(201).json(product)
    } catch (error) {
      next(error)
    }
  }

  findAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { search } = req.query
      const products = await this.productService.getAllProducts(search as string)
      res.json(products)
    } catch (error) {
      next(error)
    }
  }

  findOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
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
      const { id } = req.params
      const { name, description, price } = req.body
      const userId = req.userId

      if (!userId) {
        throw new AppError('Usuário não autenticado', 401)
      }

      const product = await this.productService.updateProduct(id, userId, {
        name,
        description,
        price
      })

      res.json(product)
    } catch (error) {
      next(error)
    }
  }

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
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