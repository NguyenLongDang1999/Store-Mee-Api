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
import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'

// ** Category Imports
import { CategoryService } from './category.service'
import { CategorySearch } from './category.interface'

@UseGuards(AccessTokenGuard)
@Controller('category')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}

    @Post()
    async create(
        @Res() res: Response,
        @Body() createCategoryDto: CreateCategoryDto
    ) {
        const categoryExist = await this.categoryService.categoryExist(createCategoryDto.slug)
        if (categoryExist) {
            throw new ConflictException('Category is Exists. Please try again!')
        }

        const category = await this.categoryService.create(createCategoryDto)
        if (category) {
            return res.status(HttpStatus.CREATED).json(category.id)
        }

        throw new BadRequestException('Bad Request. Please try again!')
    }

    @Get('fetch-list')
    async fetchList(@Res() res: Response) {
        const fetchList = await this.categoryService.fetchList()
        if (fetchList) {
            return res.status(HttpStatus.OK).json(fetchList)
        }

        throw new BadRequestException('Bad Request. Please try again!')
    }

    @Get()
    async findAll(
        @Res() res: Response,
        @Query() params?: CategorySearch
    ) {
        const payload = {
            ...params,
            page: (params.page - 1) * params.pageSize
        }

        const { data, aggregations } = await this.categoryService.findAll(payload)
        return res.status(HttpStatus.OK).json({ data, aggregations })
    }

    @Get(':id')
    async findOne(
        @Res() res: Response,
        @Param('id') id: string
    ) {
        const findOne = await this.categoryService.findOne(id)
        if (findOne) {
            return res.status(HttpStatus.OK).json(findOne)
        }

        throw new BadRequestException('Bad Request. Please try again!')
    }

    @Patch(':id')
    async update(
        @Res() res: Response,
        @Param('id') id: string,
        @Body() updateCategoryDto: UpdateCategoryDto
    ) {
        if (!id) throw new BadRequestException('ID is invalid. Please try again!')

        const find = await this.categoryService.findOne(id)
        if (!find) throw new BadRequestException('Category is invalid. Please try again!')

        const categoryExist = await this.categoryService.categoryExist(updateCategoryDto.slug, id)
        if (categoryExist) throw new ConflictException('Category is Exists. Please try again!')

        const category = await this.categoryService.update(id, updateCategoryDto)
        if (category) {
            return res.status(HttpStatus.NO_CONTENT).json(id)
        }

        throw new BadRequestException('Bad Request. Please try again!')
    }

    @Patch('delete/:id')
    async remove(
        @Res() res: Response,
        @Param('id') id: string
    ) {
        const remove = await this.categoryService.remove(id)
        if (remove) {
            return res.status(HttpStatus.NO_CONTENT).json({ message: 'Category Remove Successfully!' })
        }

        throw new BadRequestException('Bad Request. Please try again!')
    }
}