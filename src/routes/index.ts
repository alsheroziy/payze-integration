import { Router } from 'express'
import productRoute from '@/routes/product.route'
import orderRoute from '@/routes/order.route'

const router = Router()

router.use('/products', productRoute)
router.use('/orders', orderRoute)

export default router