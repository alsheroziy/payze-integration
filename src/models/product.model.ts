import { Document, model, Schema } from 'mongoose'

import { IProduct } from '@/interfaces/product.interfaces'

const productSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
			unique: true,
		},
		price: {
			type: Number,
			required: true,
		},
	},
	{
		timestamps: true,
	}
)

export default model<IProduct & Document>('product', productSchema)
