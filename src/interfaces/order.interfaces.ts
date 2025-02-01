import { PaymentProvider } from '@/enums/payment-provider.enum'
import { Types } from 'mongoose'

export interface IOrder {
	user: IOrderUser
	products: Array<IOrderProduct>
	paidPrice: number
	paymentProvider: PaymentProvider
	performetedAt?: Date
	canceledAt?: Date
	createdAt: Date
	updatedAt: Date
}

interface IOrderProduct {
	productId: Types.ObjectId
	count: number
}

interface IOrderUser {
	fullName: string
	phone: string
}
