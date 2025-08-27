"use client";
import { useEffect, useState } from "react";
import { api } from "./api";
import Toast from "./components/Toast";

type Movie = { id: number; title: string; description?: string; durationMin: number };
type Hall = { id: number; name: string; capacity: number };
type Showtime = { 
  id: number; 
  startsAt: string; 
  movie: Movie; 
  hall: Hall;
  ticketsSold: number;
  isSoldOut: boolean;
};

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [halls, setHalls] = useState<Hall[]>([]);
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [movieForm, setMovieForm] = useState({ title: "", description: "", durationMin: 120 });
  const [hallForm, setHallForm] = useState({ name: "", capacity: 50 });
  const [showtimeForm, setShowtimeForm] = useState({ movieId: 0, hallId: 0, startsAt: "" });
  
  // Toast state
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error';
    isVisible: boolean;
  }>({
    message: '',
    type: 'success',
    isVisible: false
  });

  async function refresh() {
    try {
      setLoading(true);
      console.log("Loading data...");
      const [m, h, s] = await Promise.all([
        api.listMovies(),
        api.listHalls(),
        api.listShowtimes(),
      ]);
      console.log("Data loaded:", { movies: m, halls: h, showtimes: s });
      setMovies(m as Movie[]);
      setHalls(h as Hall[]);
      setShowtimes(s as Showtime[]);
    } catch (e: any) {
      console.error("Error loading data:", e);
      showToast("Error al cargar datos", 'error');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({
      message,
      type,
      isVisible: true
    });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  const handleSubmit = async (formType: 'movie' | 'hall' | 'showtime', data: any) => {
    try {
      setSubmitting(true);
      switch (formType) {
        case 'movie':
          await api.createMovie(data);
          setMovieForm({ title: "", description: "", durationMin: 120 });
          showToast("Película creada exitosamente!", 'success');
          break;
        case 'hall':
          await api.createHall(data);
          setHallForm({ name: "", capacity: 50 });
          showToast("Sala creada exitosamente!", 'success');
          break;
        case 'showtime':
          await api.createShowtime(data);
          setShowtimeForm({ movieId: 0, hallId: 0, startsAt: "" });
          showToast("Función creada exitosamente!", 'success');
          break;
      }
      await refresh();
    } catch (e: any) {
      // Clean error message - extract only the user-friendly message
      let errorMessage = 'Error al crear elemento';
      
      if (e.message) {
        if (e.message.includes('API')) {
          // Extract message from API error format
          const match = e.message.match(/API \d+: (.+)/);
          errorMessage = match ? match[1] : 'Error al crear elemento';
        } else if (e.message.includes('Capacidad de la sala alcanzada')) {
          errorMessage = 'Capacidad de la sala alcanzada';
        } else if (e.message.includes('No se pueden crear funciones en el pasado')) {
          errorMessage = 'No se pueden crear funciones en el pasado';
        } else {
          errorMessage = e.message;
        }
      }
      
      showToast(errorMessage, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (type: 'movie' | 'hall' | 'showtime', id: number) => {
    try {
      setSubmitting(true);
      switch (type) {
        case 'movie':
          await api.deleteMovie(id);
          showToast("Película eliminada exitosamente!", 'success');
          break;
        case 'hall':
          await api.deleteHall(id);
          showToast("Sala eliminada exitosamente!", 'success');
          break;
        case 'showtime':
          await api.deleteShowtime(id);
          showToast("Función eliminada exitosamente!", 'success');
          break;
      }
      await refresh();
    } catch (e: any) {
      let errorMessage = 'Error al eliminar elemento';
      
      if (e.message) {
        if (e.message.includes('API')) {
          const match = e.message.match(/API \d+: (.+)/);
          errorMessage = match ? match[1] : 'Error al eliminar elemento';
        } else {
          errorMessage = e.message;
        }
      }
      
      showToast(errorMessage, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePurchaseTicket = async (showtimeId: number) => {
    try {
      setSubmitting(true);
      await api.purchaseTicket(showtimeId);
      showToast("Ticket vendido exitosamente!", 'success');
      await refresh();
    } catch (e: any) {
      let errorMessage = 'Error al vender ticket';
      
      if (e.message) {
        if (e.message.includes('API')) {
          const match = e.message.match(/API \d+: (.+)/);
          errorMessage = match ? match[1] : 'Error al vender ticket';
        } else if (e.message.includes('Capacidad de la sala alcanzada')) {
          errorMessage = 'Capacidad de la sala alcanzada';
        } else {
          errorMessage = e.message;
        }
      }
      
      showToast(errorMessage, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            🎬 Cine Admin
          </h1>
          <p className="text-slate-300 text-lg">
            Gestiona películas, salas, funciones y ventas de tu cine.
          </p>
        </div>

        {/* Debug Info */}
        <div className="bg-blue-600 text-white p-4 rounded-lg mb-6 text-center">
          <p>Loading: {loading ? 'Sí' : 'No'}</p>
          <p>Movies: {movies.length}</p>
          <p>Halls: {halls.length}</p>
          <p>Showtimes: {showtimes.length}</p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Panel de Películas */}
          <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700">
            <h2 className="text-white text-xl font-bold mb-6 flex items-center gap-2">
              🎞️ Películas
            </h2>
            
            {/* Formulario */}
            <div className="bg-slate-700 rounded-lg p-4 mb-6">
              <h3 className="text-white font-semibold mb-4">Añadir Película</h3>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  await handleSubmit('movie', movieForm);
                }}
                className="space-y-3"
              >
                <input
                  placeholder="Título de la película"
                  value={movieForm.title}
                  onChange={(e) => setMovieForm({ ...movieForm, title: e.target.value })}
                  required
                  disabled={submitting}
                  className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white placeholder-slate-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                <input
                  placeholder="Descripción (opcional)"
                  value={movieForm.description}
                  onChange={(e) => setMovieForm({ ...movieForm, description: e.target.value })}
                  disabled={submitting}
                  className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white placeholder-slate-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                <input
                  type="number"
                  placeholder="Duración (min)"
                  value={movieForm.durationMin}
                  onChange={(e) => setMovieForm({ ...movieForm, durationMin: Number(e.target.value) })}
                  required
                  min="1"
                  disabled={submitting}
                  className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white placeholder-slate-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                <button 
                  type="submit" 
                  disabled={submitting}
                  className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting ? "Añadiendo..." : "➕ Añadir Película"}
                </button>
              </form>
            </div>

            {/* Lista */}
            <div className="space-y-3">
              {movies.map((m) => (
                <div key={m.id} className="bg-slate-700 rounded-lg p-4 border border-slate-600">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-white font-semibold text-lg">{m.title}</h3>
                      {m.description && <p className="text-slate-300 text-sm mt-1">{m.description}</p>}
                      <p className="text-slate-400 text-xs mt-1">Duración: {m.durationMin} minutos</p>
                    </div>
                    <button 
                      className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-1"
                      onClick={async () => await handleDelete('movie', m.id)}
                      disabled={submitting}
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
                </div>
              ))}
              {movies.length === 0 && (
                <div className="text-center text-slate-400 italic py-8 bg-slate-700 rounded-lg border border-slate-600">
                  No hay películas añadidas aún
                </div>
              )}
            </div>
          </div>

          {/* Panel de Salas */}
          <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700">
            <h2 className="text-white text-xl font-bold mb-6 flex items-center gap-2">
              🏢 Salas de Cine
            </h2>
            
            {/* Formulario */}
            <div className="bg-slate-700 rounded-lg p-4 mb-6">
              <h3 className="text-white font-semibold mb-4">Añadir Sala</h3>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  await handleSubmit('hall', hallForm);
                }}
                className="space-y-3"
              >
                <input
                  placeholder="Nombre de la sala"
                  value={hallForm.name}
                  onChange={(e) => setHallForm({ ...hallForm, name: e.target.value })}
                  required
                  disabled={submitting}
                  className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white placeholder-slate-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                <input
                  type="number"
                  placeholder="Capacidad"
                  value={hallForm.capacity}
                  onChange={(e) => setHallForm({ ...hallForm, capacity: Number(e.target.value) })}
                  required
                  min="1"
                  disabled={submitting}
                  className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white placeholder-slate-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                <button 
                  type="submit" 
                  disabled={submitting}
                  className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting ? "Añadiendo..." : "➕ Añadir Sala"}
                </button>
              </form>
            </div>

            {/* Lista */}
            <div className="space-y-3">
              {halls.map((h) => (
                <div key={h.id} className="bg-slate-700 rounded-lg p-4 border border-slate-600">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-white font-semibold text-lg">{h.name}</h3>
                      <p className="text-slate-400 text-xs mt-1">{h.capacity} asientos</p>
                    </div>
                    <button 
                      className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-1"
                      onClick={async () => await handleDelete('hall', h.id)}
                      disabled={submitting}
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
                </div>
              ))}
              {halls.length === 0 && (
                <div className="text-center text-slate-400 italic py-8 bg-slate-700 rounded-lg border border-slate-600">
                  No hay salas añadidas aún
                </div>
              )}
            </div>
          </div>

          {/* Panel de Funciones */}
          <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700">
            <h2 className="text-white text-xl font-bold mb-6 flex items-center gap-2">
              🎭 Funciones
            </h2>
            
            {/* Formulario */}
            <div className="bg-slate-700 rounded-lg p-4 mb-6">
              <h3 className="text-white font-semibold mb-4">Crear Función</h3>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  await handleSubmit('showtime', {
                    movieId: showtimeForm.movieId,
                    hallId: showtimeForm.hallId,
                    startsAt: new Date(showtimeForm.startsAt).toISOString()
                  });
                }}
                className="space-y-3"
              >
                <select
                  value={showtimeForm.movieId}
                  onChange={(e) => setShowtimeForm({ ...showtimeForm, movieId: Number(e.target.value) })}
                  required
                  disabled={submitting || movies.length === 0}
                  className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  <option value={0}>Seleccionar película</option>
                  {movies.map((m) => (
                    <option key={m.id} value={m.id}>{m.title}</option>
                  ))}
                </select>
                <select
                  value={showtimeForm.hallId}
                  onChange={(e) => setShowtimeForm({ ...showtimeForm, hallId: Number(e.target.value) })}
                  required
                  disabled={submitting || halls.length === 0}
                  className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  <option value={0}>Seleccionar sala</option>
                  {halls.map((h) => (
                    <option key={h.id} value={h.id}>{h.name}</option>
                  ))}
                </select>
                <input
                  type="datetime-local"
                  value={showtimeForm.startsAt}
                  onChange={(e) => setShowtimeForm({ ...showtimeForm, startsAt: e.target.value })}
                  required
                  disabled={submitting}
                  className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                <button 
                  type="submit" 
                  disabled={submitting || movies.length === 0 || halls.length === 0}
                  className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting ? "Creando..." : "➕ Crear Función"}
                </button>
              </form>
            </div>

            {/* Lista */}
            <div className="space-y-3">
              {showtimes.map((s) => (
                <div key={s.id} className={`bg-slate-700 rounded-lg p-4 border ${s.isSoldOut ? 'border-red-500 bg-red-900/20' : 'border-slate-600'}`}>
                  <div className="mb-3">
                    <h3 className="text-white font-semibold text-lg">{s.movie.title}</h3>
                    <p className="text-slate-300 text-sm mt-1">
                      📅 {new Date(s.startsAt).toLocaleString()}
                    </p>
                    <p className="text-slate-400 text-xs mt-1">
                      🏢 {s.hall.name} ({s.hall.capacity} asientos)
                    </p>
                    <div className="mt-2">
                      <p className={`text-sm font-medium ${s.isSoldOut ? 'text-red-400' : 'text-green-400'}`}>
                        🎫 Tickets vendidos: {s.ticketsSold || 0} / {s.hall.capacity}
                      </p>
                      {s.isSoldOut && (
                        <p className="text-red-400 text-xs mt-1 font-semibold">
                          ⚠️ AGOTADO - No hay más asientos disponibles
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      className={`flex-1 px-3 py-1 text-white text-sm rounded transition-colors disabled:opacity-50 flex items-center justify-center gap-1 ${
                        s.isSoldOut 
                          ? 'bg-red-600 cursor-not-allowed' 
                          : 'bg-slate-600 hover:bg-slate-500'
                      }`}
                      onClick={async () => await handlePurchaseTicket(s.id)}
                      disabled={submitting || s.isSoldOut}
                    >
                      {s.isSoldOut ? '❌ AGOTADO' : '🛒 Vender Ticket'}
                    </button>
                    <button 
                      className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-1"
                      onClick={async () => await handleDelete('showtime', s.id)}
                      disabled={submitting}
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
                </div>
              ))}
              {showtimes.length === 0 && (
                <div className="text-center text-slate-400 italic py-8 bg-slate-700 rounded-lg border border-slate-600">
                  No hay funciones programadas aún
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Toast Component */}
      <Toast 
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </div>
  );
}
