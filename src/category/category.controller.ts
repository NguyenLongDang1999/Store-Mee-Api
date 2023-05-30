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

// ** Types Imports
import { CategorySearch } from './category.interface'

// ** Service Imports
import { CategoryService } from './category.service'

@Controller('category')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}

    @Post()
    @UseGuards(AccessTokenGuard)
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
    @UseGuards(AccessTokenGuard)
    async fetchList(@Res() res: Response) {
        const fetchList = await this.categoryService.fetchList()
        if (fetchList) {
            return res.status(HttpStatus.OK).json(fetchList)
        }

        throw new BadRequestException('Bad Request. Please try again!')
    }

    @Get()
    @UseGuards(AccessTokenGuard)
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
    @UseGuards(AccessTokenGuard)
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
    @UseGuards(AccessTokenGuard)
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
    @UseGuards(AccessTokenGuard)
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

    // --------------------------------- USER ---------------------------------
    @Get('user/get-list')
    async userGetList(@Res() res: Response) {
        const fetchList = await this.categoryService.userGetList()
        if (fetchList) {
            return res.status(HttpStatus.OK).json(fetchList)
        }

        throw new BadRequestException('Bad Request. Please try again!')
    }

    // --------------------------------- USER ---------------------------------
    @Get('user/:slug')
    async userGetDetail(
        @Res() res: Response,
        @Param('slug') slug: string
    ) {
        const fetchDetail = await this.categoryService.userGetDetail(slug)
        if (fetchDetail) {
            return res.status(HttpStatus.OK).json(fetchDetail)
        }

        throw new BadRequestException('Bad Request. Please try again!')
    }
}
