import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('peliculas')
export class Pelicula {
    @PrimaryGeneratedColumn()
    id!: number;
    @Column()
    nombre!: string;
    @Column()
    descripcion!: string;
    @Column()
    anio!: number;
    @Column({ default: true })
    estado!: boolean;
}