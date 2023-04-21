// ** Guards Imports
import { RefreshTokenGuard } from './../common/guards/refreshToken.guard'
import { AccessTokenGuard } from './../common/guards/accessToken.guard'

// ** NestJS Imports
import { Controller, Get, Post, Body, Req, Res, UseGuards, HttpStatus } from '@nestjs/common'

// ** Auth Imports
import { AuthService } from './auth.service'

// ** DTO Imports
import { CreateAuthDto } from './dto/create-auth.dto'
import { CreateAdminDto } from 'src/admin/dto/create-admin.dto'

// ** ExpressJS Imports
import { Request, Response } from 'express'

// ** Utils Imports
import { AuthResponse } from './auth.interface'
import { AUTH } from 'src/utils/enum'

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('sign-up')
    signUp(@Body() createAdminDto: CreateAdminDto) {
        return this.authService.signUp(createAdminDto)
    }

    @Post('sign-in')
    async signIn(
        @Res() res: Response,
        @Body() data: CreateAuthDto
    ) {
        const response: AuthResponse = await this.authService.signIn(data)

        res.cookie('ELRT', response.refreshToken, {
            httpOnly: process.env.ENV == 'production' ? true : false,
            sameSite: process.env.ENV == 'production' ? true : false,
            secure: process.env.ENV == 'production' ? true : false,
            maxAge: AUTH._7_DAYS
        })

        return res.status(HttpStatus.OK).json({
            accessToken: response.accessToken,
            admins: response.admins
        })
    }

    @UseGuards(AccessTokenGuard)
    @Get('logout')
    logout(
        @Res() res: Response,
        @Req() req: Request
    ) {
        res.clearCookie('ELRT', {
            sameSite: process.env.ENV == 'production' ? true : false,
            secure: process.env.ENV == 'production' ? true : false
        }).send()
        
        return this.authService.logout(req.user['sub'])
    }

    @UseGuards(RefreshTokenGuard)
    @Get('refresh')
    async refreshTokens(
        @Res() res: Response,
        @Req() req: Request
    ) {
        const userId = req.user['sub']
        const refreshToken = req.cookies['ELRT']

        const response: AuthResponse = await this.authService.refreshTokens(userId, refreshToken)

        res.cookie('ELRT', response.refreshToken, {
            httpOnly: process.env.ENV == 'production' ? true : false,
            sameSite: process.env.ENV == 'production' ? true : false,
            secure: process.env.ENV == 'production' ? true : false,
            maxAge: AUTH._7_DAYS
        })

        return res.status(HttpStatus.OK).json({ accessToken: response.accessToken })
    }
}
