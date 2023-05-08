import { ApiProperty } from '@nestjs/swagger'
import {
    IsNotEmpty,
    IsString,
    MaxLength,
    IsOptional,
    ValidateNested
} from 'class-validator'

import { Type } from 'class-transformer'

class CreateVariantDto {
    @IsOptional()
    @ApiProperty({ required: false })
        attribute_id?: string

    @IsNotEmpty()
    @IsString()
    @MaxLength(30)
    @ApiProperty()
        name: string
}

export class CreateAttributeDto {
    @IsNotEmpty()
    @IsString()
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

    @IsNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => CreateVariantDto)
        Variations: CreateVariantDto[]
}
