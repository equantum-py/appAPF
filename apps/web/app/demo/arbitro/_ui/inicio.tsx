import Link from "next/link";
import { fotos } from "./fotos";
import { Icon } from "./icons";
import { Photo } from "./photo";

export function Inicio() {
  return (
    <div className="rf-training-home">
      <section aria-labelledby="entrenamiento-hoy">
        <h1 id="entrenamiento-hoy">¿Qué vas a entrenar hoy?</h1>
        <div className="rf-home-options">
          <Link href="/demo/arbitro/entrenar" className="rf-photo-link rf-photo-category">
            <Photo foto={fotos.arbitrosSorteo} sizes="(min-width: 1024px) 440px, (min-width: 480px) 440px, 100vw" priority />
            <span className="rf-photo-link-copy">
              <span className="rf-photo-link-title">Decisiones de juego</span>
              <span className="rf-photo-link-detail">Ejercicios de demostración</span>
            </span>
          </Link>
          <div className="rf-photo-link rf-photo-category rf-photo-physical">
            <Photo foto={fotos.calentamiento} sizes="(min-width: 480px) 440px, 100vw" />
            <span className="rf-photo-link-copy">
              <span className="rf-photo-link-title">Preparación física</span>
              <span className="rf-coming-soon">Próximamente</span>
            </span>
          </div>
        </div>
      </section>
      <section aria-labelledby="segui-aprendiendo">
        <h2 id="segui-aprendiendo">Seguí aprendiendo</h2>
        <div className="rf-home-options">
          <Link href="/demo/arbitro/entrenar#reglas" className="rf-photo-link rf-photo-learning">
            <Photo foto={fotos.asistenteBandera} sizes="(min-width: 480px) 440px, 100vw" />
            <Icon name="libro" filled={false} className="rf-photo-link-icon" />
            <span className="rf-photo-link-copy">
              <span className="rf-photo-link-title">Reglas del juego</span>
              <span className="rf-photo-link-detail">Consultá el criterio de cada práctica</span>
            </span>
          </Link>
          <Link href="/demo/arbitro/progreso" className="rf-photo-link rf-photo-learning">
            <Photo foto={fotos.disputaHombro} sizes="(min-width: 480px) 440px, 100vw" />
            <Icon name="lista" filled={false} className="rf-photo-link-icon" />
            <span className="rf-photo-link-copy">
              <span className="rf-photo-link-title">Tus resultados</span>
              <span className="rf-photo-link-detail">Revisá los ejemplos de la demo</span>
            </span>
          </Link>
        </div>
      </section>
      <p className="rf-home-disclaimer">
        Fotos de referencia · Demo sin guardado.{" "}
        <Link href="/demo/arbitro/yo#creditos">Créditos</Link>
      </p>
    </div>
  );
}
