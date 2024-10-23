import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Org {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    createdAt: Date;

    @Column()
    updatedAt: Date;
}