'use client';
import React, { useRef, useState } from 'react';
import { Pelicula } from '../types/pelicula';
import axios from 'axios';

interface EditarPeliculaProps {
  pelicula: Pelicula;
  setPelicula: (p: Pelicula) => void;
  cargando: boolean;
  handleSubmit: (accion: 'editar') => void;
  resultado: any;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  modo: 'crear' | 'editar';
  evitarCaracteresInvalidos: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const api = axios.create({
  baseURL: 'http://localhost:3001/api/peliculas',
});

export default function EditarPelicula({
  pelicula,
  setPelicula,
  cargando,
  handleSubmit,
  resultado,
  textareaRef,
  modo,
  evitarCaracteresInvalidos
}: EditarPeliculaProps) {

  const [idInexistente, setIdInexistente] = useState(false);

  const handleIdChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const id = e.target.value ? parseInt(e.target.value) : 0;
    setPelicula({ ...pelicula, id });

    if (id > 0) {
      try {
        const res = await api.get(`/id/${id}`);
        if (res.data) {
          setPelicula(res.data);
          setIdInexistente(false);
        } else {
          setIdInexistente(true);
        }
      } catch {
        setIdInexistente(true);
        setPelicula({ ...pelicula, id, nombre: '', descripcion: '', anio: 0, estado: true });
      }
    } else {
      setIdInexistente(false);
      setPelicula({ ...pelicula, id: 0, nombre: '', descripcion: '', anio: 0, estado: true });
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded shadow p-12">
      <h1 className="text-2xl font-bold text-black border-b-2 border-indigo-500 mb-4 pb-3"> 📄 Editar película</h1>

      <form onSubmit={(e) => { e.preventDefault(); handleSubmit('editar'); }}>
        <div className="mb-4 relative">
          <label className="text-black italic">ID:</label>
          <input
            type="number"
            placeholder="Ingrese el ID de la película"
            value={pelicula.id === 0 ? '' : pelicula.id}
            onChange={handleIdChange}
            onKeyDown={evitarCaracteresInvalidos}
            className="border-indigo-500 border rounded px-2 py-1 w-full text-gray-500"
            min={0}
            required
          />
          {idInexistente && <span className="text-red-600 text-sm absolute top-full left-0 mt-0">ID inexistente</span>}
          {pelicula.id === 0 && <span className="text-gray-400 text-sm absolute top-full left-0 mt-0">Indique primeramente el ID</span>}
        </div>

        <div className="mb-4">
          <label className="text-black italic">Nombre:</label>
          <input
            type="text"
            value={pelicula.nombre}
            onChange={(e) => setPelicula({ ...pelicula, nombre: e.target.value })}
            className="border-indigo-500 border rounded px-2 py-1 w-full text-gray-500"
          />
        </div>

        <div className="mb-4">
          <label className="text-black italic">Descripción:</label>
          <textarea
            ref={textareaRef}
            value={pelicula.descripcion}
            onChange={(e) => {
              setPelicula({ ...pelicula, descripcion: e.target.value });
              if (textareaRef.current) {
                textareaRef.current.style.height = 'auto';
                textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
              }
            }}
            className="border-indigo-500 border rounded px-2 py-1 w-full text-gray-500"
          />
        </div>

        <div className="mb-4">
          <label className="text-black italic">Año:</label>
          <input
            type="number"
            value={pelicula.anio === 0 ? '' : pelicula.anio}
            onChange={(e) => setPelicula({ ...pelicula, anio: parseInt(e.target.value) || 0 })}
            onKeyDown={evitarCaracteresInvalidos}
            className="border-indigo-500 border rounded px-2 py-1 w-full text-gray-500"
            min={0}
          />
        </div>

        <div className="mb-4">
          <label className="text-black italic">Estado:</label>
          <select
            value={pelicula.estado === true ? 'true' : 'false'}
            onChange={(e) => setPelicula({ ...pelicula, estado: e.target.value === 'true' })}
            className="border-indigo-500 border rounded px-2 py-1 w-full text-gray-500"
          >
            <option value="true">Activada</option>
            <option value="false">Dada de baja</option>
          </select>
        </div>

        <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit" disabled={!pelicula || cargando}>
          {cargando ? 'Procesando...' : 'Confirmar edición'}
        </button>
      </form>

      {modo === 'editar' && resultado && (
        <section className="mt-4 bg-gray-100 p-3 rounded-[25px] border-2 border-indigo-500">
          {resultado.insertadas > 0 ? (
            <p className="text-black"><strong>Película editada correctamente</strong></p>
          ) : (
            <p className="text-black"><strong>{resultado.message}</strong></p>
          )}
        </section>
      )}
    </div>
  );
}