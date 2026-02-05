import { IsOptional, IsString, IsUrl } from "class-validator";

export class CreateUserDto {

    @IsString()
    firstName:string;

    @IsString()
    lastName:string;

    @IsString()
    email:string;

    @IsString()
    @IsUrl()
    @IsOptional()
    avatarUrl:string;
    
    @IsString()
    password:string;
}
