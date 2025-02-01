import { Document, model, Schema } from 'mongoose'

import { PaymentProvider } from '@/enums/payment-provider.enum'
import { IOrder } from '@/interfaces/order.interfaces'

const orderSchema = new Schema(
	{
		user: {
			_id: false,
			type: {
				fullName: {
					type: String,
					required: true,
				},
				phone: {
					type: String,
					required: true,
				},
			},
			required: true,
		},
		products: {
			_id: false,
			type: [
				{
					productId: {
						type: Schema.Types.ObjectId,
						ref: 'product',
						required: true,
					},
					count: {
						type: Number,
						default: 1,
					},
				},
			],
			required: true,
		},
		paymentProvider: {
			type: String,
			enum: Object.values(PaymentProvider),
			default: PaymentProvider.Payze,
		},
		paidPrice: {
			type: Number,
			required: true,
		},
		performetedAt: {
			type: Date,
		},
		canceledAt: {
			type: Date,
		},
	},
	{
		timestamps: true,
	}
)

export default model<IOrder & Document>('product', orderSchema)
