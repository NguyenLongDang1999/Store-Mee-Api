import { PrismaModule } from './../prisma/prisma.module'
import { Module } from '@nestjs/common'
import { AdminService } from './admin.service'
import { AdminController } from './admin.controller'

@Module({
    imports: [PrismaModule],
    controllers: [AdminController],
    providers: [AdminService]
})

export class AdminModule {}
