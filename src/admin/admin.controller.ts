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
import { CreateAdminDto } from './dto/create-admin.dto'
import { UpdateAdminDto } from './dto/update-admin.dto'

// ** Category Imports
import { AdminService } from './admin.service'
import { AdminSearch } from './admin.interface'

@UseGuards(AccessTokenGuard)
@Controller('admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) {}

    @Post()
    async create(
        @Res() res: Response,
        @Body() createAdminDto: CreateAdminDto
    ) {
        const adminExist = await this.adminService.adminExist(createAdminDto.email)
        if (adminExist) {
            throw new ConflictException('Admin is Exists. Please try again!')
        }

        const admin = await this.adminService.create(createAdminDto)
        if (admin) {
            return res.status(HttpStatus.CREATED).json({ message: 'Admins Created Successfully!' })
        }

        throw new BadRequestException('Bad Request. Please try again!')
    }

    @Get()
    async findAll(
        @Res() res: Response,
        @Query() params?: AdminSearch
    ) {
        const payload = {
            ...params,
            pageIndex: params.pageIndex * params.pageSize
        }

        const { data, aggregations } = await this.adminService.findAll(payload)
        return res.status(HttpStatus.OK).json({ data, aggregations })
    }

    @Get(':id')
    async findOne(
        @Res() res: Response,
        @Param('id') id: string
    ) {
        const findOne = await this.adminService.findOne(id)
        if (findOne) {
            return res.status(HttpStatus.OK).json(findOne)
        }

        throw new BadRequestException('Bad Request. Please try again!')
    }

    @Patch(':id')
    async update(
        @Res() res: Response,
        @Param('id') id: string,
        @Body() updateAdminDto: UpdateAdminDto
    ) {
        if (!id) throw new BadRequestException('ID is invalid. Please try again!')

        const find = await this.adminService.findOne(id)
        if (!find) throw new BadRequestException('Admins is invalid. Please try again!')

        const adminExist = await this.adminService.adminExist(updateAdminDto.email, id)
        if (adminExist) throw new ConflictException('Admins is Exists. Please try again!')

        const admin = await this.adminService.update(id, updateAdminDto)
        if (admin) {
            return res.status(HttpStatus.NO_CONTENT).json({ message: 'Admins Updated Successfully!' })
        }

        throw new BadRequestException('Bad Request. Please try again!')
    }

    @Patch('delete/:id')
    async remove(
        @Res() res: Response,
        @Param('id') id: string
    ) {
        const remove = await this.adminService.remove(id)
        if (remove) {
            return res.status(HttpStatus.NO_CONTENT).json({ message: 'Admins Remove Successfully!' })
        }

        throw new BadRequestException('Bad Request. Please try again!')
    }
}
