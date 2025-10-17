'use client';
import React, { useEffect } from 'react';
import { Pelicula } from '../types/pelicula';

interface ListarPeliculasProps {
    peliculas: Pelicula[];
    cargando: boolean;
    paginacion: { page: number; limit: number; total: number };
    traerPeliculasEnStock: (page?: number) => void;
    traerPeliculasPorNombre: (nombre: string, page?: number) => void;
    totalPaginas: number;
    textoBuscar: string;
    error404: boolean;
    tooltip: { text: string; x: number; y: number } | null;
    setTooltip: (tooltip: { text: string; x: number; y: number } | null) => void;
}

export default function ListarPeliculas({
    peliculas,
    cargando,
    paginacion,
    traerPeliculasEnStock,
    traerPeliculasPorNombre,
    totalPaginas,
    textoBuscar,
    error404,
    tooltip,
    setTooltip
}: ListarPeliculasProps) {

    useEffect(() => {
        if (!textoBuscar || textoBuscar.trim() === "") {
            traerPeliculasEnStock(1);
        } else {
            traerPeliculasPorNombre(textoBuscar, 1);
        }
    }, [textoBuscar]);

    if (cargando) return <p className="text-center">Cargando...</p>;

    return (
        <>
            {/* TABLA */}
            <table className="w-full border-collapse border border-gray-300 text-sm">
                <thead>
                    <tr className="animated-gradient-header">
                        <th className="border border-gray-300 p-2">ID</th>
                        <th className="border border-gray-300 p-2">Nombre</th>
                        <th className="border border-gray-300 p-2">Descripción</th>
                        <th className="border border-gray-300 p-2">Año</th>
                        {textoBuscar?.trim() !== "" && <th className="border border-gray-300 p-2">Estado</th>}
                    </tr>
                </thead>
                <tbody className="animated-gradient-body overflow-visible">
                    {error404 ? (
                        <tr>
                            <td colSpan={5} className="text-center text-red-600 p-2">
                                No hay una película con ese nombre
                            </td>
                        </tr>
                    ) : (
                        peliculas.map((peli: any) => (
                            <tr key={peli.id} className="hover-animated-gradient transition">
                                <td className="border border-gray-300 p-2 table-cell">{peli.id}</td>
                                <td className="border border-gray-300 p-2 table-cell">{peli.nombre}</td>
                                <td
                                    className="border border-gray-300 p-2 table-cell relative"
                                    onMouseEnter={(e) => {
                                        const rect = (e.target as HTMLElement).getBoundingClientRect();
                                        setTooltip({
                                            text: peli.descripcion,
                                            x: rect.left + rect.width / 2,
                                            y: rect.top - 10
                                        });
                                    }}
                                    onMouseLeave={() => setTooltip(null)}
                                >
                                    {peli.descripcion}
                                </td>
                                <td className="border border-gray-300 p-2 table-cell">{peli.anio}</td>
                                {textoBuscar?.trim() !== "" &&
                                    <td className="border border-gray-300 p-2 table-cell">
                                        {peli.estado ? "Activada" : <p className='text-red-600'>Dada de baja</p>}
                                    </td>
                                }
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {/* PAGINACIÓN */}
            <div className="mt-4 flex justify-center gap-2">
                <button
                    onClick={() => textoBuscar?.trim() === ""
                        ? traerPeliculasEnStock(paginacion.page - 1)
                        : traerPeliculasPorNombre(textoBuscar, paginacion.page - 1)
                    }
                    disabled={paginacion.page === 1 || cargando}
                    className="px-3 py-1 bg-violet-900 rounded-l-full disabled:opacity-50"
                >
                    Anterior
                </button>

                <span className="px-2 py-1">
                    Página {paginacion.page} de {totalPaginas}
                </span>

                <button
                    onClick={() => textoBuscar?.trim() === ""
                        ? traerPeliculasEnStock(paginacion.page + 1)
                        : traerPeliculasPorNombre(textoBuscar, paginacion.page + 1)
                    }
                    disabled={paginacion.page === totalPaginas || cargando}
                    className="px-3 py-1 bg-violet-900 rounded-r-full disabled:opacity-50"
                >
                    Siguiente
                </button>
                {tooltip && (
                    <div
                        className="fixed bg-gray-900 text-white text-sm px-2 py-1 rounded shadow-lg max-w-xs z-50 pointer-events-none"
                        style={{
                            top: tooltip.y,
                            left: tooltip.x,
                            transform: 'translateX(-50%)',
                        }}
                    >
                        {tooltip.text}
                    </div>
                )}
            </div>
        </>
    );
}