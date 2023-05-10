// ** NestJS Imports
import { ConfigModule } from '@nestjs/config'
import { Module } from '@nestjs/common'

// ** App Imports
import { AppController } from './app.controller'
import { AppService } from './app.service'

// ** Module Imports
import { PrismaModule } from './prisma/prisma.module'
import { CategoryModule } from './category/category.module'
import { AuthModule } from './auth/auth.module'
import { AdminModule } from './admin/admin.module'
import { BrandModule } from './brand/brand.module'
import { ProductModule } from './product/product.module'
import { AttributeModule } from './attribute/attribute.module'

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true
        }),
        PrismaModule,
        CategoryModule,
        AuthModule,
        AdminModule,
        BrandModule,
        ProductModule,
        AttributeModule
    ],
    controllers: [AppController],
    providers: [AppService]
})

export class AppModule {}
