import ProductController from '@/controllers/product.controller'
import { Router } from 'express'

const router = Router()
const productController = new ProductController()

router.post('/', productController.create)

export default router