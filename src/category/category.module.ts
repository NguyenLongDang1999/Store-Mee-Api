// ** NestJS Imports
import { Module } from '@nestjs/common'

// ** Service Imports
import { CategoryService } from './category.service'

// ** Controller Imports
import { CategoryController } from './category.controller'

// ** Prisma Imports
import { PrismaModule } from './../prisma/prisma.module'

@Module({
    imports: [PrismaModule],
    controllers: [CategoryController],
    providers: [CategoryService]
})

export class CategoryModule {}
