import { ApiProperty } from '@nestjs/swagger'
import {
    IsNotEmpty,
    IsString,
    MaxLength,
    IsOptional
} from 'class-validator'

export class CreateAttributeDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(30)
    @ApiProperty()
        name: string

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
        category_id: string
    
    @IsOptional()
    @MaxLength(160)
    @ApiProperty({ required: false })
        description?: string
}
