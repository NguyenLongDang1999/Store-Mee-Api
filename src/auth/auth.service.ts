// ** NestJS Imports
import { JwtService } from '@nestjs/jwt'
import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

// ** DTO Imports
import { CreateAuthDto } from './dto/create-auth.dto'
import { CreateAdminDto } from 'src/admin/dto/create-admin.dto'

// ** Argon2 Imports
import * as argon2 from 'argon2'

// ** Service Imports
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private configService: ConfigService,
        private prisma: PrismaService
    ) {}

    async signUp(createAdminDto: CreateAdminDto): Promise<any> {
        const userExists = await this.prisma.admins.findFirst({
            where: { email:  createAdminDto.email },
            select: { id: true }            
        })

        if (userExists) throw new BadRequestException('User already exists')
    
        // Hash password
        const hash = await this.hashData(createAdminDto.password)
        return await this.prisma.admins.create({
            data: {
                ...createAdminDto,
                password: hash
            }
        })
    }

    async signIn(data: CreateAuthDto) {
        const user = await this.prisma.admins.findFirst({
            where: {
                email: data.email,
                deleted_flg: false
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                password: true,
                image_uri: true
            }
        })

        if (!user) throw new BadRequestException('User does not exist')

        const passwordMatches = await argon2.verify(user.password, data.password)

        if (!passwordMatches) throw new BadRequestException('Password is incorrect')

        const tokens = await this.getTokens(user.id, user.email)
        await this.updateRefreshToken(user.id, tokens.refreshToken)

        const userOutData = Object.fromEntries(
            Object.entries(user)
                .filter(
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    ([key, _]) => !(key === 'password'),
                ),
        )

        return {
            ...tokens,
            admins: userOutData
        }
    }
    
    async logout(userId: string) {
        return await this.prisma.admins.update({
            where: { id: userId },
            data: { refresh_token: null }
        })
    }
    
    hashData(data: string) {
        return argon2.hash(data)
    }
    
    async updateRefreshToken(userId: string, refreshToken: string) {
        const hashedRefreshToken = await this.hashData(refreshToken)

        await this.prisma.admins.update({
            where: { id: userId },
            data: { refresh_token: hashedRefreshToken }
        })
    }
    
    async getTokens(userId: string, email: string) {
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync({
                sub: userId,
                email
            }, {
                secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
                expiresIn: '15m'
            }),
            this.jwtService.signAsync({
                sub: userId,
                email
            }, {
                secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
                expiresIn: '7d'
            })
        ])
    
        return {
            accessToken,
            refreshToken
        }
    }

    async refreshTokens(id: string, refreshToken: string) {
        const user = await this.prisma.admins.findFirst({
            where: { id },
            select: {
                id: true,
                email: true,
                refresh_token: true
            }
        })

        if (!user || !user.refresh_token) throw new ForbiddenException('Access Denied')

        const refreshTokenMatches = await argon2.verify(
            user.refresh_token,
            refreshToken,
        )

        if (!refreshTokenMatches) throw new ForbiddenException('Access Denied')

        const tokens = await this.getTokens(user.id, user.email)
        await this.updateRefreshToken(user.id, tokens.refreshToken)
        return tokens
    }
}
