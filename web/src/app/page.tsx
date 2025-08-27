"use client";
import { useEffect, useState } from "react";
import styles from "./page.module.css";
import { api } from "./api";

type Movie = { id: number; title: string; description?: string; durationMin: number };
type Hall = { id: number; name: string; capacity: number };
type Showtime = { id: number; startsAt: string; movie: Movie; hall: Hall };

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [halls, setHalls] = useState<Hall[]>([]);
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);

  const [movieForm, setMovieForm] = useState({ title: "", description: "", durationMin: 120 });
  const [hallForm, setHallForm] = useState({ name: "", capacity: 50 });
  const [showtimeForm, setShowtimeForm] = useState({ movieId: 0, hallId: 0, startsAt: "" });
  const [error, setError] = useState<string>("");

  async function refresh() {
    try {
      const [m, h, s] = await Promise.all([
        api.listMovies(),
        api.listHalls(),
        api.listShowtimes(),
      ]);
      setMovies(m);
      setHalls(h);
      setShowtimes(s);
    } catch (e: any) {
      setError(e.message || "Error fetching data");
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>Cine Admin</h1>
        {error && <p style={{ color: 'red' }}>{error}</p>}

        <section>
          <h2>Movies</h2>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              await api.createMovie(movieForm);
              setMovieForm({ title: "", description: "", durationMin: 120 });
              await refresh();
            }}
          >
            <input
              placeholder="Title"
              value={movieForm.title}
              onChange={(e) => setMovieForm({ ...movieForm, title: e.target.value })}
              required
            />
            <input
              placeholder="Description"
              value={movieForm.description}
              onChange={(e) => setMovieForm({ ...movieForm, description: e.target.value })}
            />
            <input
              type="number"
              placeholder="Duration (min)"
              value={movieForm.durationMin}
              onChange={(e) => setMovieForm({ ...movieForm, durationMin: Number(e.target.value) })}
              required
            />
            <button type="submit">Add</button>
          </form>
          <ul>
            {movies.map((m) => (
              <li key={m.id}>
                {m.title} ({m.durationMin}m)
                <button onClick={async () => { await api.deleteMovie(m.id); await refresh(); }}>Delete</button>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2>Halls</h2>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              await api.createHall(hallForm);
              setHallForm({ name: "", capacity: 50 });
              await refresh();
            }}
          >
            <input
              placeholder="Name"
              value={hallForm.name}
              onChange={(e) => setHallForm({ ...hallForm, name: e.target.value })}
              required
            />
            <input
              type="number"
              placeholder="Capacity"
              value={hallForm.capacity}
              onChange={(e) => setHallForm({ ...hallForm, capacity: Number(e.target.value) })}
              required
            />
            <button type="submit">Add</button>
          </form>
          <ul>
            {halls.map((h) => (
              <li key={h.id}>
                {h.name} (cap: {h.capacity})
                <button onClick={async () => { await api.deleteHall(h.id); await refresh(); }}>Delete</button>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2>Showtimes</h2>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              await api.createShowtime(showtimeForm);
              setShowtimeForm({ movieId: 0, hallId: 0, startsAt: "" });
              await refresh();
            }}
          >
            <select
              value={showtimeForm.movieId}
              onChange={(e) => setShowtimeForm({ ...showtimeForm, movieId: Number(e.target.value) })}
              required
            >
              <option value={0}>Select movie</option>
              {movies.map((m) => (
                <option key={m.id} value={m.id}>{m.title}</option>
              ))}
            </select>
            <select
              value={showtimeForm.hallId}
              onChange={(e) => setShowtimeForm({ ...showtimeForm, hallId: Number(e.target.value) })}
              required
            >
              <option value={0}>Select hall</option>
              {halls.map((h) => (
                <option key={h.id} value={h.id}>{h.name}</option>
              ))}
            </select>
            <input
              type="datetime-local"
              value={showtimeForm.startsAt}
              onChange={(e) => setShowtimeForm({ ...showtimeForm, startsAt: new Date(e.target.value).toISOString() })}
              required
            />
            <button type="submit">Add</button>
          </form>
          <ul>
            {showtimes.map((s) => (
              <li key={s.id}>
                {new Date(s.startsAt).toLocaleString()} — {s.movie.title} @ {s.hall.name}
                <button onClick={async () => { await api.purchaseTicket(s.id); alert('Ticket purchased'); }}>Buy ticket</button>
                <button onClick={async () => { await api.deleteShowtime(s.id); await refresh(); }}>Delete</button>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
