import { ApiProperty } from '@nestjs/swagger'
import {
    IsNotEmpty,
    IsString,
    IsNumber,
    MaxLength,
    MinLength,
    IsOptional
} from 'class-validator'

export class CreateAdminDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    @MaxLength(50)
    @ApiProperty()
        name: string

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

    @IsNotEmpty()
    @IsString()
    @MaxLength(20)
    @ApiProperty()
        phone: string

    @IsOptional()
    @ApiProperty({ required: false })
        refresh_token?: string

    @IsNotEmpty()
    @IsNumber()    
    @ApiProperty()
        role: number

    @IsOptional()
    @ApiProperty({ required: false })
        image_uri?: string
}
