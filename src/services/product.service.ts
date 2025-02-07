import { CreateProductDto } from "@/dtos/produc.dto";
import { IProduct } from "@/interfaces/product.interfaces";
import ProductRepo from "@/repositories/product.repo";

class ProductService {
	public productRepo = new ProductRepo();

	public create = async(data: CreateProductDto): Promise<IProduct> => {
		return this.productRepo.create(data);
	}
}

export default ProductService;