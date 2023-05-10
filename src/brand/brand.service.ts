// ** NestJS Imports
import { Injectable } from '@nestjs/common'

// ** DTO Imports
import { CreateBrandDto } from './dto/create-brand.dto'
import { UpdateBrandDto } from './dto/update-brand.dto'

// ** Types Imports
import { BrandSearch } from './brand.interface'
import { queryID } from 'src/utils/interfaces'

// ** Prisma Imports
import { Prisma } from '@prisma/client'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class BrandService {
    constructor(private prisma: PrismaService) {}

    async create(createBrandDto: CreateBrandDto) {
        return await this.prisma.brand.create({ data: createBrandDto })
    }

    async findAll(query: BrandSearch) {
        const search: Prisma.BrandWhereInput = {
            deleted_flg: false,
            name: {
                contains: query.name || undefined,
                mode: 'insensitive'
            },
            category_id: {
                equals: query.category_id || undefined
            },
            status: {
                equals: Number(query.status) || undefined
            },
            popular: {
                equals: Number(query.popular) || undefined
            }
        }

        const data = await this.prisma.brand.findMany({
            take: Number(query.pageSize) || undefined,
            skip: Number(query.page) || undefined,
            orderBy: { created_at: 'desc' },
            where: search,
            select: {
                id: true,
                name: true,
                status: true,
                popular: true,
                image_uri: true,
                created_at: true,
                updated_at: true,
                Category: {
                    select: {
                        id: true,
                        name: true,
                        image_uri: true
                    }
                }
            }
        })

        const aggregations = await this.prisma.brand.aggregate({
            where: search,
            _count: true
        })

        return { data, aggregations: aggregations._count }
    }

    async brandExist(slug: string, id?: string) {
        const params = id ? { slug, id: { not: id } } : { slug }
        return await this.prisma.brand.count({ where: params })
    }

    async fetchList(params: queryID) {
        return await this.prisma.brand.findMany({
            orderBy: { created_at: 'desc' },
            where: {
                deleted_flg: false,
                category_id: params.id || undefined
            },
            select: {
                id: true,
                name: true
            }
        })
    }

    async findOne(id: string) {
        return await this.prisma.brand.findUnique({ 
            where: { id },
            select: {
                id: true,
                name: true,
                slug: true,
                category_id: true,
                description: true,
                status: true,
                popular: true,
                image_uri: true
            }
        })
    }

    async update(id: string, updateBrandDto: UpdateBrandDto) {
        return await this.prisma.brand.update({
            where: { id },
            data: updateBrandDto
        })
    }

    async remove(id: string) {
        return await this.prisma.brand.update({
            where: { id },
            data: { deleted_flg: true }
        })
    }
}
