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
import { CreateAttributeDto } from './dto/create-attribute.dto'
import { UpdateAttributeDto } from './dto/update-attribute.dto'

// ** Types Imports
import { AttributeSearch } from './attribute.interface'
import { queryID } from 'src/utils/interfaces'

// ** Service Imports
import { AttributeService } from './attribute.service'

@UseGuards(AccessTokenGuard)
@Controller('attribute')
export class AttributeController {
    constructor(private readonly attributeService: AttributeService) {}

    @Post()
    async create(
        @Res() res: Response,
        @Body() createAttributeDto: CreateAttributeDto
    ) {
        const attributeExist = await this.attributeService.attributeExist(createAttributeDto.name, createAttributeDto.category_id)
        if (attributeExist) {
            throw new ConflictException('Attribute is Exists. Please try again!')
        }

        const attribute = await this.attributeService.create(createAttributeDto)
        if (attribute) {
            return res.status(HttpStatus.CREATED).json(attribute.id)
        }

        throw new BadRequestException('Bad Request. Please try again!')
    }

    @Get()
    async findAll(
        @Res() res: Response,
        @Query() params?: AttributeSearch
    ) {
        const payload = {
            ...params,
            pageIndex: params.pageIndex * params.pageSize
        }

        const { data, aggregations } = await this.attributeService.findAll(payload)
        return res.status(HttpStatus.OK).json({ data, aggregations })
    }

    @Get('fetch-list')
    async fetchList(
        @Res() res: Response, 
        @Query() params?: queryID
    ) {
        const fetchList = await this.attributeService.fetchList(params)
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
        const findOne = await this.attributeService.findOne(id)
        if (findOne) {
            return res.status(HttpStatus.OK).json(findOne)
        }

        throw new BadRequestException('Bad Request. Please try again!')
    }

    @Patch(':id')
    async update(
        @Res() res: Response,
        @Param('id') id: string,
        @Body() updateAttributeDto: UpdateAttributeDto
    ) {
        if (!id) throw new BadRequestException('ID is invalid. Please try again!')

        const find = await this.attributeService.findOne(id)
        if (!find) throw new BadRequestException('Attribute is invalid. Please try again!')

        const attributeExist = await this.attributeService.attributeExist(updateAttributeDto.name, updateAttributeDto.category_id, id)
        if (attributeExist) throw new ConflictException('Attribute is Exists. Please try again!')

        const attribute = await this.attributeService.update(id, updateAttributeDto)
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
        const remove = await this.attributeService.remove(id)
        if (remove) {
            return res.status(HttpStatus.NO_CONTENT).json({ message: 'Attribute Remove Successfully!' })
        }

        throw new BadRequestException('Bad Request. Please try again!')
    }
}
