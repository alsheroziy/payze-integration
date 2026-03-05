import { CreateOrderDto } from '@/dtos/order.dto'
import { StatusCode } from '@/enums/status-code.enum'
import { SuccessCode } from '@/enums/succes-code.enum'
import OrderService from '@/services/order.service'
import { validation } from '@/utils/validation.util'
import { NextFunction, Request, Response } from 'express'

class OrderController {
	private orderService = new OrderService()

	public create = async (
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> => {
		try {
			const dto: CreateOrderDto = req.body

			await validation(CreateOrderDto, dto)

			const { order, paymentUrl } = await this.orderService.create(dto)

			res.status(StatusCode.Created).json({
				data: { order, paymentUrl },
				message: SuccessCode.OrderCreated,
			})
		} catch (error) {
			next(error)
		}
	}

	public paymentCallback = async (
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> => {
		try {
			const transactionId =
				(req.query.transactionId as string) ||
				(req.query.transaction_id as string)

			const order =
				await this.orderService.handleCallback(transactionId)

			res.status(StatusCode.ok).json({
				data: order,
				message: SuccessCode.PaymentCompleted,
			})
		} catch (error) {
			next(error)
		}
	}

	public paymentCallbackError = async (
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> => {
		try {
			const transactionId =
				(req.query.transactionId as string) ||
				(req.query.transaction_id as string)

			const order =
				await this.orderService.handleCallbackError(transactionId)

			res.status(StatusCode.ok).json({
				data: order,
				message: SuccessCode.PaymentCancelled,
			})
		} catch (error) {
			next(error)
		}
	}

	public getById = async (
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> => {
		try {
			const { id } = req.params
			const order = await this.orderService.getById(id)

			res.status(StatusCode.ok).json({
				data: order,
				message: SuccessCode.OrderFetched,
			})
		} catch (error) {
			next(error)
		}
	}
}

export default OrderController
