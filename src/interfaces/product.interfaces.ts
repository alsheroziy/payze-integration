import { Types } from 'mongoose'

export interface IProduct {
	_id: Types.ObjectId
	name: string
	price: number
	createdAt: Date
	updatedAt: Date
}
