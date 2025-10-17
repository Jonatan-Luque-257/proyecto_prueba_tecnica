'use client';
import React from 'react';

interface SubirCsvProps {
  cargando: boolean;
  handleSubmit: (e: React.FormEvent) => void;
  archivo: File | null;
  setArchivo: (file: File | null) => void;
  resultado: any;
}

export default function SubirCsv({ cargando, handleSubmit, archivo, setArchivo, resultado }: SubirCsvProps) {
  return (
    <main className="max-w-md mx-auto p-4 bg-white rounded shadow p-12">
      <h1 className="text-2xl font-bold text-black border-b-2 border-indigo-500 pb-3">📄 Subir archivo CSV</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept=".csv"
          onChange={(e) => setArchivo(e.target.files?.[0] || null)}
          className="my-5 border-indigo-500 border rounded px-2 py-1 w-full text-gray-500"
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          type="submit"
          disabled={!archivo || cargando}
        >
          {cargando ? 'Procesando...' : 'Subir CSV'}
        </button>
      </form>

      {resultado && (
        <section className="mt-4 bg-gray-100 p-3 rounded-[25px] border-2 border-indigo-500">
          <p className="text-black"><strong>Filas totales:</strong> {resultado.total}</p>
          <p className="text-black"><strong>Insertadas:</strong> {resultado.insertadas}</p>
          <p className="text-black"><strong>Ignoradas:</strong> {resultado.ignoradas}</p>
          {resultado?.errores?.length > 0 && (
            <details className="mt-2">
              <summary className="cursor-pointer text-sm text-red-600">Ver errores</summary>
              <ul className="text-sm mt-1">
                {resultado.errores.map((err: { fila: number; motivo: string }, i: number) => (
                  <li key={i}>Fila {err.fila}: {err.motivo}</li>
                ))}
              </ul>
            </details>
          )}
        </section>
      )}
    </main>
  );
}