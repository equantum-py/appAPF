import Link from "next/link";
import { PitchVideo, PitchThumb } from "../_components/pitch";
import { situations, progressByRule } from "../_data";
export default function ArbitroInicio() {
  const total = progressByRule.reduce((sum, r) => sum + r.total, 0);
  const ok = progressByRule.reduce((sum, r) => sum + r.ok, 0);
  return (
    <div className="home-dashboard">
      <div className="home-heading">
        <div>
          <p className="app-eyebrow">TU ENTRENAMIENTO</p>
          <h1>Hola, árbitro</h1>
          <p>Una jugada. Una mejor decisión.</p>
        </div>
        <span className="streak">
          <span aria-hidden>↗</span> 4 días
          <br />
          <small>de práctica</small>
        </span>
      </div>
      <div className="dashboard-grid">
        <section className="training-card">
          <div className="training-top">
            <span className="app-eyebrow">PRÁCTICA DE HOY</span>
            <span className="training-count">4 jugadas · demo</span>
          </div>
          <h2>Entrená tu criterio.</h2>
          <p>Observá, decidí y revisá el porqué.</p>
          <div className="training-pitch">
            <PitchVideo
              badge={<span className="scene-tag">Faltas · nivel medio</span>}
            />
          </div>
          <Link
            href={`/demo/arbitro/jugada/${situations[0].id}`}
            className="app-primary"
          >
            Entrenar ahora <span aria-hidden>↗</span>
          </Link>
        </section>
        <div className="home-secondary">
          <Link href="/demo/arbitro/progreso" className="progress-tile">
            <div className="tile-heading">
              <h2>Tu progreso</h2>
              <span aria-hidden>↗</span>
            </div>
            <div className="progress-number">
              {Math.round((ok / total) * 100)}
              <span>%</span>
              <small>aciertos</small>
            </div>
            <div className="mini-bars" aria-hidden>
              {[35, 52, 43, 68, 62, 76, 83].map((height, i) => (
                <span key={i} style={{ height: `${height}%` }} />
              ))}
            </div>
            <div className="tile-foot">
              <span>{total} jugadas respondidas</span>
              <span>Ver detalle →</span>
            </div>
          </Link>
          <Link href="/demo/arbitro/feedback" className="review-tile">
            <span className="review-avatar">IN</span>
            <div>
              <span className="app-eyebrow">REVISIÓN DEL INSTRUCTOR</span>
              <h2>Tenés algo para revisar</h2>
              <p>3 anotaciones en tu última jugada</p>
            </div>
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
      <section className="continue-section">
        <div className="section-heading">
          <h2>Para seguir practicando</h2>
          <Link href="/demo/arbitro/biblioteca">Ver jugadas →</Link>
        </div>
        <div className="suggested-grid">
          {situations.slice(1, 3).map((s) => (
            <Link
              key={s.id}
              href={`/demo/arbitro/jugada/${s.id}`}
              className="suggested-row"
            >
              <PitchThumb className="h-16 w-20" />
              <div>
                <span className="app-eyebrow">{s.rule}</span>
                <h3>{s.title}</h3>
                <p>
                  {s.duration} · nivel {s.difficulty}
                </p>
              </div>
              <span aria-hidden>›</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
