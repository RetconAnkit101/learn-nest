import { registerAs } from "@nestjs/config";
import { JwtModuleOptions } from "@nestjs/jwt";
import type { StringValue } from "ms";

export default registerAs(
    "jwt", 
    (): JwtModuleOptions=>{

        // console.log(process.env.JWT_EXPIRES_IN)
        return ({
            secret: process.env.JWT_SECRET,
            signOptions: {
                expiresIn: process.env.JWT_EXPIRES_IN as StringValue,
            },
        })
    } 
    );