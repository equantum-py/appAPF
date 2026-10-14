import Link from "next/link";
import ArbitroLayout from "./demo/arbitro/layout";
import { Icon } from "./demo/arbitro/_ui/icons";

/** Bienvenida aprobada: acceso inmediato a la demo o al ingreso real. */
export default function Bienvenida() {
  return (
    <ArbitroLayout>
      <main className="rf-entry">
        <div className="rf-entry-identity">
          <Icon name="silbato" filled={false} className="rf-entry-symbol" />
          <h1>Plataforma arbitral</h1>
          <p>Entrená tu criterio. Prepará tu partido.</p>
        </div>
        <div className="rf-entry-actions">
          <Link href="/demo/arbitro" className="rf-entry-start">Comenzar</Link>
          <Link href="/ingresar" className="rf-entry-account">Ya tengo cuenta</Link>
        </div>
        <p className="rf-entry-note">
          Demo con datos ficticios.<br />
          Proyecto independiente, sin vínculo institucional con la APF.
        </p>
      </main>
    </ArbitroLayout>
  );
}
