import { CreateProductDto } from "@/dtos/produc.dto";
import { IProduct } from "@/interfaces/product.interfaces";
import productModel from "@/models/product.model";

class ProductRepo {
	public productModel = productModel

	public create = async (data: CreateProductDto): Promise<IProduct> => {
		return this.productModel.create(data);
	}

	public getById = async(id: string): Promise<IProduct | null> => {
		return this.productModel.findById(id).lean();
	}
}

export default ProductRepo;