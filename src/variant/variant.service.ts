// ** NestJS Imports
import { Injectable } from '@nestjs/common'

// ** DTO Imports
import { CreateVariantDto } from './dto/create-variant.dto'
import { UpdateVariantDto } from './dto/update-variant.dto'

// ** Variant Imports
import { VariantSearch } from './variant.interface'

// ** Prisma Imports
import { PrismaService } from '../prisma/prisma.service'

// ** Utils Imports
import { PAGE } from 'src/utils/enum'

@Injectable()
export class VariantService {
    constructor(private prisma: PrismaService) {}

    async create(createVariantDto: CreateVariantDto) {
        return await this.prisma.variations.create({ data: createVariantDto })
    }

    async findAll(query: VariantSearch) {
        const data = await this.prisma.variations.findMany({
            take: Number(query.pageSize) || PAGE.SIZE,
            skip: Number(query.pageIndex) || undefined,
            orderBy: { created_at: 'desc' },
            where: {
                deleted_flg: false,
                name: {
                    contains: query.name || undefined,
                    mode: 'insensitive'
                },
                attribute_id: {
                    equals: query.attribute_id || undefined
                }
            },
            select: {
                id: true,
                name: true,
                created_at: true,
                updated_at: true,
                Attribute: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        })

        const totalPage = await this.prisma.variations.aggregate({
            where: {
                deleted_flg: false,
                name: {
                    contains: query.name || undefined,
                    mode: 'insensitive'
                },
                attribute_id: {
                    equals: query.attribute_id || undefined
                }
            },
            _count: true
        })

        return { data, aggregations: totalPage._count }
    }

    async fetchList(id?: string) {
        return await this.prisma.variations.findMany({
            orderBy: { created_at: 'desc' },
            where: {
                deleted_flg: false,
                attribute_id: id
            },
            select: {
                id: true,
                name: true
            }
        })
    }

    async findOne(id: string) {
        return await this.prisma.variations.findUnique({ 
            where: { id },
            select: {
                id: true,
                name: true,
                attribute_id: true
            }
        })
    }

    async update(id: string, updateVariantDto: UpdateVariantDto) {
        return await this.prisma.variations.update({
            where: { id },
            data: updateVariantDto
        })
    }

    async remove(id: string) {
        return await this.prisma.variations.update({
            where: { id },
            data: { deleted_flg: true }
        })
    }
}
