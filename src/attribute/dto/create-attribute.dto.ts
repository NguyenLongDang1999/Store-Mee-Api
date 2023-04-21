import { ApiProperty } from '@nestjs/swagger'
import {
    IsNotEmpty,
    IsString,
    MaxLength,
    MinLength,
    IsOptional
} from 'class-validator'

export class CreateAttributeDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    @MaxLength(30)
    @ApiProperty()
        name: string

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
        slug: string

    @IsOptional()
    @ApiProperty({ required: false })
        category_id?: string
    
    @IsOptional()
    @MaxLength(160)
    @ApiProperty({ required: false })
        description?: string
}
