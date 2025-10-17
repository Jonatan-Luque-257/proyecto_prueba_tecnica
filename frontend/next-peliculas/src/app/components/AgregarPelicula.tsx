'use client';
import React from 'react';
import { Pelicula } from '../types/pelicula';

interface AgregarPeliculaProps {
  pelicula: Pelicula;
  setPelicula: (p: Pelicula) => void;
  cargando: boolean;
  handleSubmit: (accion: 'crear') => void;
  resultado: any;
  modo: 'crear' | 'editar';
}

export default function AgregarPelicula({
  pelicula,
  setPelicula,
  cargando,
  handleSubmit,
  resultado,
  modo
}: AgregarPeliculaProps) {

  return (
    <main className="max-w-md mx-auto p-4 bg-white rounded shadow p-12">
      <h1 className="text-2xl font-bold text-black border-b-2 border-indigo-500 mb-4 pb-3"> 📄 Agregar película</h1>

      <form onSubmit={(e) => { e.preventDefault(); handleSubmit('crear'); }}>
        <div className="mb-4">
          <label className="text-black italic">Nombre:</label>
          <input
            type="text"
            value={pelicula.nombre}
            placeholder="Ingrese el nombre de la película"
            onChange={(e) => setPelicula({ ...pelicula, nombre: e.target.value })}
            className="border-indigo-500 border rounded px-2 py-1 w-full text-gray-500"
            required
          />
        </div>

        <div className="mb-2">
          <label className="text-black italic">Descripción:</label>
          <textarea
            placeholder="Ingrese la descripción de la película"
            value={pelicula.descripcion}
            onChange={(e) => setPelicula({ ...pelicula, descripcion: e.target.value })}
            className="border-indigo-500 border rounded px-2 py-1 w-full text-gray-500"
            required
          />
        </div>

        <div className="mb-4">
          <label className="text-black italic">Año:</label>
          <input
            type="number"
            placeholder="Ingrese el año de lanzamiento"
            value={pelicula.anio === 0 ? '' : pelicula.anio}
            onChange={(e) => setPelicula({ ...pelicula, anio: Number(e.target.value) })}
            className="border-indigo-500 border rounded px-2 py-1 w-full text-gray-500"
            min={0}
            required
          />
        </div>

        <button className="bg-blue-600 text-white px-4 py-2 rounded"
          type="submit"
          disabled={!pelicula || cargando}
        >
          {cargando ? 'Procesando...' : 'Agregar Película'}
        </button>
      </form>

      {modo === 'crear' && resultado && (
        <section className="mt-4 bg-gray-100 p-3 rounded-[25px] border-2 border-indigo-500">
          {resultado.insertadas > 0 ? (
            <p className="text-black"><strong>Película añadida correctamente con el ID: {resultado.data?.idInsertado}</strong></p>
          ) : (
            <p className="text-black"><strong>{resultado.message}</strong></p>
          )}
        </section>
      )}
    </main>
  );
}