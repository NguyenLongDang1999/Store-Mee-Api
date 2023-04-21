// ** NestJS Imports
import { ApiProperty } from '@nestjs/swagger'

// ** Validate Imports
import {
    IsNotEmpty,
    IsString,
    IsNumber,
    MaxLength,
    IsOptional
} from 'class-validator'

export class CreateCategoryDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(60)
    @ApiProperty()
        name: string

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
        slug: string

    @IsOptional()
    @ApiProperty({ required: false })
        parent_id?: string
    
    @IsOptional()
    @MaxLength(160)
    @ApiProperty({ required: false })
        description?: string

    @IsOptional()
    @ApiProperty({ required: false })
        image_uri?: string

    @IsNumber()    
    @IsOptional()
    @ApiProperty({ required: false, default: 2 })
        status = 2

    @IsNumber()
    @IsOptional()
    @ApiProperty({ required: false, default: 2 })
        popular = 2

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
