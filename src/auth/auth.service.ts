import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { UserService } from 'src/user/user.service';
import { AuthJwtpayload } from './types/auth-jwtPayload';
import refreshJwtConfig from './config/refresh-jwt.config';
import * as config from '@nestjs/config';
import * as argon2 from 'argon2';  //we ahve installed argon2 to hash the refreshToken - supposedly better than bcrypt for large hashcodes

@Injectable()
export class AuthService {
    
    constructor(
        private userService: UserService, 
        private jwtService: JwtService,
        @Inject(refreshJwtConfig.KEY) private refreshTokenConfig: config.ConfigType<typeof refreshJwtConfig> 
     ){}

    async validateUser(email: string, password:string){
        const user = await this.userService.findByEmail(email);
        if(!user) throw new UnauthorizedException("User not found");
        const isPasswordMatch = await compare(password, user.password);
        if( !isPasswordMatch ) throw new UnauthorizedException('Invalid Credentials');

        return { id: user.id };
    };

    async login(userId: number) {
        // const payload:AuthJwtpayload =  { sub: userId };
        // const token =  this.jwtService.sign(payload);
        // const refreshToken = this.jwtService.sign(payload, this.refreshTokenConfig);

        const { accessToken, refreshToken } = await this.generateTokens(userId);
        const hashedRefreshToken = await argon2.hash(refreshToken);
        await this.userService.updateHashedRefreshToken(userId, hashedRefreshToken)
        return {
            id: userId,
            accessToken,
            refreshToken
        };
    }

    async generateTokens(userId:number){
        const payload: AuthJwtpayload = {sub: userId};
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload),
            this.jwtService.signAsync(payload, this.refreshTokenConfig)
        ])
        return {
            accessToken,
            refreshToken
        }
    };

    async refreshToken(userId: number) {
        const { accessToken, refreshToken } = await this.generateTokens(userId);
        const hashedRefreshToken = await argon2.hash(refreshToken);
        await this.userService.updateHashedRefreshToken(userId, hashedRefreshToken);
        return {
            id: userId,
            accessToken,
            refreshToken
        }
    }; 

    async validateRefreshToken(userId: number, refreshToken: string){
        const user = await this.userService.findOne(userId);
        if(!user || !user.hashedRefreshToken)
            throw new UnauthorizedException("Invalid refresh token");

        const refreshTokenMatches = await argon2.verify(user.hashedRefreshToken, refreshToken);
        if(!refreshTokenMatches) throw new UnauthorizedException('Invalid refresh token');

        return {id: userId};
    }

    async signOut(userId: number){
        await this.userService.updateHashedRefreshToken(userId, '')  //this was set as null but due to ts complaining had to set ''.
    }
};
