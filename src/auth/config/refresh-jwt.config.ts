
import { registerAs } from "@nestjs/config";
import { JwtSignOptions } from "@nestjs/jwt";
import type { StringValue } from "ms";

export default registerAs(
    "refresh-jwt", 
    (): JwtSignOptions=>{

        // console.log(process.env.JWT_EXPIRES_IN)
        return ({
            secret: process.env.REFRESH_JWT_SECRET,
            expiresIn: process.env.REFRESH_JWT_EXPIRES_IN as StringValue,
        })
    } 
    );