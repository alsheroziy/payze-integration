import { Types } from 'mongoose'

export interface IProduct {
	_id: Types.ObjectId
	name: string
	price: Number
	createdAt: Date
	updatedAt: Date
}
