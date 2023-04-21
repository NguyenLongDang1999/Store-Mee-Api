// ** NestJS Imports
import { Module } from '@nestjs/common'

// ** Category Imports
import { CategoryService } from './category.service'
import { CategoryController } from './category.controller'

// ** Prisma Imports
import { PrismaModule } from './../prisma/prisma.module'

@Module({
    imports: [PrismaModule],
    controllers: [CategoryController],
    providers: [CategoryService]
})

export class CategoryModule {}
