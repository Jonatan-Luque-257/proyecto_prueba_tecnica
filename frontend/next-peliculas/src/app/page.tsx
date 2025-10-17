'use client';
import { useState, useRef } from 'react';
import Tabs from './components/Tabs';
import SubirCsv from './components/SubirCsv';
import ListarPeliculasFlexible from './components/ListarPeliculas';
import AgregarPelicula from './components/AgregarPelicula';
import EditarPelicula from './components/EditarPelicula';
import { Pelicula } from './types/pelicula';
import { api } from './services/api';

export default function Page() {
  const [peliculas, setPeliculas] = useState<Pelicula[]>([]);
  const [pelicula, setPelicula] = useState<Pelicula>({ id: 0, nombre: '', descripcion: '', anio: 0, estado: true });
  const [paginacion, setPaginacion] = useState({ page: 1, limit: 10, total: 0 });
  const [archivo, setArchivo] = useState<File | null>(null);
  const [resultado, setResultado] = useState<any>(null);
  const [resultadoParticular, setResultadoParticular] = useState<any>(null);
  const [cargando, setCargando] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [modo, setModo] = useState<'crear' | 'editar'>('crear');
  const [textoBuscar, setTextoBuscar] = useState('');
  const [error404, setError404] = useState(false);
  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const evitarCaracteresInvalidos = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (['e', 'E', '+', '-'].includes(e.key)) e.preventDefault();
  };

  const totalPaginas = Math.ceil(paginacion.total / paginacion.limit);

  // Funciones para traer películas
  const traerPeliculasEnStock = async (pagina = 1) => {
    try {
      const res = await api.get(`/estado/1?page=${pagina}&limit=${paginacion.limit}`);
      setPeliculas(res.data.peliculas);
      setPaginacion({ page: res.data.page, limit: res.data.limit, total: res.data.total });
    } catch (error) {
      console.error(error);
    } finally {
      setCargando(false);
    }
  };

  const traerPeliculasPorNombre = async (nombre: string, pagina = 1) => {
    setCargando(true);
    setError404(false);
    try {
      const res = await api.get(`/nombre/${encodeURIComponent(nombre)}?page=${pagina}&limit=${paginacion.limit}`);
      setPeliculas(res.data.peliculas);
      setPaginacion({ page: res.data.page, limit: res.data.limit, total: res.data.total });
    } catch (error: any) {
      if (error.response?.status === 404) {
        setPeliculas([]);
        setError404(true);
      } else {
        console.error(error);
      }
    } finally {
      setCargando(false);
    }
  };

  // Manejo de CSV
  const handleSubmitCSV = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!archivo) return;
    setCargando(true);
    const formData = new FormData();
    formData.append('file', archivo);
    try {
      const res = await api.post('/csv', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setResultado(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setCargando(false);
    }
  };

  // Manejo de agregar/editar película
  const handleSubmit = async (accion: 'crear' | 'editar') => {
    setModo(accion);

    if (!pelicula.nombre?.trim() || !pelicula.descripcion?.trim() || !pelicula.anio || (accion === 'editar' && !pelicula.id)) {
      alert('Completa todos los campos antes de enviar');
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
      if (accion === 'crear') res = await api.post('/', peliculaParaEnviar);
      else res = await api.put(`/${pelicula.id}`, peliculaParaEnviar);

      setResultadoParticular(res.data);

      // Limpiar formulario
      setPelicula({ id: 0, nombre: '', descripcion: '', anio: 0, estado: true });
    } catch (error: any) {
      if (error.response) {
        setResultadoParticular({ insertadas: 0, message: error.response.data.message });
      } else console.error(error);
    } finally {
      setCargando(false);
    }
  };

  // Definir tabs
  const tabs = [
    { id: 'subir', label: 'Subir CSV', content: () => <SubirCsv cargando={cargando} handleSubmit={handleSubmitCSV} archivo={archivo} setArchivo={setArchivo} resultado={resultado} /> },
    { id: 'listar', label: 'Listar películas', content: () => <ListarPeliculasFlexible peliculas={peliculas} cargando={cargando} paginacion={paginacion} traerPeliculasEnStock={traerPeliculasEnStock} traerPeliculasPorNombre={traerPeliculasPorNombre} totalPaginas={totalPaginas} textoBuscar={textoBuscar} error404={error404} tooltip={tooltip} setTooltip={setTooltip} /> },
    { id: 'agregar', label: 'Agregar película', content: () => <AgregarPelicula pelicula={pelicula} setPelicula={setPelicula} cargando={cargando} handleSubmit={handleSubmit} resultado={resultadoParticular} modo={modo} /> },
    { id: 'editar', label: 'Editar película', content: () => <EditarPelicula pelicula={pelicula} setPelicula={setPelicula} cargando={cargando} handleSubmit={handleSubmit} resultado={resultadoParticular} textareaRef={textareaRef} modo={modo} evitarCaracteresInvalidos={evitarCaracteresInvalidos} /> },
  ];

  return (
    <>
      <header className="h-16 bg-violet-600 text-white flex justify-center items-center shadow-md z-10">
        <h1 className="text-2xl font-bold">Catálogo de Películas</h1>
        {tabs[activeTab]?.id === "listar" && (
          <input
            type="search"
            placeholder="Buscar por nombre..."
            onChange={(e) => setTextoBuscar(e.target.value)}
            className="absolute right-5 h-7 w-48 pl-2 pr-3 rounded-[20px] border-2 border-white bg-black text-white placeholder-white placeholder:italic shadow-md focus:outline-none focus:ring-3 focus:ring-white focus:border-transparent"
          />
        )}
      </header>

      <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} setTextoBuscar={setTextoBuscar} />
    </>
  );
}
