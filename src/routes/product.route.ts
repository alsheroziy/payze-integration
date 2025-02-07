import ProductController from '@/controllers/product.controller'
import { Router } from 'express'

const router = Router()
const productController = new ProductController()

router.post('/products', productController.create)

export default router