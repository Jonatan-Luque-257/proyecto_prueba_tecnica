import { AppDataSource } from '../data-source';
import { Pelicula } from '../entity/Pelicula';
import { Like } from "typeorm";

const repositorioPelicula = AppDataSource.getRepository(Pelicula);

export const peliculaModel = {
    //-GETTERS
    async getPeliculas(limit: number, offset: number) {
        return await repositorioPelicula.find({
            skip: offset,
            take: limit
        });
    },
    async getPeliculaById(id: number, limit: number, offset: number) {
        return await repositorioPelicula.find({
            where: { id },
            skip: offset,
            take: limit
        });
    },
    async getPeliculaByNombre(nombre: string, limit: number, offset: number) {
        return await repositorioPelicula.find({
            where: { nombre: Like(`%${nombre}%`) },
            skip: offset,
            take: limit
        });
    },
    async getPeliculasByEstado(estado: boolean, limit: number, offset: number) {
        return await repositorioPelicula.find({
            where: { estado },
            skip: offset,
            take: limit
        });
    },


    //-SETTERS / POST / INSERT
    async createPelicula(nombre: string, descripcion: string, anio: number) {
        const nueva = repositorioPelicula.create({ nombre, descripcion, anio });
        return await repositorioPelicula.save(nueva);
    },

    async comprobarNombre(nombre: string) {
        const existe = await repositorioPelicula.findOneBy({ nombre });
        return !!existe;
    },

    //-PUTTERS / UPDATE
    async updatePelicula(id: number, nombre: string, descripcion: string, anio: number, estado: boolean) {
        const pelicula = await repositorioPelicula.findOneBy({ id });
        if (!pelicula) return null;
        pelicula.nombre = nombre;
        pelicula.descripcion = descripcion;
        pelicula.anio = anio;
        pelicula.estado = estado;
        return await repositorioPelicula.save(pelicula);
    },

    //PATCH

    //-DELETE
    async deletePeliculaLogica(id: number) {
        const pelicula = await repositorioPelicula.findOneBy({ id });
        if (!pelicula) return null;
        pelicula.estado = false;
        return await repositorioPelicula.save(pelicula);
    },

    async deletePeliculaFisica(id: number) {
        return await repositorioPelicula.delete(id);
    }
};
