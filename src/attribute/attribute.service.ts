// ** NestJS Imports
import { Injectable } from '@nestjs/common'

// ** DTO Imports
import { CreateAttributeDto } from './dto/create-attribute.dto'
import { UpdateAttributeDto } from './dto/update-attribute.dto'

// ** Attribute Imports
import { AttributeSearch } from './attribute.interface'

// ** Prisma Imports
import { PrismaService } from '../prisma/prisma.service'

// ** Utils Imports
import { PAGE } from 'src/utils/enum'

@Injectable()
export class AttributeService {
    constructor(private prisma: PrismaService) {}

    async create(createAttributeDto: CreateAttributeDto) {
        return await this.prisma.attributes.create({ data: createAttributeDto })
    }

    async findAll(query: AttributeSearch) {
        const data = await this.prisma.attributes.findMany({
            take: Number(query.pageSize) || PAGE.SIZE,
            skip: Number(query.pageIndex) || undefined,
            orderBy: { created_at: 'desc' },
            where: {
                deleted_flg: false,
                name: {
                    contains: query.name || undefined,
                    mode: 'insensitive'
                },
                category_id: {
                    equals: query.category_id || undefined
                }
            },
            select: {
                id: true,
                name: true,
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

        const totalPage = await this.prisma.attributes.aggregate({
            where: {
                deleted_flg: false,
                name: {
                    contains: query.name || undefined,
                    mode: 'insensitive'
                },
                category_id: {
                    equals: query.category_id || undefined
                }
            },
            _count: true
        })

        return { data, aggregations: totalPage._count }
    }

    async fetchList(id?: string) {
        return await this.prisma.attributes.findMany({
            orderBy: { created_at: 'desc' },
            where: {
                deleted_flg: false,
                category_id: id
            },
            select: {
                id: true,
                name: true
            }
        })
    }

    async attributeExist(slug: string, id?: string) {
        const params = id ? { slug, id: { not: id } } : { slug }
        return await this.prisma.attributes.count({ where: params })
    }

    async findOne(id: string) {
        return await this.prisma.attributes.findUnique({ 
            where: { id },
            select: {
                id: true,
                name: true,
                slug: true,
                category_id: true,
                description: true
            }
        })
    }

    async update(id: string, updateAttributeDto: UpdateAttributeDto) {
        return await this.prisma.attributes.update({
            where: { id },
            data: updateAttributeDto
        })
    }

    async remove(id: string) {
        return await this.prisma.attributes.update({
            where: { id },
            data: { deleted_flg: true }
        })
    }
}
