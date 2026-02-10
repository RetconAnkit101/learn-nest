import * as config from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import jwtConfig from "../config/jwt.config";
import { AuthJwtpayload } from "../types/auth-jwtPayload";
import { Inject, Injectable } from "@nestjs/common";
import refreshJwtConfig from "../config/refresh-jwt.config";
import { Request } from "express";
import { AuthService } from "../auth.service";

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(Strategy, 'refresh-jwt') {
    constructor(
        @Inject(refreshJwtConfig.KEY)
        private refreshJwtConfiguration: config.ConfigType<typeof refreshJwtConfig>,
        private authService: AuthService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromBodyField('refresh'),
            secretOrKey: refreshJwtConfiguration.secret as string, // Ensure this is a string as required
            ignoreExpiration: false,
            passReqToCallback: true
        });
    }

    validate(req: Request, payload: AuthJwtpayload) {
        const authHeader = req.get("authorization");
        if (!authHeader) {
            throw new Error("No authorization header found");  //dont know ts complains and adds this in my setup only
        }
        const refreshToken = authHeader.replace("Bearer", "").trim();
        const userId = payload.sub;
        return this.authService.validateRefreshToken(userId, refreshToken);
    }
}