import { ApiProperty } from '@nestjs/swagger'
import {
    IsNotEmpty,
    IsString,
    IsNumber,
    MaxLength,
    MinLength,
    IsOptional
} from 'class-validator'

export class CreateProductDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(10)
    @ApiProperty()
        sku: string

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
        slug: string

    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    @MaxLength(60)
    @ApiProperty()
        name: string

    @IsOptional()
    @MaxLength(160)
    @ApiProperty({ required: false })
        short?: string

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({ default: 0 })
        quantity: number
    
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
        category_id: string

    @IsOptional()
    @ApiProperty({ required: false })
        brand_id?: string

    @IsOptional()
    @ApiProperty({ required: false })
        content?: string

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({ default: 0 })
        price: number

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({ default: 0 })
        type_discount: number

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({ default: 0 })
        price_discount: number

    @IsOptional()
    @ApiProperty({ required: false })
        image_uri?: string

    @IsNumber()    
    @IsOptional()
    @ApiProperty({ required: false, default: 1 })
        status?: number = 1

    @IsNumber()
    @IsOptional()
    @ApiProperty({ required: false, default: 2 })
        popular?: number = 2

    @IsOptional()
    @MaxLength(60)
    @ApiProperty({ required: false })
        metaTitle?: string

    @IsOptional()
    @MaxLength(60)
    @ApiProperty({ required: false })
        metaKeyword?: string

    @IsOptional()
    @MaxLength(160)
    @ApiProperty({ required: false })
        metaDescription?: string
}