// ** NestJS Imports
import { Injectable } from '@nestjs/common'

// ** DTO Imports
import { CreateAttributeDto } from './dto/create-attribute.dto'
import { UpdateAttributeDto } from './dto/update-attribute.dto'

// ** Attribute Imports
import { AttributeSearch } from './attribute.interface'

// ** Prisma Imports
import { Prisma } from '@prisma/client'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class AttributeService {
    constructor(private prisma: PrismaService) {}

    async create(createAttributeDto: CreateAttributeDto) {
        const { Variations, ...attributeData } = createAttributeDto

        const attribute = await this.prisma.attributes.create({ data: attributeData })
        const variantsData = []
        
        createAttributeDto.Variations.forEach(item => {
            variantsData.push({
                attribute_id: attribute.id,
                name: item.name
            })
        })

        await this.prisma.variations.createMany({
            data: variantsData
        })

        return attribute
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
                Variations: {
                    select: {
                        name: true
                    }
                },
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
                description: true,
                Variations: {
                    select: {
                        id: true,
                        name: true
                    }
                }
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
