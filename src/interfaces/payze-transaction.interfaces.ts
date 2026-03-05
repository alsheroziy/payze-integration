import { Types } from 'mongoose'

export enum PayzeTransactionStatus {
	Pending = 'PENDING',
	Completed = 'COMPLETED',
	Failed = 'FAILED',
	Refunded = 'REFUNDED',
}

export interface IPayzeTransaction {
	transactionId: string
	orderId: Types.ObjectId
	amount: number
	currency: string
	status: PayzeTransactionStatus
	paymentUrl: string
	metadata?: Record<string, unknown>
	createdAt: Date
	updatedAt: Date
}
