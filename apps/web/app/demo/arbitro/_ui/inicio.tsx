import Image from "next/image";
import Link from "next/link";
import hero from "../_premium/apf-hero.jpg";
import jugadas from "../_premium/apf-jugadas.jpg";
import reglas from "../_premium/apf-reglas.jpg";
import logo from "../_premium/apf-logo.png";
import { Icon } from "./icons";

/** Inicio según referencia suministrada; sólo UI de demo, sin entrenamiento persistido. */
export function Inicio() {
  return (
    <div className="rf-premium-home">
      <section className="rf-premium-hero" aria-labelledby="premium-title">
        <Image src={hero} alt="" fill priority sizes="(min-width: 440px) 440px, 100vw" className="rf-premium-photo" />
        <header className="rf-premium-header">
          <svg width="0" height="0" aria-hidden focusable="false">
            <defs><filter id="apf-logo-on-dark" colorInterpolationFilters="sRGB">
              <feColorMatrix type="matrix" values="1 0 -1.179 0 1.179 0 1 -1.085 0 1.085 0 0 0 0 1 0 0 0 1 0" />
            </filter></defs>
          </svg>
          <Link href="/demo/arbitro" className="rf-premium-logo">
            <Image src={logo} alt="APF — Plataforma arbitral" width={160} height={46} priority />
          </Link>
          <Link href="/demo/arbitro/yo" className="rf-premium-profile" aria-label="Mi perfil">
            <Icon name="yo" filled={false} className="size-6" />
            <span aria-hidden />
          </Link>
        </header>
        <div className="rf-premium-copy">
          <h1 id="premium-title"><span>ENTRENÁ</span>{" "}<span>TU CRITERIO</span></h1>
          <p>Mejores decisiones.<br />Mejores partidos.</p>
          <Link href="/demo/arbitro/jugada/entrada-mediocampo" className="rf-premium-start">
            Comenzar entrenamiento <span aria-hidden>→</span>
          </Link>
        </div>
      </section>
      <section className="rf-premium-training" aria-labelledby="premium-training-title">
        <h2 id="premium-training-title">¿Qué quieres entrenar hoy?</h2>

        <Link href="/demo/arbitro/fisico" className="rf-premium-physical" aria-label="Abrir preview de Preparación física">
          <span className="rf-premium-physical-icon"><Icon name="correr" filled={false} className="size-6" /></span>
          <span className="rf-premium-physical-copy">
            <span>Preparación física</span>
            <small>Mejorá tu rendimiento como árbitro.</small>
          </span>
          <span className="rf-premium-soon">Preview</span>
          <span className="rf-premium-lock" aria-hidden>→</span>
        </Link>

        <div className="rf-premium-cards">
          <Link href="/demo/arbitro/entrenar" className="rf-premium-card" aria-label="Jugadas">
            <Image src={jugadas} alt="" fill sizes="(min-width: 440px) 204px, 46vw" className="rf-premium-photo" />
            <span className="rf-premium-card-content">
              <span className="rf-premium-icon"><Icon name="video" filled={false} className="size-6" /></span>
              <span className="rf-premium-card-title">Jugadas</span>
              <span className="rf-premium-card-detail">Poné a prueba<br />tus decisiones.</span>
              <span className="rf-premium-card-arrow" aria-hidden>→</span>
            </span>
          </Link>
          <Link href="/demo/arbitro/entrenar#reglas" className="rf-premium-card rf-premium-rules" aria-label="Reglas del juego">
            <Image src={reglas} alt="" fill sizes="(min-width: 440px) 204px, 46vw" className="rf-premium-photo" />
            <span className="rf-premium-card-content">
              <span className="rf-premium-icon"><Icon name="libro" filled={false} className="size-6" /></span>
              <span className="rf-premium-card-title">Reglas<br />del juego</span>
              <span className="rf-premium-card-detail">Dominá cada<br />situación.</span>
              <span className="rf-premium-card-arrow" aria-hidden>→</span>
            </span>
          </Link>
        </div>
      </section>
    </div>
  );
}
