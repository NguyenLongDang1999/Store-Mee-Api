import { ApiProperty } from '@nestjs/swagger'
import {
    IsNotEmpty,
    IsOptional,
    IsString,
    MaxLength
} from 'class-validator'

export class CreateVariantDto {
    @IsOptional()
    @ApiProperty({ required: false })
        attribute_id?: string

    @IsNotEmpty()
    @IsString()
    @MaxLength(30)
    @ApiProperty()
        name: string
}
