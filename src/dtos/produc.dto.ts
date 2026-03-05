import { IsInt, IsNotEmpty, IsString, Min } from "class-validator";

export class CreateProductDto {
	@IsString()
	@IsNotEmpty()
	readonly name: string

	@IsInt()
	@Min(0)
	@IsNotEmpty()
	readonly price: number
}