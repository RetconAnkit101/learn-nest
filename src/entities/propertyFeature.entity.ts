import { IsBoolean, IsInt } from "class-validator";
import { Property } from "./property.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class PropertyFeature{

    
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    @IsInt()
    bedrooms: number;

    @Column()
    @IsInt()
    bathrooms: number;

    @Column()
    @IsInt()
    parkingSpots: number;

    @Column()
    @IsInt()
    area: number;

    @Column()
    @IsBoolean()
    hasGardenyard: boolean;

    @Column()
    @IsBoolean()
    hasBalcony: boolean;

    @Column({ default: false })
    @IsBoolean()
    hasSwimmingPool: boolean;

    @OneToOne(() => Property, (property)=> property.propertyFeature)
    @JoinColumn()
    property: Property;
}