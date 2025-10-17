'use client';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api/peliculas',
});

type Pelicula = {
  id?: number;
  nombre: string;
  descripcion: string;
  anio: number;
  estado?: boolean;
};

function SubirCsv(
  { cargando,
    handleSubmit,
    archivo,
    setArchivo,
    resultado
  }: any
) {
  return (
    <main className="max-w-md mx-auto p-4 bg-white rounded shadow p-12">
      <h1 className="text-2xl font-bold text-black border-b-2 border-indigo-500 pb-3"> 📄 Subir archivo CSV</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept=".csv"
          onChange={(e) => setArchivo(e.target.files?.[0] || null)}
          className="my-5 border-indigo-500 border rounded px-2 py-1 w-full text-gray-500"
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded"
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
          {resultado?.errores && resultado.errores.length > 0 && (
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

function ListarPeliculasFlexible({
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
}: any) {

  useEffect(() => {
    // Si no hay texto en el buscador, lista películas normales
    if (!textoBuscar || String(textoBuscar).trim() === "") {
      traerPeliculasEnStock(1);
    } else {
      traerPeliculasPorNombre(textoBuscar, 1);
    }
  }, [textoBuscar]); // se ejecuta cada vez que cambia el textoBuscar

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


function AgregarPelicula(
  {
    pelicula,
    setPelicula,
    cargando,
    handleSubmit,
    resultado,
    modo,
    evitarCaracteresInvalidos
  }: any
) {
  return (
    <>
      <main className="max-w-md mx-auto p-4 bg-white rounded shadow p-12">
        <h1 className="text-2xl font-bold text-black border-b-2 border-indigo-500 mb-4 pb-3"> 📄 Agregar película</h1>

        <form onSubmit={(e) => { e.preventDefault(); handleSubmit('crear'); }}>
          <div className="mb-4">
            <label className="text-black italic">
              Nombre:
            </label>
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
            <label className="text-black italic">
              Descripción:
            </label>
            <textarea
              placeholder="Ingrese la descripción de la película"
              value={pelicula.descripcion}
              onChange={(e) => setPelicula({ ...pelicula, descripcion: e.target.value })}
              className="border-indigo-500 border rounded px-2 py-1 w-full text-gray-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="text-black italic">
              Año:
            </label>
            <input
              type="number"
              placeholder="Ingrese el año de lanzamiento de la película"
              value={pelicula.anio === 0 ? '' : pelicula.anio}
              onChange={(e) => setPelicula({ ...pelicula, anio: e.target.value })}
              onKeyDown={evitarCaracteresInvalidos}
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

        {modo === 'crear' ?
          (
            resultado && (
              <section className="mt-4 bg-gray-100 p-3 rounded-[25px] border-2 border-indigo-500">
                {resultado.insertadas > 0 ? (
                  <p className="text-black"><strong>Película añadida correctamente con el ID: {resultado.data?.idInsertado}</strong></p>
                ) : (
                  <p className="text-black"><strong>{resultado.message}</strong></p>
                )}
              </section>
            )
          ) : null}
      </main>
    </>
  );
}

function EditarPelicula(
  {
    pelicula,
    setPelicula,
    cargando,
    handleSubmit,
    resultado,
    textareaRef,
    modo,
    evitarCaracteresInvalidos
  }: any
) {
  const [idInexistente, setIdInexistente] = useState(false);
  return (
    <>
      <main className="max-w-md mx-auto p-4 bg-white rounded shadow p-12">
        <h1 className="text-2xl font-bold text-black border-b-2 border-indigo-500 mb-4 pb-3">
          📄 Editar película
        </h1>

        <form onSubmit={(e) => { e.preventDefault(); handleSubmit('editar'); }}>
          <div className="mb-4 relative">
            <label className="text-black italic">ID:</label>
            <input
              type="number"
              placeholder="Ingrese el ID de la película a modificar"
              value={pelicula.id === 0 ? '' : pelicula.id}
              onChange={async (e) => {
                const id = e.target.value ? parseInt(e.target.value) : 0;
                setPelicula({ ...pelicula, id });

                if (id > 0) {
                  try {
                    const res = await api.get(`/id/${id}`);
                    if (res.data) {
                      // Llenamos automáticamente los campos
                      setPelicula({
                        id: res.data.id,
                        nombre: res.data.nombre,
                        descripcion: res.data.descripcion,
                        anio: res.data.anio,
                        estado: res.data.estado,
                      });
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
              }}
              onKeyDown={evitarCaracteresInvalidos}
              className="border-indigo-500 border rounded px-2 py-1 w-full text-gray-500"
              min={0}
              required
            />
            {idInexistente && (
              <span className="text-red-600 text-sm absolute top-full left-0 mt-0">
                ID inexistente
              </span>
            )}
            {pelicula.id === 0 && (
              <span className="text-gray-400 text-sm absolute top-full left-0 mt-0">
                Indique primeramente el ID
              </span>
            )}
          </div>

          <div className="mb-4">
            <label className="text-black italic">
              Nombre:
            </label>
            <input
              type="text"
              value={pelicula.nombre}
              placeholder="Ingrese el nombre de la película"
              onChange={(e) => setPelicula({ ...pelicula, nombre: e.target.value })}
              className="border-indigo-500 border rounded px-2 py-1 w-full text-gray-500"
            />
          </div>
          <div className="mb-4">
            <label className="text-black italic">
              Descripción:
            </label>
            <textarea
              ref={textareaRef}
              placeholder="Ingrese la descripción de la película"
              value={pelicula.descripcion}
              onChange={(e) => {
                setPelicula({ ...pelicula, descripcion: e.target.value });
                if (textareaRef.current) {
                  textareaRef.current.style.height = 'auto'; // reset
                  textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'; // ajustar al contenido
                }
              }}
              className="border-indigo-500 border rounded px-2 py-1 w-full text-gray-500"
            />
          </div>
          <div className="mb-4">
            <label className="text-black italic">
              Año:
            </label>
            <input
              type="number"
              placeholder="Ingrese el año de lanzamiento de la película"
              value={pelicula.anio === 0 ? '' : pelicula.anio}
              onChange={(e) => setPelicula({ ...pelicula, anio: parseInt(e.target.value) || 0 })}
              onKeyDown={evitarCaracteresInvalidos}
              className="border-indigo-500 border rounded px-2 py-1 w-full text-gray-500"
              min={0}
            />
          </div>
          <div className="mb-4">
            <label className="text-black italic">
              Estado:
            </label>
            <select
              value={pelicula.estado === true ? 'true' : 'false'}
              onChange={(e) =>
                setPelicula({ ...pelicula, estado: e.target.value === 'true' })
              }
              className="border-indigo-500 border rounded px-2 py-1 w-full text-gray-500"
            >
              <option value="true">Activada</option>
              <option value="false">Dada de baja</option>
            </select>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded"
            type="submit"
            disabled={!pelicula || cargando}
          >
            {cargando ? 'Procesando...' : 'Confirmar edición'}
          </button>
        </form>

        {modo === 'editar' ?
          (
            resultado && (
              <section className="mt-4 bg-gray-100 p-3 rounded-[25px] border-2 border-indigo-500">
                {resultado.insertadas > 0 ? (
                  <p className="text-black"><strong>Película editada correctamente</strong></p>
                ) : (
                  <p className="text-black"><strong>{resultado.message}</strong></p>
                )}
              </section>
            )
          ) : null}
      </main>
    </>
  );
}

export default function Page() {
  const [peliculas, setPeliculas] = useState<Pelicula[]>([]);
  const [pelicula, setPelicula] = useState<Pelicula>(
    {
      id: 0,
      nombre: '',
      descripcion: '',
      anio: 0,
      estado: true,
    }
  );
  const [paginacion, setPaginacion] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });
  const [archivo, setArchivo] = useState<File | null>(null);
  const [resultado, setResultado] = useState<null | {
    insertadas: number;
    ignoradas: number;
    total: number;
    errores?: { fila: number; motivo: string }[];
  }>(null);
  const [resultadoParticular, setResultadoParticular] = useState<null | {
    insertadas: number;
    message: string;
    data?: { idInsertado: number };
  }>(null);
  const [cargando, setCargando] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [modo, setModo] = useState<'crear' | 'editar'>('crear');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [textoBuscar, setTextoBuscar] = useState('');
  const [error404, setError404] = useState(false);
  const evitarCaracteresInvalidos = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (['e', 'E', '+', '-'].includes(e.key)) e.preventDefault();
  };

  const traerPeliculasEnStock = async (pagina: number = 1) => {
    try {
      const res = await api.get(`/estado/1?page=${pagina}&limit=${paginacion.limit}`);
      setPeliculas(res.data.peliculas);
      setPaginacion({
        page: res.data.page,
        limit: res.data.limit,
        total: res.data.total,
      });
    } catch (error) {
      console.error('Error al traer películas:', error);
    } finally {
      setCargando(false);
    }
  };
  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null);

  const traerPeliculasPorNombre = async (nombre: string, pagina: number = 1) => {
    setCargando(true);
    setError404(false); // resetear cada vez

    try {
      const res = await api.get(`/nombre/${encodeURIComponent(nombre)}?page=${pagina}&limit=${paginacion.limit}`);
      setPeliculas(res.data.peliculas);
      setPaginacion({
        page: res.data.page,
        limit: res.data.limit,
        total: res.data.total,
      });
    } catch (error: any) {
      if (error.response?.status === 404) {
        setPeliculas([]); // limpiar lista
        setError404(true); // indicar que no se encontró
      } else {
        console.error('Error al traer películas:', error);
      }
    } finally {
      setCargando(false);
    }
  };

  const tabs = [
    {
      id: "subir",
      label: "Subir archivo .csv",
      content: () => (
        <SubirCsv
          cargando={cargando}
          handleSubmit={handleSubmitCSV}
          archivo={archivo}
          setArchivo={setArchivo}
          resultado={resultado}
        />
      ),
    },
    {
      id: "listar",
      label: "Listar películas",
      content: () => (
        <ListarPeliculasFlexible
          peliculas={peliculas}
          cargando={cargando}
          paginacion={paginacion}
          traerPeliculasEnStock={traerPeliculasEnStock}
          traerPeliculasPorNombre={traerPeliculasPorNombre}
          totalPaginas={totalPaginas}
          textoBuscar={textoBuscar}
          error404={error404}
          tooltip={tooltip}
          setTooltip={setTooltip}
        />
      ),
    },
    {
      id: "agregar",
      label: "Agregar película",
      content: () => (
        <AgregarPelicula
          pelicula={pelicula}
          setPelicula={setPelicula}
          cargando={cargando}
          handleSubmit={handleSubmit}
          resultado={resultadoParticular}
          modo={modo}
        />
      ),
    },
    {
      id: "editar",
      label: "Editar película",
      content: () => (<EditarPelicula
        pelicula={pelicula}
        setPelicula={setPelicula}
        cargando={cargando}
        handleSubmit={handleSubmit}
        resultado={resultadoParticular}
        textareaRef={textareaRef}
        modo={modo}
      />
      ),
    },
  ];

  // Calcular la cantidad total de páginas
  const totalPaginas = Math.ceil(paginacion.total / paginacion.limit);

  const handleSubmitCSV = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!archivo) return;

    setCargando(true);
    const formData = new FormData();
    formData.append('file', archivo);

    try {
      const res = await api.post('/csv', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setResultado(res.data);
    } catch (error) {
      console.error('Error al subir CSV:', error);
    } finally {
      setCargando(false);
    }
  };

  const handleSubmit = async (accion: 'crear' | 'editar') => {
    setModo(accion);//  actualiza el modo visible
    // Validación de campos obligatorios string
    if (!pelicula.nombre?.trim() || !pelicula.descripcion?.trim()) {
      alert("Completa todos los campos antes de enviar");
      return;
    }

    // Validación de año y id: 0 no es válido
    if (!pelicula.anio || (accion === 'editar' && !pelicula.id)) {
      alert("Completa todos los campos antes de enviar");
      return;
    }

    // No validar booleanos con !, porque false es válido
    if (accion === 'editar' && pelicula.estado === undefined) {
      alert("Completa todos los campos antes de enviar");
      return;
    }

    const peliculaParaEnviar = { ...pelicula };
    if (accion === 'crear') {
      delete peliculaParaEnviar.id;
      delete peliculaParaEnviar.estado;
    }

    setCargando(true);

    try {
      let res;
      if (accion === 'crear') {
        res = await api.post('/', peliculaParaEnviar);
      } else {
        res = await api.put(`/${pelicula.id}`, peliculaParaEnviar);
      }

      setResultadoParticular(res.data);

      setPelicula({  //limpio el objeto para volver a usarlo
        id: 0,
        nombre: '',
        descripcion: '',
        anio: 0,
        estado: true,
      });

    } catch (error: any) {
      // Aquí manejamos el error 400 del backend
      if (error.response) {
        setResultadoParticular({
          insertadas: 0,
          message: error.response.data.message,
          data: undefined,
        });
      } else {
        console.error("Error:", error);
      }
    } finally {
      setCargando(false);
    }
  };

  return (
    <>
      {/* LAYOUT GENERAL */}
      <div className="flex min-h-screen">

        {/* ASIDE */}
        <aside className="fixed left-0 top-0 h-full w-56 bg-gray-800 text-white flex flex-col overflow-y-auto shadow-lg z-20">
          <ul className="tabs flex-1 p-4 space-y-2">
            {tabs.map((tab, index) => (
              <li key={tab.id}>
                <button
                  onClick={() => {
                    setActiveTab(index);
                    setTextoBuscar('');
                  }}
                  className={`block w-full text-left px-4 py-2 rounded-md transition-all duration-200 ${activeTab === index
                    ? "bg-indigo-600"
                    : "hover:bg-gray-700 bg-gray-700/60"
                    }`}
                >
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* CONTENEDOR PRINCIPAL */}
        <div className="flex flex-col flex-1 ml-56">

          {/* HEADER */}
          <header className="h-16 bg-violet-600 text-white flex justify-center items-center shadow-md z-10">
            <h1 className="text-2xl font-bold">Catálogo de Películas</h1>
            {tabs[activeTab]?.id === "listar" && (
              <input type="search"
                placeholder="Buscar por nombre..."
                onChange={(e) => setTextoBuscar(e.target.value)}
                className="absolute right-5 h-7 w-48 pl-2 pr-3 rounded-[20px] border-2 border-white bg-black text-white placeholder-white placeholder:italic shadow-md focus:outline-none focus:ring-3 focus:ring-white focus:border-transparent"
              />
            )}
          </header>

          {/* MAIN */}
          <main className="flex-1 flex justify-center items-center p-8 overflow-y-auto">
            <div className="w-full max-w-4xl shadow-md rounded-lg p-6">
              {/* SECCIONES */}
              {tabs.map((tab, index) => (
                <article
                  key={tab.id}
                  className={`transition-opacity duration-500 ${activeTab === index ? "opacity-100" : "hidden opacity-0"
                    }`}
                >
                  {activeTab === index && tab.content()}
                </article>
              ))}
            </div>
          </main>
        </div>
      </div>
    </>
  );

}

/**
 * 
 * - AGREGAR BUSCADOR AL LISTAR
 * - BOTONES DE EDITAR Y BORRAR EN CADA FILA QUE REDIRECCIONEN A 
 *   LOS FORMULARIOS CON CAMPOS AUTOCOMPLETADOS
 * - SEPARAR TODO EN DIFERENTES ARCHIVOS PARA ORDENARLO
 * - TERMINAR EL README
 * 
 * 
 * return (
    <>
      <Head>
        <title>Catálogo de películas</title>
        <meta name="description" content="Proyecto de prueba técnica fullstack" />
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <main className="max-w-md mx-auto p-4">  //es angosto, usarlo para tarjetas o formularios
        <h1 className="text-2xl font-bold mb-4">Subir archivo CSV</h1>

        <form onSubmit={handleSubmit}>
          <input
            type="file"
            accept=".csv"
            onChange={(e) => setArchivo(e.target.files?.[0] || null)}
            className="mb-2 border-white border rounded px-2 py-1 w-full"
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
            <p className="text-black"><strong>Total:</strong> {resultado.total}</p>
            <p className="text-black"><strong>Insertadas:</strong> {resultado.insertadas}</p>
            <p className="text-black"><strong>Ignoradas:</strong> {resultado.ignoradas}</p>
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
 */