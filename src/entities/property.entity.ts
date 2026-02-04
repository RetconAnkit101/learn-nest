import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { PropertyFeature } from "./propertyFeature.entity";
import { PropertyType } from "./propertyType.entity";
import { User } from "./user.entity";

@Entity()
export class Property{
    @PrimaryGeneratedColumn()
    id:number

    @Column()
    name:string

    @Column()
    description: string

    @Column({ default: 0 })
    price: number 

    
    @OneToOne(
        ()=> PropertyFeature,
        (PropertyFeature) => PropertyFeature.property,
        { cascade: true }
    )
    propertyFeature: PropertyFeature

    @ManyToOne(()=> User, (user=> user.properties))
    @JoinColumn({ name: 'ownerId'})
    user:User
    
    @ManyToMany(()=> User, (user)=> user.likedProperties)
    likedBy: User[]
    
    @ManyToOne(() => PropertyType)
    type: PropertyType
}