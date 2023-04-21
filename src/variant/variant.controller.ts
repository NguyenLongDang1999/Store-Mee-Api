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
    BadRequestException
} from '@nestjs/common'

// ** Express Imports
import { Response } from 'express'

// ** DTO Imports
import { CreateVariantDto } from './dto/create-variant.dto'
import { UpdateVariantDto } from './dto/update-variant.dto'

// ** Attribute Imports
import { VariantService } from './variant.service'
import { VariantSearch } from './variant.interface'

@UseGuards(AccessTokenGuard)
@Controller('variant')
export class VariantController {
    constructor(private readonly variantService: VariantService) {}

    @Post()
    async create(
        @Res() res: Response,
        @Body() createVariantDto: CreateVariantDto
    ) {
        const variant = await this.variantService.create(createVariantDto)
        if (variant) {
            return res.status(HttpStatus.CREATED).json(variant.id)
        }

        throw new BadRequestException('Bad Request. Please try again!')
    }

    @Get()
    async findAll(
        @Res() res: Response,
        @Query() params?: VariantSearch
    ) {
        const payload = {
            ...params,
            pageIndex: params.pageIndex * params.pageSize
        }

        const { data, aggregations } = await this.variantService.findAll(payload)
        return res.status(HttpStatus.OK).json({ data, aggregations })
    }

    @Get('fetch-list/:id')
    async fetchListWithCategory(
        @Res() res: Response,
        @Param('id') id: string
    ) {
        const fetchList = await this.variantService.fetchList(id)
        if (fetchList) {
            return res.status(HttpStatus.OK).json(fetchList)
        }

        throw new BadRequestException('Bad Request. Please try again!')
    }

    @Get(':id')
    async findOne(
        @Res() res: Response,
        @Param('id') id: string
    ) {
        const findOne = await this.variantService.findOne(id)
        if (findOne) {
            return res.status(HttpStatus.OK).json(findOne)
        }

        throw new BadRequestException('Bad Request. Please try again!')
    }

    @Patch(':id')
    async update(
        @Res() res: Response,
        @Param('id') id: string,
        @Body() updateVariantDto: UpdateVariantDto
    ) {
        if (!id) throw new BadRequestException('ID is invalid. Please try again!')

        const find = await this.variantService.findOne(id)
        if (!find) throw new BadRequestException('Variant is invalid. Please try again!')

        const attribute = await this.variantService.update(id, updateVariantDto)
        if (attribute) {
            return res.status(HttpStatus.NO_CONTENT).json(id)
        }

        throw new BadRequestException('Bad Request. Please try again!')
    }

    @Patch('delete/:id')
    async remove(
        @Res() res: Response,
        @Param('id') id: string
    ) {
        const remove = await this.variantService.remove(id)
        if (remove) {
            return res.status(HttpStatus.NO_CONTENT).json({ message: 'Variant Remove Successfully!' })
        }

        throw new BadRequestException('Bad Request. Please try again!')
    }
}
