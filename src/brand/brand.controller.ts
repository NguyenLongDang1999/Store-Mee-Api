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
import { CreateBrandDto } from './dto/create-brand.dto'
import { UpdateBrandDto } from './dto/update-brand.dto'

// ** Types Imports
import { BrandSearch } from './brand.interface'
import { queryID } from 'src/utils/interfaces'

// ** Service Imports
import { BrandService } from './brand.service'

@UseGuards(AccessTokenGuard)
@Controller('brand')
export class BrandController {
    constructor(private readonly brandService: BrandService) {}

    @Post()
    async create(
        @Res() res: Response,
        @Body() createBrandDto: CreateBrandDto
    ) {
        const brandExist = await this.brandService.brandExist(createBrandDto.slug)
        if (brandExist) {
            throw new ConflictException('Brand is Exists. Please try again!')
        }

        const brand = await this.brandService.create(createBrandDto)
        if (brand) {
            return res.status(HttpStatus.CREATED).json(brand.id)
        }

        throw new BadRequestException('Bad Request. Please try again!')
    }

    @Get()
    async findAll(
        @Res() res: Response,
        @Query() params?: BrandSearch
    ) {
        const payload = {
            ...params,
            page: (params.page - 1) * params.pageSize
        }

        const { data, aggregations } = await this.brandService.findAll(payload)
        return res.status(HttpStatus.OK).json({ data, aggregations })
    }

    @Get('fetch-list')
    async fetchList(
        @Res() res: Response,
        @Query() params?: queryID
    ) {
        const fetchList = await this.brandService.fetchList(params)
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
        const findOne = await this.brandService.findOne(id)
        if (findOne) {
            return res.status(HttpStatus.OK).json(findOne)
        }

        throw new BadRequestException('Bad Request. Please try again!')
    }

    @Patch(':id')
    async update(
        @Res() res: Response,
        @Param('id') id: string,
        @Body() updateBrandDto: UpdateBrandDto
    ) {
        if (!id) throw new BadRequestException('ID is invalid. Please try again!')

        const find = await this.brandService.findOne(id)
        if (!find) throw new BadRequestException('Brand is invalid. Please try again!')

        const brandExist = await this.brandService.brandExist(updateBrandDto.slug, id)
        if (brandExist) throw new ConflictException('Brand is Exists. Please try again!')

        const brand = await this.brandService.update(id, updateBrandDto)
        if (brand) {
            return res.status(HttpStatus.NO_CONTENT).json(id)
        }

        throw new BadRequestException('Bad Request. Please try again!')
    }

    @Patch('delete/:id')
    async remove(
        @Res() res: Response,
        @Param('id') id: string
    ) {
        const remove = await this.brandService.remove(id)
        if (remove) {
            return res.status(HttpStatus.NO_CONTENT).json({ message: 'Brand Remove Successfully!' })
        }

        throw new BadRequestException('Bad Request. Please try again!')
    }
}
