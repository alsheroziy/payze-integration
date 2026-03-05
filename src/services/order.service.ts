import { ErrorCode } from '@/enums/error-ode.enum'
import { PaymentProvider } from '@/enums/payment-provider.enum'
import NoutFoundError from '@/errors/not-found.error'
import { IOrder } from '@/interfaces/order.interfaces'
import { PayzeTransactionStatus } from '@/interfaces/payze-transaction.interfaces'
import OrderRepo from '@/repositories/order.repo'
import PayzeTransactionRepo from '@/repositories/payze-transaction.repo'
import ProductRepo from '@/repositories/product.repo'
import { CreateOrderDto } from '@/dtos/order.dto'
import PayzeService from '@/services/payze.service'
import { Types } from 'mongoose'

class OrderService {
	private orderRepo = new OrderRepo()
	private productRepo = new ProductRepo()
	private payzeService = new PayzeService()
	private transactionRepo = new PayzeTransactionRepo()

	public create = async (
		dto: CreateOrderDto
	): Promise<{ order: IOrder; paymentUrl: string }> => {
		let totalPrice = 0

		for (const item of dto.products) {
			const product = await this.productRepo.getById(item.productId)
			if (!product) {
				throw new NoutFoundError(ErrorCode.ProductNotFound, {
					productId: item.productId,
				})
			}
			totalPrice += product.price * item.count
		}

		const order = await this.orderRepo.create({
			user: dto.user,
			products: dto.products.map((p) => ({
				productId: new Types.ObjectId(p.productId),
				count: p.count,
			})),
			paidPrice: totalPrice,
			paymentProvider: PaymentProvider.Payze,
		})

		const { paymentUrl } = await this.payzeService.initiatePayment(
			(order as IOrder & { _id: Types.ObjectId })._id,
			totalPrice,
			'USD',
			`Order from ${dto.user.fullName}`
		)

		return { order, paymentUrl }
	}

	public handleCallback = async (
		transactionId: string
	): Promise<IOrder | null> => {
		const transaction =
			await this.payzeService.confirmTransaction(transactionId)

		if (!transaction) {
			throw new NoutFoundError(ErrorCode.TransactionNotFound, {
				transactionId,
			})
		}

		if (transaction.status === PayzeTransactionStatus.Completed) {
			return this.orderRepo.updateById(transaction.orderId, {
				performetedAt: new Date(),
			})
		}

		return this.orderRepo.getById(transaction.orderId.toString())
	}

	public handleCallbackError = async (
		transactionId: string
	): Promise<IOrder | null> => {
		const transaction =
			await this.transactionRepo.getByTransactionId(transactionId)

		if (!transaction) {
			throw new NoutFoundError(ErrorCode.TransactionNotFound, {
				transactionId,
			})
		}

		await this.transactionRepo.updateStatus(
			transactionId,
			PayzeTransactionStatus.Failed
		)

		return this.orderRepo.updateById(transaction.orderId, {
			canceledAt: new Date(),
		})
	}

	public getById = async (id: string): Promise<IOrder> => {
		const order = await this.orderRepo.getById(id)
		if (!order) {
			throw new NoutFoundError(ErrorCode.OrderNotFound, { id })
		}
		return order
	}
}

export default OrderService
