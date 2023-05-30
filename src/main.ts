// ** NestJS Imports
import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as cookieParser from 'cookie-parser'

// ** Swagger Imports
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'

// ** Module Imports
import { AppModule } from './app.module'

async function bootstrap() {
    // App
    const app = await NestFactory.create(AppModule)
    app.get(ConfigService)
    app.use(cookieParser())
    app.enableCors({
        origin: [process.env.CMS_URL, process.env.USER_URL],
        credentials: true
    })
    app.useGlobalPipes(new ValidationPipe())
    app.setGlobalPrefix('api/v1')

    // Swagger
    const config = new DocumentBuilder()
        .setTitle('StoreMee API')
        .setDescription('The StoreMee API')
        .setVersion('0.1')
        .build()

    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('docs', app, document)

    // Run Serve
    const PORT = process.env.PORT
    await app.listen(PORT, () =>  console.log(`🚀 Server ready at: http://localhost:${PORT}`))
}

bootstrap()
