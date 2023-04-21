// ** NestJS Imports
import { Module } from '@nestjs/common'

// ** Attribute Imports
import { VariantService } from './variant.service'
import { VariantController } from './variant.controller'

// ** Prisma Imports
import { PrismaModule } from './../prisma/prisma.module'

@Module({
    imports: [PrismaModule],
    controllers: [VariantController],
    providers: [VariantService]
})

export class VariantModule {}
