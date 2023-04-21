// ** NestJS Imports
import { Module } from '@nestjs/common'

// ** Product Imports
import { ProductService } from './product.service'
import { ProductController } from './product.controller'

// ** Prisma Imports
import { PrismaModule } from './../prisma/prisma.module'

@Module({
    imports: [PrismaModule],
    controllers: [ProductController],
    providers: [ProductService]
})

export class ProductModule {}
