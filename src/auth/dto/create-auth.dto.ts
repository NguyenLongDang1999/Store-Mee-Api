import { ApiProperty } from '@nestjs/swagger'
import {
    IsNotEmpty,
    IsString,
    MaxLength,
    MinLength
} from 'class-validator'

export class CreateAuthDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    @MaxLength(100)
    @ApiProperty()
        email: string

    @IsNotEmpty()
    @IsString()
    @MaxLength(100)
    @ApiProperty()
        password: string
}
