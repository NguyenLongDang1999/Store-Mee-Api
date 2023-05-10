// ** NestJS Imports
import { Module } from '@nestjs/common'

// ** Service Imports
import { AttributeService } from './attribute.service'

// ** Controller Imports
import { AttributeController } from './attribute.controller'

// ** Prisma Imports
import { PrismaModule } from './../prisma/prisma.module'

@Module({
    imports: [PrismaModule],
    controllers: [AttributeController],
    providers: [AttributeService]
})

export class AttributeModule {}
