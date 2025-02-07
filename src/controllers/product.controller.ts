import { CreateProductDto } from "@/dtos/produc.dto";
import { StatusCode } from "@/enums/status-code.enum";
import { SuccessCode } from "@/enums/succes-code.enum";
import ProductService from "@/services/product.service";
import { validation } from "@/utils/validation.util";
import { NextFunction, Request, Response } from "express"

class productController {
	public productService = new ProductService();

	public create = async(req: Request, res: Response, next: NextFunction)=>{
		try {
			const createdData: CreateProductDto = req.body;

			await validation(CreateProductDto, createdData);
			
			const result = await this.productService.create(createdData);

			res.status(StatusCode.Created).json({ data: result, message: SuccessCode.ProductCreated });
		} catch (error) {
			next(error);
		}
	}
}

export default productController;