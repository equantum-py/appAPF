import Link from "next/link";
import { decisions, labelOf, progressByRule, sanctions } from "../../../_data";
import { byId, fotoOf, lawOf, pastAnswers, resultHref } from "../../_ui/data";
import { Photo } from "../../_ui/photo";

export default function ProgresoPage() {
  return (
    <>
      <h1 className="rf-page-title">Progreso</h1>
      <p className="rf-lead">
        Cómo vienen tus decisiones en cada tema. Datos ficticios de la demo.
      </p>

      <h2 className="rf-eyebrow rf-section-title mt-6">Por tema</h2>
      <ul className="rf-list">
        {progressByRule.map((r) => (
          <li key={r.rule} className="py-4">
            <div className="flex items-baseline justify-between gap-3">
              <span className="rf-row-title">{r.rule}</span>
              <span className="rf-byline mt-0">
                <strong>{r.ok}</strong> de {r.total} decisiones bien
              </span>
            </div>
            <div
              className="rf-bar"
              role="img"
              aria-label={`${r.ok} de ${r.total}`}
            >
              <span style={{ width: `${(r.ok / r.total) * 100}%` }} />
            </div>
          </li>
        ))}
      </ul>

      <h2 className="rf-eyebrow rf-section-title mt-7">Últimos resultados</h2>
      <ul className="rf-list">
        {pastAnswers.map((a) => {
          const s = byId(a.id)!;
          const ok =
            a.d === s.decision && a.s === s.sanction && a.l === lawOf(s).id;
          return (
            <li key={a.id}>
              <Link href={resultHref(a.id, a.d, a.s, a.l)} className="rf-row">
                <span className="rf-row-thumb">
                  <Photo foto={fotoOf(s)} sizes="64px" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="rf-row-title">{s.title}</span>
                  <span className="rf-byline mt-1">
                    <strong>{ok ? "Correcta" : "A corregir"}</strong>
                    <span aria-hidden>·</span>
                    <span>
                      {labelOf(decisions, a.d)}
                      {a.s !== "ninguna" &&
                        ` + ${labelOf(sanctions, a.s).toLowerCase()}`}{" "}
                      · {a.when}
                    </span>
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}
