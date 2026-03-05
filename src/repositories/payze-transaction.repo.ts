import {
	IPayzeTransaction,
	PayzeTransactionStatus,
} from '@/interfaces/payze-transaction.interfaces'
import payzeTransactionModel from '@/models/payze-transaction'
import { Types } from 'mongoose'

class PayzeTransactionRepo {
	public transactionModel = payzeTransactionModel

	public create = async (
		data: Partial<IPayzeTransaction>
	): Promise<IPayzeTransaction> => {
		return this.transactionModel.create(data)
	}

	public getByTransactionId = async (
		transactionId: string
	): Promise<IPayzeTransaction | null> => {
		return this.transactionModel.findOne({ transactionId }).lean()
	}

	public updateStatus = async (
		transactionId: string,
		status: PayzeTransactionStatus,
		metadata?: Record<string, unknown>
	): Promise<IPayzeTransaction | null> => {
		return this.transactionModel
			.findOneAndUpdate(
				{ transactionId },
				{ $set: { status, ...(metadata && { metadata }) } },
				{ new: true }
			)
			.lean()
	}

	public getByOrderId = async (
		orderId: string | Types.ObjectId
	): Promise<IPayzeTransaction | null> => {
		return this.transactionModel.findOne({ orderId }).lean()
	}
}

export default PayzeTransactionRepo
