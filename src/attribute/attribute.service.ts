// ** NestJS Imports
import { Injectable } from '@nestjs/common'

// ** DTO Imports
import { CreateAttributeDto } from './dto/create-attribute.dto'
import { UpdateAttributeDto } from './dto/update-attribute.dto'

// ** Types Imports
import { queryID } from 'src/utils/interfaces'
import { AttributeSearch } from './attribute.interface'

// ** Prisma Imports
import { Prisma } from '@prisma/client'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class AttributeService {
    constructor(private prisma: PrismaService) { }

    async create(createAttributeDto: CreateAttributeDto) {
        return await this.prisma.attributes.create({ data: createAttributeDto })
    }

    async findAll(query: AttributeSearch) {
        const search: Prisma.AttributesWhereInput = {
            deleted_flg: false,
            name: {
                contains: query.name || undefined,
                mode: 'insensitive'
            },
            category_id: {
                equals: query.category_id || undefined
            }
        }

        const data = await this.prisma.attributes.findMany({
            take: Number(query.pageSize) || undefined,
            skip: Number(query.pageIndex) || undefined,
            orderBy: { created_at: 'desc' },
            where: search,
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

        const aggregations = await this.prisma.attributes.aggregate({
            where: search,
            _count: true
        })

        return { data, aggregations: aggregations._count }
    }

    async fetchList(params: queryID) {
        return await this.prisma.attributes.findMany({
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

    async attributeExist(name: string, category_id: string, id?: string) {
        return await this.prisma.attributes.count({
            where: {
                id: { not: id || undefined },
                name,
                category_id
            }
        })
    }

    async findOne(id: string) {
        return await this.prisma.attributes.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
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
