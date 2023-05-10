import { ApiProperty } from '@nestjs/swagger'
import {
    IsNotEmpty,
    IsString,
    IsNumber,
    MaxLength,
    IsOptional
} from 'class-validator'

export class CreateBrandDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(30)
    @ApiProperty()
        name: string

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
        slug: string

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
        category_id: string
    
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
}
