// ** Guard Imports
import { AccessTokenGuard } from './../common/guards/accessToken.guard'

// ** NestJS Imports
import { 
    Controller,
    Get,
    Res,
    Post,
    Body,
    Patch,
    Param,
    Query,
    UseGuards,
    HttpStatus,
    ConflictException,
    BadRequestException
} from '@nestjs/common'

// ** Express Imports
import { Response } from 'express'

// ** DTO Imports
import { CreateProductDto } from './dto/create-product.dto'
import { UpdateProductDto } from './dto/update-product.dto'

// ** Product Imports
import { ProductService } from './product.service'
import { ProductSearch } from './product.interface'

@UseGuards(AccessTokenGuard)
@Controller('product')
export class ProductController {
    constructor(private readonly productService: ProductService) {}

    @Post()
    async create(
        @Res() res: Response,
        @Body() createProductDto: CreateProductDto
    ) {
        const productExist = await this.productService.productExist(createProductDto.slug)
        if (productExist) {
            throw new ConflictException('Product is Exists. Please try again!')
        }

        const product = await this.productService.create(createProductDto)
        if (product) {
            return res.status(HttpStatus.CREATED).json(product.id)
        }

        throw new BadRequestException('Bad Request. Please try again!')
    }

    @Get()
    async findAll(
        @Res() res: Response,
        @Query() params?: ProductSearch
    ) {
        const payload = {
            ...params,
            pageIndex: params.pageIndex * params.pageSize
        }

        const { data, aggregations } = await this.productService.findAll(payload)
        return res.status(HttpStatus.OK).json({ data, aggregations })
    }

    @Get(':id')
    async findOne(
        @Res() res: Response,
        @Param('id') id: string
    ) {
        const findOne = await this.productService.findOne(id)
        if (findOne) {
            return res.status(HttpStatus.OK).json(findOne)
        }

        throw new BadRequestException('Bad Request. Please try again!')
    }

    @Patch(':id')
    async update(
        @Res() res: Response,
        @Param('id') id: string,
        @Body() updateProductDto: UpdateProductDto
    ) {
        if (!id) throw new BadRequestException('ID is invalid. Please try again!')

        const find = await this.productService.findOne(id)
        if (!find) throw new BadRequestException('Product is invalid. Please try again!')

        const productExist = await this.productService.productExist(updateProductDto.slug, id)
        if (productExist) throw new ConflictException('Product is Exists. Please try again!')

        const product = await this.productService.update(id, updateProductDto)
        if (product) {
            return res.status(HttpStatus.NO_CONTENT).json(id)
        }

        throw new BadRequestException('Bad Request. Please try again!')
    }

    @Patch('delete/:id')
    async remove(
        @Res() res: Response,
        @Param('id') id: string
    ) {
        const remove = await this.productService.remove(id)
        if (remove) {
            return res.status(HttpStatus.NO_CONTENT).json({ message: 'Product Remove Successfully!' })
        }

        throw new BadRequestException('Bad Request. Please try again!')
    }
}
