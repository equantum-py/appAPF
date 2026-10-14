import Link from "next/link";
import { notFound } from "next/navigation";
import {
  decisions,
  labelOf,
  sanctions,
  type Decision,
  type Sanction,
} from "../../../../_data";
import {
  byId,
  improveOf,
  isLaw,
  lawById,
  lawOf,
  fotoOf,
  relatedOf,
} from "../../../_ui/data";
import { ResultHeading } from "../../../_ui/result-focus";
import { Icon } from "../../../_ui/icons";
import { Photo } from "../../../_ui/photo";

const isDecision = (v: unknown): v is Decision =>
  decisions.some((d) => d.id === v);
const isSanction = (v: unknown): v is Sanction =>
  sanctions.some((s) => s.id === v);
const sanctionLabel = (s: Sanction) =>
  s === "ninguna"
    ? "Sin tarjeta"
    : `Tarjeta ${labelOf(sanctions, s).toLowerCase()}`;

export default async function ResultadoPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ d?: string; s?: string; l?: string }>;
}) {
  const [{ id }, { d, s, l }] = await Promise.all([params, searchParams]);
  const situation = byId(id);
  if (!situation || !isDecision(d) || !isSanction(s) || !isLaw(l)) notFound();

  const dOk = d === situation.decision;
  const sOk = s === situation.sanction;
  const lOk = l === lawOf(situation).id;
  const correct = dOk && sOk && lOk;
  const verdict = correct
    ? "Decisión correcta"
    : dOk && sOk
      ? "Regla a corregir"
      : dOk && lOk
        ? "Sanción a corregir"
        : sOk && lOk
          ? "Decisión a corregir"
          : "Respuesta a corregir";
  const related = relatedOf(situation);
  const rows = [
    {
      label: "Decisión",
      mine: labelOf(decisions, d),
      right: labelOf(decisions, situation.decision),
      ok: dOk,
    },
    {
      label: "Sanción",
      mine: sanctionLabel(s),
      right: sanctionLabel(situation.sanction),
      ok: sOk,
    },
    {
      label: "Regla",
      mine: lawById(l).title,
      right: lawOf(situation).title,
      ok: lOk,
    },
  ];

  return (
    <div className="rf-page">
      <div className="rf-topbar">
        <Link
          href="/demo/arbitro"
          className="rf-round rf-round-light"
          aria-label="Volver al inicio"
        >
          ✕
        </Link>
        <span className="rf-eyebrow">Resultado</span>
        <span className="w-11" />
      </div>

      <div className="rf-result-layout">
        <div>
          <div className="rf-hero-media rf-hero-short">
            <Photo
              foto={fotoOf(situation)}
              sizes="(min-width: 1024px) 580px, (min-width: 480px) 400px, 100vw"
              priority
            />
            <span className="rf-badge">Foto de referencia</span>
          </div>
          <p className="rf-eyebrow mt-4">
            {situation.rule} · {situation.title}
          </p>
          <ResultHeading correct={correct}>{verdict}</ResultHeading>

          <table className="rf-compare">
            <thead>
              <tr>
                <th scope="col">
                  <span className="sr-only">Aspecto</span>
                </th>
                <th scope="col">Vos</th>
                <th scope="col">Correcta</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.label}>
                  <th scope="row">{r.label}</th>
                  <td data-ok={r.ok}>
                    <span aria-hidden>{r.ok ? "✓" : "✗"}</span> {r.mine}
                    <span className="sr-only">
                      {r.ok ? " (bien)" : " (a corregir)"}
                    </span>
                  </td>
                  <td>{r.right}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h2 className="rf-eyebrow rf-section-title mt-6">
            {lawOf(situation).title}
          </h2>
          <p className="rf-lead mt-3">{situation.explanation}</p>
        </div>

        <div>
          {!correct && (
            <div className="rf-box mt-6 lg:mt-0">
              <p className="rf-eyebrow">Qué mejorar</p>
              <p className="mt-1.5 leading-relaxed">{improveOf(situation)}</p>
              {!lOk && (
                <p className="mt-3 leading-relaxed">
                  Relacioná tu decisión con{" "}
                  {lawOf(situation).title.toLowerCase()}, no con{" "}
                  {lawById(l).title.toLowerCase()}.
                </p>
              )}
            </div>
          )}

          <p className="rf-eyebrow rf-section-title mt-6">
            Práctica relacionada
          </p>
          {related ? (
            <>
              <Link
                href={`/demo/arbitro/jugada/${related.id}`}
                className="rf-row"
              >
                <span className="rf-row-thumb">
                  <Photo foto={fotoOf(related)} sizes="64px" />
                </span>
                <span className="min-w-0">
                  <span className="rf-row-title">{related.title}</span>
                  <span className="rf-byline mt-1">
                    <strong>{lawOf(related).short}</strong>
                    <span aria-hidden>·</span>
                    <span>Nivel {related.difficulty}</span>
                  </span>
                </span>
              </Link>
              <Link
                href={`/demo/arbitro/jugada/${related.id}`}
                className="rf-primary"
              >
                <Icon name="play" className="size-5" />
                Practicar la relacionada
              </Link>
            </>
          ) : (
            <>
              <p className="rf-lead mt-3">
                Todavía no hay otra jugada de {situation.rule.toLowerCase()} en
                esta demo. Podés volver a practicar esta situación.
              </p>
              <Link
                href={`/demo/arbitro/jugada/${situation.id}`}
                className="rf-primary"
              >
                Volver a practicar esta jugada
              </Link>
            </>
          )}
          <Link href="/demo/arbitro" className="rf-ghost">
            Volver al inicio
          </Link>
          <p className="rf-note text-center">
            Ejemplo ficticio. No es criterio técnico oficial.
          </p>
        </div>
      </div>
    </div>
  );
}
