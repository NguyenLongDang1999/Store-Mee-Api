// ** NestJS Imports
import { Injectable, BadRequestException } from '@nestjs/common'

// ** DTO Imports
import { CreateAdminDto } from './dto/create-admin.dto'
import { UpdateAdminDto } from './dto/update-admin.dto'

// ** Admin Imports
import { AdminSearch } from './admin.interface'

// ** Argon2 Imports
import * as argon2 from 'argon2'

// ** Prisma Imports
import { PrismaService } from '../prisma/prisma.service'

// ** Utils Imports
import { PAGE } from 'src/utils/enum'

@Injectable()
export class AdminService {
    constructor(private prisma: PrismaService) {}

    async create(createAdminDto: CreateAdminDto): Promise<any> {
        const userExists = await this.prisma.admins.findFirst({
            where: { email:  createAdminDto.email },
            select: { id: true }            
        })

        if (userExists) throw new BadRequestException('User already exists')
    
        // Hash password
        const hash = await this.hashData(createAdminDto.password)
        return await this.prisma.admins.create({
            data: {
                ...createAdminDto,
                password: hash
            }
        })
    }

    hashData(data: string) {
        return argon2.hash(data)
    }

    async adminExist(email: string, id?: string) {
        const params = id ? { email, id: { not: id } } : { email }
        return await this.prisma.admins.count({ where: params })
    }
  
    async findAll(query: AdminSearch) {
        const params = await this.searchQuery(query)

        const data = await this.prisma.admins.findMany({
            take: Number(query.pageSize) || PAGE.SIZE,
            skip: Number(query.pageIndex) || undefined,
            orderBy: { created_at: 'desc' },
            where: params,
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                gender: true,
                role: true,
                image_uri: true,
                created_at: true
            }
        })

        const totalPage = await this.prisma.admins.aggregate({
            where: params,
            _count: true
        })

        const aggregations = Math.ceil(totalPage._count / query.pageSize) || 1
        return { data, aggregations }
    }

    async searchQuery(query: AdminSearch) {
        const params = {
            deleted_flg: false
        }
        
        if (query?.name) {
            params['name'] = {
                contains: query?.name,
                mode: 'insensitive'
            }
        }

        if (query?.email) {
            params['email'] = {
                contains: query?.email,
                mode: 'insensitive'
            }
        }

        if (query?.phone) {
            params['phone'] = {
                contains: query?.phone,
                mode: 'insensitive'
            }
        }

        if (query?.gender) {
            params['gender'] = {
                equals: Number(query?.gender)
            }
        }

        if (query?.role) {
            params['role'] = {
                equals: Number(query?.role)
            }
        }

        return params
    }

    async findOne(id: string) {
        return await this.prisma.admins.findUnique({ 
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                gender: true,
                role: true,
                image_uri: true
            }
        })
    }

    async update(id: string, updateAdminDto: UpdateAdminDto) {
        return await this.prisma.admins.update({
            where: { id },
            data: updateAdminDto
        })
    }

    async remove(id: string) {
        return await this.prisma.admins.update({
            where: { id },
            data: { deleted_flg: true }
        })
    }
}
