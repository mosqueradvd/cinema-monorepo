export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
    ...options,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API ${res.status}: ${text}`);
  }
  return res.json();
}

export const api = {
  // Movies
  listMovies: () => request('/movies'),
  createMovie: (body: { title: string; description?: string; durationMin: number }) =>
    request('/movies', { method: 'POST', body: JSON.stringify(body) }),
  deleteMovie: (id: number) => request(`/movies/${id}`, { method: 'DELETE' }),

  // Halls
  listHalls: () => request('/halls'),
  createHall: (body: { name: string; capacity: number }) =>
    request('/halls', { method: 'POST', body: JSON.stringify(body) }),
  deleteHall: (id: number) => request(`/halls/${id}`, { method: 'DELETE' }),

  // Showtimes
  listShowtimes: () => request('/showtimes'),
  createShowtime: (body: { movieId: number; hallId: number; startsAt: string }) =>
    request('/showtimes', { method: 'POST', body: JSON.stringify(body) }),
  deleteShowtime: (id: number) => request(`/showtimes/${id}`, { method: 'DELETE' }),

  // Tickets
  purchaseTicket: (showtimeId: number) =>
    request('/tickets/purchase', { method: 'POST', body: JSON.stringify({ showtimeId }) }),
};


