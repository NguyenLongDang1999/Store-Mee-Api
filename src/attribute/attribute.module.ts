// ** NestJS Imports
import { Module } from '@nestjs/common'

// ** Attribute Imports
import { AttributeService } from './attribute.service'
import { AttributeController } from './attribute.controller'

// ** Prisma Imports
import { PrismaModule } from './../prisma/prisma.module'

@Module({
    imports: [PrismaModule],
    controllers: [AttributeController],
    providers: [AttributeService]
})

export class AttributeModule {}
