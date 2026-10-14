import Link from "next/link";
import ArbitroLayout from "./demo/arbitro/layout";
import { fotos, LICENSE } from "./demo/arbitro/_ui/fotos";
import { Photo } from "./demo/arbitro/_ui/photo";

const hero = fotos.arbitroTarjeta;

/** Fila del resultado real de la app, en miniatura. */
const preview = [
  { label: "Decisión", mine: "Tiro libre directo", ok: true },
  { label: "Sanción", mine: "Tarjeta amarilla", ok: true },
  { label: "Regla", mine: "Regla 11", right: "Regla 12", ok: false },
];

/**
 * Bienvenida breve: presenta la plataforma en una pantalla y lleva a la
 * demostración existente. No crea cuentas ni simula autenticación.
 */
export default function Bienvenida() {
  return (
    <ArbitroLayout>
      <div className="rf-welcome">
        <div className="rf-welcome-photo">
          <Photo
            foto={hero}
            alt={hero.alt}
            sizes="(min-width: 1024px) 46vw, (min-width: 640px) 560px, 100vw"
            priority
          />
          <p className="rf-wordmark rf-welcome-mark rf-welcome-mark-photo">
            <span className="rf-mark" aria-hidden />
            Formación arbitral
          </p>
          <p className="rf-welcome-credit">
            Foto:{" "}
            <a href={hero.source} className="underline">
              {hero.author}
            </a>{" "}
            ·{" "}
            <a href={LICENSE.url} rel="license" className="underline">
              {LICENSE.name}
            </a>
          </p>
        </div>

        <main className="rf-welcome-body">
          <p className="rf-wordmark rf-welcome-mark rf-welcome-mark-body">
            <span className="rf-mark" aria-hidden />
            Formación arbitral
          </p>

          <figure
            className="rf-preview"
            aria-label="Vista de la app: así se ve el resultado de una práctica"
          >
            <figcaption className="rf-preview-head">
              <span className="rf-eyebrow">Tu resultado</span>
              <span className="rf-preview-verdict">Regla a corregir</span>
            </figcaption>
            <dl className="rf-preview-rows">
              {preview.map((r) => (
                <div key={r.label} data-ok={r.ok}>
                  <dt>{r.label}</dt>
                  <dd>
                    <span aria-hidden>{r.ok ? "✓" : "✗"}</span> {r.mine}
                    {r.right && (
                      <span className="rf-preview-right">
                        {" "}
                        → correcta: {r.right}
                      </span>
                    )}
                    <span className="sr-only">
                      {r.ok ? " (bien)" : " (a corregir)"}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </figure>

          <h1 className="rf-welcome-title">Decidí mejor en cada jugada.</h1>
          <p className="rf-welcome-lead">
            Practicá situaciones de juego, compará tu decisión con el criterio y
            sabé qué corregir antes del próximo partido.
          </p>

          <div className="rf-welcome-actions">
            <Link href="/demo/arbitro" className="rf-primary">
              Comenzar
            </Link>
            <Link href="/ingresar" className="rf-ghost">
              Ya tengo cuenta
            </Link>
          </div>
          <p className="rf-welcome-note">
            Demostración con datos ficticios. Proyecto independiente, sin
            vínculo institucional con la APF.
            <span className="rf-welcome-note-credit">
              {" "}
              Foto: {hero.author} ·{" "}
              <a href={LICENSE.url} rel="license" className="underline">
                {LICENSE.name}
              </a>
            </span>
          </p>
        </main>
      </div>
    </ArbitroLayout>
  );
}
