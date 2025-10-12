'use client';

import Head from 'next/head';
import { useState } from 'react';

export default function Page() {
  const [archivo, setArchivo] = useState<File | null>(null);
  const [resultado, setResultado] = useState<null | {
    insertadas: number;
    ignoradas: number;
    total: number;
    errores?: { fila: number; motivo: string }[];
  }>(null);
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!archivo) return;

    setCargando(true);
    const formData = new FormData();
    formData.append('file', archivo);

    try {
      const res = await fetch('http://localhost:3001/api/peliculas/csv', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      setResultado(data);
    } catch (error) {
      console.error('Error al subir CSV:', error);
    } finally {
      setCargando(false);
    }
  };

  return (
    <>
      <Head>
        <title>Catálogo de películas</title>
        <meta name="description" content="Proyecto de prueba técnica fullstack" />
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <main className="max-w-md mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Subir archivo CSV</h1>

        <form onSubmit={handleSubmit}>
          <input
            type="file"
            accept=".csv"
            onChange={(e) => setArchivo(e.target.files?.[0] || null)}
            className="mb-2"
          />
          <button
            type="submit"
            disabled={!archivo || cargando}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {cargando ? 'Procesando...' : 'Subir CSV'}
          </button>
        </form>

        {resultado && (
          <section className="mt-4 bg-gray-100 p-3 rounded">
            <p><strong>Total:</strong> {resultado.total}</p>
            <p><strong>Insertadas:</strong> {resultado.insertadas}</p>
            <p><strong>Ignoradas:</strong> {resultado.ignoradas}</p>
            {resultado?.errores && resultado.errores.length > 0 && (
              <details className="mt-2">
                <summary className="cursor-pointer text-sm text-red-600">Ver errores</summary>
                <ul className="text-sm mt-1">
                  {resultado.errores.map((err, i) => (
                    <li key={i}>Fila {err.fila}: {err.motivo}</li>
                  ))}
                </ul>
              </details>
            )}
          </section>
        )}
      </main>
    </>
  );
}