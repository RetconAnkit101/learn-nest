import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';

@Injectable()
export class UserService {
  constructor (@InjectRepository(User) private UserRepo: Repository<User>){}

  async updateHashedRefreshToken(userId:number, hashedRefreshToken:string){
    return await this.UserRepo.update(
      {id:userId},
      {hashedRefreshToken}
    )
  }

  async create(dto: CreateUserDto) {
    const user = await this.UserRepo.create(dto);  //we create first then save, because we have to hash the password. or else it saves the pwd directly
    return await this.UserRepo.save(user)
  }

  findAll() {
    return `This action returns all user`;
  }

  async findByEmail(email:string) {
    return await this.UserRepo.findOne({
      where: {
        email
      }
    });
  }

  async findOne(id: number) {
    return await this.UserRepo.findOne({
      where: {id},
      select: ['firstName','lastName','avatarUrl','hashedRefreshToken']
    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
};
