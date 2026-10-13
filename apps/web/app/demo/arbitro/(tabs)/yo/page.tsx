import Link from "next/link";

export default function YoPage() {
  return (
    <>
      <h1 className="rf-page-title">Yo</h1>
      <div className="rf-profile">
        <span className="rf-avatar" aria-hidden>
          AD
        </span>
        <span>
          <span className="rf-card-title">Árbitro Demo</span>
          <span className="rf-byline mt-0.5">Perfil de demostración</span>
        </span>
      </div>

      <h2 className="rf-eyebrow rf-section-title mt-7">Cuenta</h2>
      <ul className="rf-list">
        <li>
          <Link href="/demo/panel" className="rf-setting">
            Cambiar a la vista de instructor <span aria-hidden>›</span>
          </Link>
        </li>
        <li>
          <span className="rf-setting text-[var(--rf-muted)]">
            Avisos <span className="rf-tag">Próximamente</span>
          </span>
        </li>
      </ul>

      <h2 className="rf-eyebrow rf-section-title mt-7">Sobre esta demo</h2>
      <p className="rf-lead mt-3">
        Es una demostración con datos ficticios: no guarda tus respuestas y las jugadas son ilustraciones. Proyecto independiente, sin vínculo
        institucional con la APF.
      </p>
    </>
  );
}
