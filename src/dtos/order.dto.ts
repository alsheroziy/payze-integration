import { Type } from 'class-transformer'
import {
	IsArray,
	IsInt,
	IsMongoId,
	IsNotEmpty,
	IsString,
	Min,
	ValidateNested,
} from 'class-validator'

export class OrderProductDto {
	@IsMongoId()
	@IsNotEmpty()
	readonly productId: string

	@IsInt()
	@Min(1)
	readonly count: number
}

export class OrderUserDto {
	@IsString()
	@IsNotEmpty()
	readonly fullName: string

	@IsString()
	@IsNotEmpty()
	readonly phone: string
}

export class CreateOrderDto {
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => OrderProductDto)
	readonly products: OrderProductDto[]

	@ValidateNested()
	@Type(() => OrderUserDto)
	readonly user: OrderUserDto
}
