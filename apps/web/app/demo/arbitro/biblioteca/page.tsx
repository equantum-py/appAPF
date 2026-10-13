"use client";
import Link from "next/link";
import { useState } from "react";
import { PitchVideo } from "../../_components/pitch";
import { situations } from "../../_data";
const rules = ["Todas", "Faltas", "Mano", "Fuera de juego"];
export default function Biblioteca() {
  const [query, setQuery] = useState("");
  const [rule, setRule] = useState("Todas");
  const filtered = situations.filter(
    (s) =>
      (rule === "Todas" || s.rule === rule) &&
      s.title.toLocaleLowerCase("es").includes(query.toLocaleLowerCase("es")),
  );
  return (
    <div className="library-view">
      <div className="view-heading">
        <p className="app-eyebrow">PRÁCTICA A TU RITMO</p>
        <h1>Jugadas</h1>
        <p>Elegí una situación y poné a prueba tu criterio.</p>
      </div>
      <label className="search-field">
        <span aria-hidden>⌕</span>
        <input
          type="search"
          aria-label="Buscar jugadas"
          placeholder="Buscar una jugada"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </label>
      <div className="filter-chips" role="group" aria-label="Filtrar por regla">
        {rules.map((r) => (
          <button
            key={r}
            type="button"
            aria-pressed={rule === r}
            onClick={() => setRule(r)}
          >
            {r}
          </button>
        ))}
      </div>
      <p className="library-count" aria-live="polite">
        {filtered.length} jugadas disponibles · ejemplos ficticios
      </p>
      <div className="library-grid">
        {filtered.map((s) => (
          <Link
            href={`/demo/arbitro/jugada/${s.id}`}
            key={s.id}
            className="library-card"
          >
            <PitchVideo
              badge={<span className="scene-tag">{s.duration}</span>}
            />
            <div className="library-card-body">
              <span className="app-eyebrow">
                {s.rule} · nivel {s.difficulty}
              </span>
              <h2>{s.title}</h2>
              <span className="library-card-action">
                Practicar <span aria-hidden>→</span>
              </span>
            </div>
          </Link>
        ))}
      </div>
      {filtered.length === 0 ? (
        <p className="empty-search">
          No encontramos jugadas. Probá otra búsqueda o regla.
        </p>
      ) : null}
    </div>
  );
}
