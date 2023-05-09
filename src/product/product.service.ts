// ** NestJS Imports
import { Injectable } from '@nestjs/common'

// ** DTO Imports
import { CreateProductDto } from './dto/create-product.dto'
import { UpdateProductDto } from './dto/update-product.dto'

// ** Product Imports
import { ProductSearch } from './product.interface'

// ** Prisma Imports
import { Prisma } from '@prisma/client'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class ProductService {
    constructor(private prisma: PrismaService) {}

    async create(createProductDto: CreateProductDto) {
        return await this.prisma.product.create({
            data: createProductDto,
            select: { id: true }
        })
    }

    async findAll(query: ProductSearch) {
        const search: Prisma.ProductWhereInput = {
            deleted_flg: false,
            sku: {
                contains: query.sku || undefined,
                mode: 'insensitive'
            },
            name: {
                contains: query.name || undefined,
                mode: 'insensitive'
            },
            category_id: {
                equals: query.category_id || undefined
            },
            brand_id: {
                equals: query.brand_id || undefined
            },
            status: {
                equals: Number(query.status) || undefined
            },
            popular: {
                equals: Number(query.popular) || undefined
            },
            quantity: {
                equals: Number(query.quantity) || undefined
            },
            price: {
                equals: Number(query.price) || undefined
            },
            price_discount: {
                equals: Number(query.price_discount) || undefined
            },
            type_discount: {
                equals: Number(query.type_discount) || undefined
            }
        }

        const data = await this.prisma.product.findMany({
            take: Number(query.pageSize) || undefined,
            skip: Number(query.pageIndex) || undefined,
            orderBy: { created_at: 'desc' },
            where: search,
            select: {
                id: true,
                sku: true,
                name: true,
                image_uri: true,
                Category: {
                    select: {
                        id: true,
                        name: true,
                        image_uri: true
                    }
                },
                Brand: {
                    select: {
                        id: true,
                        name: true,
                        image_uri: true
                    }
                },
                price: true,
                type_discount: true,
                price_discount: true,
                quantity: true,
                status: true,
                popular: true,
                created_at: true
            }
        })

        const aggregations = await this.prisma.product.aggregate({
            where: search,
            _count: true
        })

        return { data, aggregations: aggregations._count }
    }

    async productExist(slug: string, id?: string) {
        const params = id ? { slug, id: { not: id } } : { slug }
        return await this.prisma.product.count({ where: params })
    }

    async findOne(id: string) {
        return await this.prisma.product.findFirst({ 
            where: { id },
            select: {
                id: true,
                name: true,
                slug: true,
                short: true,
                price: true,
                price_discount: true,
                type_discount: true,
                category_id: true,
                brand_id: true,
                quantity: true,
                image_uri: true,
                content: true,
                sku: true,
                status: true,
                popular: true,
                meta_title: true,
                meta_keyword: true,
                meta_description: true
            }
        })
    }

    async update(id: string, updateProductDto: UpdateProductDto) {
        return await this.prisma.product.update({
            where: { id },
            data: updateProductDto
        })
    }

    async remove(id: string) {
        return await this.prisma.product.update({
            where: { id },
            data: { deleted_flg: true }
        })
    }
}
