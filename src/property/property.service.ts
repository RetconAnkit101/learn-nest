import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { Repository } from 'typeorm';
import { Property } from 'src/entities/property.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDTO } from './dto/pagination.dto';
import { DEFAULT_PAGE_SIZE } from 'src/utils/constants';

@Injectable()
export class PropertyService {

  constructor(
   @InjectRepository(Property) private propertyRepo: Repository<Property>,
  ) {}
  
  async create(dto: CreatePropertyDto) {
   return await this.propertyRepo.save(dto)  //create() only creates - save() saves in db also 
  }

  async findAll(dto: PaginationDTO) {
    return await this.propertyRepo.find({
      skip: dto.skip,
      take: dto.limit ?? DEFAULT_PAGE_SIZE,
    });
  }

  async findOne(id: number) {
  const property = await this.propertyRepo.findOne({
      where: {
        id
      },
    });

    if(!property) throw new NotFoundException();
    return property;
  };

  async update(id: number, dto: UpdatePropertyDto) {
    return await this.propertyRepo.update({id}, dto)
  }

  async delete(id: number) {
    return await  this.propertyRepo.delete({
      id,
    });
  }
}
