import Link from "next/link";
import { notFound } from "next/navigation";
import { decisions, labelOf, sanctions, type Decision, type Sanction } from "../../../../_data";
import { byId, improveOf, lawOf, relatedOf, sceneOf } from "../../../_ui/data";
import { Icon } from "../../../_ui/icons";
import { Scene } from "../../../_ui/scene";

const isDecision = (v: unknown): v is Decision => decisions.some((d) => d.id === v);
const isSanction = (v: unknown): v is Sanction => sanctions.some((s) => s.id === v);
const sanctionLabel = (s: Sanction) => (s === "ninguna" ? "Sin tarjeta" : `Tarjeta ${labelOf(sanctions, s).toLowerCase()}`);

export default async function ResultadoPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ d?: string; s?: string }>;
}) {
  const [{ id }, { d, s }] = await Promise.all([params, searchParams]);
  const situation = byId(id);
  if (!situation || !isDecision(d) || !isSanction(s)) notFound();

  const dOk = d === situation.decision;
  const sOk = s === situation.sanction;
  const verdict = dOk && sOk ? "Decisión correcta" : dOk ? "Sanción a corregir" : sOk ? "Decisión a corregir" : "Decisión y sanción a corregir";
  const related = relatedOf(situation);
  const rows = [
    { label: "Decisión", mine: labelOf(decisions, d), right: labelOf(decisions, situation.decision), ok: dOk },
    { label: "Sanción", mine: sanctionLabel(s), right: sanctionLabel(situation.sanction), ok: sOk },
  ];

  return (
    <div className="rf-page">
      <div className="rf-topbar">
        <Link href="/demo/arbitro" className="rf-round rf-round-light" aria-label="Volver al inicio">
          ✕
        </Link>
        <span className="rf-eyebrow">Resultado</span>
        <span className="w-11" />
      </div>

      <div className="rf-result-layout">
        <div>
          <div className="rf-hero-media rf-hero-short">
            <Scene kind={sceneOf(situation)} className="size-full" />
            <span className="rf-badge">Ilustración</span>
          </div>
          <p className="rf-eyebrow mt-4">
            {situation.rule} · {situation.title}
          </p>
          <h1 className="rf-headline" data-ok={dOk && sOk}>
            {verdict}
          </h1>

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
                    <span className="sr-only">{r.ok ? " (bien)" : " (a corregir)"}</span>
                  </td>
                  <td>{r.right}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h2 className="rf-eyebrow rf-section-title mt-6">{lawOf(situation).title}</h2>
          <p className="rf-lead mt-3">{situation.explanation}</p>
        </div>

        <div>
          {!(dOk && sOk) && (
            <div className="rf-box mt-6 lg:mt-0">
              <p className="rf-eyebrow">Qué mejorar</p>
              <p className="mt-1.5 leading-relaxed">{improveOf(situation)}</p>
            </div>
          )}

          <p className="rf-eyebrow rf-section-title mt-6">Práctica relacionada</p>
          <Link href={`/demo/arbitro/jugada/${related.id}`} className="rf-row">
            <span className="rf-row-thumb">
              <Scene kind={sceneOf(related)} className="size-full" />
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
          <Link href={`/demo/arbitro/jugada/${related.id}`} className="rf-primary">
            <Icon name="play" className="size-5" />
            Practicar la relacionada
          </Link>
          <Link href="/demo/arbitro" className="rf-ghost">
            Volver al inicio
          </Link>
          <p className="rf-note text-center">Ejemplo ficticio. No es criterio técnico oficial.</p>
        </div>
      </div>
    </div>
  );
}
