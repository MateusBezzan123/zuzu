import { Router } from 'express'
import { ProductController } from '../controllers/ProductController'
import { authMiddleware } from '../middleware/auth'

const productRouter = Router()
const productController = new ProductController()

productRouter.get('/', productController.findAll)
productRouter.get('/:id', productController.findOne)

productRouter.post('/', authMiddleware, productController.create)
productRouter.get('/my/products', authMiddleware, productController.findMyProducts)
productRouter.put('/:id', authMiddleware, productController.update)
productRouter.delete('/:id', authMiddleware, productController.delete)

export { productRouter }