import { Request, Response } from 'express';
import { peliculaModel } from '../models/peliculaModel';
import fs from 'fs';
import csv from 'csv-parser';
import { AppDataSource } from '../data-source';
import { Pelicula } from '../entity/Pelicula';
import { Like } from 'typeorm';

//-GETTERS
export const getPeliculas = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const offset = (page - 1) * limit;

  try {
    const [peliculas, total] = await AppDataSource.getRepository(Pelicula).findAndCount({
      skip: offset,
      take: limit,
    });
    res.status(200).json({ page, limit, total, peliculas });
  } catch {
    res.status(500).json({ msg: 'Error al consultar las películas' });
  }
};

export const getPeliculaById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const pelicula = await AppDataSource.getRepository(Pelicula).findOneBy({
      id: Number(id),
    });

    if (!pelicula) {
      return res.status(404).json({ message: 'Película por ID no encontrada' });
    }

    // Devuelve un solo objeto
    res.status(200).json(pelicula);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al consultar la película por ID' });
  }
};


export const getPeliculaByNombre = async (req: Request, res: Response) => {
  const { nombre } = req.params;
  const nombreVerificado = decodeURIComponent(nombre).trim().normalize('NFC');
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const offset = (page - 1) * limit;


  try {
    const [peliculas, total] = await AppDataSource.getRepository(Pelicula).findAndCount({
      where: { nombre: Like(`%${nombreVerificado}%`) },
      skip: offset,
      take: limit,
    });
    if (!peliculas.length) {
      return res.status(404).json({ message: 'No se encontró una película con ese nombre' });
    }
    res.status(200).json({ page, limit, total, peliculas });
  } catch {
    res.status(500).json({ msg: 'Error al consultar la película por nombre' });
  }
};

export const getPeliculasByEstado = async (req: Request, res: Response) => {
  const { estado } = req.params;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const offset = (page - 1) * limit;

  try {
    const [peliculas, total] = await AppDataSource.getRepository(Pelicula).findAndCount({
      where: { estado: estado === '1' }, // true o false según params
      skip: offset,
      take: limit,
    });
    if (!peliculas.length) {
      return res.status(404).json({ message: 'No se encontraron películas con ese estado' });
    }
    res.status(200).json({ page, limit, total, peliculas });
  } catch {
    res.status(500).json({ msg: 'Error al consultar por estado' });
  }
};

//-SETTERS / POST / INSERT
export const createPelicula = async (req: Request, res: Response) => {
  const { nombre, descripcion, anio } = req.body;

  try {
    const existe = await peliculaModel.comprobarNombre(nombre);
    if (existe) {
      return res.status(400).json({ message: 'El nombre de la película ya existe', insertadas: 0 });
    }

    const nueva = await peliculaModel.createPelicula(nombre, descripcion, anio);
    res.status(201).json({ message: 'Película insertada correctamente', data: { idInsertado: nueva.id }, insertadas: 1 });
  } catch {
    res.status(500).json({ message: 'Error al insertar la película', insertadas: 0 });
  }
};

export const createPeliculaFromCSV = async (req: Request, res: Response) => {
  const archivo = req.file;
  if (!archivo) return res.status(400).json({ msg: 'No se recibió el archivo' });

  const resultados: any[] = [];
  let insertadas = 0;
  let ignoradas = 0;

  fs.createReadStream(archivo.path)
    .pipe(csv({ separator: ';', headers: ['nombre', 'descripcion', 'anio'] }))
    .on('data', (data) => resultados.push(data))
    .on('end', async () => {
      try {
        for (const fila of resultados) {
          const nombre = fila.nombre?.trim().normalize('NFC');
          const descripcion = fila.descripcion?.trim().normalize('NFC');
          const anio = parseInt(fila.anio);

          // Validación estricta: todos los campos deben estar presentes y válidos
          if (!nombre || !descripcion || isNaN(anio)) {
            ignoradas++;
            continue;
          }

          const existe = await peliculaModel.comprobarNombre(nombre);
          if (!existe) {
            await peliculaModel.createPelicula(nombre, descripcion, anio);
            insertadas++;
          } else {
            ignoradas++;
          }
        }

        fs.unlink(archivo.path, (err) => {
          if (err) console.error('Error al borrar archivo:', err);
        });
        res.json({
          message: 'Procesamiento completo',
          insertadas,
          ignoradas,
          total: resultados.length
        });
      } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Error al procesar el archivo' });
      }
    });
};

//-PUTTERS / UPDATE
export const updatePelicula = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { nombre, descripcion, anio, estado } = req.body || {};

  if (!nombre || !descripcion || typeof anio !== 'number' || estado === undefined) {
    return res.status(400).json({ message: 'Faltan campos obligatorios o el año no es numérico' });
  }

  try {
    const actualizada = await peliculaModel.updatePelicula(Number(id), nombre, descripcion, anio, estado);
    if (!actualizada) {
      return res.status(404).json({ message: 'Película no encontrada para modificar' });
    }
    res.status(200).json({ message: 'Película modificada correctamente' });
  } catch {
    res.status(500).json({ message: 'Error al modificar la película' });
  }
};

//-DELETE
export const deletePeliculaLogica = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const resultado = await peliculaModel.deletePeliculaLogica(Number(id));
    if (!resultado) {
      return res.status(404).json({ message: 'Película no encontrada para baja lógica' });
    }
    res.status(200).json({ message: 'Película dada de baja lógicamente' });
  } catch {
    res.status(500).json({ message: 'Error al intentar dar de baja lógica' });
  }
};

export const deletePeliculaFisica = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await peliculaModel.deletePeliculaFisica(Number(id));
    res.status(200).json({ message: 'Película eliminada permanentemente' });
  } catch {
    res.status(500).json({ message: 'Error al intentar eliminar la película' });
  }
};

export default {
  getPeliculas,
  getPeliculaById,
  getPeliculaByNombre,
  getPeliculasByEstado,
  createPelicula,
  createPeliculaFromCSV,
  updatePelicula,
  deletePeliculaLogica,
  deletePeliculaFisica
};