import { IsEmpty, IsInt, IsNotEmpty, IsString } from "class-validator";

export class CreateProductDto{
	@IsString()
	@IsEmpty()
	readonly name: string

	@IsInt()
	@IsNotEmpty()
	readonly price: string

}