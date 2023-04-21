import { ApiProperty } from '@nestjs/swagger'
import {
    IsNotEmpty,
    IsString,
    MaxLength
} from 'class-validator'

export class CreateVariantDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
        attribute_id: string

    @IsNotEmpty()
    @IsString()
    @MaxLength(30)
    @ApiProperty()
        name: string
}
