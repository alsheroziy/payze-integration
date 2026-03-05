import { IOrder } from '@/interfaces/order.interfaces'
import orderModel from '@/models/order.model'
import { Types } from 'mongoose'

class OrderRepo {
	public orderModel = orderModel

	public create = async (
		data: Partial<IOrder>
	): Promise<IOrder> => {
		return this.orderModel.create(data)
	}

	public getById = async (id: string): Promise<IOrder | null> => {
		return this.orderModel
			.findById(id)
			.populate('products.productId')
			.lean()
	}

	public updateById = async (
		id: string | Types.ObjectId,
		data: Partial<IOrder>
	): Promise<IOrder | null> => {
		return this.orderModel
			.findByIdAndUpdate(id, { $set: data }, { new: true })
			.lean()
	}
}

export default OrderRepo
