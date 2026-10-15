import Link from "next/link";
import { Icon } from "../_ui/icons";

const categories = [
  { name: "Resistencia", detail: "Base aeróbica y continuidad" },
  { name: "Velocidad", detail: "Aceleración y cambios de ritmo" },
  { name: "Fuerza", detail: "Trabajo complementario" },
  { name: "Movilidad", detail: "Preparación y recuperación" },
];

const sessions = [
  {
    title: "Sesión guiada de ejemplo",
    meta: "Preview · contenido por validar",
    description:
      "Muestra cómo se presentarán objetivo, bloques, materiales y registro. No guarda resultados ni prescribe cargas reales.",
  },
  {
    title: "Historial de entrenamiento",
    meta: "Preview · sin datos persistidos",
    description:
      "Vista prevista para consultar sesiones completadas, abandonadas y mediciones cuando el módulo funcional esté habilitado.",
  },
];

export default function PhysicalPreviewPage() {
  return (
    <main className="rf-physical-preview">
      <header className="rf-physical-preview-head">
        <div>
          <span className="rf-physical-kicker">PREVIEW NAVEGABLE</span>
          <h1>Preparación física</h1>
          <p>
            Propuesta visual aprobada. Esta pantalla usa datos ficticios y no guarda entrenamientos.
          </p>
        </div>
        <Link href="/demo/arbitro" className="rf-physical-back">
          ← Inicio
        </Link>
      </header>

      <section className="rf-physical-hero" aria-labelledby="physical-hero-title">
        <div className="rf-physical-hero-copy">
          <span className="rf-physical-icon-large">
            <Icon name="correr" filled={false} className="size-8" />
          </span>
          <div>
            <span className="rf-physical-kicker rf-physical-kicker-light">PRIORIDAD DEL ÁRBITRO</span>
            <h2 id="physical-hero-title">Entrená tu rendimiento físico</h2>
            <p>
              Sesiones organizadas por objetivo, historial y progreso. Las rutinas reales deben ser validadas por un responsable físico especializado.
            </p>
          </div>
        </div>
        <span className="rf-physical-demo-pill">Demo · sin persistencia</span>
      </section>

      <section className="rf-physical-section" aria-labelledby="physical-categories-title">
        <div className="rf-physical-section-heading">
          <div>
            <span className="rf-physical-kicker">CATEGORÍAS</span>
            <h2 id="physical-categories-title">¿Qué querés trabajar?</h2>
          </div>
          <span>Contenido pendiente de validación</span>
        </div>
        <div className="rf-physical-category-grid">
          {categories.map((category) => (
            <button key={category.name} type="button" className="rf-physical-category">
              <span>{category.name}</span>
              <small>{category.detail}</small>
              <span aria-hidden>→</span>
            </button>
          ))}
        </div>
      </section>

      <section className="rf-physical-section" aria-labelledby="physical-sessions-title">
        <div className="rf-physical-section-heading">
          <div>
            <span className="rf-physical-kicker">SESIONES GUIADAS</span>
            <h2 id="physical-sessions-title">Tu entrenamiento</h2>
          </div>
        </div>
        <div className="rf-physical-session-list">
          {sessions.map((session, index) => (
            <article key={session.title} className="rf-physical-session">
              <div className="rf-physical-session-number">0{index + 1}</div>
              <div>
                <span className="rf-physical-session-meta">{session.meta}</span>
                <h3>{session.title}</h3>
                <p>{session.description}</p>
              </div>
              {index === 0 ? (
                <Link href="/demo/arbitro/fisico/sesion-ejemplo" className="rf-physical-session-link">
                  Ver sesión →
                </Link>
              ) : (
                <span className="rf-physical-session-disabled">Sin datos reales</span>
              )}
            </article>
          ))}
        </div>
      </section>

      <aside className="rf-physical-notice">
        <strong>Importante:</strong> esta preview no habilita entrenamiento físico real, no persiste respuestas y no representa criterios oficiales de la APF.
      </aside>
    </main>
  );
}
