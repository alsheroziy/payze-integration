import { Document, model, Schema } from 'mongoose'

import {
	IPayzeTransaction,
	PayzeTransactionStatus,
} from '@/interfaces/payze-transaction.interfaces'

const payzeTransactionSchema = new Schema(
	{
		transactionId: {
			type: String,
			required: true,
			unique: true,
		},
		orderId: {
			type: Schema.Types.ObjectId,
			ref: 'order',
			required: true,
		},
		amount: {
			type: Number,
			required: true,
		},
		currency: {
			type: String,
			required: true,
			default: 'USD',
		},
		status: {
			type: String,
			enum: Object.values(PayzeTransactionStatus),
			default: PayzeTransactionStatus.Pending,
		},
		paymentUrl: {
			type: String,
			required: true,
		},
		metadata: {
			type: Schema.Types.Mixed,
		},
	},
	{
		timestamps: true,
	}
)

export default model<IPayzeTransaction & Document>(
	'payze-transaction',
	payzeTransactionSchema
)
