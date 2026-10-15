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

        <Link href="/demo/arbitro/fisico" aria-label="Explorar preparación física, preview" className="relative mb-4 flex min-h-[190px] overflow-hidden rounded-[22px] bg-[#082a43] text-white shadow-lg">
          <Image src={hero} alt="" fill sizes="(min-width: 440px) 440px, 100vw" className="object-cover object-center opacity-30" />
          <span className="relative z-10 flex w-full flex-col justify-between gap-4 p-5">
            <span className="flex items-center justify-between gap-2"><span className="rounded-full bg-[#38c5f4] px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-[#062b43]">Entrenamiento destacado</span><span className="text-xs text-white/80">Preview</span></span>
            <span><span className="block text-[27px] font-bold leading-tight tracking-tight">Preparación física</span><span className="mt-1 block text-[13px] text-white/85">Tu rendimiento también se entrena.</span></span>
            <span className="flex w-fit items-center gap-3 rounded-full bg-[#38c5f4] px-5 py-3 text-[13px] font-bold text-[#062b43]">Explorar preparación física <span aria-hidden>→</span></span>
          </span>
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
