// ** NestJS Imports
import { Injectable } from '@nestjs/common'

// ** DTO Imports
import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'

// ** Types Imports
import { CategorySearch } from './category.interface'

// ** Utils Imports
import { POPULAR, STATUS } from 'src/utils/enum'

// ** Prisma Imports
import { Prisma } from '@prisma/client'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class CategoryService {
    constructor(private prisma: PrismaService) { }

    async create(createCategoryDto: CreateCategoryDto) {
        return await this.prisma.category.create({
            data: createCategoryDto,
            select: { id: true }
        })
    }

    async findAll(query: CategorySearch) {
        const search: Prisma.CategoryWhereInput = {
            deleted_flg: false,
            name: {
                contains: query.name || undefined,
                mode: 'insensitive'
            },
            parent_id: {
                equals: query.parent_id || undefined
            },
            status: {
                equals: Number(query.status) || undefined
            },
            popular: {
                equals: Number(query.popular) || undefined
            }
        }

        const data = await this.prisma.category.findMany({
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
                parentCategory: {
                    select: {
                        id: true,
                        name: true,
                        image_uri: true
                    }
                }
            }
        })

        const aggregations = await this.prisma.category.aggregate({
            where: search,
            _count: true
        })

        return { data, aggregations: aggregations._count }
    }

    async categoryExist(slug: string, id?: string) {
        return await this.prisma.category.count({
            where: {
                id: { not: id || undefined },
                slug
            }
        })
    }

    async fetchList() {
        return await this.prisma.category.findMany({
            orderBy: { created_at: 'desc' },
            where: {
                deleted_flg: false,
                parent_id: null
            },
            select: {
                id: true,
                name: true
            }
        })
    }

    async findOne(id: string) {
        return await this.prisma.category.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                slug: true,
                image_uri: true,
                parent_id: true,
                description: true,
                status: true,
                popular: true,
                meta_title: true,
                meta_keyword: true,
                meta_description: true
            }
        })
    }

    async update(id: string, updateCategoryDto: UpdateCategoryDto) {
        return await this.prisma.category.update({
            where: { id },
            data: updateCategoryDto
        })
    }

    async remove(id: string) {
        return await this.prisma.category.update({
            where: { id },
            data: { deleted_flg: true }
        })
    }

    // --------------------------------- USER ---------------------------------
    async userGetList() {
        return await this.prisma.category.findMany({
            orderBy: { created_at: 'desc' },
            where: {
                deleted_flg: false,
                parent_id: null,
                status: STATUS.ACTIVE,
                popular: POPULAR.ACTIVE
            },
            select: {
                id: true,
                slug: true,
                name: true,
                image_uri: true
            }
        })
    }

    async userGetDetail(slug: string) {
        return await this.prisma.category.findFirst({
            orderBy: { created_at: 'desc' },
            where: { 
                deleted_flg: false,
                status: STATUS.ACTIVE,
                slug
            },
            select: {
                id: true,
                name: true,
                image_uri: true,
                description: true,
                meta_title: true,
                meta_keyword: true,
                meta_description: true,
                Product: {
                    orderBy: { created_at: 'desc' },
                    select: {
                        id: true,
                        slug: true,
                        name: true,
                        image_uri: true
                    }
                }
            }
        })
    }
}
