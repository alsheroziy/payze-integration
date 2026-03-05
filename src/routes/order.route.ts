import OrderController from '@/controllers/order.controller'
import { Router } from 'express'

const router = Router()
const orderController = new OrderController()

router.post('/', orderController.create)
router.get('/callback', orderController.paymentCallback)
router.get('/callback/error', orderController.paymentCallbackError)
router.get('/:id', orderController.getById)

export default router
