import Link from "next/link";

const blocks = [
  "Objetivo de la sesión",
  "Material necesario",
  "Bloques ordenados",
  "Descansos e instrucciones",
  "Medición cuando corresponda",
];

export default function PhysicalSessionExamplePage() {
  return (
    <main className="rf-physical-preview rf-physical-session-page">
      <header className="rf-physical-preview-head">
        <div>
          <span className="rf-physical-kicker">SESIÓN DE EJEMPLO</span>
          <h1>Así se verá una sesión</h1>
          <p>
            Esta vista explica el recorrido previsto sin inventar cargas, tiempos ni rutinas reales.
          </p>
        </div>
        <Link href="/demo/arbitro/fisico" className="rf-physical-back">
          ← Preparación física
        </Link>
      </header>

      <section className="rf-physical-session-detail">
        <div className="rf-physical-session-detail-main">
          <span className="rf-physical-demo-pill rf-physical-demo-pill-dark">Preview · contenido no validado</span>
          <h2>Sesión guiada de ejemplo</h2>
          <p>
            En producción, este espacio mostrará únicamente contenido aprobado por el responsable físico: objetivo, nivel, material, duración estimada, bloques, protocolo y versión.
          </p>
          <div className="rf-physical-session-blocks">
            {blocks.map((block, index) => (
              <div key={block} className="rf-physical-session-block">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <strong>{block}</strong>
                  <small>Pendiente de contenido especialista</small>
                </div>
              </div>
            ))}
          </div>
        </div>
        <aside className="rf-physical-session-aside">
          <span className="rf-physical-kicker">ESTADO</span>
          <h3>No iniciar entrenamiento</h3>
          <p>
            Esta pantalla no registra actividad. Cuando el módulo real exista, iniciar una sesión creará una ejecución identificable y trazable.
          </p>
          <button type="button" disabled>
            Iniciar sesión
          </button>
        </aside>
      </section>
    </main>
  );
}
