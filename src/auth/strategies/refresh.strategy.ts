import * as config from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import jwtConfig from "../config/jwt.config";
import { AuthJwtpayload } from "../types/auth-jwtPayload";
import { Inject, Injectable } from "@nestjs/common";
import refreshJwtConfig from "../config/refresh-jwt.config";

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(Strategy, 'refresh-jwt') {
    constructor(
        @Inject(refreshJwtConfig.KEY)
        private refreshJwtConfiguration: config.ConfigType<typeof refreshJwtConfig>,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromBodyField('refresh'),
            secretOrKey: refreshJwtConfiguration.secret as string, // Ensure this is a string as required
            ignoreExpiration: false
        });
    }

    async validate(payload: AuthJwtpayload) {
        return { id: payload.sub };
    }
}