import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { Search, Code, Grid, Info, BookOpen, Github, Server, ShieldCheck, X, ChevronRight, Download } from 'lucide-react';

// --- Types ---
interface PokemonType {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

interface PokemonDetails {
  id: number;
  name: string;
  types: PokemonType[];
  sprites: {
    front_default: string;
    other: {
      'official-artwork': {
        front_default: string;
      };
    };
  };
  height: number;
  weight: number;
  base_experience: number;
}

interface PokemonListItem {
  name: string;
  url: string;
}

// --- Components ---

const TypeBadge: React.FC<{ type: string }> = ({ type }) => {
  return (
    <span className={`type-${type} text-white text-xs font-bold px-2 py-1 rounded-full capitalize shadow-sm`}>
      {type}
    </span>
  );
};

const PokemonCard: React.FC<{ data: PokemonDetails }> = ({ data }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-100 flex flex-col">
      <div className="bg-gray-50 p-4 flex justify-center items-center relative">
        <span className="absolute top-2 right-3 text-gray-400 font-bold text-xs">#{String(data.id).padStart(3, '0')}</span>
        <img 
          src={data.sprites.other['official-artwork'].front_default || data.sprites.front_default} 
          alt={data.name}
          className="w-32 h-32 object-contain drop-shadow-md transform hover:scale-110 transition-transform duration-300"
        />
      </div>
      <div className="p-4 flex-1">
        <h3 className="text-lg font-bold text-gray-800 capitalize mb-2 text-center">{data.name}</h3>
        <div className="flex justify-center gap-2 mb-4">
          {data.types.map((t) => (
            <TypeBadge key={t.type.name} type={t.type.name} />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 bg-gray-50 rounded-lg p-2">
          <div className="text-center border-r border-gray-200">
            <p className="font-semibold">Height</p>
            <p>{data.height / 10} m</p>
          </div>
          <div className="text-center">
            <p className="font-semibold">Weight</p>
            <p>{data.weight / 10} kg</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const JsonView: React.FC<{ data: PokemonDetails[] | PokemonDetails }> = ({ data }) => {
  return (
      <div className="bg-gray-900 rounded-xl overflow-hidden shadow-lg border border-gray-700 h-[80vh] min-h-[480px] flex flex-col">
      <div className="bg-gray-800 px-4 py-2 border-b border-gray-700 flex items-center gap-2">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <span className="ml-2 text-xs text-gray-400 font-mono">response.json</span>
      </div>
      <pre className="p-4 text-sm text-green-400 font-mono overflow-auto json-scroll flex-1">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
};

const InfoModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2 text-red-600">
            <BookOpen size={24} />
            <h2 className="text-xl font-bold text-gray-900">Cómo funciona esta App</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
            <X size={24} className="text-gray-500" />
          </button>
        </div>
        
        <div className="p-6 space-y-8 text-gray-700">
          
          {/* Intro */}
          <section>
            <p className="mb-4 leading-relaxed">
              Esta aplicación es un ejemplo práctico de cómo un cliente web (Frontend) consume datos de un servicio externo (Backend) utilizando el protocolo HTTP.
            </p>
          </section>

          {/* HTTP vs HTTPS */}
          <section className="grid md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
              <div className="flex items-center gap-2 mb-3 text-blue-700">
                <Server size={20} />
                <h3 className="font-bold">HTTP</h3>
              </div>
              <p className="text-sm mb-2"><strong>HyperText Transfer Protocol</strong></p>
              <p className="text-sm text-gray-600">
                Es el protocolo base de la web. Define cómo se envían los mensajes entre tu navegador (cliente) y el servidor donde viven los datos. Es como un idioma común que ambos entienden.
              </p>
            </div>

            <div className="bg-green-50 p-5 rounded-xl border border-green-100">
              <div className="flex items-center gap-2 mb-3 text-green-700">
                <ShieldCheck size={20} />
                <h3 className="font-bold">HTTPS (Seguro)</h3>
              </div>
              <p className="text-sm mb-2"><strong>HTTP Secure</strong></p>
              <p className="text-sm text-gray-600">
                Es la versión segura de HTTP. Utiliza encriptación (TLS/SSL) para que los datos viajen "protegidos". Si alguien intercepta la comunicación, solo verá datos ilegibles. La PokéAPI usa HTTPS.
              </p>
            </div>
          </section>

          {/* App Architecture */}
          <section>
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Code size={20} className="text-purple-600"/>
              Ciclo de Vida de una Solicitud
            </h3>
            <div className="space-y-4">
              <div className="flex gap-4 items-start">
                <div className="bg-purple-100 text-purple-700 font-bold rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">1</div>
                <div>
                  <h4 className="font-semibold text-gray-900">Solicitud (Request)</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Cuando cargas la página o buscas, React ejecuta <code>fetch('https://pokeapi.co/...')</code>. Esta función envía un mensaje GET al servidor pidiendo datos.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="bg-purple-100 text-purple-700 font-bold rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">2</div>
                <div>
                  <h4 className="font-semibold text-gray-900">Procesamiento</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    La API de Pokémon recibe la solicitud, busca en su base de datos la información requerida (listado o Pokémon específico) y prepara un paquete de respuesta.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="bg-purple-100 text-purple-700 font-bold rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">3</div>
                <div>
                  <h4 className="font-semibold text-gray-900">Respuesta (Response)</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    El servidor responde con un código de estado (ej. 200 OK) y el cuerpo del mensaje en formato <strong>JSON</strong>. Puedes ver este formato crudo cambiando a la vista "JSON".
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
        
        <div className="p-6 bg-gray-50 border-t border-gray-100 rounded-b-2xl">
          <p className="text-xs text-center text-gray-500">
            Esta aplicación fue construida con React, Tailwind CSS y la PokéAPI v2.
          </p>
        </div>
      </div>
    </div>
  );
};

// --- Main App Component ---

const App: React.FC = () => {
  const [pokemonList, setPokemonList] = useState<PokemonDetails[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'card' | 'json'>('card');
  const [showInfo, setShowInfo] = useState(false);
  
  const abortControllerRef = useRef<AbortController | null>(null);

  // Initial Load
  useEffect(() => {
    fetchInitialData();
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const fetchInitialData = async () => {
    if (abortControllerRef.current) abortControllerRef.current.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    setError(null);
    try {
      // 1. Get list of 20
      const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=20', { signal: controller.signal });
      if (!response.ok) throw new Error('Failed to fetch list');
      const data = await response.json();
      
      // 2. Get details for each
      const detailsPromises = data.results.map((p: PokemonListItem) => 
        fetch(p.url, { signal: controller.signal }).then(res => res.json())
      );
      const details = await Promise.all(detailsPromises);
      
      setPokemonList(details);
      return details;
    } catch (err: any) {
      if (err.name === 'AbortError') return;
      setError('Ocurrió un error al cargar los Pokémon. Por favor intenta más tarde.');
      console.error(err);
      return [] as PokemonDetails[];
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      fetchInitialData();
      return;
    }

    if (abortControllerRef.current) abortControllerRef.current.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    setError(null);
    try {
      const query = searchTerm.toLowerCase().trim();
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${query}`, { signal: controller.signal });
      
      if (response.status === 404) {
        setError(`No se encontró ningún Pokémon con el nombre o ID "${searchTerm}".`);
        setPokemonList([]);
        setLoading(false);
        return;
      }

      if (!response.ok) throw new Error('Error en la búsqueda');
      
      const data = await response.json();
      setPokemonList([data]); // Array with single result for consistent rendering
    } catch (err: any) {
      if (err.name === 'AbortError') return;
      setError('Ocurrió un error de conexión.');
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    fetchInitialData();
  };

  return (
    <div className="min-h-screen flex flex-col">
      
      {/* Header */}
      <header className="bg-red-600 text-white shadow-lg sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={clearSearch}>
            <div className="w-8 h-8 bg-white rounded-full border-4 border-gray-800 relative overflow-hidden shadow-inner">
               <div className="absolute top-1/2 w-full h-1 bg-gray-800 -translate-y-1/2"></div>
               <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-white border-2 border-gray-800 rounded-full -translate-x-1/2 -translate-y-1/2 z-10"></div>
            </div>
            <h1 className="font-bold text-xl tracking-tight">PokéAPI Explorer</h1>
          </div>

          <button 
            onClick={() => setShowInfo(true)}
            className="flex items-center gap-2 text-sm bg-red-700 hover:bg-red-800 px-3 py-1.5 rounded-lg transition-colors"
          >
            <Info size={18} />
            <span className="hidden sm:inline">Info & Docs</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        
        {/* Controls Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          
          {/* Search */}
          <form onSubmit={handleSearch} className="relative w-full md:w-96 group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400 group-focus-within:text-red-500 transition-colors" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent sm:text-sm transition-all shadow-sm"
              placeholder="Buscar por nombre o ID (ej. pikachu, 25)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button 
                type="button"
                onClick={clearSearch}
                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
              >
                <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </form>

          {/* Botón para obtener la lista en JSON (debajo del buscador) */}
          <div className="mt-2 md:mt-0 md:ml-0 w-full md:w-96">
            <button
              onClick={async () => {
                const data = await fetchInitialData();
                setViewMode('json');
                console.groupCollapsed('PokéAPI — Lista de Pokémon (JSON)');
                console.log(data);
                console.groupEnd();
              }}
              className="w-full md:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all text-gray-700 bg-white border border-gray-200 hover:bg-gray-50"
            >
              <Download size={18} />
              Obtener lista
            </button>
          </div>

          {/* View Toggles */}
          <div className="flex bg-white rounded-lg p-1 shadow-sm border border-gray-200">
            <button
              onClick={() => setViewMode('card')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                viewMode === 'card' 
                  ? 'bg-red-100 text-red-700 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Grid size={18} />
              Tarjetas
            </button>
            <button
              onClick={() => setViewMode('json')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                viewMode === 'json' 
                  ? 'bg-gray-800 text-white shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Code size={18} />
              JSON
            </button>
            
          </div>
        </div>

        {/* Content Area */}
        <div className="min-h-[400px]">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-pulse">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-gray-200 rounded-xl h-64 w-full"></div>
              ))}
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="bg-red-50 text-red-500 p-4 rounded-full mb-4">
                <Server size={48} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Algo salió mal</h3>
              <p className="text-gray-600 max-w-md">{error}</p>
              <button 
                onClick={clearSearch}
                className="mt-6 text-red-600 font-medium hover:text-red-800 underline"
              >
                Volver a intentar
              </button>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-end mb-4">
                <h2 className="text-lg font-semibold text-gray-700">
                  Resultados ({pokemonList.length})
                </h2>
                {viewMode === 'json' && (
                  <span className="text-xs text-gray-500 italic">Mostrando datos crudos de la API</span>
                )}
              </div>

              {viewMode === 'card' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {pokemonList.map((pokemon) => (
                    <PokemonCard key={pokemon.id} data={pokemon} />
                  ))}
                </div>
              ) : (
                <JsonView data={pokemonList.length === 1 ? pokemonList[0] : pokemonList} />
              )}
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-500">
            Datos provistos por <a href="https://pokeapi.co/" target="_blank" rel="noreferrer" className="text-red-600 hover:underline">PokéAPI</a>.
          </p>
        </div>
      </footer>

      {/* Documentation Modal */}
      <InfoModal isOpen={showInfo} onClose={() => setShowInfo(false)} />

    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);