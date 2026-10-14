import Link from "next/link";
import { fotos } from "./fotos";
import { Icon } from "./icons";
import { Photo } from "./photo";

export function Inicio() {
  return (
    <div className="rf-simple-home">
      <figure className="rf-simple-hero">
        <Photo foto={fotos.arbitrosSorteo} sizes="(min-width: 1024px) 500px, (min-width: 480px) 480px, 100vw" priority />
        <figcaption>
          <Link href="/demo/arbitro/yo#creditos">Foto de referencia</Link>
        </figcaption>
      </figure>
      <section className="rf-simple-actions" aria-labelledby="entrenamiento-hoy">
        <h1 id="entrenamiento-hoy">¿Qué vas a entrenar?</h1>
        <Link href="/demo/arbitro/entrenar" className="rf-simple-access rf-simple-primary">
          <Icon name="silbato" filled={false} className="size-7" />
          <span>Jugadas</span>
          <span className="rf-simple-arrow" aria-hidden>→</span>
        </Link>
        <Link href="/demo/arbitro/entrenar#reglas" className="rf-simple-access">
          <Icon name="libro" filled={false} className="size-7" />
          <span>Reglas del juego</span>
          <span className="rf-simple-arrow" aria-hidden>→</span>
        </Link>
        <div className="rf-simple-access rf-simple-pending">
          <Icon name="correr" filled={false} className="size-7" />
          <span>Preparación física</span>
          <span className="rf-simple-soon">Próximamente</span>
        </div>
      </section>
    </div>
  );
}
